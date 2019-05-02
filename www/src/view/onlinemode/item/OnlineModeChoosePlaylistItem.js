import BaseView from "../../BaseView.js";
import AvatarAlbum from "../../base/AvatarAlbum.js";
import MainData from "../../../model/MainData.js";
import TextBase from "../../component/TextBase.js";
import LevelPlaylist from "../../base/LevelPlaylist.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";

export default class OnlineModeChoosePlaylistItem extends BaseView {
    constructor() {
        super(game, null);
    }

    afterCreate() {
        this.event = {
            buy: new Phaser.Signal(),
            select: new Phaser.Signal()
        }

        this.data = null;
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.ava = new AvatarAlbum();
        this.ava.x = 33 * MainData.instance().scale;
        this.ava.y = 16 * MainData.instance().scale;
        this.ava.setSize(107 * MainData.instance().scale, 107 * MainData.instance().scale);
        this.addChild(this.ava);

        this.txtName = new TextBase(this.positionCreateRoom.choose_playlist_itemplaylist_txtname, "");
        this.txtName.setTextBounds(0, 0, 305 * MainData.instance().scale, 66 * MainData.instance().scale);
        this.addChild(this.txtName);

        this.txtVip = new TextBase(this.positionCreateRoom.choose_playlist_itemplaylist_vip, "");
        this.txtVip.setTextBounds(0, 0, 305 * MainData.instance().scale, 28 * MainData.instance().scale);
        //this.addChild(this.txtVip);


        this.level = new LevelPlaylist();
        this.level.x = this.positionCreateRoom.choose_playlist_itemplaylist_vip.x * MainData.instance().scale;
        this.level.y = this.positionCreateRoom.choose_playlist_itemplaylist_vip.y * MainData.instance().scale;
        this.addChild(this.level);


        this.btnBuy = null;

        this.line = new SpriteBase(this.positionCreateRoom.choose_playlist_itemplaylist_line);
        this.addChild(this.line);
    }

    setButtonBuy(price = 0) {
        this.removeBtnBuy();
        this.btnBuy = new ButtonWithText(this.positionCreateRoom.choose_playlist_itemplaylist_btnBuy, price, this.chooseBuy, this);
        this.addChild(this.btnBuy);

        this.line.visible = false;
    }

    removeBtnBuy() {
        if (this.btnBuy !== null) {
            this.removeChild(this.btnBuy);
            this.btnBuy.destroy();
            this.btnBuy = null;
        }
    }

    setButtonChoose() {
        this.removeBtnBuy();
        this.btnBuy = new ButtonWithText(this.positionCreateRoom.choose_playlist_itemplaylist_select, Language.instance().getData("46"), this.chooseSelect, this);
        this.addChild(this.btnBuy);
    }

    setDataQuickPlay(data, idx) {
        this.data = data;
        this.ava.beginLoad(this.data.thumb, idx);
        this.txtName.text = this.data.name;
        /*
        if (this.data.vip > 0) {
            this.txtVip.text = "Vip only";
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y;
        } else {
            this.txtVip.text = "";
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y + 30 * MainData.instance().scale;
        }*/

        console.log("this.data.user.user_id : " + this.data.user.user_id);
        if (this.data.user.user_id === SocketController.instance().dataMySeft.user_id) {
            this.setButtonChoose();
        } else {
            this.setButtonBuy(this.data.price);
        }

        this.level.visible = true;
        this.level.setData(this.data.user);
        if (idx < 8) {
            this.x = game.width;
            game.add.tween(this).to({
                x: 0
            }, 200, Phaser.Easing.Power1, true, 150 + 50 * (idx + 1));
        } else {
            this.x = 0;
        }
    }

    setData(data, idx, isSuggest = false) {
        this.data = data;
        this.ava.beginLoad(this.data.thumb, idx);
        this.txtName.text = this.data.name;
        /*
        if (this.data.vip > 0) {
            this.txtVip.text = "Vip only";
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y;
        } else {
            this.txtVip.text = "";
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y + 30 * MainData.instance().scale;
        }*/

        if (isSuggest === false) {
            this.level.visible = true;
            this.level.setData(this.data.user);
            if (idx < 8) {
                this.x = game.width;
                game.add.tween(this).to({
                    x: 0
                }, 200, Phaser.Easing.Power1, true, 250 + 50 * (idx + 1));
            } else {
                this.x = 0;
            }
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y;
        } else {
            this.level.visible = false;
            this.txtName.y = this.positionCreateRoom.choose_playlist_itemplaylist_txtname.y + 20;
        }
    }

    chooseBuy() {
        LogConsole.log("chooseBuy");
        //this.event.buy.dispatch();
        if (this.data != null) {
            ControllScreenDialog.instance().addPopupBuy(this.data);
        }
    }
    chooseSelect() {
        LogConsole.log("chooseSelect");
        this.btnBuy.inputEnabled = false;
        this.event.select.dispatch(this.data);
    }
    get width() {
        return 640 * MainData.instance().scale;
    }
    get height() {
        return 145 * MainData.instance().scale;
    }
}