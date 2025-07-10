import { GameMessageHandler } from '@/handlers/GameMessageHandler';
import { networkManager } from '@/core/NetworkManager';
import { PlayerManager } from '@/core/PlayerManager';
import { UIManager } from '@/core/UIManager';
import { EffectManager } from '@/core/EffectManager';
import { AudioManager } from '@/core/AudioManager';
import { BattleManager } from '@/core/BattleManager';
import { phaserEvents } from '@/events/EventCenter';

import { useSkillStore } from '@/stores/skillStore';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    async create() {
        phaserEvents.emit('scene-changed', 'GameScene');
        this.scale.resize(1440, 258);
        this.initManagers();
        this.setupSceneEvents();

        const room = await networkManager.getRoom();
        this.messageHandler = new GameMessageHandler(this, room);

        this.events.on('action', this.onBattleEnded, this);
        this.events.on('randomSkill', this.onBattleEnded, this);
        this.events.on('skillLogs', this.onBattleEnded, this);
        this.events.on('giveCards', this.onBattleEnded, this);
        this.events.on('showReady', this.onBattleEnded, this);
        this.events.on('winner', this.onBattleEnded, this);
        this.events.on('turn', this.onBattleEnded, this);
        this.events.on('round', this.onBattleEnded, this);
        this.events.on('condition', this.onBattleEnded, this);

        this.uiManager.showReadyButton();

        // this.effectManager.fadeIn();
        // this.audioManager.playBgm('battle');
    }

    initManagers() {
        this.playerManager = new PlayerManager(this);
        this.uiManager = new UIManager(this);
        this.effectManager = new EffectManager(this);
        this.audioManager = new AudioManager(this);
        this.battleManager = new BattleManager(this, this.playerManager);
    }

    setupSceneEvents() {
        phaserEvents.on('scene-changed', (sceneName, data) => {
            // this.audioManager.fadeOutBgm();
            this.scene.start(sceneName, data);
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    cleanup() {
        this.playerManager.cleanup();
        this.uiManager.cleanup();
        this.audioManager.cleanup();
        phaserEvents.removeAllListeners();
    }

    onAction(payload) {
        const skillStore = useSkillStore();
        skillStore.setSkills(payload);
    }

    onCondition(payload) {
        const skillStore = useSkillStore();
        skillStore.loadConditionFromColyseus(payload);
    }

    onRandomSkill(_room, skills) {
        const skillStore = useSkillStore();
        skillStore.addSkills(skills);
    }

    onRound(round) {}

    onShowReady() {}

    onSkillLogs(room, logs) {
        logs.forEach(({ sessionId, skill }) => {
            const isEnemy = room.sessionId !== sessionId;
            phaserEvents.emit('useSkill', { isEnemy, skill });
        });
    }

    async onSkillSelectModal(room, cards) {
        const modalStore = useModalStore();
        const skillStore = useSkillStore();
        skillStore.setSelectCards(cards);

        const selected = await modalStore.open('skillSelect', { cards });

        if (selected) {
            room.send('selectSkill', selected.id);
            skillStore.addSkills([selected]);
            skillStore.clearSelectCards();
        }
    }

    onTurn(turn) {
        phaserEvents.emit('turn', turn);
    }

    onBattleEnded(payload) {
        this.scene.start('ResultScene', payload);
    }

    shutdown() {
        this.messageHandler.unregisterAll();
    }
}
