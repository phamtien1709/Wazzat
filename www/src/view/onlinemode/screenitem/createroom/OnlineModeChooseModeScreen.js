import BaseView from "../../../BaseView.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import TextBase from "../../../component/TextBase.js";
import ButtonScale9WithText from "../../../component/ButtonScale9WithText.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import FaceBookCheckingTools from "../../../../FaceBookCheckingTools.js";
import MainData from "../../../../model/MainData.js";
import KeyBoard from "../../../component/KeyBoard.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import SendOnlineModeCRQuickJoin from "../../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRQuickJoin.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import EventGame from "../../../../controller/EventGame.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import Language from "../../../../model/Language.js";


export default class OnlineModeChooseModeScreen extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            close: new Phaser.Signal(),
            create_room: new Phaser.Signal(),
            quick_play: new Phaser.Signal()
        }

        this.positionCreateRoom = JSON.parse(game.cache.getText('positionCreateRoom'));

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.header = new OnlineModeHeaderItem();
        this.header.setTitle();
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        this.txtTimPhong = new TextBase(MainData.instance().positionCreateRoom.choose_game_text_timphong, Language.instance().getData("72"));
        this.addChild(this.txtTimPhong);

        this.btnInputText = new ButtonScale9WithText(MainData.instance().positionCreateRoom.choose_game_bg_input_text, Language.instance().getData("73") + "...", this.chooseInputText, this);
        this.addChild(this.btnInputText);

        this.btnThamgia = new ButtonWithText(MainData.instance().positionCreateRoom.choose_game_btn_thamgia, Language.instance().getData("74"), this.chooseThamGia, this);
        this.addChild(this.btnThamgia);

        this.line = new SpriteBase(MainData.instance().positionCreateRoom.choose_game_bg_line);
        this.addChild(this.line);

        this.btnChoiNgay = new ButtonWithText(MainData.instance().positionCreateRoom.choose_game_btn_choingay, Language.instance().getData("75"), this.chooseQuickPlay, this);
        this.addChild(this.btnChoiNgay);

        this.btnTaoPhong = new ButtonWithText(MainData.instance().positionCreateRoom.choose_game_btn_taophong, Language.instance().getData("76"), this.chooseCreateRoom, this);
        this.addChild(this.btnTaoPhong);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Party_online_mode);

        ControllLoading.instance().hideLoading();


        if (IronSource.instance().showInterstitialCreateRoom() === false && IronSource.instance().showInterstitialQuickPlay() === false) {
            IronSource.instance().showBanerPartyModeScreen();
        }

        this.addEvent();
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        LogConsole.log("chooseCreateRoom--------");
        this.onCancel();
        MainData.instance().state = "";
        this.event.close.dispatch();
    }

    chooseQuickPlay() {
        LogConsole.log("chooseCreateRoom--------");
        this.onCancel();
        this.event.quick_play.dispatch();
    }
    chooseCreateRoom() {
        LogConsole.log("chooseCreateRoom--------");
        this.onCancel();
        this.event.create_room.dispatch();
    }

    chooseThamGia() {
        if (KeyBoard.instance().getValue() === "") {
            //LogConsole.log("chua nhap id phong");
            ControllScreenDialog.instance().addDialog(Language.instance().getData("77"));
            this.onCancel();
        } else {
            this.enterKeyBoard();
        }
    }

    chooseInputText() {

        //this.btnInputText.visible = false;

        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: Language.instance().getData("78"),
            isSearch: false,
            typeInputText: "input",
            configText: {
                width: this.btnInputText.width,
                height: this.btnInputText.height,
                x: this.btnInputText.x,
                y: this.btnInputText.y
            },
            inputType: "number"
        }

        KeyBoard.instance().show(options);
        KeyBoard.instance().event.change.add(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.add(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.add(this.enterKeyBoard, this);
        KeyBoard.instance().event.submit.add(this.enterKeyBoard, this);
        KeyBoard.instance().event.cancle.add(this.onCancel, this);
    }

    hideKeyboard() {
        KeyBoard.instance().hide();
    }

    onCancel() {
        this.btnInputText.visible = true;

        KeyBoard.instance().event.change.remove(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.remove(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.remove(this.enterKeyBoard, this);
        KeyBoard.instance().event.submit.remove(this.enterKeyBoard, this);
        KeyBoard.instance().event.cancle.remove(this.onCancel, this);
        KeyBoard.instance().hide();
    }
    changeKeyBoard() {
        LogConsole.log("changeKeyBoard");
    }

    enterKeyBoard() {
        let idRoom = parseInt(KeyBoard.instance().getValue());
        if (idRoom !== "") {
            if (isNaN(idRoom)) {
                ControllScreenDialog.instance().addDialog(Language.instance().getData("79"));
            } else {
                SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_QUICK_JOIN_REQUEST,
                    SendOnlineModeCRQuickJoin.begin(parseInt(idRoom)));
            }
        } else {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("79"));
        }
        this.onCancel();
    }

    destroy() {
        this.removeEvent();
        this.header.destroy();
        this.onCancel();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}