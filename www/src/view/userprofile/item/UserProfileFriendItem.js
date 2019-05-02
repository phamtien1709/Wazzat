import BaseView from "../../BaseView.js";
import Friend from "../../../model/userprofile/data/Friend.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import MainData from "../../../model/MainData.js";

export default class UserProfileFriendItem extends BaseView {
    constructor() {
        super(game, null);
        this.positionUserProfile = MainData.instance().positionUserProfile;
        this.data = new Friend();

        this.ava = new AvatarPlayer();
        this.ava.setSize(118 * window.GameConfig.RESIZE, 118 * window.GameConfig.RESIZE);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            // ControllScreenDialog.instance
            ControllScreenDialog.instance().addUserProfile(this.data.userId);
        }, this);
        this.addChild(this.ava);

        this.txtName = new TextBase(this.positionUserProfile.achievement_txt_name, "");
        this.txtName.setTextBounds(0, 0, 118 * window.GameConfig.RESIZE, 47 * window.GameConfig.RESIZE);
        this.addChild(this.txtName);
        this.btnOnline = null;
    }

    get width() {
        return 118 * window.GameConfig.RESIZE;
    }
    get height() {
        return 178 * window.GameConfig.RESIZE;
    }

    setData(data, idx) {
        this.data = Object.assign({}, this.data, data);

        this.ava.setAvatar(this.data.avatar, idx);

        this.txtName.text = this.data.userName;
        if (this.btnOnline !== null) {
            this.removeChild(this.btnOnline);
            this.btnOnline.destroy();
            this.btnOnline = null;
        }
        if (this.data.isOnline === true) {
            this.btnOnline = new SpriteBase(this.positionUserProfile.playlist_check_online);
            this.addChild(this.btnOnline);
        } else {
            this.btnOnline = new SpriteBase(this.positionUserProfile.playlist_check_offline);
            this.addChild(this.btnOnline);
        }
    }

    destroy() {
        this.ava.inputEnabled = false;
        super.destroy();
    }
}