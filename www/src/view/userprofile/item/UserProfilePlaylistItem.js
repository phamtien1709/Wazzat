import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";

export default class UserProfilePlaylistItem extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            view_all: new Phaser.Signal()
        }

        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));

        this.txtPlayList = new TextBase(this.positionUserProfile.playlist_txt_playlist, Language.instance().getData("54") + " (0)");
        this.txtPlayList.setTextBounds(0, 0, 237 * window.GameConfig.RESIZE, 35 * window.GameConfig.RESIZE);
        this.addChild(this.txtPlayList);

        this.txtViewAll = new TextBase(this.positionUserProfile.playlist_txt_xemtatca, Language.instance().getData("1"));
        this.txtViewAll.setTextBounds(0, 0, 191 * window.GameConfig.RESIZE, 30 * window.GameConfig.RESIZE);
        this.addChild(this.txtViewAll);

        this.btnViewAll = new ButtonBase(this.positionUserProfile.playlist_line_select, this.chooseViewAll, this);
        this.btnViewAll.x = this.txtViewAll.x;
        this.btnViewAll.y = this.txtViewAll.y;
        this.btnViewAll.width = 191 * window.GameConfig.RESIZE;
        this.btnViewAll.height = 30 * window.GameConfig.RESIZE;
        this.btnViewAll.alpha = 0;
        this.addChild(this.btnViewAll);

        this.line = new SpriteBase(this.positionUserProfile.playlist_line);
        this.addChild(this.line);

        this.lineActive = new SpriteBase(this.positionUserProfile.playlist_line_select);
        this.addChild(this.lineActive);

        this.addPlayList = game.add.group();
        this.addChild(this.addPlayList);

        this.heightGame = 89 * window.GameConfig.RESIZE;
    }

    chooseViewAll() {
        this.event.view_all.dispatch();
    }

    setData(playlists) {
        while (this.addPlayList.children.length > 0) {
            let item = this.addPlayList.children[0];
            this.addPlayList.removeChild(item);
            item.destroy();
            item = null;
        }

        this.txtPlayList.text = Language.instance().getData("54") + "(" + playlists + ")";
        // this.txtPlayList.addColor("#999999", 8);
        // this.txtPlayList.addFontStyle('italic', 8)

        /*
        if (playlists.length > 0) {
            let beginX = 35 * window.GameConfig.RESIZE;
            let beginY = 103 * window.GameConfig.RESIZE;
            let max = 3;
            if (playlists.length < 3) {
                max = playlists.length;
            }
            for (let i = 0; i < max; i++) {
                let playList = new ShopItemPlayList();
                playList.event.CHOOSE.add(this.choosePlaylist, this);
                playList.setData(playlists[i], i);
                playList.x = beginX;
                playList.y = beginY;

                this.addPlayList.addChild(playList);

                beginX += playList.width + 35 * window.GameConfig.RESIZE;
            }
            this.heightGame = 415 * window.GameConfig.RESIZE;
        } else {
            this.heightGame = 89 * window.GameConfig.RESIZE;
        }*/
    }

    choosePlaylist(data) {
        ControllScreenDialog.instance().addPlaylistDetail(data.id);
    }

    get height() {
        return this.heightGame;
    }
    get width() {
        return game.width
    }
}