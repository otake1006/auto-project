// scenes/BattleScene.js
import Phaser from 'phaser';

import { World } from '@/core/World.js';
import { RenderSystem } from '@/game/systems/RenderSystem.js';
import { NetworkSystem } from '@/game/systems/NetworkSystem.js';
import { PlayerSyncSystem } from '@/game/systems/PlayerSyncSystem.js';
import { SkillLogSystem } from '@/game/systems/SkillLogSystem.js';
import { RoundSystem } from '@/game/systems/RoundSystem.js';
import { ReadySystem } from '@/game/systems/ReadySystem.js';
import { ScenePhaseSystem } from '@/game/systems/ScenePhaseSystem.js';

import { networkManager } from '@/core/NetworkManager.js';

import { EffectManager } from '@/core/EffectManager.js';
import { BgmManager } from '@/core/BgmManager';
import { BattleManager } from '../../core/BattleManager';
import { bgmMap } from '@/core/sounds/bgmMap.js';

import Character from '@/core/entities/Character.js';
import CharacterView from '@/core/entities/CharacterView.js';
import { useSceneStore } from '@/ui/stores/sceneStore';
import { useSkillStore } from '@/ui/stores/skillStore';
import { useModalStore } from '@/ui/stores/modalStore';
import { StateWatchSystem } from '@/game/systems/StateWatchSystem';
import { ReadyButton } from '@/game/ui/button/ReadyButton';
import { bounceTween } from '@/game/ui/animations/bounceTween.js';
import { phaserEvents } from '@/events/EventCenter';
import { InputLockSystem } from '@/game/systems/InputLockSystem';
import { sm } from '@/core/SoundManager';
import { HideShowMixin } from '@/game/ui/button/HideShowMixin';
import { ImageButton } from '@/game/ui/button/ImageButton';

class CustomSceneButton extends HideShowMixin(ImageButton) {}

const PLAYER_CFG = { hp: 100, mp: 50, key: 'player' };
const GAP = 300; // 左右の距離

const PLAYER_CONFIG = {
    hp: 100,
    mp: 50,
    spriteKey: 'player',
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.room = networkManager.getRoom();
        this.networkManager = networkManager;
    }

    async create() {
        useSceneStore().set(this.scene.key);
        this.scale.resize(1440, 258);
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY - 10;

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY - 10;
        this.positions = [
            { x: this.centerX - 300, y: this.centerY },
            { x: this.centerX + 300, y: this.centerY },
        ];

        this.createPlayers();

        this.readyButton = new ReadyButton(
            this,
            this.centerX,
            this.centerY + 30,
            () => {
                phaserEvents.emit('ready');
            },
            {
                defaultKey: 'ready-button',
                hoverImageKey: 'ready-button',
                downImageKey: 'ready-button',
                sounds: { click: 'click.mp3' },
                tweens: [bounceTween],
            },
        );

        this.scene.bringToTop('HudScene');

        this.battleManager = new BattleManager(this, this.playerView, this.enemyView);
        this.effectMgr = new EffectManager(this);
        this.bgmMgr = new BgmManager(this);
        this.bgmMgr.play(this.scene.key, bgmMap);

        // SkillLogSystemを保存して他のシステムからアクセス可能にする
        this.skillLogSystem = new SkillLogSystem(
            this.playerView,
            this.enemyView,
            this.effectMgr,
            this.battleManager,
            this.room,
        );

        // NetworkSystemを保存してシーン参照を設定
        this.networkSystem = new NetworkSystem(this.room);
        this.networkSystem.setScene(this);

        this.world = new World()
            .addSystem(new RenderSystem(this))
            .addSystem(this.networkSystem)
            .addSystem(
                new PlayerSyncSystem(this.player, this.playerView, this.enemy, this.enemyView),
            )
            .addSystem(this.skillLogSystem)
            .addSystem(new RoundSystem(this, this.effectMgr))
            //.addSystem(new TurnSystem(this, this.effectMgr))
            .addSystem(new ReadySystem(this.readyButton, this.room))
            .addSystem(new StateWatchSystem(this.room))
            .addSystem(new ScenePhaseSystem(this.scene, this.bgmMgr))
            .addSystem(new InputLockSystem(this));

        networkManager.send('requestPlayer');

        // Expose for testing (development only)
        if (typeof window !== 'undefined') {
            window.testBuffs = (buffs) => this.testBuffDisplay(buffs);
        }

        this.createMuteButtons();

        /* 4. クリーンアップ ------------------------------------------------ */
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.shutdown());
    }

    // テスト用メソッド - バフ表示のテスト
    testBuffDisplay(buffs = null) {
        const testBuffs = buffs || {
            power: 5,
            defense: 3,
            speed: 2,
            heal: 1,
            fire: 4,
            poison: -2,
            shield: 8,
        };

        if (this.playerView && this.playerView.updateBuffs) {
            this.playerView.updateBuffs(testBuffs);
        }

        if (this.enemyView && this.enemyView.updateBuffs) {
            this.enemyView.updateBuffs({
                curse: -3,
                ice: 2,
                magic: 4,
            });
        }
    }

    shutdown() {
        const skillStore = useSkillStore();
        const modalStore = useModalStore();
        skillStore.reset();
        modalStore.close();
        this.world.destroy();
        this.scene.stop('HudScene');
        this.scene.stop('BackgroundScene');
    }

    update(_, dt) {
        this.world.update(dt);
    }

    createMuteButtons() {
        // SE ミュートボタン
        new CustomSceneButton(this, 1300, 30, 'button', {
            onClick: (btn) => {
                sm.toggleMuteSe();
                btn.setTexture(sm.isMutedSe ? 'icon_se_off' : 'icon_se_on');
            },
            sounds: { click: null }, // ミュート状態でも音を鳴らさない
        });

        // BGM ミュートボタン
        new CustomSceneButton(this, 1370, 30, 'button', {
            onClick: (btn) => {
                this.bgmMgr.toggleMute();
                btn.setTexture(this.bgmMgr.isMuted ? 'icon_bgm_off' : 'icon_bgm_on');
            },
            sounds: { click: null },
        });
    }

    createPlayers() {
        this.player = this.createCharacter(this.positions[0], true, 'player');
        this.enemy = this.createCharacter(this.positions[1], false, 'enemy');

        this.playerView = new CharacterView(
            this,
            this.player,
            this.positions[0].x,
            this.positions[0].y,
        );
        this.enemyView = new CharacterView(
            this,
            this.enemy,
            this.positions[1].x,
            this.positions[1].y,
            true,
        );
    }

    createCharacter(position, isPlayer, id) {
        return new Character(
            this,
            position.x,
            position.y,
            id,
            id,
            PLAYER_CONFIG.hp,
            PLAYER_CONFIG.mp,
            !isPlayer, // flipX: プレイヤーは左向き(false)、敵は右向き(true)
        );
    }
}
