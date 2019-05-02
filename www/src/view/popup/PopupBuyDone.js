import BaseView from "../BaseView.js";
import ShopPlayList from "../../model/shop/data/ShopPlayList.js";
import PopupBuyDoneItem from "./item/PopupBuyDoneItem.js";
import MainData from "../../model/MainData.js";
import SqlLiteController from "../../SqlLiteController.js";

export default class PopupBuyDone extends BaseView {
    constructor(playlist_id, solo_mode = false) {

        super(game, null);
        this.isSoloMode = solo_mode;

        this.playlist_id = playlist_id;

        this.data = new ShopPlayList();
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.itemConfirm = new PopupBuyDoneItem();
        this.itemConfirm.event.OK.add(this.chooseOk, this);
        this.itemConfirm.x = 35 * MainData.instance().scale;

        this.itemConfirm.y = game.height + 237 * MainData.instance().scale;
        this.addChild(this.itemConfirm);

        this.addEvent();
    }

    addEvent() {
        if (this.isSoloMode === false) {
            SqlLiteController.instance().getPlaylistById(this.playlist_id);
            SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDataPlayListComplete, this);
        } else {
            // console.log('MainData.instance().soloModePlaylists')
            console.log(MainData.instance().soloModePlaylists)
            let data = MainData.instance().soloModePlaylists.find(x => x.id === this.playlist_id);
            // console.log('sgdfgfg')
            // console.log(data);
            this.setData(data);
        }
    }
    removeEvent() {
        // SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getDataPlayListComplete(data) {
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDataPlayListComplete, this);
        this.setData(data);
    }


    getData(data) {
        /*
        switch (data.cmd) {
            case ShopCommand.PLAYLIST_DETAIL_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.setData(GetPlayListDetail.begin(data.params, this.playlist_id));
                }
                break;
        }
        */
    }

    setContent(content) {
        this.itemConfirm.setContent(content);
    }

    setData(data) {
        //data la ShopPlayList;
        this.data = Object.assign({}, this.data, data);
        this.itemConfirm.setData(data);

        this.tweenItemPopup(this.itemConfirm, game.height - 810 * MainData.instance().scale);
    }

    chooseOk() {
        this.event.OK.dispatch(this.data);
    }

    destroy() {
        this.removeEvent();
        this.bg.destroy();
        this.itemConfirm.destroy();
        super.destroy();
    }
}