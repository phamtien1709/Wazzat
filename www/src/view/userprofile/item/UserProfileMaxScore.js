import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class UserProfileMaxScore extends BaseView {
    constructor() {
        super(game, null);

        this.positionUserProfile = MainData.instance().positionUserProfile;

        this.txtPlayList = new TextBase(this.positionUserProfile.playlist_txt_playlist, Language.instance().getData("164"));
        this.txtPlayList.setTextBounds(0, 0, 237 * window.GameConfig.RESIZE, 35 * window.GameConfig.RESIZE);
        this.addChild(this.txtPlayList);

        /*
        this.txtViewAll = new TextBase(this.positionUserProfile.playlist_txt_xemtatca, "Xem tất cả");
        this.txtViewAll.setTextBounds(0, 0, 322, 51);
        this.addChild(this.txtViewAll);*/

        this.line = new SpriteBase(this.positionUserProfile.playlist_line);
        this.addChild(this.line);

        this.lineActive = new SpriteBase(this.positionUserProfile.playlist_line_select);
        this.addChild(this.lineActive);


        this.lbMonth = new TextBase(this.positionUserProfile.maxscore_label_month, Language.instance().getData("165"));
        this.lbMonth.setTextBounds(0, 0, 255 * window.GameConfig.RESIZE, 30 * window.GameConfig.RESIZE);
        this.addChild(this.lbMonth);

        this.lbAll = new TextBase(this.positionUserProfile.maxscore_label_all, Language.instance().getData("166"));
        this.lbAll.setTextBounds(0, 0, 255 * window.GameConfig.RESIZE, 30 * window.GameConfig.RESIZE);
        this.addChild(this.lbAll);

        this.txtScoreMonth = new TextBase(this.positionUserProfile.maxscore_txt_month, "0");
        this.txtScoreMonth.setTextBounds(0, 0, 255 * window.GameConfig.RESIZE, 30 * window.GameConfig.RESIZE);
        this.addChild(this.txtScoreMonth);

        this.txtScoreAll = new TextBase(this.positionUserProfile.maxscore_txt_all, "0");
        this.txtScoreAll.setTextBounds(0, 0, 255 * window.GameConfig.RESIZE, 30 * window.GameConfig.RESIZE);
        this.addChild(this.txtScoreAll);
    }

    setData(scoreMonth, scoreAll) {
        this.txtScoreMonth.text = scoreMonth;
        this.txtScoreAll.text = scoreAll;
    }

    get height() {
        return 225 * window.GameConfig.RESIZE;
    }

    get width() {
        return game.width;
    }
}