import PopupBg from "../../popup/item/PopupBg.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import DailyRewardGroupSprite from "./DailyRewardGroupSprite.js";
import RewardDailySprite from "./RewardDailySprite.js";
import ListView from "../../../../libs/listview/list_view.js";
import IronSource from "../../../IronSource.js";
import ControllDialog from "../../ControllDialog.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";

export default class DailyRewardPopupChild extends Phaser.Sprite {
    constructor(dailyRewardSettings, dailyRewardLog) {
        super(game, 0, 1140 * window.GameConfig.RESIZE, null);
        this.dailyRewardConfig = JSON.parse(game.cache.getText('dailyRewardConfig'));
        this.dailyRewardSettings = dailyRewardSettings;
        this.dailyRewardLog = dailyRewardLog;
        this.popup;
        this.event = {
            claimDailyReward: new Phaser.Signal()
        };
        this.addPopup();
    }

    static get INIT() {
        return "INIT";
    }
    static get NOT_INIT() {
        return "NOT_INIT";
    }
    static get REWARDED() {
        return "REWARDED";
    }

    addPopup() {
        this.addEventExtension();
        this.popup = new SpriteBase(this.dailyRewardConfig.popup);
        this.popup.x = 18 * window.GameConfig.RESIZE;
        this.popup.y = 233 * window.GameConfig.RESIZE;
        this.addChild(this.popup);
        this.addDecoPopup();
        this.addListReward();
    }

    addDecoPopup() {
        this.boxGift;
        this.ribbon;
        this.btnClaim;
        this.txtHeader;
        this.initRewardIndex = -1;
        this.rewardObj;
        this.addBoxGift();
        this.addBtnClaim();
        this.addBtnWatch();
        this.addTxtHeader();
    }

    addBoxGift() {
        this.boxGift = new SpriteBase(this.dailyRewardConfig.decorate.box_gift);
        this.boxGift.anchor.set(0.5);
        this.popup.addChild(this.boxGift);
    }

    addRibbon() {
        this.ribbon = new SpriteBase(this.dailyRewardConfig.decorate.ribbon);
        this.popup.addChild(this.ribbon);
    }

    addBtnClaim() {
        if (SocketController.instance().dataMySeft.vip === true) {
            this.btnClaim = new ButtonBase(this.dailyRewardConfig.decorate.btn_claim_vip, this.onClickClaim, this);
            this.btnClaim.anchor.set(0.5);
            let txtBtn = new TextBase(this.dailyRewardConfig.decorate.txt_btn, Language.instance().getData(188));
            txtBtn.anchor.set(0.5);
            this.btnClaim.addChild(txtBtn);
            this.popup.addChild(this.btnClaim);
        } else {
            this.btnClaim = new ButtonBase(this.dailyRewardConfig.decorate.btn_claim, this.onClickClaim, this);
            this.btnClaim.anchor.set(0.5);
            let txtBtn = new TextBase(this.dailyRewardConfig.decorate.txt_btn, Language.instance().getData(189));
            txtBtn.anchor.set(0.5);
            this.btnClaim.addChild(txtBtn);
            this.popup.addChild(this.btnClaim);
        }
    }
    onClickClaim() {
        this.btnClaim.inputEnabled = false;
        if (this.btnWatch) {
            this.btnWatch.inputEnabled = false;
        }
        if (SocketController.instance().dataMySeft.vip === true) {
            this.event.claimDailyReward.dispatch(this.rewardObj, 1);
        } else {
            this.event.claimDailyReward.dispatch(this.rewardObj, 0);
        }
        // LogConsole.log(this.groupPlaylists);
    }
    changeItemChildInit() {
        // LogConsole.log(this.initRewardIndex);
        this.btnClaim.kill();
        if (this.btnWatch) {
            this.btnWatch.kill();
        }
        let item = this.groupPlaylists.children[this.initRewardIndex - 1];
        item.changeRewarded();
        // this.event.claimDailyReward.dispatch();
    }

    addBtnWatch() {
        if (SocketController.instance().dataMySeft.vip === true) {

        } else {
            this.btnWatch = new ButtonBase(this.dailyRewardConfig.decorate.btn_watch_video_reward, this.onClickWatch, this);
            this.btnWatch.anchor.set(0.5);
            let cam = new SpriteBase(this.dailyRewardConfig.decorate.btn_watch_video_reward.camera);
            this.btnWatch.addChild(cam);
            let txt1 = new TextBase(this.dailyRewardConfig.decorate.btn_watch_video_reward.txt1, Language.instance().getData("191"));
            let txt2 = new TextBase(this.dailyRewardConfig.decorate.btn_watch_video_reward.txt2, Language.instance().getData("190"));
            this.btnWatch.addChild(txt1);
            this.btnWatch.addChild(txt2);
            this.popup.addChild(this.btnWatch);
            //
            // if (MainData.instance().platform === "ios") {
            // this.btnWatch.kill();
            // this.btnWatch.alpha = 0.75;
            // this.btnWatch.tint = 0x8c8c89;
            // }
        }
    }

