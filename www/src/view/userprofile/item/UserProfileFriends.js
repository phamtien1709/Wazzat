import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class UserProfileFriends extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            view_all: new Phaser.Signal()
        }

        this.positionUserProfile = MainData.instance().positionUserProfile;

        this.txtPlayList = new TextBase(this.positionUserProfile.playlist_txt_playlist, Language.instance().getData("163") + " (0)");
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

        this.addAchi = game.add.group();
        this.addChild(this.addAchi);

        this.heightGame = 89 * window.GameConfig.RESIZE;
    }

    chooseViewAll() {
        this.event.view_all.dispatch();
    }

    setData(friends) {
        while (this.addAchi.children.length > 0) {
            let item = this.addAchi.children[0];
            this.addAchi.removeChild(item);
            item.destroy();
            item = null;
        }
        /*
        if (friends.length > 0) {
            let beginX = 35 * window.GameConfig.RESIZE;
            let beginY = 104 * window.GameConfig.RESIZE;
            let idx = 0;
            for (let i = 0; i < friends.length; i++) {
                let item = new UserProfileFriendItem();
                item.setData(friends[i]);
                item.x = beginX;
                item.y = beginY;
                this.addAchi.addChild(item);

                beginX += 151 * window.GameConfig.RESIZE;

                idx++;
                if (idx === 4) {
                    break;
                }
            }


            this.heightGame = 296 * window.GameConfig.RESIZE;
        } else {
            this.heightGame = 89 * window.GameConfig.RESIZE;
        }*/
        this.txtPlayList.text = Language.instance().getData("163") + " (" + friends + ")";
    }

    get height() {
        return this.heightGame;
    }
    get width() {
        return game.width;
    }
}