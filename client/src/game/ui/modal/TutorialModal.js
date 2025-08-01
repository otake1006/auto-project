export class TutorialModal {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
        this.isVisible = false;
        this.currentSlide = 0;
        this.slides = [
            {
                title: 'ゲームの目的',
                description: 'このゲームは戦略的なカードバトルゲームです。\n相手のHPを0にすることで勝利できます。',
                icon: '🎯'
            },
            {
                title: 'スキルカードの使い方',
                description: 'スキルカードを選択して相手に攻撃したり、\n自分を守ったりできます。\n各スキルにはMPコストがあります。',
                icon: '🃏'
            },
            {
                title: 'HP・MP・シールド',
                description: 'HP（体力）、MP（マナポイント）、\nシールド（防御力）の3つのステータスを\n管理しましょう。',
                icon: '❤️'
            },
            {
                title: 'バトルの流れ',
                description: '各ターンでスキルを選択し、\n同時に実行されます。\n戦略的にスキルを組み合わせて\n勝利を目指しましょう！',
                icon: '⚔️'
            }
        ];
    }

    show() {
        if (this.isVisible) return;
        this.isVisible = true;
        this.currentSlide = 0;

        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        const overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, screenWidth, screenHeight);
        overlay.setDepth(1000);

        const modalWidth = 600;
        const modalHeight = 450;
        const modalX = screenWidth / 2 - modalWidth / 2;
        const modalY = screenHeight / 2 - modalHeight / 2;

        const modalBg = this.scene.add.graphics();
        modalBg.fillStyle(0x222222, 1);
        modalBg.lineStyle(3, 0xffffff, 1);
        modalBg.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);
        modalBg.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);
        modalBg.setDepth(1001);

        const progressBarBg = this.scene.add.graphics();
        progressBarBg.fillStyle(0x444444, 1);
        progressBarBg.fillRect(modalX + 20, modalY + 20, modalWidth - 40, 8);
        progressBarBg.setDepth(1002);

        this.progressBar = this.scene.add.graphics();
        this.progressBar.setDepth(1003);
        this.updateProgressBar(modalX, modalY, modalWidth);

        const titleText = this.scene.add
            .text(screenWidth / 2, modalY + 60, 'TUTORIAL', {
                fontSize: '28px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        const slideCountText = this.scene.add
            .text(screenWidth / 2, modalY + 90, '', {
                fontSize: '16px',
                fontFamily: 'DotGothic16',
                color: '#aaaaaa',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        this.slideCountText = slideCountText;

        this.slideIcon = this.scene.add
            .text(screenWidth / 2, modalY + 150, '', {
                fontSize: '48px',
                fontFamily: 'DotGothic16',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        this.slideTitle = this.scene.add
            .text(screenWidth / 2, modalY + 210, '', {
                fontSize: '22px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        this.slideDescription = this.scene.add
            .text(screenWidth / 2, modalY + 280, '', {
                fontSize: '16px',
                fontFamily: 'DotGothic16',
                color: '#cccccc',
                align: 'center',
                lineSpacing: 8,
                wordWrap: { width: modalWidth - 80 }
            })
            .setOrigin(0.5)
            .setDepth(1004);

        const prevButton = this.scene.add.graphics();
        prevButton.fillStyle(0x444444, 1);
        prevButton.lineStyle(2, 0xffffff, 1);
        prevButton.fillRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
        prevButton.strokeRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
        prevButton.setDepth(1002);
        prevButton.setInteractive(
            new Phaser.Geom.Rectangle(modalX + 30, modalY + modalHeight - 70, 80, 40),
            Phaser.Geom.Rectangle.Contains
        );

        const prevButtonText = this.scene.add
            .text(modalX + 70, modalY + modalHeight - 50, '← PREV', {
                fontSize: '14px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        const nextButton = this.scene.add.graphics();
        nextButton.fillStyle(0x444444, 1);
        nextButton.lineStyle(2, 0xffffff, 1);
        nextButton.fillRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
        nextButton.strokeRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
        nextButton.setDepth(1002);
        nextButton.setInteractive(
            new Phaser.Geom.Rectangle(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40),
            Phaser.Geom.Rectangle.Contains
        );

        this.nextButtonText = this.scene.add
            .text(modalX + modalWidth - 70, modalY + modalHeight - 50, 'NEXT →', {
                fontSize: '14px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        const closeButton = this.scene.add.graphics();
        closeButton.fillStyle(0x666666, 1);
        closeButton.lineStyle(2, 0xffffff, 1);
        closeButton.fillCircle(modalX + modalWidth - 30, modalY + 30, 15);
        closeButton.strokeCircle(modalX + modalWidth - 30, modalY + 30, 15);
        closeButton.setDepth(1002);
        closeButton.setInteractive(
            new Phaser.Geom.Circle(modalX + modalWidth - 30, modalY + 30, 15),
            Phaser.Geom.Circle.Contains
        );

        const closeButtonText = this.scene.add
            .text(modalX + modalWidth - 30, modalY + 30, '×', {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0.5)
            .setDepth(1004);

        this.dots = [];
        for (let i = 0; i < this.slides.length; i++) {
            const dot = this.scene.add.graphics();
            const dotX = screenWidth / 2 - ((this.slides.length - 1) * 15) / 2 + i * 15;
            const dotY = modalY + modalHeight - 100;
            
            dot.fillStyle(i === 0 ? 0xffff00 : 0x666666, 1);
            dot.fillCircle(dotX, dotY, 4);
            dot.setDepth(1003);
            dot.setInteractive(
                new Phaser.Geom.Circle(dotX, dotY, 6),
                Phaser.Geom.Circle.Contains
            );
            
            dot.on('pointerdown', () => this.goToSlide(i));
            dot.on('pointerover', () => dot.setAlpha(0.8));
            dot.on('pointerout', () => dot.setAlpha(1));
            
            this.dots.push(dot);
        }

        prevButton.on('pointerdown', () => this.previousSlide());
        prevButton.on('pointerover', () => {
            prevButton.clear();
            prevButton.fillStyle(0x555555, 1);
            prevButton.lineStyle(2, 0xffffff, 1);
            prevButton.fillRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
            prevButton.strokeRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
        });
        prevButton.on('pointerout', () => {
            prevButton.clear();
            prevButton.fillStyle(0x444444, 1);
            prevButton.lineStyle(2, 0xffffff, 1);
            prevButton.fillRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
            prevButton.strokeRoundedRect(modalX + 30, modalY + modalHeight - 70, 80, 40, 8);
        });

        nextButton.on('pointerdown', () => {
            if (this.currentSlide === this.slides.length - 1) {
                this.hide();
            } else {
                this.nextSlide();
            }
        });
        nextButton.on('pointerover', () => {
            nextButton.clear();
            const isLast = this.currentSlide === this.slides.length - 1;
            nextButton.fillStyle(isLast ? 0x007700 : 0x555555, 1);
            nextButton.lineStyle(2, 0xffffff, 1);
            nextButton.fillRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
            nextButton.strokeRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
        });
        nextButton.on('pointerout', () => {
            nextButton.clear();
            const isLast = this.currentSlide === this.slides.length - 1;
            nextButton.fillStyle(isLast ? 0x006600 : 0x444444, 1);
            nextButton.lineStyle(2, 0xffffff, 1);
            nextButton.fillRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
            nextButton.strokeRoundedRect(modalX + modalWidth - 110, modalY + modalHeight - 70, 80, 40, 8);
        });

        closeButton.on('pointerdown', () => this.hide());
        closeButton.on('pointerover', () => {
            closeButton.clear();
            closeButton.fillStyle(0x777777, 1);
            closeButton.lineStyle(2, 0xffffff, 1);
            closeButton.fillCircle(modalX + modalWidth - 30, modalY + 30, 15);
            closeButton.strokeCircle(modalX + modalWidth - 30, modalY + 30, 15);
        });
        closeButton.on('pointerout', () => {
            closeButton.clear();
            closeButton.fillStyle(0x666666, 1);
            closeButton.lineStyle(2, 0xffffff, 1);
            closeButton.fillCircle(modalX + modalWidth - 30, modalY + 30, 15);
            closeButton.strokeCircle(modalX + modalWidth - 30, modalY + 30, 15);
        });

        this.prevButton = prevButton;
        this.nextButton = nextButton;
        this.modalX = modalX;
        this.modalY = modalY;
        this.modalWidth = modalWidth;
        this.modalHeight = modalHeight;

        this.elements = [
            overlay, modalBg, progressBarBg, this.progressBar, titleText, slideCountText,
            this.slideIcon, this.slideTitle, this.slideDescription,
            prevButton, prevButtonText, nextButton, this.nextButtonText,
            closeButton, closeButtonText, ...this.dots
        ];

        this.updateSlideContent();
        this.setupKeyboardControls();
    }

    updateProgressBar(modalX, modalY, modalWidth) {
        const progress = (this.currentSlide + 1) / this.slides.length;
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffff00, 1);
        this.progressBar.fillRect(modalX + 20, modalY + 20, (modalWidth - 40) * progress, 8);
    }

    updateSlideContent() {
        const slide = this.slides[this.currentSlide];
        
        this.slideCountText.setText(`${this.currentSlide + 1} / ${this.slides.length}`);
        this.slideIcon.setText(slide.icon);
        this.slideTitle.setText(slide.title);
        this.slideDescription.setText(slide.description);

        this.updateProgressBar(this.modalX, this.modalY, this.modalWidth);

        this.dots.forEach((dot, index) => {
            dot.clear();
            dot.fillStyle(index === this.currentSlide ? 0xffff00 : 0x666666, 1);
            dot.fillCircle(
                this.scene.scale.width / 2 - ((this.slides.length - 1) * 15) / 2 + index * 15,
                this.modalY + this.modalHeight - 100,
                4
            );
        });

        const isLast = this.currentSlide === this.slides.length - 1;
        this.nextButtonText.setText(isLast ? 'FINISH' : 'NEXT →');
        
        this.nextButton.clear();
        this.nextButton.fillStyle(isLast ? 0x006600 : 0x444444, 1);
        this.nextButton.lineStyle(2, 0xffffff, 1);
        this.nextButton.fillRoundedRect(
            this.modalX + this.modalWidth - 110,
            this.modalY + this.modalHeight - 70,
            80, 40, 8
        );
        this.nextButton.strokeRoundedRect(
            this.modalX + this.modalWidth - 110,
            this.modalY + this.modalHeight - 70,
            80, 40, 8
        );

        this.animateSlideTransition();
    }

    animateSlideTransition() {
        this.slideIcon.setAlpha(0);
        this.slideTitle.setAlpha(0);
        this.slideDescription.setAlpha(0);

        this.scene.tweens.add({
            targets: [this.slideIcon, this.slideTitle, this.slideDescription],
            alpha: 1,
            duration: 300,
            ease: 'Power2.easeOut',
            delay: (target, targetKey, value, targetIndex) => targetIndex * 100
        });
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlideContent();
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideContent();
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            this.updateSlideContent();
        }
    }

    setupKeyboardControls() {
        this.keyHandler = (event) => {
            switch (event.code) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    if (this.currentSlide === this.slides.length - 1) {
                        this.hide();
                    } else {
                        this.nextSlide();
                    }
                    break;
                case 'Escape':
                    this.hide();
                    break;
                case 'Enter':
                    if (this.currentSlide === this.slides.length - 1) {
                        this.hide();
                    } else {
                        this.nextSlide();
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
    }

    hide() {
        if (!this.isVisible) return;

        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }

        this.elements.forEach((element) => element.destroy());
        this.elements = [];
        this.dots = [];
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