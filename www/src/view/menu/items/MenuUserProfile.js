import SpriteBase from "../../component/SpriteBase.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import Common from "../../../common/Common.js";
import MainData from "../../../model/MainData.js";
import ControllLoading from "../../ControllLoading.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuUserProfile extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        //
        this.event = {
            claimHourRewardDone: new Phaser.Signal()
        };
        this.user_id = 0;
        this.user_name = "";
        this.avatar = "";
        this.gender = "";
        this.experience_score = 0;
        this.heart = 0;
        this.diamond = 0;
        this.ticket = 0;
        this.weekly_high_score = 0;
        this.all_time_high_score = 0;
        this.u_level = 0;
        this.level_title = "";
        this.user_vip = 0;
        //
        this.user_id = SocketController.instance().dataMySeft.user_id;
        this.user_name = SocketController.instance().dataMySeft.user_name;
        this.avatar = SocketController.instance().dataMySeft.avatar;
        this.gender = SocketController.instance().dataMySeft.gender;
        this.experience_score = SocketController.instance().dataMySeft.experience_score;
        this.heart = SocketController.instance().dataMySeft.heart;
        this.diamond = SocketController.instance().dataMySeft.diamond;
        this.ticket = SocketController.instance().dataMySeft.ticket;
        this.weekly_high_score = SocketController.instance().dataMySeft.weekly_high_score;
        this.all_time_high_score = SocketController.instance().dataMySeft.all_time_high_score;
        this.u_level = SocketController.instance().dataMySeft.level;
        this.level_title = SocketController.instance().dataMySeft.level_title;
        this.user_vip = SocketController.instance().dataMySeft.vip;
        //
        this.addEventExtension();
        //
        this.addHeartAndtxtHeart(this.heart);
        this.addDiamondAndTxtDiamond(this.diamond);
        this.addTicketAndTxtTicket(this.ticket);
        this.addDoc();
        this.addAvaAndName(this.user_name);
    }

    //
    addEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
    }
    removeEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
    }

    onUpdateUserVars() {
        if (SocketController.instance().dataMySeft.user_id == this.user_id) {
            if (parseInt(this.txt_diamond.text) !== SocketController.instance().dataMySeft.diamond) {
                this.txt_diamond.text = SocketController.instance().dataMySeft.diamond;
            }
            if (parseInt(this.txt_heart.text) !== SocketController.instance().dataMySeft.heart) {
                this.txt_heart.text = SocketController.instance().dataMySeft.heart;
            }
            if (parseInt(this.txt_ticket.text) !== SocketController.instance().dataMySeft.ticket) {
                this.txt_ticket.text = SocketController.instance().dataMySeft.ticket;
            }
        }
    }

    updateValue(type) {
        if (type == MenuUserProfile.UPDATE_AVA) {

        } else if (type == MenuUserProfile.UPDATE_NAME) {
            this.user_name = SocketController.instance().dataMySeft.user_name;
            this.nameFB.setText(this.user_name);
        }
        // LogConsole.log('fsdfdfs');
    }

    static get UPDATE_AVA() {
        return "update_ava";
    }

    static get UPDATE_NAME() {
        return "update_name";
    }

    addAvaAndName(user_name) {
        this.maskAva = null;
        this.ava = null;
        // mask ava in front  of ava sprite
        this.addAva();
        this.addNameAndLvl(user_name);
        //
        this.loadAva();
    }

    addFrameAva() {
        // var random_boolean = Math.random() >= 0.5;
        // this.user_vip = false;
        if (this.user_vip === true) {
            this.frameAvatar = new Phaser.Sprite(game, this.positionMenuConfig.frame_ava_vip.x * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip.y * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip.nameAtlas, this.positionMenuConfig.frame_ava_vip.nameSprite);
            this.frameAvatar.anchor.set(0.5);
            this.frameAvatar.scale.set(145 / 140 * window.GameConfig.RESIZE);
            // let vipIcon = new Phaser.Sprite(game, this.positionMenuConfig.frame_ava_vip_icon.x * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip_icon.y * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip_icon.nameAtlas, this.positionMenuConfig.frame_ava_vip_icon.nameSprite);
            // vipIcon.anchor.set(0.5);
            // this.frameAvatar.addChild(vipIcon);
            this.laurel = new Phaser.Sprite(game, this.positionMenuConfig.frame_ava_vip_laurel.x * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip_laurel.y * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava_vip_laurel.nameAtlas, this.positionMenuConfig.frame_ava_vip_laurel.nameSprite);
            this.laurel.anchor.set(0.5);
            this.frameAvatar.addChild(this.laurel);
        } else {
            // LogConsole.log('hehe');
            this.frameAvatar = new Phaser.Sprite(game, this.positionMenuConfig.frame_ava.x * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava.y * window.GameConfig.RESIZE, this.positionMenuConfig.frame_ava.nameAtlas, this.positionMenuConfig.frame_ava.nameSprite);
            this.frameAvatar.anchor.set(0.5);
            this.frameAvatar.scale.set(145 / 140 * window.GameConfig.RESIZE);
        }
    }

    addAva() {
        this.addFrameAva();
    }

    loadAva() {
        if (SocketController.instance().dataMySeft !== null) {
            let loader = new Phaser.Loader(game);
            loader.crossOrigin = 'anonymous';
            loader.image('ava_fb', this.avatar);
            loader.onLoadComplete.add(this.onLoad, this);
            if (game.cache.checkImageKey('ava_fb') == true) {
                this.onLoad();
            } else {
                loader.start();
            }
        }
    }

    onLoad() {
        // this.loader.onLoadComplete.remove(this.onLoad, this);
        if (this.maskAva == null) {
            this.maskAva = new Phaser.Graphics(game, 0, 0);
        }
        this.maskAva.clear();
        this.maskAva.drawCircle(0, 0, 148 * window.GameConfig.RESIZE);
        this.maskAva.anchor.set(0.5);
        //
        this.avaBox = new Phaser.Sprite(game, this.positionMenuConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionMenuConfig.ava_fb.y * window.GameConfig.RESIZE, null);
        this.addChild(this.avaBox);
        if (this.ava !== null) {
            this.removeChild(this.ava);
            this.ava.destroy();
            this.ava = null;
        }
        //
        if (game.cache.checkImageKey('ava_fb') == true) {
            this.ava = new Phaser.Button(game, 0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE, 'ava_fb');
        } else {
            this.ava = new Phaser.Button(game, 0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE, 'songDetailSprites', () => { }, this, null, 'ava-default');
        }
        this.ava.anchor.set(0.5);
        this.ava.width = 148;
        this.ava.height = 148;
        //
        this.ava.mask = this.maskAva;
        this.avaBox.addChild(this.maskAva);
        this.avaBox.addChild(this.ava);
        this.addChild(this.frameAvatar);
        this.ava.events.onInputUp.add(() => {
            ControllLoading.instance().showLoading();
            ControllScreenDialog.instance().addUserProfile(this.user_id);
        });
        //
        if (MainData.instance().isScrollChange == true) {
            this.scrollChange();
        } else {
            this.scrollDefault();
        }
    }

    addNameAndLvl(user_name) {
        user_name = Common.formatName(user_name, 25);
        //console.log('addNameAndLvladdNameAndLvl' + user_name);
        this.nameFB = new Phaser.Text(game, 320 * window.GameConfig.RESIZE, 238 * window.GameConfig.RESIZE, user_name, {
            font: `GilroyBold`,
            fill: "white",
            fontSize: 26 * window.GameConfig.RESIZE
        });
        this.nameFB.anchor.set(0.5);
        this.addChild(this.nameFB);
        //level
        this.u_level = new Phaser.Text(game, 320 * window.GameConfig.RESIZE, 270 * window.GameConfig.RESIZE, `LV ${this.u_level} - ${this.level_title}`, {
            font: `${19 * window.GameConfig.RESIZE}px GilroyMedium`,
            fill: "orange",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        this.u_level.anchor.set(0.5);
        this.u_level.addColor("#ffffff", 6);
        this.addChild(this.u_level);
    }

    addHeartAndtxtHeart(heart) {
        this.heartSprite = new Phaser.Sprite(game,
            this.positionMenuConfig.heart.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.heart.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.heart.nameAtlas,
            this.positionMenuConfig.heart.nameSprite
        );
        this.heartSprite.anchor.set(0.5);
        this.addChild(this.heartSprite);
        this.txt_heart = new Phaser.Text(game, this.positionMenuConfig.txt_heart.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_heart.y * window.GameConfig.RESIZE, `${heart}${this.positionMenuConfig.txt_heart.text}`, this.positionMenuConfig.txt_heart.configs);
        this.txt_heart.anchor.set(0, 0.5);
        this.addChild(this.txt_heart);
        // LogConsole.log(SocketController.instance().event);
        SocketController.instance().events.onUserVarsUpdate.add(() => {
            if (this.txt_heart !== null) {
                if (SocketController.instance().dataMySeft.heart !== parseInt(this.txt_heart.text)) {
                    this.txt_heart.setText(`${SocketController.instance().dataMySeft.heart}${this.positionMenuConfig.txt_heart.text}`);
                }
            }
        }, this);
    }

    addDiamondAndTxtDiamond(diamond) {
        this.diamondSprite = new Phaser.Button(game,
            this.positionMenuConfig.diamond.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.diamond.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.diamond.nameAtlas,
            () => { },
            this,
            null,
            this.positionMenuConfig.diamond.nameSprite
        );
        this.diamondSprite.anchor.set(0.5);
        this.addChild(this.diamondSprite);
        this.txt_diamond = new Phaser.Text(game, this.positionMenuConfig.txt_diamond.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_diamond.y * window.GameConfig.RESIZE, diamond, this.positionMenuConfig.txt_diamond.configs);
        this.txt_diamond.anchor.set(0, 0.5);
        this.addChild(this.txt_diamond);
    }

    addTicketAndTxtTicket(ticket) {
        this.ticketSprite = new Phaser.Sprite(game,
            this.positionMenuConfig.ticket.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.ticket.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.ticket.nameAtlas,
            this.positionMenuConfig.ticket.nameSprite
        );
        this.ticketSprite.anchor.set(0.5);
        this.addChild(this.ticketSprite);
        // text reward
        this.txt_ticket = new Phaser.Text(game, this.positionMenuConfig.txt_ticket.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_ticket.y * window.GameConfig.RESIZE, ticket, this.positionMenuConfig.txt_ticket.configs);
        this.txt_ticket.anchor.set(0, 0.5);
        this.addChild(this.txt_ticket);
    }

    addDoc() {
        this.groupDoc = new Phaser.Group(game, 0, 0);
        let doc1 = new SpriteBase(this.positionMenuConfig.line_doc1);
        this.groupDoc.add(doc1);
        let doc2 = new SpriteBase(this.positionMenuConfig.line_doc2);
        this.groupDoc.add(doc2);
        this.addChild(this.groupDoc);
    }

    claimHourReward(hours_reward_setting) {
        this.hours_reward_setting = hours_reward_setting;
        let finishPoint = {
            x: 315,
            y: 303
        }
        // setTimeout(() => {
        ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, {
            type: this.hours_reward_setting.reward_type,
            reward: this.hours_reward_setting.reward,
            finishPoint: finishPoint
        }
        );
        this.timeClaimHourReward = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            if (hours_reward_setting.reward_type == "DIAMOND") {
                let tweenVariable = game.add.tween(this.txt_diamond).to({ text: SocketController.instance().socket.mySelf.getVariable('diamond').value }, 300, "Linear", false);
                tweenVariable.start();
                tweenVariable.onUpdateCallback(() => {
                    // LogConsole.log('vao');
                    this.txt_diamond.text = parseInt(this.txt_diamond.text);
                }, this);
                tweenVariable.onComplete.add(this.completeClaim, this);
            } else if (hours_reward_setting.reward_type == "TICKET") {

            }
            MainData.instance().isRefreshMenu.checking = false;
        }, this);
        // }, 1000);
    }

    completeClaim() {
        this.event.claimHourRewardDone.dispatch();
    }

    scrollChange() {
        //
        if (this.user_vip === true) {
            let tweenLaurel = game.add.tween(this.laurel).to({ alpha: 0 }, 150, "Linear", true);
            tweenLaurel.start();
        }
        //
        // this.ava.scale.set(0.7 * window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        // this.frameAvatar.scale.set(0.7 * 145 / 140 * window.GameConfig.RESIZE);
        if (this.ava !== null) {
            let tweenScaleAva = game.add.tween(this.ava).to({ width: 0.7 * 148 * window.GameConfig.RESIZE, height: 0.7 * 148 * window.GameConfig.RESIZE }, 150, "Linear", true);
            let tweenScaleFrameAva = game.add.tween(this.frameAvatar.scale).to({ x: 0.7 * 145 / 140 * window.GameConfig.RESIZE, y: 0.7 * 145 / 140 * window.GameConfig.RESIZE }, 150, "Linear", true);
            tweenScaleAva.start();
            tweenScaleFrameAva.start();
            //
            let posYFrame = this.positionMenuConfig.frame_ava.y;
            if (this.user_vip === true) {
                posYFrame = this.positionMenuConfig.frame_ava_vip.y;
            }
            let tweenAva = game.add.tween(this.avaBox).to({ y: this.positionMenuConfig.ava_fb.y - 50 }, 150, "Linear", true);
            let tweenFrameAva = game.add.tween(this.frameAvatar).to({ y: posYFrame - 50 }, 150, "Linear", true);
            tweenAva.start();
            tweenFrameAva.start();
            //
            let tweenMask = game.add.tween(this.maskAva.scale).to({ x: 0.7, y: 0.7 }, 150, "Linear", true);
            tweenMask.start();
        }
        //
        this.nameFB.kill();
        this.u_level.kill();
        this.diamondSprite.kill();
        this.txt_diamond.kill();
        this.heartSprite.kill();
        this.txt_heart.kill();
        this.ticketSprite.kill();
        this.txt_ticket.kill();
        //
        for (let i = 0; i < this.groupDoc.children.length; i++) {
            this.groupDoc.children[i].kill();
        }
    }

    scrollDefault() {
        if (this.user_vip === true) {
            let tweenLaurel = game.add.tween(this.laurel).to({ alpha: 1 }, 150, "Linear", true);
            tweenLaurel.start();
        }
        //
        // this.ava.scale.set(window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        // this.frameAvatar.scale.set(145 / 140 * window.GameConfig.RESIZE);
        if (this.ava !== null) {
            let tweenScaleAva = game.add.tween(this.ava).to({ width: 148 * window.GameConfig.RESIZE, height: 148 * window.GameConfig.RESIZE }, 150, "Linear", true);
            let tweenScaleFrameAva = game.add.tween(this.frameAvatar.scale).to({ x: 145 / 140 * window.GameConfig.RESIZE, y: 145 / 140 * window.GameConfig.RESIZE }, 150, "Linear", true);
            tweenScaleAva.start();
            tweenScaleFrameAva.start();
            //
            let posYFrame = this.positionMenuConfig.frame_ava.y;
            if (this.user_vip === true) {
                posYFrame = this.positionMenuConfig.frame_ava_vip.y;
            }
            let tweenAva = game.add.tween(this.avaBox).to({ y: this.positionMenuConfig.ava_fb.y }, 150, "Linear", true);
            let tweenFrameAva = game.add.tween(this.frameAvatar).to({ y: posYFrame }, 150, "Linear", true);
            tweenAva.start();
            tweenFrameAva.start();
            //
            // this.maskAva.clear();
            // this.maskAva.drawCircle(0, 0, 148 * window.GameConfig.RESIZE);
            let tweenMask = game.add.tween(this.maskAva.scale).to({ x: 1, y: 1 }, 150, "Linear", true);
            tweenMask.start();
        }
        //
        if (this.nameFB !== undefined) {
            this.nameFB.revive();
        }
        this.u_level.revive();
        if (this.diamondSprite !== undefined) {
            this.diamondSprite.revive();
        }
        this.txt_diamond.revive();
        this.heartSprite.revive();
        this.txt_heart.revive();
        this.ticketSprite.revive();
        this.txt_ticket.revive();
        //
        for (let i = 0; i < this.groupDoc.children.length; i++) {
            this.groupDoc.children[i].revive();
        }
    }

    destroy() {
        this.removeEventExtension();
        ControllLoadCacheUrl.instance().resetLoad();
        game.time.events.remove(this.timeClaimHourReward);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}