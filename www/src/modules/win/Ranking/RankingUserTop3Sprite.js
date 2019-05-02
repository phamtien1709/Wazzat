import RankingAvaLoader from "./RankingAvaLoader.js";
import SpriteBase from "../../../view/component/SpriteBase.js";
import ControllScreenDialog from "../../../view/ControllScreenDialog.js";
import EventGame from "../../../controller/EventGame.js";

export default class RankingUserTop3Sprite extends Phaser.Sprite {
    constructor(configs, index, isFinish = false) {
        super(game, 0, index * 188 * window.GameConfig.RESIZE, null);
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.configs = configs;
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
        this.score;
        this.diamond;
        this.txtDiamond;
        this.ticket;
        this.txtTicket;
        this.line;
        this.addIcon(this.positionRankingConfig.rank[this.index + 1]);
        this.addNumber();
        this.addAva();
        this.addName();
        this.addCircle(this.positionRankingConfig.circle_stroke);
        this.addFrameAva();
        this.addScore();
        this.addLine();
        // this.addTweenMoveToScreen();
    }
    get height() {
        return 115 * window.GameConfig.RESIZE;
    }
    addIcon(configs) {
        this.icon = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.addChild(this.icon);
    }

    addNumber() {
        this.number = new Phaser.Text(game, 85 * window.GameConfig.RESIZE, 47 * window.GameConfig.RESIZE, `${this.index + 1}`, {
            font: `GilroyMedium`,
            fill: "#ffffff",
            fontSize: 21
        });
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
            this.clickProfile = false;
            ControllScreenDialog.instance().addUserProfile(this.configs.user_id);
        } else {
            this.clickProfile = false;
        }
    }

    addName() {
        this.name = new Phaser.Text(game, 225 * window.GameConfig.RESIZE, 38 * window.GameConfig.RESIZE, this.configs.user_name, {
            font: `GilroyMedium`,
            fill: "#ffffff",
            fontSize: 22
        });
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

    addDiamondScore() {
        this.diamond = new Phaser.Sprite(game, this.positionRankingConfig.diamond.x * window.GameConfig.RESIZE, this.positionRankingConfig.diamond.y * window.GameConfig.RESIZE, this.positionRankingConfig.diamond.nameAtlas, this.positionRankingConfig.diamond.nameSprite);
        this.addChild(this.diamond);
        this.txtDiamond = new Phaser.Text(game, this.positionRankingConfig.txt_diamond.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_diamond.y * window.GameConfig.RESIZE, 3000 / (this.index + 1), this.positionRankingConfig.txt_diamond.configs);
        this.addChild(this.txtDiamond);
    }

    addTicketScore() {
        this.ticket = new Phaser.Sprite(game, this.positionRankingConfig.ticket.x * window.GameConfig.RESIZE, this.positionRankingConfig.ticket.y * window.GameConfig.RESIZE, this.positionRankingConfig.ticket.nameAtlas, this.positionRankingConfig.ticket.nameSprite);
        this.addChild(this.ticket);
        this.txtTicket = new Phaser.Text(game, this.positionRankingConfig.txt_ticket.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_ticket.y * window.GameConfig.RESIZE, 30 / (this.index + 1), this.positionRankingConfig.txt_ticket.configs);
        this.addChild(this.txtTicket);
    }

    addLine() {
        this.line = new SpriteBase(this.positionRankingConfig.line_under);
        this.addChild(this.line);
    }

    addTweenMoveToScreen() {
        // setTimeout(() => {
        //     let tween = game.add.tween(this).to({ x: 0 }, 250, "Linear", true);
        //     tween.start();
        // }, this.index * 100);
        this.x = 0;
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