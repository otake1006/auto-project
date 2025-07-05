// BattleScene.js
import Character from '@/entities/Character.js';
import CharacterView from '@/entities/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';
import { ColyseusClient } from '@/colyseus/client';
import { phaserEvents, Event } from '@/events/EventCenter';
import { ReadyButton } from '@/ui/ReadyButton';
import { EffectManager } from '@/core/EffectManager.js';
import { RoundStatusUI } from '@/ui/RoundStatus.js';
import { WipeAppearDisappearText } from '@/effects/WipeAppearDisappearText.js';
import { TurnIndicator } from '@/ui/TurnIndicator';
import { BattleManager } from '../core/BattleManager';
import { sm } from '../core/SoundManager';
import { BgmManager } from '@/core/BgmManager';
import { bgmMap } from '@/core/sounds/bgmMap';

const PLAYER_CONFIG = {
    hp: 100,
    mp: 50,
    spriteKey: 'player',
};

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.colyseus = new ColyseusClient();
    }

    preload() {}

    async create() {
        phaserEvents.emit('scene-changed', 'BattleScene');
        this.scale.resize(1440, 258);

        this.initLayout();
        this.createPlayers();
        this.setupUI();
        this.setupNetworkHandlers();
        this.battleManager = new BattleManager(this, this.playerView, this.enemyView);
        this.bgmManager = new BgmManager(this);
        this.bgmManager.play(this.scene.key, bgmMap);

        await this.colyseus.join(() => {
            this.readyButton.show();
        });

        // sm.playBgm('bgm_battle');
        this.effectManager.fadeIn();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        this.bgmManager.fadeOut();
        phaserEvents.removeAllListeners('scene-changed');
    }

    initLayout() {
        this.cameras.main.setBackgroundColor('#000');
        this.add.image(0, 0, 'background').setOrigin(0);

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY - 10;
        this.positions = [
            { x: this.centerX - 300, y: this.centerY },
            { x: this.centerX + 300, y: this.centerY },
        ];
    }

    setupUI() {
        this.readyButton = new ReadyButton(this, this.centerX, this.centerY + 30, () => {
            this.sendSkillSet();
            this.readyButton.hide();
        });
        this.readyButton.hide();

        this.effectManager = new EffectManager(this);
        this.turnIndicator = new TurnIndicator(this);

        // UIの将来的な拡張用
        // this.roundUI = new RoundStatusUI(this, this.centerX, 20);
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
            PLAYER_CONFIG.spriteKey,
            id,
            PLAYER_CONFIG.hp,
            PLAYER_CONFIG.mp,
            isPlayer,
        );
    }

    setupNetworkHandlers() {
        this.colyseus.onPlayerUpdated(
            this.handlePlayerUpdate.bind(this, this.player, this.playerView),
        );
        this.colyseus.onEnemyUpdated(
            this.handlePlayerUpdate.bind(this, this.enemy, this.enemyView),
        );
        this.colyseus.onSkillLog(this.handleSkillLog, this);
        this.colyseus.onShowReady(() => this.handleShowReady());
        this.colyseus.onTurn(this.handleTurn, this);
        this.colyseus.onRound(this.handleRound, this);
        this.colyseus.onSceneChanged(this.handleSceneChanged, this);
    }

    handleSceneChanged(data) {
        this.bgmManager.fadeOut(500, () => {
            this.scene.start('ResultScene', data); // ← ResultScene に遷移
        });
    }

    handleTurn(turn) {
        this.turnIndicator.showTurn(turn);
    }

    handleRound(round) {
        console.log(round);
        this.effectManager.shakeCamera();
        this.effectManager.flashColor();
        new WipeAppearDisappearText(this, this.centerX, this.centerY, `Round ${round}!`, {
            textStyle: {
                fontSize: '36px',
                fontFamily: 'Arial',
                color: '#ffcc00',
            },
            bgColor: 0x333333,
        });
    }

    handlePlayerUpdate(character, view, player) {
        character.updatePlayer(player);
        if (view?.setReady) {
            view.setReady(player.ready);
        }
        view.updateBars();
        view.updateCount(player.shield);
    }

    async handleSkillLog(isEnemy) {
        if (!isEnemy) return;
        if (!isEnemy.skill) return;
        const logText = `${isEnemy.skill} を唱えた!`;
        const view = isEnemy.isEnemy ? this.enemyView : this.playerView;
        view.showSkillLog(logText);
        if (!isEnemy.isEnemy) {
            this.effectManager.shakeCamera();
        }

        await this.battleManager.startTurn(isEnemy.isEnemy);
    }

    async handleShowReady() {
        this.readyButton.show();
    }

    sendSkillSet() {
        const skillStore = useSkillStore();
        const payload = skillStore.skillSets
            .filter((set) => set.skill)
            .map((set) => ({
                skill: set.skill.id,
                conditions: set.conditions.map((c) => {
                    return { id: c.id, value: c.value };
                }),
            }));

        this.colyseus.sendSkillSet(payload);
    }

    onGameOver(winner) {
        this.add.text(this.centerX, this.centerY, `${winner} wins!`, {
            fontSize: '32px',
            color: '#ff0000',
        });
    }

    cleanup() {
        console.log('[BattleScene] Cleaning up scene.');
        const skillStore = useSkillStore();
        skillStore.reset();
        // Colyseusのイベント解除とleave
        this.colyseus?.leave?.();
        this.colyseus?.removeAllListeners?.();

        // Phaser EventCenterのリスナー解除
        //phaserEvents.removeAllListeners();

        // 各UI要素・オブジェクト破棄
        this.readyButton?.destroy?.();
        this.effectManager?.destroy?.();
        this.turnIndicator?.destroy?.();

        this.playerView?.destroy?.();
        this.enemyView?.destroy?.();

        this.player?.destroy?.();
        this.enemy?.destroy?.();

        // メモリリーク防止
        this.readyButton = null;
        this.effectManager = null;
        this.turnIndicator = null;
        this.playerView = null;
        this.enemyView = null;
        this.player = null;
        this.enemy = null;

        // Phaserが保持しているDisplayObjectも削除（念のため）
        this.children.removeAll(true);
    }
}
