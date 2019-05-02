import MainData from "../../../model/MainData.js";
import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import SocketController from "../../../controller/SocketController.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";

export default class OnlineModeHeaderItem extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            back: new Phaser.Signal(),
            search: new Phaser.Signal()
        }

        this.clickBack = true;

        this.bg = new SpriteBase(MainData.instance().positionCreateRoom.bg_header);
        this.addChild(this.bg);

        this.btnBack = new ButtonBase(MainData.instance().positionCreateRoom.button_back, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.txtTitle = null;
        this.btnDiamond = null;

        /*begin var waittingroom*/
        this.txtIdPhong = null;
        this.txtNguoiTao = null;
        /*end var waittingroom*/

        this.btnSearch = null;

        this.addEvent();

        //game.time.events.add(1000, this.setBack, this);
    }

    setBack() {
        this.clickBack = true;
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBackButton, this);
        SocketController.instance().events.onUserVarsUpdate.add(this.onUserVarsUpdate, this);
    }
    removeEvent() {
        LogConsole.log('removeEvent HEADER');
        EventGame.instance().event.backButton.remove(this.chooseBackButton, this);
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUserVarsUpdate, this);
    }

    onUserVarsUpdate(data) {
        if (this.btnDiamond !== null) {
            this.btnDiamond.setText(SocketController.instance().dataMySeft.diamond);
        }
    }

    chooseBackButton() {
        this.chooseBack(true);
    }

    setHideBtnBack() {
        this.btnBack.visible = false;
    }
    setShowBtnBack() {
        this.btnBack.visible = true;
    }

    chooseBack(ktBackButton = false) {
        //console.log('HERE HERE HERE');
        if (this.clickBack === true) {
            this.btnBack.inputEnabled = false;
            LogConsole.log("chooseBack header");
            this.event.back.dispatch(ktBackButton);
        }
    }

    chooseSearch() {
        this.event.search.dispatch();
    }

    setSearchButton() {
        this.btnSearch = new ButtonBase(MainData.instance().positionCreateRoom.button_search, this.chooseSearch, this);
        this.addChild(this.btnSearch);
    }
    setTitle(title = "CN") {
        if (title === "CN") {
            title = Language.instance().getData("212"); //CHƠI NHÓM
        }
        this.txtTitle = new TextBase(MainData.instance().positionCreateRoom.txt_title_header, title);
        this.txtTitle.setTextBounds(0, 0, game.width, this.bg.height * MainData.instance().scale);
        this.addChild(this.txtTitle);
    }
    setDiamond() {
        this.btnDiamond = new ButtonWithText(MainData.instance().positionCreateRoom.btn_diamond_header, SocketController.instance().dataMySeft.diamond);
        this.addChild(this.btnDiamond);
    }
    setWaittingRoom() {
        this.txtIdPhong = new TextBase(MainData.instance().positionCreateRoom.waitting_txt_idphong, "");
        this.txtIdPhong.setTextBounds(0, 0, game.width, 44 * MainData.instance().scale);
        this.addChild(this.txtIdPhong);

        this.txtNguoiTao = new TextBase(MainData.instance().positionCreateRoom.waitting_txt_nguoitao, "");
        this.txtNguoiTao.setTextBounds(0, 0, game.width, 28 * MainData.instance().scale);
        this.addChild(this.txtNguoiTao);
    }

    setIdPhong(id) {
        if (this.txtIdPhong !== null) {
            this.txtIdPhong.text = Language.instance().getData("48") + ": " + id;
        }
    }
    setNguoiTao(nameNguoiTao) {
        if (this.txtNguoiTao !== null) {
            this.txtNguoiTao.text = Language.instance().getData("49") + ": " + nameNguoiTao;
            this.txtNguoiTao.addColor("#FFA339", Language.instance().getData("49").length + 1);
        }
    }

    setStyleTitle(style) {
        if (this.txtTitle !== null) {
            this.txtTitle.changeStyle(style);
        }
    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }
}