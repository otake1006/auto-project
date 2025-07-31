export class CreditsModal {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
        this.isVisible = false;
    }

    show() {
        if (this.isVisible) return;
        this.isVisible = true;

        const overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);

        const modalWidth = 500;
        const modalHeight = 350;
        const modalX = this.scene.scale.width / 2 - modalWidth / 2;
        const modalY = this.scene.scale.height / 2 - modalHeight / 2;

        const modalBg = this.scene.add.graphics();
        modalBg.fillStyle(0x222222, 1);
        modalBg.lineStyle(3, 0xffffff, 1);
        modalBg.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 10);
        modalBg.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 10);

        const title = this.scene.add
            .text(this.scene.scale.width / 2, modalY + 40, 'CREDITS', {
                fontSize: '28px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        const creditsData = [
            'Game Design & Programming:',
            'otake & Elic0de',
            '',
            'Art & Graphics: Au-Ta',
            '',
            'Sound & Music: Free Assets',
            '',
            'Special Thanks:',
            'Phaser.js Community',
            'Colyseus Framework',
            'Vue.js Team',
            '',
            '© 2025 Au-Ta Game Studio',
        ];

        const creditsText = this.scene.add
            .text(this.scene.scale.width / 2, modalY + 180, creditsData.join('\n'), {
                fontSize: '14px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 4,
                wordWrap: { width: modalWidth - 40 },
            })
            .setOrigin(0.5);

        const closeButton = this.scene.add
            .text(this.scene.scale.width / 2, modalY + modalHeight - 40, 'CLOSE', {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffff00',
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                closeButton.setColor('#ffffff');
            })
            .on('pointerout', () => {
                closeButton.setColor('#ffff00');
            })
            .on('pointerdown', () => {
                this.hide();
            });

        this.elements = [overlay, modalBg, title, creditsText, closeButton];
    }

    hide() {
        if (!this.isVisible) return;

        this.elements.forEach((element) => element.destroy());
        this.elements = [];
        this.isVisible = false;
        
        // プレイヤー名入力欄を再表示
        import('@/ui/stores/modalStore').then(({ useModalStore }) => {
            const modalStore = useModalStore();
            modalStore.setPlayerNameInputVisibility(true);
        });
    }

    destroy() {
        this.hide();
    }
}
