import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import DataCommand from "../../../common/DataCommand.js";
import SocketController from "../../../controller/SocketController.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnGift extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            goToGift: new Phaser.Signal(),
            refreshMenu: new Phaser.Signal()
        }
        this.inputEnabled = true;
        this.outSize = true;
        this.isGift = false;
        this.afterInit();
    }

    static get INIT() {
        return "INIT";
    }

    static get REWARDED() {
        return "REWARDED";
    }

    afterInit() {
        this.btn;
        this.animCircleScale;
        this.animButtonInOut;
        this.addBtn();
        this.addAnimCircleScale();
        //
        this.addAnimButtonInOut();
        // this.runAnim();
    }

    addBtn() {
        this.btn = new Phaser.Sprite(game, this.positionMenuConfig.btnGift.x * window.GameConfig.RESIZE, this.positionMenuConfig.btnGift.y * window.GameConfig.RESIZE, this.positionMenuConfig.btnGift.nameAtlas, this.positionMenuConfig.btnGift.nameSprite);
        this.btn.anchor.set(0.5);
        //
        this.txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_gift.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_gift.y * window.GameConfig.RESIZE, this.positionMenuConfig.txt_gift.text, this.positionMenuConfig.txt_gift.configs);
        this.txtBtn.anchor.set(0.5);
        this.btn.addChild(this.txtBtn);
        this.addChild(this.btn);
    }

    onClickBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.btn.inputEnabled = false;
        // LogConsole.log(this.hoursReward);
        this.sendDataClaimHoursReward();
        // this.event.goToGift.dispatch();
        // FacebookAction.instance().share();
    }

    addAnimCircleScale() {
        this.animCircleScale = new Phaser.Sprite(game, 0, 0, 'CircleScale');
        this.animCircleScale.anchor.set(0.5);
        this.btn.addChild(this.animCircleScale);
    }

    addAnimButtonInOut() {
        this.animButtonInOut = new Phaser.Sprite(game, 0, 0, 'ButtonGift');
        this.animButtonInOut.anchor.set(0.5);
        this.btn.addChild(this.animButtonInOut);
    }

    runAnim() {
        this.isGift = true;
        let runAnimBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 25, true);
        let runAnimCircle = this.animCircleScale.animations.add('run_scale_circle');
        this.animCircleScale.animations.play('run_scale_circle', 30, true);
    }

    getValue(hoursReward) {
        this.hoursReward = hoursReward;
        if (this.hoursReward.state == MenuBtnGift.INIT) {
            this.runAnim();
            this.btn.inputEnabled = true;
            this.btn.events.onInputUp.addOnce(this.onClickBtn, this);
            this.addEventExtension();
        } else {
            this.handleTimeCountToClaim();
        }
        //this.btn.inputEnabled = true;
        //this.btn.events.onInputUp.add(this.onClickBtn, this);
    }

    handleTimeCountToClaim() {
        this.SixHour = 21600000;
        this.timeCountDownFinish = this.hoursReward.updated + this.SixHour;
        this.timeCountDownRunning = (this.timeCountDownFinish - Date.now()) / 1000;
        var timer = game.time.create(false);
        timer.loop(1000, this.handleTimer, this);
        timer.start();
    }

    handleTimer() {
        this.timeCountDownRunning--;
        var hour = parseInt(this.timeCountDownRunning / 3600);
        var min = parseInt((this.timeCountDownRunning % 3600) / 60);
        var sec = parseInt(((this.timeCountDownRunning % 3600) % 60));
        this.txtBtn.setText(`${this.positionMenuConfig.txt_gift.text}(${hour}:${min}:${sec})`);
        if (hour == 0 && min == 0 && sec == 0) {
            this.event.refreshMenu.dispatch();
        }
    }
    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }
    //

    sendDataClaimHoursReward() {
        // var params = new SFS2X.SFSObject();
        // params.putInt("hours_reward_id", this.hoursReward.hours_reward_id);
        SocketController.instance().sendData(DataCommand.HOURS_REWARD_CLAIM_REQUEST, null);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.HOURS_REWARD_CLAIM_RESPONSE) {
            // LogConsole.log(evtParams.params.getDump());
            if (evtParams.params.getUtfString('status') == 'OK') {
                this.getDataHoursRewardSetting(evtParams.params);
                this.event.goToGift.dispatch(this.hours_reward_setting);
                // EventGame.instance().event.updateGemPlayer.dispatch(this.hours_reward_setting);
            }
        }
    }

    getDataHoursRewardSetting(params) {
        let hours_reward_setting = params.getSFSObject('hours_reward_setting');
        let reward = hours_reward_setting.getInt('reward');
        let reward_type = hours_reward_setting.getUtfString('reward_type');
        let id = hours_reward_setting.getInt('id');
        this.hours_reward_setting = {
            reward: reward,
            reward_type: reward_type,
            id: id
        }
    }

    scrollChange() {
        this.txtBtn.kill();
        // this.btn.y = 65;
        let tweenBtn = game.add.tween(this.btn).to({ y: 65 }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isGift == true) {
            this.animCircleScale.animations.stop('run_scale_circle', true);
        }
    }

    scrollDefault() {
        this.txtBtn.revive();
        // this.btn.y = this.positionMenuConfig.btnGift.y * window.GameConfig.RESIZE;
        let tweenBtn = game.add.tween(this.btn).to({ y: this.positionMenuConfig.btnGift.y * window.GameConfig.RESIZE }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isGift == true) {
            this.animCircleScale.animations.play('run_scale_circle', 30, true);
        }
    }

    destroy() {
        this.removeEventExtension();
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