    onClickWatch() {
        if (MainData.instance().platform == "web") {

        } else {
            this.btnClaim.inputEnabled = false;
            if (this.btnWatch) {
                this.btnWatch.inputEnabled = false;
            }
            IronSource.instance().showRewardVideoX2Daily();
        }
    }

    addTxtHeader() {
        this.txtHeader = new TextBase(this.dailyRewardConfig.decorate.txt_header, Language.instance().getData(186));
        this.txtHeader.anchor.set(0.5);
        this.popup.addChild(this.txtHeader);
    }

    addListReward() {
        var listPlaylistBeginX = 0;
        var listPlaylistBeginY = 35 * window.GameConfig.RESIZE;
        this.groupPlaylists = new DailyRewardGroupSprite(0, 0 * window.GameConfig.RESIZE);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 148 * window.GameConfig.RESIZE;
        this.popup.addChild(gr);
        var bounds = new Phaser.Rectangle(17 * window.GameConfig.RESIZE, 0, 570 * window.GameConfig.RESIZE, 551 * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        //
        // LogConsole.log(this.dailyRewardSettings);
        for (let i = 1; i < this.dailyRewardSettings.length + 1; i++) {
            if (this.dailyRewardSettings[i - 1].day < this.dailyRewardLog.day) {
                // LogConsole.log('1');
                let spriteDaily = new RewardDailySprite(
                    listPlaylistBeginX,
                    listPlaylistBeginY,
                    this.dailyRewardSettings[i - 1],
                    DailyRewardPopupChild.REWARDED
                );
                this.groupPlaylists.add(spriteDaily);
            } else if (this.dailyRewardSettings[i - 1].day == this.dailyRewardLog.day) {
                // LogConsole.log('2');
                let spriteDaily = new RewardDailySprite(
                    listPlaylistBeginX,
                    listPlaylistBeginY,
                    this.dailyRewardSettings[i - 1],
                    this.dailyRewardLog.state
                );
                this.rewardObj = this.dailyRewardSettings[i - 1];
                this.initRewardIndex = i;
                this.groupPlaylists.add(spriteDaily);
            } else {
                // LogConsole.log('3');
                let spriteDaily = new RewardDailySprite(
                    listPlaylistBeginX,
                    listPlaylistBeginY,
                    this.dailyRewardSettings[i - 1],
                    DailyRewardPopupChild.NOT_INIT
                );
                this.groupPlaylists.add(spriteDaily);
            }
            if (i % 5 == 0 && i > 0) {
                listPlaylistBeginX = 0;
                listPlaylistBeginY += window.GameConfig.CONFIGS_DAILY_REWARD.y * window.GameConfig.RESIZE;
                this.groupPlaylists.height += window.GameConfig.CONFIGS_DAILY_REWARD.y * window.GameConfig.RESIZE;
            } else {
                listPlaylistBeginX += window.GameConfig.CONFIGS_DAILY_REWARD.x * window.GameConfig.RESIZE;
            }
        }
        this.listView.add(this.groupPlaylists);
    }
    //
    addEventExtension() {
        IronSource.instance().event.rewardedVideoRewardReceived.add(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.add(this.rewardedVideoFailed, this);
        IronSource.instance().event.rewardedVideoClosed.add(this.rewardedVideoClosed, this);
    }
    removeEventExtension() {
        IronSource.instance().event.rewardedVideoRewardReceived.remove(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.remove(this.rewardedVideoFailed, this)
        IronSource.instance().event.rewardedVideoClosed.remove(this.rewardedVideoClosed, this);

    }

    rewardedVideoClosed() {
        this.btnWatch.inputEnabled = true;
        this.btnClaim.inputEnabled = true;
    }

    rewardedVideoRewardReceived() {
        this.event.claimDailyReward.dispatch(this.rewardObj, 1);
    }

    rewardedVideoFailed() {
        console.log('Co vao day ko?');
        this.btnClaim.inputEnabled = true;
        if (this.btnWatch) {
            this.btnWatch.inputEnabled = true;
        }
    }

    destroy() {
        this.removeEventExtension();
        this.listView.removeAll();
        this.listView.destroy();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}