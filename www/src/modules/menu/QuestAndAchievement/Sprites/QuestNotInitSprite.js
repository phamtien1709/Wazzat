import SpriteBase from "../../../../view/component/SpriteBase.js";

export default class QuestNotInitSprite extends Phaser.Sprite {
    constructor() {
        super(game, 0, 0, 'otherSprites', 'tab-friend');
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.afterInit();
    }

    afterInit() {
        this.required;
        this.reward;
    }

    addRequireAndReward(quest) {
        this.required = new Phaser.Text(game, this.positionQAndAConfig.scroll.require.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.require.y * window.GameConfig.RESIZE, quest.quest, this.positionQAndAConfig.scroll.require.configs);
        this.required.anchor.set(0, 0.5);
        this.addChild(this.required);
        this.reward = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnReward.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnReward.y * window.GameConfig.RESIZE, null);
        //
        var nameSprite;
        if (quest.reward_type == "DIAMOND") {
            nameSprite = "Gem";
        } else if (quest.reward_type == "TICKET") {
            nameSprite = "Ticket";
        } else if (quest.reward_type == "SUPPORT_ITEM") {
            nameSprite = "Mic";
        }
        // this.reward.anchor.set(1, 0);
        let resourceType = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnReward.diamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnReward.diamond.y * window.GameConfig.RESIZE, 'questAndAchieveSprites', nameSprite);
        this.reward.addChild(resourceType);
        //
        let txtResource = new Phaser.Text(game, this.positionQAndAConfig.scroll.btnReward.txtDiamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnReward.txtDiamond.y * window.GameConfig.RESIZE, quest.reward, this.positionQAndAConfig.scroll.btnReward.txtDiamond.configs)
        this.reward.addChild(txtResource);
        this.addChild(this.reward);
        //
        let line = new SpriteBase(this.positionQAndAConfig.line_under);
        this.addChild(line);
    }
}