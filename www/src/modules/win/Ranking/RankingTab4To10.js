export default class RankingTab4To10 extends Phaser.Sprite {
    constructor() {
        super(game, 0, 0, 'practiceMenuSprites', 'Tab_4-10');
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.afterInit();
    }

    afterInit() {
        this.txtRank;
        this.iconRank;
        this.txtNumber;
        this.reward;
        this.lineUnder;
        this.addTxtRank(this.positionRankingConfig.tab4_10.txt_rank);
        this.addIconRank(this.positionRankingConfig.tab4_10.icon);
        this.addTxtNumber(this.positionRankingConfig.tab4_10.number);
        this.addReward(this.positionRankingConfig.tab4_10.reward);
        this.addLineUnder(this.positionRankingConfig.tab4_10.line);
    }

    addTxtRank(configs) {
        this.txtRank = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.addChild(this.txtRank);
    }

    addIconRank(configs) {
        this.iconRank = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.addChild(this.iconRank);
    }

    addTxtNumber(configs) {
        this.txtNumber = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.addChild(this.txtNumber);
    }

    addReward(configs) {
        this.reward = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, null);
        this.reward.anchor.set(1, 0);
        this.addChild(this.reward);
    }

    addLineUnder(configs) {
        this.lineUnder = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.addChild(this.lineUnder);
    }
}