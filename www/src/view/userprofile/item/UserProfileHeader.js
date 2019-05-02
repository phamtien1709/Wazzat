import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import EventGame from "../../../controller/EventGame.js";

export default class UserProfileHeader extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal()
        }
        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));

        this.bg = new SpriteBase(this.positionUserProfile.header_bg);
        this.bg.visible = false;
        this.addChild(this.bg);

        this.bgVip = new SpriteBase(this.positionUserProfile.header_bg_vip);
        this.bgVip.visible = false;
        this.addChild(this.bgVip);

        this.txtHeader = new TextBase(this.positionUserProfile.header_txt_content, "");
        this.txtHeader.setTextBounds(0, 0, this.bg.width, this.bg.height);
        this.addChild(this.txtHeader);

        this.btnBack = new ButtonBase(this.positionUserProfile.header_button_back, this.chooseBack, this);
        this.addChild(this.btnBack);
    }

    chooseBack() {
        this.event.back.dispatch();
        if (MainData.instance().isGetUserProfileSearch == true) {
            EventGame.instance().event.searchFriendBackUserProfile.dispatch();
            MainData.instance().isGetUserProfileSearch = false;
        }
    }
    setBg(isVip) {
        if (isVip === true) {
            this.bgVip.visible = true;
            this.bg.visible = false;
        } else {
            this.bgVip.visible = false;
            this.bg.visible = true;
        }
    }

    setTitle(content) {
        this.txtHeader.text = content;
    }

    destroy() {
        super.destroy();
    }
}