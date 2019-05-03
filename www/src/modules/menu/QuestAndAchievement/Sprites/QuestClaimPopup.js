import PopupDialogWithCloseItem from "../../../../view/popup/item/PopupDialogWithCloseItem.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../../FaceBookCheckingTools.js";
import PlayScriptScreen from "../../../../view/playscript/playScriptScreen.js";
import MainData from "../../../../model/MainData.js";
import SocketController from "../../../../controller/SocketController.js";
import DataCommand from "../../../../common/DataCommand.js";
import Language from "../../../../model/Language.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class QuestClaimPopup extends BaseGroup {
    constructor(quest) {
        super(game)
        // "questDemo": {
        //     "reward": 50,
        //     "id": 12,
        //     "quest": "Share game resuft on facebook",
        //     "required": 1,
        //     "quest_type": 11,
        //     "order": 12,
        //     "reward_type": "DIAMOND"
        // }
        this.quest = quest;
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.eventInput = {
            claim: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.screenDim;
        this.popup;
        this.addScreenDim();
        this.addPopup();
        //
        this.addEventExtension();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Popup_Quest);
        //
    }

    addScreenDim() {
        this.screenDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.screenDim.inputEnabled = true;
        this.addChild(this.screenDim);
    }

    addPopup() {
        this.txtPopup;
        this.rewardClaimed;
        this.txtQuestReward;
        this.btnClaim;
        this.popup = new PopupDialogWithCloseItem();
        this.popup.x = 35 * window.GameConfig.RESIZE;
        this.popup.y = 1136 * window.GameConfig.RESIZE;
        this.popup.setHeight(400 * window.GameConfig.RESIZE);
        this.popup.event.close.add(this.onClose, this);
        this.addTxtPopup();
        this.addRewardClaimed();
        this.addTxtQuestReward();
        this.addBtnClaim();
        this.addChild(this.popup);
    }

    addTxtPopup() {
        this.txtPopup = new Phaser.Text(game, this.positionQAndAConfig.txtPopupClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.txtPopupClaim.y * window.GameConfig.RESIZE, Language.instance().getData("272"), this.positionQAndAConfig.txtPopupClaim.configs);
        this.txtPopup.anchor.set(0.5, 0);
        this.popup.addChild(this.txtPopup);
    }

    addRewardClaimed() {
        this.rewardClaimed = new Phaser.Text(game, this.positionQAndAConfig.rewardClaimed.x * window.GameConfig.RESIZE, this.positionQAndAConfig.rewardClaimed.y * window.GameConfig.RESIZE, this.quest.reward, this.positionQAndAConfig.rewardClaimed.configs);
        //
        if (this.quest.reward_type == "DIAMOND") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.gemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.gemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.gemClaim.nameAtlas, this.positionQAndAConfig.gemClaim.nameSprite);
            gem.scale.set(1.2);
        } else if (this.quest.reward_type == "TICKET") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.ticketClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.ticketClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.ticketClaim.nameAtlas, this.positionQAndAConfig.ticketClaim.nameSprite);
            gem.scale.set(1.2);
        } else {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.sptItemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.sptItemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.sptItemClaim.nameAtlas, this.positionQAndAConfig.sptItemClaim.nameSprite);
            gem.scale.set(1.2);
        }
        //
        let sumWidth = this.rewardClaimed.width + gem.width;
        this.rewardClaimed.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) + this.rewardClaimed.width + 5 * window.GameConfig.RESIZE;
        //
        this.popup.addChild(this.rewardClaimed);
        this.popup.addChild(gem);
    }

    addTxtQuestReward() {
        // console.log(this.quest);
        this.txtQuestReward = new Phaser.Text(game, this.positionQAndAConfig.questReward.x * window.GameConfig.RESIZE, this.positionQAndAConfig.questReward.y * window.GameConfig.RESIZE, this.quest.quest, this.positionQAndAConfig.questReward.configs);
        this.txtQuestReward.anchor.set(0.5, 0);
        this.popup.addChild(this.txtQuestReward);
    }

    addBtnClaim() {
        this.btnClaim = new Phaser.Sprite(game, 285 * window.GameConfig.RESIZE, 295 * window.GameConfig.RESIZE, "questAndAchieveSprites", "Button_Nhan_popup");
        this.btnClaim.anchor.set(0.5, 0);
        let txt = new Phaser.Text(game, 0, 27 * window.GameConfig.RESIZE, Language.instance().getData("189"), {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 30
        });
        txt.anchor.set(0.5, 0);
        this.btnClaim.addChild(txt);
        this.btnClaim.inputEnabled = true;
        this.btnClaim.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            let tween = game.add.tween(this.popup).to({ y: -249 * window.GameConfig.RESIZE }, 200, Phaser.Easing.Linear.Out, false);
            tween.start();
            tween.onComplete.add(() => {
                this.eventInput.claim.dispatch();
                this.destroy();
            }, this);
        }, this);
        this.popup.addChild(this.btnClaim);
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.popupfinishquest);
        let tween = game.add.tween(this.popup).to({ y: (game.height - 776) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_TURNBASE) {
                let popupTut = new PlayScriptScreen();
                popupTut.afterInit();
                this.addChild(popupTut);
                popupTut.event.step5.add(this.step5ReceiveFristReward, this);
                popupTut.addStep5ReceiveFirstReward();
            }
        }, this)
    }

    step5ReceiveFristReward() {
        this.eventInput.claim.dispatch();
        this.destroy();
    }

    onClose() {
        let tween = game.add.tween(this.popup).to({ y: -420 * window.GameConfig.RESIZE }, 200, Phaser.Easing.Linear.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
        this.popup.event.close.remove(this.onClose, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.PLAY_SCRIPT_DONE_ALL_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                MainData.instance().playScript.playing_guide = PlayScriptScreen.DONE_ALL;
                this.destroy();
            }
        }
    }

    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    destroy() {
        this.removeEventExtension();
        if (this.children !== null) {
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
        super.destroy();
    }
}