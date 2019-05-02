import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import KeyBoard from "../../../component/KeyBoard.js";
import EventGame from "../../../../controller/EventGame.js";
import Language from "../../../../model/Language.js";
import MainData from "../../../../model/MainData.js";

export default class ShopSortHeader extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.eventSearch = new Phaser.Signal();
        this.eventBack = new Phaser.Signal();

        this.positionShop = MainData.instance().positionShop;
        this.bg = new SpriteBase(this.positionShop.sort_play_list_bg_top_menu);
        this.addChild(this.bg);

        this.btnBack = new ButtonBase(this.positionShop.sort_play_list_bg_back_top_menu, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.btnSearch = new ButtonBase(this.positionShop.sort_play_list_bg_search_icon_top_menu, this.chooseSearch, this);
        this.addChild(this.btnSearch);

        this.btnDiamond = new ButtonWithText(this.positionShop.sort_play_list_bg_diamond_top_menu, SocketController.instance().dataMySeft.diamond);
        this.addChild(this.btnDiamond);

        this.addEvent();
    }
    addEvent() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUserVarsUpdate, this);
        EventGame.instance().event.backButton.add(this.chooseBack, this);
    }
    removeEvent() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUserVarsUpdate, this);
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
    }

    onUserVarsUpdate(data) {
        if (this.btnDiamond !== null) {
            this.btnDiamond.setText(SocketController.instance().dataMySeft.diamond);
        }
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        LogConsole.log("chooseBack");
        this.dispatchEventBack();
    }
    chooseSearch() {
        LogConsole.log("chooseSearch");
        this.addKeyBoard();
    }

    addEventSearch(callback, scope) {
        this.eventSearch.add(callback, scope);
    }
    removeEventSearch(callback, scope) {
        this.eventSearch.remove(callback, scope);
    }

    dispatchEventSearch(str) {
        this.eventSearch.dispatch(str);
    }

    addEventBack(callback, scope) {
        this.eventBack.add(callback, scope);
    }
    removeEventBack(callback, scope) {
        this.eventBack.remove(callback, scope);
    }
    dispatchEventBack() {
        this.eventBack.dispatch();
    }


    addKeyBoard() {
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: Language.instance().getData("142"),
            isSearch: true,
            typeInputText: "search"
        }

        KeyBoard.instance().show(options);
        KeyBoard.instance().event.change.add(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.add(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.add(this.onSubmit, this);
        KeyBoard.instance().event.submit.add(this.onSubmit, this);
        KeyBoard.instance().event.cancle.add(this.onCancel, this);
    }

    hideKeyboard() {
        KeyBoard.instance().hide();
    }

    onSubmit() {
        let str = KeyBoard.instance().getValue();
        this.dispatchEventSearch(str);
        setTimeout(() => {
            KeyBoard.instance().hide();
        }, 100);
    }

    onCancel() {
        KeyBoard.instance().event.change.remove(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.remove(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.remove(this.onSubmit, this);
        KeyBoard.instance().event.submit.remove(this.onSubmit, this);
        KeyBoard.instance().event.cancle.remove(this.onCancel, this);
        KeyBoard.instance().hide();
    }

    changeKeyBoard() {
        let str = KeyBoard.instance().getValue();
        this.dispatchEventSearch(str);

    }

    destroy() {
        this.removeEvent();
        this.bg.destroy();
        this.btnBack.destroy();
        this.btnSearch.destroy();
        this.btnDiamond.destroy();
        this.onCancel();

        super.destroy();
    }
}