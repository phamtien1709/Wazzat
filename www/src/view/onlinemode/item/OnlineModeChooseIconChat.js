import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import OnlineModeIconChat from "./OnlineModeIconChat.js";
import ButtonBase from "../../component/ButtonBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import SocketController from "../../../controller/SocketController.js";
import DataCommand from "../../../model/DataCommand.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeChooseIconChat extends BaseView {
    constructor() {
        super(game, null);

        this.event =
            {
                close_dialog: new Phaser.Signal()
            }

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new SpriteBase(this.positionCreateRoom.chat_icon_bg);
        this.addChild(this.bg);

        this.arrType = [
            OnlineModeIconChat.batngo,
            OnlineModeIconChat.buon,
            OnlineModeIconChat.chenhao,
            OnlineModeIconChat.khoc,
            OnlineModeIconChat.ngaingung,
            OnlineModeIconChat.tucgian,
            OnlineModeIconChat.vuive
        ]

        this.arrString = [
            "06_Batngo",
            "05_Buon",
            "01_CuoiCheNhao",
            "04_Khoc",
            "03_CuoiNgaiNgung",
            "07_Tucgian",
            "02_CuoiVuiVe"
        ]

        let beginX = 30;
        let beginY = 30;
        let idx = 0;

        for (let i = 0; i < this.arrType.length; i++) {
            idx++;
            let objData = {
                x: 0,
                y: 0,
                nameAtlas: "IconChatOnlineMode",
                nameSprite: "Circle_Icon",
                configText: {
                    x: 0,
                    y: 0,
                    style: {
                        fontSize: 26,
                        font: "GilroyBold"
                    }
                },
                icon: {
                    x: 0,
                    y: 8,
                    nameAtlas: "IconChatOnlineMode",
                    nameSprite: this.arrString[i]
                },
                alignAll: "center"
            }
            console.log("aaaaaaaaaa ------------------");
            console.log(objData);
            let item = new ButtonWithText(objData, "", this.chooseItem, this);

            item.x = beginX;
            item.y = beginY;
            item.type = this.arrType[i];
            beginX += 133;
            if (idx % 4 === 0) {
                beginY += 135;
                beginX = 30;
            }
            this.addChild(item);
        }

        this.btnClose = new ButtonBase(this.positionCreateRoom.chat_icon_btn_close, this.chooseClose, this);
        this.addChild(this.btnClose);
    }

    chooseClose() {
        this.event.close_dialog.dispatch();
    }

    chooseItem(item) {
        console.log("chooseItem---------");
        console.log(item.type);

        let dataChat = new SFS2X.SFSObject();
        dataChat.putUtfString("typeicon", item.type);
        SocketController.instance().sendPublicChat(DataCommand.CHAT_ONLINE_MODE, dataChat);

        this.chooseClose();
    }
}