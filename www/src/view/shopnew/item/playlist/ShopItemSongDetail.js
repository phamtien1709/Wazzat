import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ShopSong from "../../../../model/shop/data/ShopSong.js";
import MainData from "../../../../model/MainData.js";


export default class ShopItemSongDetail extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.data = new ShopSong();

        this.positionShop = MainData.instance().positionDetailPlaylist;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist', this.chooseDetail, this);
        this.bg.alpha = 0;
        this.bg.width = this.width;
        this.bg.height = this.height;
        this.addChild(this.bg);

        this.line = new SpriteBase(this.positionShop.detail_playlist_item_line);
        this.line.width = 570 * MainData.instance().scale;
        this.addChild(this.line);

        this.txtNameSong = new TextBase(this.positionShop.detail_playlist_item_name_song);
        this.txtNameSong.setTextBounds(0, 0, 551 * MainData.instance().scale, 59 * MainData.instance().scale);
        this.addChild(this.txtNameSong);

        this.txtNameCaSi = new TextBase(this.positionShop.detail_playlist_item_name_casi);
        this.txtNameCaSi.setTextBounds(0, 0, 551 * MainData.instance().scale, 31 * MainData.instance().scale);
        this.addChild(this.txtNameCaSi);

        this.btnDetailSong = new ButtonBase(this.positionShop.detail_playlist_btn_detail_song, this.chooseDetail, this);
        this.addChild(this.btnDetailSong);

    }

    chooseDetail() {
        LogConsole.log("chooseDetail");
        ControllScreenDialog.instance().addDetailSong(this.data);
    }

    hideLine() {
        this.line.visible = false;
    }

    get width() {
        return 586 * MainData.instance().scale;
    }
    get height() {
        return 115 * MainData.instance().scale;
    }

    setData(data) {
        this.data = data;
        console.log(data);
        this.txtNameSong.text = this.data.title;
        this.txtNameCaSi.text = this.data.singer;
    }
}