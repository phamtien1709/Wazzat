import DataCommand from "../../../../common/DataCommand.js";
import SpriteBase from "../../../../view/component/SpriteBase.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import PlayScriptScreen from "../../../../view/playscript/playScriptScreen.js";
import Language from "../../../../model/Language.js";

export default class QuestInitSprite extends Phaser.Sprite {
    constructor(type = 0) {
        super(game, 0, 0, 'otherSprites', 'tab-friend');
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.signalClaim = new Phaser.Signal();
        this.type = type;
        this.event = {
            claimReward: new Phaser.Signal(),
            claimPlayScript: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.required;
        this.reward;
        this.btnClaim;
    }

    onStep6Claim() {
        this.event.claimReward.dispatch(this.quest, this.quest_log_id);
    }

    addRequireAndReward(quest, quest_log_id) {
        this.quest = quest;
        this.quest_log_id = quest_log_id;
        //
        PlayScriptScreen.instance().event.step6.add(this.onStep6Claim, this);
        //
        this.required = new Phaser.Text(game, this.positionQAndAConfig.scroll.requireInit.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.requireInit.y * window.GameConfig.RESIZE, quest.quest, this.positionQAndAConfig.scroll.requireInit.configs);
        this.required.anchor.set(0, 0.5);
        this.addChild(this.required);
        this.reward = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardInit.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardInit.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardInit.nameAtlas, this.positionQAndAConfig.scroll.btnRewardInit.nameSprite);
        var nameSprite;
        if (quest.reward_type == "DIAMOND") {
            nameSprite = "Gem";
        } else if (quest.reward_type == "TICKET") {
            nameSprite = "Ticket";
        } else if (quest.reward_type == "SUPPORT_ITEM") {
            nameSprite = "Mic";
        }
        let resourceType = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnRewardInit.diamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardInit.diamond.y * window.GameConfig.RESIZE, 'questAndAchieveSprites', nameSprite);
        this.reward.addChild(resourceType);
        //
        let txtResource = new Phaser.Text(game, this.positionQAndAConfig.scroll.btnRewardInit.txtDiamond.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnRewardInit.txtDiamond.y * window.GameConfig.RESIZE, quest.reward, this.positionQAndAConfig.scroll.btnRewardInit.txtDiamond.configs)
        this.reward.addChild(txtResource);
        this.addChild(this.reward);
        this.reward.inputEnabled = true;
        //
        this.btnClaim = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.btnClaimReward.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnClaimReward.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnClaimReward.nameAtlas, this.positionQAndAConfig.scroll.btnClaimReward.nameSprite);
        this.btnClaim.inputEnabled = true;
        this.btnClaim.idQuest = quest_log_id;
        let txtClaim = new Phaser.Text(game, this.positionQAndAConfig.scroll.btnClaimReward.txt.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.btnClaimReward.txt.y * window.GameConfig.RESIZE, Language.instance().getData("234"), this.positionQAndAConfig.scroll.btnClaimReward.txt.configs);
        this.btnClaim.addChild(txtClaim);
        this.addChild(this.btnClaim);
        this.btnClaim.events.onInputUp.add(this.onClaim, this);
        //
        let line = new SpriteBase(this.positionQAndAConfig.line_under);
        this.addChild(line);
    }

    onClaim() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.btnClaim.inputEnabled = false;
        if (this.type == 0) {
            this.event.claimReward.dispatch(this.quest, this.btnClaim.idQuest);
        } else {
            this.event.claimPlayScript.dispatch();
        }
    }

    onReceiveReward() {
        PlayScriptScreen.instance().event.step6.remove(this.onStep6Claim, this);
        this.reward.destroy();
        this.loadTexture('otherSprites', 'tab-friend');
        let tick = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.doneIcon.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.doneIcon.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.doneIcon.nameAtlas, this.positionQAndAConfig.scroll.doneIcon.nameSprite);
        tick.anchor.set(1, 0);
        this.addChild(tick);
    }
}