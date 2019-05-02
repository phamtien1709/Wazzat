export default class QuestDoingSprite extends Phaser.Sprite {
    constructor() {
        super(game, 0, 0, 'questAndAchieveSprites', 'Tab_Quest_Dang_Lam');
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.afterInit();
    }

    afterInit() {
        this.required;
        this.reward;
    }

    addRequireAndReward(quest, nextQuest) {
        this.required = new Phaser.Text(game, this.positionQAndAConfig.scroll.requireInit.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.requireInit.y * window.GameConfig.RESIZE, `${quest.quest} (${nextQuest.next_quest_archieved}/${quest.required})`, this.positionQAndAConfig.scroll.requireInit.configs);
        this.required.anchor.set(0, 0.5);
        this.addChild(this.required);
        //
        this.reward = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardDoing.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoing.y * window.GameConfig.RESIZE, null);
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
        let resourceType = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardDoing.diamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoing.diamond.y * window.GameConfig.RESIZE, 'questAndAchieveSprites', nameSprite);
        this.reward.addChild(resourceType);
        //
        let txtResource = new Phaser.Text(game, this.positionQAndAConfig.scroll.btnRewardDoing.txtDiamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardDoing.txtDiamond.y * window.GameConfig.RESIZE, quest.reward, this.positionQAndAConfig.scroll.btnRewardDoing.txtDiamond.configs)
        this.reward.addChild(txtResource);
        this.addChild(this.reward);
        // let line_white = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.Line_percent_white.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.Line_percent_white.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.Line_percent_white.nameAtlas, this.positionQAndAConfig.scroll.Line_percent_white.nameSprite);
        // this.addChild(line_white);
        // let line_gradient = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.Line_percent_gradient.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.Line_percent_gradient.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.Line_percent_gradient.nameAtlas, this.positionQAndAConfig.scroll.Line_percent_gradient.nameSprite);
        // this.addChild(line_gradient);
        // let progress = parseInt((nextQuest.next_quest_archieved / quest.required) * 100);
        // line_gradient.scale.set(progress / 100, 1)
        // LogConsole.log(progress);
    }
}