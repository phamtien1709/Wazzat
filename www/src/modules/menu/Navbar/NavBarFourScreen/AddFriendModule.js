import FriendRequestScreen from "../../../../view/friendrequest/FriendRequestScreen.js";

export default class AddFriendModule extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 4;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addFriendScreen = null;
    }

    createAddFriendScreen() {
        this.addFriendScreen = new FriendRequestScreen();
        this.addChild(this.addFriendScreen);
    }

    show() {
        let tweenShow = game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
        tweenShow.start();
        tweenShow.onComplete.add(() => {
            this.addFriendScreen.afterTweenDone();
        })
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300 * window.GameConfig.RESIZE
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }

    destroy() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}