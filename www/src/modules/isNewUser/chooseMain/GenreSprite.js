import ControllSoundFx from "../../../controller/ControllSoundFx.js";

// import { setTimeout } from "timers";

export default class GenreSprite extends Phaser.Sprite {
    constructor(x, y, key, configs, childrenGenre, index) {
        super(game, 0, y, key.nameAtlas, key.nameSprite);
        // LogConsole.log(key);
        this.configs = configs;
        this.childrenGenre = childrenGenre;
        this.index = index;
        this.posX = x;
        this.posY = y;
        this.choosed = configs.choosed;
        if (this.index == 0) {
            this.x = -296 * window.GameConfig.RESIZE;
        } else {
            if (this.index % 2 == 1) {
                this.x = 936 * window.GameConfig.RESIZE;
            } else {
                this.x = -296 * window.GameConfig.RESIZE;
            }
        }
        // LogConsole.log(configs);
        this.signalInput = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.onClickSprite, this);
        this.addTicked();
        this.makeTweenGenre();
    }

    makeTweenGenre() {
        let tween = game.add.tween(this).to({ x: this.posX }, 500, Phaser.Easing.Back.Out, false);
        setTimeout(() => {
            tween.start();
        }, this.index * 100);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.childrenGenre.length > 0) {
            this.signalInput.dispatch({
                cmd: "HAS_CHILD",
                childrenGenre: this.childrenGenre,
                nameParent: this.configs.genre
            });
        } else {
            if (this.choosed == true) {
                this.destroyTicked();
                this.signalInput.dispatch({
                    cmd: "DISCHOOSED",
                    id: this.configs.id
                });
                this.choosed = false;
            } else if (this.choosed == false) {
                this.showTicked();
                this.signalInput.dispatch({
                    cmd: "CHOOSED",
                    id: this.configs.id
                });
                this.choosed = true;
            }
            // this.destroy();
        }
    }

    addTicked() {
        this.tick = new Phaser.Sprite(game, 223 * window.GameConfig.RESIZE, 103 * window.GameConfig.RESIZE, 'isNewUserSprites', 'Button_Active');
        this.frameAcitve = new Phaser.Sprite(game, 0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE, 'isNewUserSprites', 'Khung_Active');
        if (this.choosed == true) {

        } else {
            this.frameAcitve.kill();
            this.tick.kill();
        }
        this.addChild(this.frameAcitve);
        this.addChild(this.tick);
    }

    destroyTicked() {
        this.frameAcitve.kill();
        this.tick.kill();
    }

    showTicked() {
        // Button_Active
        this.frameAcitve.revive();
        this.tick.revive();
    }

    addEventInput(callback, scope) {
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }
}