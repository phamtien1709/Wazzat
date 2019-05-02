import SpriteBase from "../../../../view/component/SpriteBase.js";

export default class QuestDoingDaily extends Phaser.Sprite {
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
        this.required = new Phaser.Text(game, this.positionQAndAConfig.scroll.requireInitDaily.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.requireInitDaily.y * window.GameConfig.RESIZE, `${quest.quest} (${quest.achieved}/${quest.required})`, this.positionQAndAConfig.scroll.requireInitDaily.configs);
        this.required.anchor.set(0, 0.5);
        this.addChild(this.required);
        //
        this.reward = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardDoingDaily.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoingDaily.y * window.GameConfig.RESIZE, null);
        //
        var nameSprite;
        if (quest.reward_type == "DIAMOND") {
            nameSprite = "Gem";
        } else if (quest.reward_type == "TICKET") {
            nameSprite = "Ticket";
        } else if (quest.reward_type == "SUPPORT_ITEM") {
            nameSprite = "Mic";
        }
        let resourceType = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardDoingDaily.diamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoingDaily.diamond.y * window.GameConfig.RESIZE, 'questAndAchieveSprites', nameSprite);
        this.reward.addChild(resourceType);
        //
        let txtResource = new Phaser.Text(game, this.positionQAndAConfig.scroll.btnRewardDoingDaily.txtDiamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoingDaily.txtDiamond.y * window.GameConfig.RESIZE, quest.reward, this.positionQAndAConfig.scroll.btnRewardDoingDaily.txtDiamond.configs)
        this.reward.addChild(txtResource);
        this.addChild(this.reward);
        //
        let line = new SpriteBase(this.positionQAndAConfig.line_under);
        this.addChild(line);
    }
}