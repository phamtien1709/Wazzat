import RankingAvaLoader from "./RankingAvaLoader.js";
import SpriteBase from "../../../view/component/SpriteBase.js";
import ControllScreenDialog from "../../../view/ControllScreenDialog.js";
import EventGame from "../../../controller/EventGame.js";

export default class RankingTopOtherUserSprite extends Phaser.Sprite {
    constructor(configs, index, isFinish) {
        super(game, 0, index * 188 * window.GameConfig.RESIZE, null);
        this.configs = configs;
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.index = index;
        this.isFinish = isFinish;
        this.clickProfile = false;
        this.afterInit();
    }

    afterInit() {
        this.icon;
        this.number;
        this.ava;
        this.name;
        this.circle;
        this.score;
        this.line;
        // LogConsole.log(this.configs);
        this.addIcon(this.positionRankingConfig.rank.other);
        this.addNumber();
        this.addAva();
        this.addName();
        this.addCircle(this.positionRankingConfig.circle_stroke);
        this.addFrameAva();
        this.addScore();
        // if (this.isFinish == false) {
        this.addLine();
        // }
        // this.addTweenMoveToScreen();
    }

    addIcon(configs) {
        this.icon = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.addChild(this.icon);
    }

    addNumber() {
        this.number = new Phaser.Text(game, 80 * window.GameConfig.RESIZE, 39 * window.GameConfig.RESIZE, `${this.index + 1}`, {
            font: `GilroyMedium`,
            fill: "#ffffff",
            fontSize: 21
        });
        // this.number.anchor.set(0, 0.5);
        this.addChild(this.number);
    }

    addAva() {
        this.ava = new RankingAvaLoader(this.configs.avatar, this.index);
        this.ava.x = 170 * window.GameConfig.RESIZE;
        this.ava.y = 58 * window.GameConfig.RESIZE;
        this.ava.ava.inputEnabled = true;
        this.ava.ava.events.onInputUp.add(this.onClickAvaGetUserProfile, this);
        this.addChild(this.ava);
    }

    onClickAvaGetUserProfile() {
        if (this.clickProfile == false) {
            this.clickProfile = true;
            // ControllWorld.instance().addUserProfile(this.configs.user_id);
            ControllScreenDialog.instance().addUserProfile(this.configs.user_id);
        }
    }

    addName() {
        this.name = new Phaser.Text(game, 225 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, this.configs.user_name, {
            font: `GilroyMedium`,
            fill: "#ffffff",
            fontSize: 22
        });
        this.name.anchor.set(0, 0.5);
        this.addChild(this.name);
    }

    addCircle(configs) {
        this.circle = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.circle.anchor.set(1, 0);
        this.addChild(this.circle);
    }

    addScore() {
        this.score = new Phaser.Text(game, -27 * window.GameConfig.RESIZE, 28 * window.GameConfig.RESIZE, this.configs.number_of_correct, {
            font: `GilroyMedium`,
            fill: "#ffa33a",
            fontSize: 20
        });
        this.score.anchor.set(0.5);
        this.circle.addChild(this.score);
    }

    addLine() {
        this.line = new SpriteBase(this.positionRankingConfig.line_under);
        this.addChild(this.line);
    }

    get height() {
        return 115 * window.GameConfig.RESIZE;
    }

    addTweenMoveToScreen() {
        // console.log(this.index * 100);
        // if (this.index < 8) {
        //     this.timeOut = setTimeout(() => {
        //         let tween = game.add.tween(this).to({ x: 0 }, 250, "Linear", true);
        //         tween.start();
        //     }, this.index * 100);
        // } else {
        this.position.x = 0;
        // }
    }

    addFrameAva() {
        if (this.configs.vip === true) {
            this.frameAva = new Phaser.Sprite(game, 170, 60, 'vipSource', 'Ava_Nho');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(1.1)
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, 170, 58, 'defaultSource', 'Khung_Ava_Thuong');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(0.9);
            this.addChild(this.frameAva);
        }
    }

    destroy() {
        clearTimeout(this.timeOut);
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