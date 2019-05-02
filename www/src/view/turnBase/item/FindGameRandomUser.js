import FindGameButtonFriend from "./button/FindGameButtonFriend.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import FacebookAction from "../../../common/FacebookAction.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class FindGameRandomUser extends BaseGroup {
    constructor() {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.event = {
            challengeGame: new Phaser.Signal()
        }
    }

    initGroup() {
        if (this.group == null || this.group == undefined) {
            this.group = game.add.group();
            this.addChild(this.group);
        }
    }

    addButtonRandomUser(user) {
        if (user.id == null || user.id == undefined) {

        } else {
            //
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_turbase_random_opponent);
            //
            var btnRandom = new FindGameButtonFriend(this.findOpponentConfig.Button_Random, user);
            btnRandom.addTextInCenter(this.findOpponentConfig.txt_random_user);
            btnRandom.addInput(this.onClickBtn, this);
            // btnRandom.anchor.set(1, 0);
            this.group.addChild(btnRandom);
        }
        // LogConsole.log(btnRandom);
    }

    addBtnInviteFriendFB() {
        var btnFB = new Phaser.Sprite(game, this.findOpponentConfig.Button_FB.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.findOpponentConfig.Button_FB.y) * window.GameConfig.RESIZE, this.findOpponentConfig.Button_FB.nameAtlas, this.findOpponentConfig.Button_FB.nameSprite);
        btnFB.anchor.set(0, 0.5);
        btnFB.inputEnabled = true;
        btnFB.events.onInputUp.add(this.inviteFriendFB, this);
        let iconFB = new Phaser.Sprite(game, this.findOpponentConfig.Icon_Button_FB.x * window.GameConfig.RESIZE, this.findOpponentConfig.Icon_Button_FB.y * window.GameConfig.RESIZE, this.findOpponentConfig.Icon_Button_FB.nameAtlas, this.findOpponentConfig.Icon_Button_FB.nameSprite);
        iconFB.anchor.set(0, 0.5);
        btnFB.addChild(iconFB);
        let txtFB = new Phaser.Text(game, this.findOpponentConfig.txt_Button_FB.x * window.GameConfig.RESIZE, this.findOpponentConfig.txt_Button_FB.y * window.GameConfig.RESIZE, Language.instance().getData("248"), this.findOpponentConfig.txt_Button_FB.configs);
        txtFB.anchor.set(0, 0.5);
        btnFB.addChild(txtFB);
        this.group.add(btnFB);

    }

    inviteFriendFB() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        FacebookAction.instance().inviteFriend();
    }

    onClickBtn(value) {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_turbase_random_opponent_button);
        //
        LogConsole.log(value);
        this.event.challengeGame.dispatch(value);
    }

    removeGroup() {
        this.group.destroy();
        this.group = null;
    }
}