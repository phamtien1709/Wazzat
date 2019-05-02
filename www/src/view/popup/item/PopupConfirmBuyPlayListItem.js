import BaseView from "../../BaseView.js";
import PopupConfirmItem from "./PopupConfirmItem.js";
import MainData from "../../../model/MainData.js";
import AvatarAlbum from "../../base/AvatarAlbum.js";
import TextBase from "../../component/TextBase.js";
import LevelPlaylist from "../../base/LevelPlaylist.js";
import ShopUserPlayListMapping from "../../../model/shop/data/ShopUserPlayListMapping.js";
import Language from "../../../model/Language.js";

export default class PopupConfirmBuyPlayListItem extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };
        this.data = null;

        this.positionPopup = MainData.instance().positionPopup;

        this.bgConfirm = new PopupConfirmItem();
        this.bgConfirm.event.OK.add(this.chooseOk, this);
        this.bgConfirm.event.CANCLE.add(this.chooseCancle, this);
        this.bgConfirm.x = 0;
        this.bgConfirm.y = 74 * MainData.instance().scale;
        this.addChild(this.bgConfirm);

        this.avaPlayList = new AvatarAlbum();
        this.avaPlayList.setSize(200 * MainData.instance().scale, 200 * MainData.instance().scale);
        this.avaPlayList.x = 177 * MainData.instance().scale;
        this.avaPlayList.y = 0;
        this.addChild(this.avaPlayList);

        this.textName = new TextBase(this.positionPopup.popup_buy_playlist_text_name, "");
        this.textName.setTextBounds(0, 0, 560 * MainData.instance().scale, 47 * MainData.instance().scale);
        this.addChild(this.textName);

        this.textContent = new TextBase(this.positionPopup.popup_buy_playlist_text_content, Language.instance().getData("116"));
        this.textContent.setTextBounds(0, 0, 560 * MainData.instance().scale, 88 * MainData.instance().scale);
        this.addChild(this.textContent);

        this.levePlayList = new LevelPlaylist({}, false);
        this.levePlayList.y = 266 * MainData.instance().scale;
        this.levePlayList.x = this.avaPlayList.x + (this.avaPlayList.width - this.levePlayList.width) / 2;
        this.addChild(this.levePlayList);
    }
    setContent(content) {
        this.textContent.text = content;
    }

    setData(data) {
        this.data = data;
        this.textName.text = this.formatName(this.data.name, 25);
        this.levePlayList.setData(new ShopUserPlayListMapping(), false);
        this.levePlayList.x = this.avaPlayList.x + (this.avaPlayList.width - this.levePlayList.width) / 2;
        this.avaPlayList.beginLoad(this.data.thumb, 1);
    }

    chooseOk() {
        this.event.OK.dispatch();
    }

    chooseCancle() {
        this.event.CANCLE.dispatch();
    }

    destroy() {
        this.bgConfirm.destroy();
        this.avaPlayList.destroy();
        super.destroy();
    }
}