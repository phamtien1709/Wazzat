import PopupConfirmItem from "./item/PopupConfirmItem.js";
import SocketController from "../../controller/SocketController.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import ShopTNItemMenuTab from "../shopnew/item/tainguyen/ShopTNItemMenuTab.js";
import IronSource from "../../IronSource.js";
import MainData from "../../model/MainData.js";
import IPAIOS from "../../IPAIOS.js";
import IPA from "../../IPA.js";
import ShopCommand from "../../model/shop/datafield/ShopCommand.js";
import ControllLoading from "../ControllLoading.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import AnimClaimReward from "../../modules/menu/QuestAndAchievement/items/AnimClaimReward.js";
import SendShopWatchAds from "../../model/shop/server/senddata/SendShopWatchAds.js";
import BaseGroup from "../BaseGroup.js";

export default class PopupNotEnoughResource extends BaseGroup {
    constructor(typeRsr = null) {
        super(game);
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.signalBtn = new Phaser.Signal();
        this.typeRsr = typeRsr;
        this.confirmWatchVideoReward = false;
        this.timeWait = 0;
        this.timerToCountTime = null;
        this.popup = null;
        this.btnWatch = null;
        this.afterInit();
    }

    static get TICKET() {
        return "TICKET";
    }

    static get HEART() {
        return "HEART";
    }

    addEventExtension() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        IronSource.instance().event.rewardedVideoRewardReceived.add(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.add(this.rewardedVideoFailed, this);
        IronSource.instance().event.rewardedVideoClosed.add(this.rewardedVideoClosed, this);
    }

    removeEventExtension() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        IronSource.instance().event.rewardedVideoRewardReceived.remove(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.rewardedVideoFailed.remove(this.rewardedVideoFailed, this);
        IronSource.instance().event.rewardedVideoClosed.remove(this.rewardedVideoClosed, this);
    }

    rewardedVideoRewardReceived(event) {
        this.confirmWatchVideoReward = true;
        if (this.confirmWatchVideoReward == true) {
            let id = 0;
            let quantity = 0;
            let resource_type = "";
            if (this.typeRsr == PopupNotEnoughResource.HEART) {
                id = this.rsrPkgs.heart.id;
                quantity = this.rsrPkgs.heart.quantity;
                resource_type = this.rsrPkgs.heart.resource_type;
            } else {
                id = this.rsrPkgs.ticket.id;
                quantity = this.rsrPkgs.ticket.quantity;
                resource_type = this.rsrPkgs.ticket.resource_type;
            }
            SocketController.instance().sendData(
                ShopCommand.RESOURCE_PACKAGE_WATCHED_ADS_CLAIM_REQUEST,
                SendShopWatchAds.begin(
                    id,
                    quantity,
                    resource_type
                )
            );
        } else {
            ControllLoading.instance().hideLoading();
        }
    }

    rewardedVideoFailed() {

    }

    rewardedVideoClosed() {
        this.btnWatch.inputEnabled = true;
        this.btnBuy.inputEnabled = true;
    }

