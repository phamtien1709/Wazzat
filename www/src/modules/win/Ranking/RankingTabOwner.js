import RankingAvaLoader from "./RankingAvaLoader.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";

export default class RankingTabOwner extends Phaser.Button {
    constructor(configs) {
        super(game, 0, (game.height - 108) * window.GameConfig.RESIZE, 'practiceMenuSprites', () => { }, null, null, 'Tab_label');
        this.configs = configs;
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.afterInit();
    }

    afterInit() {
        this.icon;
        this.number;
        this.ava;
        this.name;
        this.circle;
        this.score;
        this.frameAva;
        this.line;
        if (this.configs.rank !== "N/A") {
            this.addIcon(this.positionRankingConfig.rank[this.configs.rank]);
            this.addNumber();
            this.addAva();
            this.addName();
            this.addCircle(this.positionRankingConfig.circle_stroke);
            this.addScore();
            this.addFrameAva();
        } else {
            this.addNotRank();
        }
    }
    addNotRank() {
        this.txtNotRank = new Phaser.Text(game, 320, 53, Language.instance().getData("28"), {
            fontSize: 30,
            font: "Gilroy",
            fill: "white",
            align: "center"
        });
        this.txtNotRank.anchor.set(0.5);
        this.addChild(this.txtNotRank);
    }

    addIcon(configs) {
        if (this.configs.rank < 4) {
            this.icon = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
            this.addChild(this.icon);
        } else {
            this.icon = new Phaser.Sprite(game, this.positionRankingConfig.rank.other.x * window.GameConfig.RESIZE, this.positionRankingConfig.rank.other.y * window.GameConfig.RESIZE, this.positionRankingConfig.rank.other.nameAtlas, this.positionRankingConfig.rank.other.nameSprite);
            this.addChild(this.icon);
        }
    }

    addNumber() {
        if (this.configs.rank > 3) {
            this.number = new Phaser.Text(game, 80 * window.GameConfig.RESIZE, 53 * window.GameConfig.RESIZE, this.configs.rank, {
                font: `GilroyMedium`,
                fill: "#ffffff",
                fontSize: 22
            });
            this.number.anchor.set(0, 0.5);
            this.addChild(this.number);
        } else {
            this.number = new Phaser.Text(game, 85 * window.GameConfig.RESIZE, 57 * window.GameConfig.RESIZE, this.configs.rank, {
                font: `GilroyMedium`,
                fill: "#ffffff",
                fontSize: 22
            });
            this.number.anchor.set(0, 0.5);
            this.addChild(this.number);
        }
    }

    addAva() {
        this.ava = new RankingAvaLoader(this.configs.user_entity.avatar);
        this.ava.x = 170 * window.GameConfig.RESIZE;
        this.ava.y = 58 * window.GameConfig.RESIZE;
        this.addChild(this.ava);
    }

    addName() {
        this.name = new Phaser.Text(game, 220 * window.GameConfig.RESIZE, 53 * window.GameConfig.RESIZE, this.configs.user_entity.user_name, {
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

    addFrameAva() {
        if (SocketController.instance().dataMySeft.vip === true) {
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

    addScore() {
        this.score = new Phaser.Text(game, -27 * window.GameConfig.RESIZE, 28 * window.GameConfig.RESIZE, this.configs.number_of_correct, {
            font: `GilroyMedium`,
            fill: "#ffa33a",
            fontSize: 20
        });
        this.score.anchor.set(0.5);
        this.circle.addChild(this.score);
    }

    get height() {
        return 193;
    }
}