import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SqlLiteController from "../../../SqlLiteController.js";
import Language from "../../../model/Language.js";

export default class PopupSuggetsRatingItem extends BaseView {
    constructor() {
        super(game, 0, 0, "");

        this.event = {
            close: new Phaser.Signal()
        }

        this.positionPopup = MainData.instance().positionPopup;

        this.bg = new SpriteBase(this.positionPopup.popup_suggets_rating_bg);
        this.addChild(this.bg);


        this.btnVoteSau = new ButtonWithText(this.positionPopup.popup_suggets_rating_btn_votesau, Language.instance().getData("121"), this.chooseVoteSau, this);
        this.addChild(this.btnVoteSau);

        this.btnVoteNgay = new ButtonWithText(this.positionPopup.popup_suggets_rating_btn_votengay, Language.instance().getData("122"), this.chooseVoteNgay, this);
        this.addChild(this.btnVoteNgay);

        this.btnClose = new ButtonBase(this.positionPopup.popup_suggets_rating_btn_close, this.chooseClose, this);
        this.addChild(this.btnClose);

        this.txt1 = new TextBase(this.positionPopup.popup_suggets_rating_lb1, Language.instance().getData("123"));
        this.txt1.x = (this.bg.width - this.txt1.width) / 2;
        this.addChild(this.txt1);

        this.txt2 = new TextBase(this.positionPopup.popup_suggets_rating_lb2, Language.instance().getData("124"));
        this.txt2.x = (this.bg.width - this.txt2.width) / 2;
        this.addChild(this.txt2);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.SuggetRatingShow);
    }


    chooseVoteSau() {
        LogConsole.log("chooseVoteSau");

        //ControllLocalStorage.instance().setItem(ControllLocalStorage.VOTE, "VoteSau");
        SqlLiteController.instance().updateCheckVote("VoteSau");
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.SuggetRatingVoteSau);

        this.event.close.dispatch();

    }

    chooseVoteNgay() {
        LogConsole.log("chooseVoteNgay");

        //ControllLocalStorage.instance().setItem(ControllLocalStorage.VOTE, "VoteNgay");
        SqlLiteController.instance().updateCheckVote("VoteNgay");
        if (MainData.instance().platform === "and") {
            // window.open("market://details?id=com.wazzat.musicgame");
            window.open(window.RESOURCE.android_storage_link);
        } else if (MainData.instance().platform === "ios") {
            // window.open("itms-apps://itunes.apple.com/app/1440442421");
            window.open(window.RESOURCE.ios_storage_link);
        }

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.SuggetRatingVoteNgay);

        this.event.close.dispatch();
    }

    chooseClose() {
        LogConsole.log("chooseClose");
        SqlLiteController.instance().updateCheckVote("Close");
        //ControllLocalStorage.instance().setItem(ControllLocalStorage.VOTE, "Close");
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.SuggetRatingClose);
        this.event.close.dispatch();
    }
}