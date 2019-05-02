import SpriteBase from "../../component/SpriteBase.js";
import PopupBg from "./PopupBg.js";
import MainData from "../../../model/MainData.js";
import ButtonBase from "../../component/ButtonBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import TextBase from "../../component/TextBase.js";
import BaseGroup from "../../BaseGroup.js";

export default class PopupClaimSoloModeChild extends BaseGroup {
    constructor(playlist, reward) {
        super(game);
        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));
        this.positionPopup = MainData.instance().positionPopup;
        this.playlist = playlist;
        this.reward = reward;
        this.event = {
            close: new Phaser.Signal(),
            claim: new Phaser.Signal(),
            rank: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.bg;
        this.iconTrophy;
        this.lblCongrat;
        this.lblRank;
        this.lblReward;
        this.boxGift;
        this.lblPlaylist;
        this.btnClose;
        this.btnOk;
        this.btnCancle;
        this.addBG();
        this.addIconTrophy();
        this.addLblCongrat();
        this.addLblRank();
        this.addLblReward();
        this.addBoxGift();
        // this.addLblPlaylist();
        this.addBtnClose();
        this.addBtnOk();
        this.addBtnCancle();
    }

    addBG() {
        this.bg = new PopupBg();
        this.bg.x = 60 * MainData.instance().scale;
        this.bg.y = 625 * MainData.instance().scale;
        this.bg.setHeight(865 * MainData.instance().scale);
        this.addChild(this.bg);
    }

    addIconTrophy() {
        this.iconTrophy = new SpriteBase(this.positionPopup.claim_solo_mode_ranking.popup_win_icon_trophy);
        this.iconTrophy.anchor.set(0.5, 0);
        this.bg.addChild(this.iconTrophy);
    }

    addBtnClose() {
        this.btnClose = new ButtonBase(this.positionPopup.claim_solo_mode_ranking.popup_close_btn_exit, this.chooseClose, this);
        this.btnClose.x = this.bg.width - this.btnClose.width / 2;
        this.btnClose.y = -this.btnClose.height / 2;
        this.bg.addChild(this.btnClose);
    }

    chooseClose() {
        this.event.close.dispatch();
    }

    addBtnOk() {
        this.btnOk = new ButtonWithText(this.positionPopup.claim_solo_mode_ranking.popup_confirm_button_ok, this.positionPopup.claim_solo_mode_ranking.popup_confirm_button_ok.text, this.chooseOK, this);
        this.bg.addChild(this.btnOk);
    }
    chooseOK() {
        this.event.claim.dispatch();
    }

    addBtnCancle() {
        this.btnCancle = new ButtonWithText(this.positionPopup.claim_solo_mode_ranking.popup_confirm_button_cancle, this.positionPopup.claim_solo_mode_ranking.popup_confirm_button_cancle.text, this.chooseCancle, this);
        this.bg.addChild(this.btnCancle);
    }
    chooseCancle() {
        this.event.rank.dispatch();
    }

    addLblCongrat() {
        this.lblCongrat = new TextBase(this.positionPopup.claim_solo_mode_ranking.popup_win_text_chucmung, this.positionPopup.claim_solo_mode_ranking.popup_win_text_chucmung.text);
        this.lblCongrat.anchor.set(0.5, 0);
        this.bg.addChild(this.lblCongrat);
    }

    addLblRank() {
        this.lblRank = new TextBase(this.positionPopup.claim_solo_mode_ranking.popup_win_text_stt, "10");
        this.lblRank.anchor.set(0.5, 0);
        this.bg.addChild(this.lblRank);
    }

    addLblReward() {
        this.lblReward = new TextBase(this.positionPopup.claim_solo_mode_ranking.popup_win_text_phanthuong, this.positionPopup.claim_solo_mode_ranking.popup_win_text_phanthuong.text);
        this.lblReward.anchor.set(0.5, 0);
        this.bg.addChild(this.lblReward);
    }

    addBoxGift() {
        this.boxGift
    }

    addLblPlaylist() {
        this.lblPlaylist = new TextBase(this.positionPopup.claim_solo_mode_ranking.popup_win_text_chucmung, this.positionPopup.claim_solo_mode_ranking.popup_win_text_chucmung.text);
        this.lblPlaylist.anchor.set(0.5, 0);
        this.bg.addChild(this.lblPlaylist);
    }
}