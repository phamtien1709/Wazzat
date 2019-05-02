import BaseView from "../../../BaseView.js";
import PopupBg from "../../../popup/item/PopupBg.js";
import ButtonBase from "../../../component/ButtonBase.js";
import TextBase from "../../../component/TextBase.js";
import EventModeRoomWinItem from "../selectroom/EventModeRoomWinItem.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import EventModeCommand from "../../../../model/eventmode/datafield/EventModeCommand.js";
import SendEventModeClaimReward from "../../../../model/eventmode/server/senddata/SendEventModeClaimReward.js";
import MainData from "../../../../model/MainData.js";
import FacebookAction from "../../../../common/FacebookAction.js";
import Language from "../../../../model/Language.js";

export default class EventModePopupTop100Item extends BaseView {
    constructor(dataEvent) {
        super(game, null);
        this.dataEvent = dataEvent;
        this.event = {
            accept_gift: new Phaser.Signal(),
            view_result: new Phaser.Signal(),
            exit: new Phaser.Signal()
        }

        this.positionEventMode = MainData.instance().positionEventMode;
        this.positionPopup = MainData.instance().positionPopup;

        this.bg = new PopupBg();
        this.bg.y = 198 * MainData.instance().scale;
        this.bg.setHeight(612 * MainData.instance().scale);
        this.addChild(this.bg);


        this.iconTrophy = new Phaser.Sprite(game, 0, 0, "iconpopupwinevent");
        this.iconTrophy.animations.add("iconpopupwinevent");
        this.iconTrophy.animations.play("iconpopupwinevent", 30, true);
        this.iconTrophy.width = 526;
        this.iconTrophy.height = 320;
        this.iconTrophy.x = (this.bg.width - this.iconTrophy.width) / 2;
        this.iconTrophy.y = -50;
        this.addChild(this.iconTrophy);
        /*
        this.iconTrophy = new SpriteBase(this.positionEventMode.popup_win_icon_trophy);
        this.addChild(this.iconTrophy);*/

        this.lbKetThuc = new TextBase(this.positionEventMode.popup_win_text_ketthucsukien, Language.instance().getData("10"));
        this.lbKetThuc.setTextBounds(0, 0, this.bg.width, 30 * MainData.instance().scale);
        this.addChild(this.lbKetThuc);

        this.lbNameEvent = new TextBase(this.positionEventMode.popup_win_text_name, dataEvent.event.name);
        this.lbNameEvent.setTextBounds(0, 0, this.bg.width, 46 * MainData.instance().scale);
        this.addChild(this.lbNameEvent);

        this.lbChucMung = new TextBase(this.positionEventMode.popup_win_text_chucmung, Language.instance().getData("11"));
        this.lbChucMung.setTextBounds(0, 0, this.bg.width, 30 * MainData.instance().scale);
        this.addChild(this.lbChucMung);

        this.lbSTT = new TextBase(this.positionEventMode.popup_win_text_stt, dataEvent.event_top_rank_log.top);
        this.lbSTT.setTextBounds(0, 0, this.bg.width, 46 * MainData.instance().scale);
        this.addChild(this.lbSTT);

        this.lbPhanThuong = new TextBase(this.positionEventMode.popup_win_text_phanthuong, Language.instance().getData("12"));
        this.lbPhanThuong.setTextBounds(0, 0, this.bg.width, 30 * MainData.instance().scale);
        this.addChild(this.lbPhanThuong);

        this.gift = new EventModeRoomWinItem(dataEvent.event_reward, true);
        this.gift.x = (this.bg.width - this.gift.width) / 2;
        this.gift.y = 518 * MainData.instance().scale;
        this.addChild(this.gift);


        this.btnClose = new ButtonBase(this.positionPopup.popup_close_btn_exit, this.chooseClose, this);
        this.btnClose.x = this.bg.width - this.btnClose.width / 2;
        this.btnClose.y = this.bg.y - this.btnClose.height / 3;
        this.addChild(this.btnClose);

        this.btnXemKetQua = new ButtonWithText(this.positionPopup.popup_confirm_button_ok, Language.instance().getData("13"), this.chooseCancle, this);
        this.btnXemKetQua.x = 35;
        this.btnXemKetQua.y = 610 * MainData.instance().scale;
        this.addChild(this.btnXemKetQua);

        this.btnShare = new ButtonWithText(this.positionPopup.popup_confirm_button_share, Language.instance().getData("14"), this.chooseShare, this);
        this.btnShare.y = 610 * MainData.instance().scale;
        this.addChild(this.btnShare);

        this.btnNhanthuong = new ButtonWithText(this.positionPopup.popup_confirm_button_ok_full, Language.instance().getData("15"), this.chooseOK, this);
        this.btnNhanthuong.x = 35;
        this.btnNhanthuong.y = 715 * MainData.instance().scale;
        this.addChild(this.btnNhanthuong);
    }

    chooseShare() {
        FacebookAction.instance().share();
    }

    chooseOK() {
        this.btnNhanthuong.inputEnabled = false;
        this.event.accept_gift.dispatch();
        SocketController.instance().sendData(EventModeCommand.EVENT_MODE_CLAIM_REWARD_REQUEST,
            SendEventModeClaimReward.begin(this.dataEvent.event_top_rank_log.id));
    }

    chooseCancle() {
        this.event.view_result.dispatch(this.dataEvent.event.id);
    }

    chooseClose() {
        this.event.exit.dispatch();
    }
}