    afterInit() {
        ControllLoading.instance().showLoading();
        this.botSprite = new Phaser.Sprite(game, 0, 0, null);
        this.addChild(this.botSprite);
        this.topSprite = new Phaser.Sprite(game, 0, 0, null);
        this.addChild(this.topSprite);
        this.screenDim;
        this.tabGem;
        this.tabHeart;
        this.popup;
        this.addScreenDim();
        if (this.typeRsr == PopupNotEnoughResource.HEART || this.typeRsr == null) {
            this.addGemAndHeart();
        }
        this.addEventExtension();
        //
        if (MainData.instance().dataPackage === null) {
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().getDataInapp();
            } else {
                IPA.instance().getDataInapp();
            }
        } else {
            // MainData.instance().dataPackage = 
            this.handlePackage();
        }
    }

    addScreenDim() {
        this.screenDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.screenDim.inputEnabled = true;
        this.botSprite.addChild(this.screenDim);
    }

    addGemAndHeart() {
        this.tabGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabGem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGem.nameAtlas, this.positionPracticePopupConfig.tabGem.nameSprite);
        this.addGemDetail();
        this.botSprite.addChild(this.tabGem);
        this.tabHeart = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabHeart.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeart.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeart.nameAtlas, this.positionPracticePopupConfig.tabHeart.nameSprite);
        this.addHeartDetail();
        this.botSprite.addChild(this.tabHeart);
    }

    addGemDetail() {
        let gem;
        // let this.txtGem;
        gem = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.gem_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.gem_reward.nameAtlas, this.positionPracticePopupConfig.gem_reward.nameSprite);
        this.txtGem = new Phaser.Text(game, 0, this.positionPracticePopupConfig.gem_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().dataMySeft.diamond, this.positionPracticePopupConfig.gem_reward_txt.configs);
        let sumWidth = gem.width + this.txtGem.width;
        this.txtGem.x = ((this.tabGem.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGem.width - sumWidth) / 2) + this.txtGem.width + 5 * window.GameConfig.RESIZE;
        this.tabGem.addChild(gem);
        this.tabGem.addChild(this.txtGem);
    }

    addHeartDetail() {
        let heart;
        // let this.txtHeart;
        heart = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.heart_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.heart_reward.nameAtlas, this.positionPracticePopupConfig.heart_reward.nameSprite);
        this.txtHeart = new Phaser.Text(game, 0, this.positionPracticePopupConfig.heart_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().dataMySeft.heart, this.positionPracticePopupConfig.heart_reward_txt.configs);
        let sumWidth = heart.width + this.txtHeart.width;
        this.txtHeart.x = ((this.tabHeart.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        heart.x = ((this.tabHeart.width - sumWidth) / 2) + this.txtHeart.width + 5 * window.GameConfig.RESIZE;
        this.tabHeart.addChild(heart);
        this.tabHeart.addChild(this.txtHeart);
    }

    addPopup() {
        if (this.popup !== null) {
            this.removeBtnWatch();
            this.addBtnWatch();
            // this.checkConfirmAds();
        } else {
            this.removePopup();
            this.txtMainPopup;
            this.txtQuestPopup;
            this.popup = new Phaser.Sprite(game, 35, 1140, 'dailyRewardSprites', 'Box');
            this.addIconCamera();
            this.addBtnWatch();
            this.addBtnBuy();
            this.addTxtMainPopup();
            this.addTxtQuestPopup();
            this.addBtnClose();
            this.botSprite.addChild(this.popup);
            //
            this.makeTweenPopup();
            // this.checkConfirmAds();
        }
        // this.removePopup();
        //
        // console.log(this.rsrPkgs)
    }
    removePopup() {
        if (this.popup !== null) {
            this.botSprite.removeChild(this.popup);
            this.popup.destroy();
            this.popup = null;
        }
    }
    removeBtnWatch() {
        if (this.btnWatch !== null) {
            this.popup.removeChild(this.btnWatch);
            this.btnWatch.destroy();
            this.btnWatch = null;
        }
    }

    addIconCamera() {
        this.icon = new Phaser.Sprite(game, 285, 42, 'dailyRewardSprites', 'Camera');
        this.icon.anchor.set(0.5, 0);
        this.popup.addChild(this.icon);
    }

    addBtnWatch() {
        this.btnWatch = new Phaser.Button(game, 414, 379, 'dailyRewardSprites', () => { }, this, null, 'Button_Xem');
        this.btnWatch.anchor.set(0.5);
        this.btnWatch.events.onInputUp.add(this.onWatch, this);
        // if (MainData.instance().platform === "web") {
        // }
        //
        this.txtBtnWatch = new Phaser.Text(game, 0, 0, 'XEM', {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 35
        });
        this.txtBtnWatch.anchor.set(0.5);
        this.txtCountBtnWatch = new Phaser.Text(game, 0, 23, '', {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 18
        });
        this.txtCountBtnWatch.anchor.set(0.5);
        this.btnWatch.addChild(this.txtBtnWatch);
        this.btnWatch.addChild(this.txtCountBtnWatch);
        this.popup.addChild(this.btnWatch);
        //
        // if (MainData.instance().platform === "ios") {
        // this.btnWatch.alpha = 0.75;
        this.btnWatch.alpha = 0.5;
        this.btnWatch.inputEnabled = false;
        // }
    }

    addBtnBuy() {
        this.btnBuy = new Phaser.Button(game, 156, 379, 'dailyRewardSprites', this.onBuy, this, null, 'Button_Mua');
        this.btnBuy.anchor.set(0.5);
        //
        this.txtBtnBuy = new Phaser.Text(game, 0, 0, 'MUA', {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 35
        });
        this.txtBtnBuy.anchor.set(0.5);
        this.btnBuy.addChild(this.txtBtnBuy);
        this.popup.addChild(this.btnBuy);
    }

    onWatch() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllLoading.instance().showLoading();
        IronSource.instance().showRewardVideoInappPurchase(this.typeRsr);
    }

    getData(data) {
        switch (data.cmd) {
            case ShopCommand.RESOURCE_PACKAGE_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    MainData.instance().dataPackage = data.params;
                    this.handlePackage();
                }
                break;
            case ShopCommand.RESOURCE_PACKAGE_WATCHED_ADS_CLAIM_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    this.animClaim();
                    //
                    MainData.instance().dataPackage = null;
                    if (MainData.instance().platform === "ios") {
                        IPAIOS.instance().getDataInapp();
                    } else {
                        IPA.instance().getDataInapp();
                    }
                    ControllLoading.instance().hideLoading();
                }
        }
    }

    onBuy() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreenDialog.instance().addShop(1, ShopTNItemMenuTab.HEART);
        this.destroy();
    }

    addTxtMainPopup() {
        let txtNoti = '';
        if (this.typeRsr == PopupNotEnoughResource.HEART) {
            txtNoti = this.positionPracticePopupConfig.txtNotEnoughHeart.text
        } else {
            txtNoti = this.positionPracticePopupConfig.txtNotEnoughTicket.text
        }
        //
        this.txtMainPopup = new Phaser.Text(game, this.positionPracticePopupConfig.txtNotEnoughHeart.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txtNotEnoughHeart.y * window.GameConfig.RESIZE, txtNoti, this.positionPracticePopupConfig.txtNotEnoughHeart.configs);
        this.txtMainPopup.anchor.set(0.5, 0);
        this.popup.addChild(this.txtMainPopup);
    }

    addTxtQuestPopup() {
        let txtAdvice = '';
        if (this.typeRsr == PopupNotEnoughResource.HEART) {
            txtAdvice = this.positionPracticePopupConfig.txtQuestNotEnoughHeart.text
        } else {
            txtAdvice = this.positionPracticePopupConfig.txtQuestNotEnoughTicket.text
        }
        this.txtQuestPopup = new Phaser.Text(game, this.positionPracticePopupConfig.txtQuestNotEnoughHeart.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txtQuestNotEnoughHeart.y * window.GameConfig.RESIZE, txtAdvice, this.positionPracticePopupConfig.txtQuestNotEnoughHeart.configs);
        this.txtQuestPopup.anchor.set(0.5, 0);
        this.popup.addChild(this.txtQuestPopup);
    }

    addBtnClose() {
        this.btnClose = new Phaser.Button(game, 536, -29, 'dailyRewardSprites', this.onClose, this, null, 'Button_Exit');
        this.popup.addChild(this.btnClose);
    }

    onClose() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.destroy();
    }

    makeTweenPopup() {
        let tween = game.add.tween(this.popup).to({ y: (game.height - 830) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Bounce.Out, false);
        tween.start();
    }

    removeTabGemAndTabHeart() {
        this.tabGem.destroy();
        this.tabHeart.destroy();
    }

    handlePackage() {
        // console.log(MainData.instance().dataPackage.getDump());
        this.rsrPkgs = {
            heart: {},
            ticket: {}
        };
        let resource_packages = MainData.instance().dataPackage.getSFSArray('resource_packages');
        for (let i = 0; i < resource_packages.size(); i++) {
            let resource = resource_packages.getSFSObject(i);
            if (resource.getUtfString("resource_type") == "HEART" && resource.getUtfString("price_type") == "ADS") {
                let pack_name = resource.getUtfString('pack_name');
                let sale = resource.getInt('sale');
                let quantity = resource.getInt('quantity');
                let payment_service = resource.getUtfString('payment_service');
                let price = resource.getInt('price');
                let name = resource.getUtfString('name');
                let resource_type = resource.getUtfString('resource_type');
                let price_type = resource.getUtfString('price_type');
                let active = resource.getInt('active');
                let next_watched_at = resource.getLong('next_watched_at');
                let id = resource.getInt('id');
                let is_allow_watch = resource.getBool('is_allow_watch');
                this.rsrPkgs.heart = {
                    pack_name: pack_name,
                    sale: sale,
                    quantity: quantity,
                    payment_service: payment_service,
                    price: price,
                    name: name,
                    resource_type: resource_type,
                    price_type: price_type,
                    active: active,
                    id: id,
                    is_allow_watch: is_allow_watch,
                    next_watched_at: next_watched_at
                }
            }
            if (resource.getUtfString("resource_type") == "HEART" && resource.getUtfString("price_type") == "ADS") {
                let pack_name = resource.getUtfString('pack_name');
                let sale = resource.getInt('sale');
                let quantity = resource.getInt('quantity');
                let payment_service = resource.getUtfString('payment_service');
                let price = resource.getInt('price');
                let name = resource.getUtfString('name');
                let resource_type = resource.getUtfString('resource_type');
                let price_type = resource.getUtfString('price_type');
                let active = resource.getInt('active');
                let id = resource.getInt('id');
                let next_watched_at = resource.getLong('next_watched_at');
                let is_allow_watch = resource.getBool('is_allow_watch');
                this.rsrPkgs.ticket = {
                    pack_name: pack_name,
                    sale: sale,
                    quantity: quantity,
                    payment_service: payment_service,
                    price: price,
                    name: name,
                    resource_type: resource_type,
                    price_type: price_type,
                    active: active,
                    id: id,
                    is_allow_watch: is_allow_watch,
                    next_watched_at: next_watched_at
                }
            }
        }
        //
        ControllLoading.instance().hideLoading();
        this.addPopup();
    }

    checkConfirmAds() {
        if (this.typeRsr == "HEART") {
            if (this.rsrPkgs.heart.is_allow_watch == true) {
                this.btnWatch.inputEnabled = true;
                this.btnWatch.alpha = 1;
            } else {
                this.btnWatch.inputEnabled = false;
                // this.btnWatch.alpha = 1;
                this.timeWait = parseInt((this.rsrPkgs.heart.next_watched_at - (new Date()).getTime()) / 1000);
                this.changeTxtBtnAds();
            }
        } else {
            if (this.rsrPkgs.ticket.is_allow_watch == true) {

            } else {

            }
        }
    }

    changeTxtBtnAds() {
        if (this.timeWait > 0) {
            this.btnWatch.inputEnabled = false;
            this.btnWatch.alpha = 0.7;
            this.txtBtnWatch.y = -5;
            this.stopCountTime();
            this.timerToCountTime = game.time.create(true);
            this.timerToCountTime.loop(1000, this.onTimerToCountTime, this);
            this.timerToCountTime.start();
            this.setTextTimer();
        } else {
            if (MainData.instance().platform === "web") {
                this.btnWatch.alpha = 0.5;
                this.btnWatch.inputEnabled = false;
            } else {
                this.btnWatch.inputEnabled = true;
                this.btnWatch.alpha = 1;
                this.txtBtnWatch.y = 0;
            }
        }
    }

    onTimerToCountTime() {
        this.timeWait = this.timeWait - 1;
        if (this.timeWait < 0) {
            this.timeWait = 0;
        }
        if (this.timeWait === 0) {
            this.stopCountTime();
            //
            ControllLoading.instance().showLoading();
            MainData.instance().dataPackage = null;
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().getDataInapp();
            } else {
                IPA.instance().getDataInapp();
            }
        } else {
            this.setTextTimer();
        }
    }

    setTextTimer() {
        let strTime = "";

        let strH = ""
        let strM = "";
        let strS = "";

        let timeH = parseInt(this.timeWait / 3600);
        let timeM = 0;
        let timeS = 0;

        if (timeH > 0) {
            if (timeH > 9) {
                strH = timeH + ":";
            } else {
                strH = "0" + timeH + ":";
            }
            timeM = parseInt((this.timeWait % 3600) / 60);
            timeS = this.timeWait - (timeH * 3600 + timeM * 60);
        } else {
            timeM = parseInt(this.timeWait / 60);
            timeS = this.timeWait % 60;
        }

        if (timeM > 9) {
            strM = timeM + ":";
        } else {
            strM = "0" + timeM + ":";
        }

        if (timeS > 9) {
            strS = timeS + "";
        } else {
            strS = "0" + timeS;
        }

        strTime = "( " + strH + strM + strS + " )";

        this.txtCountBtnWatch.setText(strTime);
    }

    animClaim() {
        let finishPoint = {
            x: 0,
            y: 0
        }
        if (this.typeRsr == "HEART") {
            finishPoint.x = this.positionPracticePopupConfig.tabHeart.x + 100;
            finishPoint.y = this.positionPracticePopupConfig.tabHeart.y + 25;
        } else if (this.typeRsr == "TICKET") {
            finishPoint.x = 0;
            finishPoint.y = 0;
        }
        if (this.typeRsr == PopupNotEnoughResource.HEART) {
            let animClaim = new AnimClaimReward(this.typeRsr, 5, finishPoint);
            this.topSprite.addChild(animClaim);
            //
            let tweenRsr = game.add.tween(this.txtHeart).to({ text: SocketController.instance().dataMySeft.heart }, 300, "Linear", false);
            this.tweenTxtRsr(tweenRsr, this.txtHeart);
        } else {

        }
    }

    tweenTxtRsr(tween, txt) {
        this.timeStartTween = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            tween.start();
        }, this);
        tween.onUpdateCallback(() => {
            // LogConsole.log('vao');
            txt.text = parseInt(txt.text);
        }, this);
        tween.onComplete.add(() => {
            //TODO: addADS
            if (window.cordova && typeof device !== 'undefined') {
                if (this.isWatchRewardVideo == true) {
                    this.tweenDestroy();
                } else {
                    this.tweenDestroy();
                }
            } else {
                this.tweenDestroy();
            }
        }, this);
    }

    tweenDestroy() {
        //
        let tween = game.add.tween(this.popup).to({ y: -1200 * window.GameConfig.RESIZE }, 200, "Linear", false);
        this.timeTweenDestroy = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            tween.start();
        }, this)
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
    }

    stopCountTime() {
        if (this.timerToCountTime !== null) {
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
            game.time.events.remove(this.timerToCountTime);
            this.timerToCountTime = null;
        }
    }

    destroy() {
        this.stopCountTime();
        this.removeEventExtension();
        super.destroy();
    }
}