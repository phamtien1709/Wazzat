import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import Achievement from "../../../model/userprofile/data/Achievement.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import AchievementStar from "../../base/AchievementStar.js";
import MainData from "../../../model/MainData.js";

export default class UserProfileAchievementItem extends BaseView {
    constructor() {
        super(game, null);
        this.idRemove = null;
        this.positionUserProfile = MainData.instance().positionUserProfile;
        this.data = new Achievement();

        this.ava = new AvatarPlayer();
        this.ava.y = 40;
        this.ava.setSize(118 * window.GameConfig.RESIZE, 118 * window.GameConfig.RESIZE);
        this.addChild(this.ava);

        this.txtName = new TextBase(this.positionUserProfile.achievement_txt_name, "");
        this.txtName.setTextBounds(0, 0, 118 * window.GameConfig.RESIZE, 47 * window.GameConfig.RESIZE);
        this.txtName.y = this.positionUserProfile.achievement_txt_name.y + 40;
        this.addChild(this.txtName);


        this.iconAchiment = new Phaser.Sprite(game, 0, 0, "EffectAchiment");
        this.iconAchiment.x = this.ava.x + (this.ava.width - this.iconAchiment.width) / 2;
        this.iconAchiment.y = this.ava.y + (this.ava.height - this.iconAchiment.height) / 2;
        this.iconAchiment.smoothed = true;
        this.iconAchiment.animations.add('EffectAchiment');
        this.addChild(this.iconAchiment);

        this.levelAchi = new AchievementStar();
        this.levelAchi.x = 12;
        this.addChild(this.levelAchi);
    }




    removeDelayCall() {
        if (this.idRemove !== null) {
            game.time.events.remove(this.idRemove);
        }
    }

    setData(data, idx) {
        this.data = Object.assign({}, this.data, data);
        this.ava.setAvatar(this.data.medal, idx);
        this.txtName.text = this.data.title + " " + data.current_level;

        let time = (0.5 + (0.5 * idx));
        this.levelAchi.setLevel(data.current_level, 0.58);

        this.removeDelayCall();
        this.idRemove = game.time.events.add(Phaser.Timer.SECOND * time, this.playSpriteSheet, this);
    }

    playSpriteSheet() {
        this.iconAchiment.animations.play("EffectAchiment", 60);
    }

    get width() {
        return 118 * window.GameConfig.RESIZE;
    }
    get height() {
        return 218 * window.GameConfig.RESIZE;
    }

    destroy() {
        this.removeDelayCall();
        super.destroy();
    }
}