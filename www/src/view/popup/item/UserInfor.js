import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl";
import BaseGroup from "../../BaseGroup";

export default class UserInfor extends BaseGroup {
    constructor(info) {
        super(game);
        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));
        this.info = info;
        this.addAva();
        this.addNameAndLvl();
        this.loadAva(this.info.avatar);
    }

    addAva() {
        var maskAva = new Phaser.Graphics(game, 0, 0);
        // maskAva.beginFill(0xffffff);
        maskAva.drawCircle(this.positionUserProfile.short_profile.ava_fb.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.ava_fb.y * window.GameConfig.RESIZE, 240 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        this.ava = new Phaser.Button(game, this.positionUserProfile.short_profile.ava_fb.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.ava_fb.y * window.GameConfig.RESIZE, 'songDetailSprites', () => { },
            this,
            null, 'ava-default');
        this.ava.anchor.set(0.5);
        this.ava.scale.set(window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        this.ava.mask = maskAva;
        this.addChild(this.ava);
        this.ava.events.onInputDown.add(() => {
            // this.button_sound.play();
            // ControllWorld.instance().addUserProfile(this.info.id);
        });
        this.addFrameAva(this.ava);
    }

    loadAva(url) {
        this.key = url;
        if (game.cache.checkImageKey(url)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(url);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        this.timeOnload = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            try {
                this.ava.loadTexture(`${this.key}`);
            } catch (error) {

            }
        }, this);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }

    addNameAndLvl() {
        var nameFB = new Phaser.Text(game, 480 * window.GameConfig.RESIZE, 200 * window.GameConfig.RESIZE, this.info.user_name, {
            font: `GilroyBold`,
            fill: "#333333",
            fontSize: 22.5
        });
        nameFB.anchor.set(0.5);
        this.addChild(nameFB);
        //level
        var u_level = new Phaser.Text(game, 480 * window.GameConfig.RESIZE, 255 * window.GameConfig.RESIZE, `LV ${this.info.level} - Tập sự`, {
            font: `33px GilroyMedium`,
            fill: "orange",
            fontSize: 16.5
        });
        u_level.anchor.set(0.5);
        u_level.addColor("#333333", 6);
        this.addChild(u_level);
    }

    addFrameAva(ava) {
        let vip = false;
        if (vip !== true) {
            var frame = new Phaser.Sprite(game, this.positionUserProfile.short_profile.frame_ava_vip.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip.y * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip.nameAtlas, this.positionUserProfile.short_profile.frame_ava_vip.nameSprite);
            frame.anchor.set(0.5);
            let vipIcon = new Phaser.Sprite(game, this.positionUserProfile.short_profile.frame_ava_vip_icon.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip_icon.y * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip_icon.nameAtlas, this.positionUserProfile.short_profile.frame_ava_vip_icon.nameSprite);
            vipIcon.anchor.set(0.5);
            frame.addChild(vipIcon);
            let laurel = new Phaser.Sprite(game, this.positionUserProfile.short_profile.frame_ava_vip_laurel.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip_laurel.y * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava_vip_laurel.nameAtlas, this.positionUserProfile.short_profile.frame_ava_vip_laurel.nameSprite);
            laurel.anchor.set(0.5);
            frame.addChild(laurel);
            this.addChild(frame);
        } else {
            // LogConsole.log('hehe');
            let frame = new Phaser.Sprite(game, this.positionUserProfile.short_profile.frame_ava.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava.y * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.frame_ava.nameAtlas, this.positionUserProfile.short_profile.frame_ava.nameSprite);
            frame.anchor.set(0.5);
            this.addChild(frame);
        }
    }

    destroy() {
        game.time.events.remove(this.timeOnload);
        super.destroy();
    }
}