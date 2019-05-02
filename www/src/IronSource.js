import FaceBookCheckingTools from "./FaceBookCheckingTools.js";
import ControllLoading from "./view/ControllLoading.js";
import SocketController from "./controller/SocketController.js";
import ControllScreenDialog from "./view/ControllScreenDialog.js";
export default class IronSource {
    constructor() {
        this.countPlayTurnBase = 0;
        this.countPlayQuickPlay = 0;
        this.countPlayCreateRoom = 0;
        this.countGameOverSoloMode = 0;
        this.countWinAndTakeRewardSoloMode = 0;
        this.countTakeReward = 0;
        this.countTakeAchievementReward = 0;
        this.countEventMode = 0;
        this.strEvent = "";
        this.ktLoadAds = false;
        this.ktLoadAdsReward = false;
        this.ktRewardWin = false;
        this.ktHideBanner = false;
        this.event = {
            rewardedVideoAvailabilityChanged: new Phaser.Signal(),
            rewardedVideoRewardReceived: new Phaser.Signal(),
            rewardedVideoStarted: new Phaser.Signal(),
            rewardedVideoEnded: new Phaser.Signal(),
            rewardedVideoOpened: new Phaser.Signal(),
            rewardedVideoClosed: new Phaser.Signal(),
            rewardedVideoFailed: new Phaser.Signal(),
            interstitialLoaded: new Phaser.Signal(),
            interstitialShown: new Phaser.Signal(),
            interstitialShowFailed: new Phaser.Signal(),
            interstitialClicked: new Phaser.Signal(),
            interstitialClosed: new Phaser.Signal(),
            interstitialWillOpen: new Phaser.Signal(),
            interstitialFailedToLoad: new Phaser.Signal(),
            bannerDidLoad: new Phaser.Signal(),
            bannerFailedToLoad: new Phaser.Signal(),
            bannerDidClick: new Phaser.Signal(),
            bannerWillPresentScreen: new Phaser.Signal(),
            bannerDidDismissScreen: new Phaser.Signal(),
            bannerWillLeaveApplication: new Phaser.Signal()
        }
        this.existAds = false;


        if (typeof AdMob !== 'undefined') {
            this.existAds = true;
            document.addEventListener("onAdFailLoad", this.onAdFailLoad.bind(this));
            document.addEventListener("onAdLoaded", this.onAdLoaded.bind(this));
            document.addEventListener("onAdPresent", this.onAdPresent.bind(this));
            document.addEventListener("onAdLeaveApp", this.onAdLeaveApp.bind(this));
            document.addEventListener("onAdDismiss", this.onAdDismiss.bind(this));

            AdMob.setOptions({
                // adSize: 'SMART_BANNER',
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                isTesting: true, // set to true, to receiving test ad for testing purpose
                bgColor: 'black', // color name, or '#RRGGBB'
                // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
                // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            });

            this.callPrepareInterstitial();
            this.callPrepareRewardVideoAd();
        }
    }

    callPrepareInterstitial() {
        let interstitialAdUnit = "ca-app-pub-4906074177432504/1649035673";
        AdMob.prepareInterstitial({
            license: "dungdt@gmail.com/da56af6429df2d6171acc976a9bb88e1",
            adId: interstitialAdUnit,
            autoShow: false
        });
    }

    callPrepareRewardVideoAd() {
        let rewardedVideoAdUnit = "ca-app-pub-3940256099942544/5224354917"//"ca-app-pub-4020852115305939/1141028765";
        AdMob.prepareRewardVideoAd({
            license: "dungdt@gmail.com/da56af6429df2d6171acc976a9bb88e1",
            adId: rewardedVideoAdUnit,
            autoShow: false
        })
    }

    onAdFailLoad(data) {
        console.log("onAdFailLoad-------------");
        console.log(data);
        if (data.adType === "interstitial") {
            this.callPrepareInterstitial();
        } else if (data.adType === "rewardvideo") {
            this.callPrepareRewardVideoAd();
        }
    }

    onAdLoaded(data) {
        console.log("onAdLoaded-------------");
        console.log(data);
        if (data.adType === "interstitial") {
            this.ktLoadAds = true;
        } else if (data.adType === "rewardvideo") {
            this.ktLoadAdsReward = true;
        }
    }

    onAdPresent(data) {
        console.log("onAdPresent-------------");
        console.log(data);
        if (data.adType === "rewardvideo") {
            this.ktRewardWin = true;
        }
    }

    onAdLeaveApp(data) {
        console.log("onAdLeaveApp-------------");
        console.log(data);
    }

    onAdDismiss(data) {
        console.log("onAdDismiss-------------");
        console.log(data);
        if (data.adType === "interstitial") {
            this.ktLoadAds = false;
            if (cordova.plugins) {
                if (cordova.plugins.VolumeControl) {
                    let VolumeControl = cordova.plugins.VolumeControl;
                    VolumeControl.setVolume(0.7); //Float between 0.0 and 1.0
                }
            }
            this.event.interstitialClosed.dispatch();

            if (this.strEvent !== "") {
                let dataLog = this.strEvent + "Closed";
                FaceBookCheckingTools.instance().logEvent(dataLog);
            }

            this.callPrepareInterstitial();

            ControllLoading.instance().hideLoading();

        } else if (data.adType === "rewardvideo") {
            if (this.ktRewardWin === true) {
                this.ktRewardWin = false;
                this.event.rewardedVideoRewardReceived.dispatch();
                if (this.strEvent !== "") {
                    let dataLog = this.strEvent + "RewardReceived";
                    FaceBookCheckingTools.instance().logEvent(dataLog);
                }
            } else {
                this.event.rewardedVideoFailed.dispatch();
                if (this.strEvent !== "") {
                    let dataLog = this.strEvent + "Closed";
                    FaceBookCheckingTools.instance().logEvent(dataLog);
                }
            }

            if (cordova.plugins) {
                if (cordova.plugins.VolumeControl) {
                    let VolumeControl = cordova.plugins.VolumeControl;
                    VolumeControl.setVolume(0.7); //Float between 0.0 and 1.0
                }
            }
            this.ktRewardWin = false;
            this.ktLoadAdsReward = false;

            this.callPrepareRewardVideoAd();

            ControllLoading.instance().hideLoading();
        }
    }

    static instance() {
        if (this.ironsource) {

        } else {
            this.ironsource = new IronSource();
        }

        return this.ironsource;
    }

    ///Interstitial ads
    playTurnBase() {
        console.log('playTurnBase');
        this.countPlayTurnBase++;
        console.log(this.countPlayTurnBase);
    }
    showInterstitialTurnBase() {
        console.log('showInterstitialTurnBase');
        if (this.countPlayTurnBase > 2) {
            this.countPlayTurnBase = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialTurnBase;
            this.showInterstitial();
            return true;
        } else {
            return false;
        }
    }

    playQuickPlay() {
        this.countPlayQuickPlay++;
    }
    showInterstitialQuickPlay() {
        if (this.countPlayQuickPlay > 1) {
            this.countPlayQuickPlay = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialQuickPlay;
            this.showInterstitial();
            return true;
        } else {
            return false;
        }
    }

    playCreateRoom() {
        this.countPlayCreateRoom++;
    }
    showInterstitialCreateRoom() {
        if (this.countPlayCreateRoom > 1) {
            this.countPlayCreateRoom = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialCreateRoom;
            this.showInterstitial();

            return true;
        } else {
            return false;
        }
    }

    playEventMode() {
        this.countEventMode++;
    }
    showInterstitialEventMode() {
        if (this.countEventMode > 0) {
            this.countEventMode = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialEventMode;
            this.showInterstitial();
            return true;
        } else {
            return false;
        }
    }

    gameoverSoloMode() {
        this.countGameOverSoloMode++;
    }
    showInterstitialGameOverSoloMode() {
        if (this.countGameOverSoloMode > 5) {
            this.countGameOverSoloMode = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialSoloModeGameOver;
            this.showInterstitial();
            return true;
        } else {
            return false;
        }
    }

    showInterstitialDoneSoloMode() {
        this.strEvent = FaceBookCheckingTools.InterstitialDoneSoloMode;
        this.showInterstitial();
    }

    winAndTakeRewarkSoloMode() {
        this.countWinAndTakeRewardSoloMode++;
    }
    showInterstitialWinTakeRewarkSoloMode() {
        if (this.countWinAndTakeRewardSoloMode > 0) {
            this.countWinAndTakeRewardSoloMode = 0;
            this.strEvent = FaceBookCheckingTools.InterstitialSoloModeWin;
            this.showInterstitial();

            return true;
        } else {
            return false;
        }
    }

    questTakeReward() {
        this.countTakeReward++;
    }
    showInterstitialQuestTakereward() {
        /*
        if (this.countTakeReward > 0) {
            this.countTakeReward = 0;
            this.showInterstitial();
            this.strEvent = FaceBookCheckingTools.InterstitialQuest;
            return true;
        } else {
            return false;
        }*/
        return false;
    }

    achievementTakeReward() {
        this.countTakeAchievementReward++;
    }
    showInterstitialachievementTakeReward() {
        if (this.countTakeAchievementReward > 0) {
            this.countTakeAchievementReward = 0;
            this.showInterstitial();
            this.strEvent = FaceBookCheckingTools.InterstitialAchievement;
            return true;
        } else {
            return false;
        }
    }

    ///Reward Video ads

    showRewardVideoInappPurchase(type) {
        let placementName = "DefaultRewardedVideo";
        if (type === "HEART") {
            placementName = "IAP_Heart";
            this.strEvent = FaceBookCheckingTools.RewardVideoInappHeart;
        } else if (type === "SUPPORT_ITEM") {
            this.strEvent = FaceBookCheckingTools.RewardVideoInappSupportItem;
        } else if (type === "DIAMOND") {
            placementName = "IAP_Diamonds";
            this.strEvent = FaceBookCheckingTools.RewardVideoInappDiamond;
        } else if (type === "TICKET") {
            placementName = "IAP_Ticket";
            this.strEvent = FaceBookCheckingTools.RewardVideoInappTicket;
        }
        this.showRewardVideoAd(placementName);
    }
    showRewardVideoX2Daily() {
        this.strEvent = FaceBookCheckingTools.RewardVideoX2DailyReward;
        this.showRewardVideoAd("x2_daily_reward");
    }
    showRewardVideoTakeHeartSoloMode() {
        this.strEvent = FaceBookCheckingTools.RewardVideoGetHeartInSoloMode;
        this.showRewardVideoAd();
    }
    showRewardVideoX2DiamondSoloMode() {
        this.strEvent = FaceBookCheckingTools.RewardVideoX2DiamondButtonSoloMode;
        this.showRewardVideoAd("x2_solo_mode_reward");
    }
    showRewardVideoLuckyWheel() {
        this.strEvent = FaceBookCheckingTools.RewardVideoLuckyWheel;
        this.showRewardVideoAd();
    }

    ///Banner ads
    showBanerQuestScreen() {

    }
    showBanerEventRoomScreen() {

    }
    showBanerUserProfileScreen() {

    }
    showBanerViewAllFriendScreen() {

    }
    showBanerInfoSongScreen() {

    }
    showBanerPartyModeScreen() {
        this.strEvent = FaceBookCheckingTools.BannerPartyMode
        this.showBanner();
    }
    showBanerQuickPlayModeRoomScreen() {
        this.strEvent = FaceBookCheckingTools.BannerQuickPlayModeRoom;
        this.showBanner();
    }
    showBanerChooseBettingQuickPlayScreen() {
        this.strEvent = FaceBookCheckingTools.BannerChooseBettingQuickPlay;
        this.showBanner();
    }
    showBanerWaitingRoomQuickPlayScreen() {
        this.strEvent = FaceBookCheckingTools.BannerWaitingRoomQuickPlayScreen;
        this.showBanner();
    }
    showBanerChoosePlaylistquickPlayScreen() {

    }
    showBanerChooseBettingCreateRoomScreen() {
        this.strEvent = FaceBookCheckingTools.BannerChooseBettingCreateRoom;
        this.showBanner();
    }
    showBanerChoosePlaylistCreateRoomScreen() {

    }
    showBanerInviteOtherUserWaitingScreen() {

    }

    loadRewardVideoAd() {
        if (this.existAds === true) {
            IronSourceAds.hasRewardedVideo({
                onSuccess: (available) => {
                    console.log("onSuccess : " + available);
                },
                onFailure: (error) => {
                    console.log("onFailure");
                    console.log(error);
                }
            });
        }
    }

    showRewardVideoAd(placementName = "DefaultRewardedVideo") {
        if (this.existAds === true) {
            console.log("this.ktLoadAdsReward : " + this.ktLoadAdsReward);
            //this.ktLoadAdsReward = true;
            if (this.ktLoadAdsReward === true) {
                ControllLoading.instance().showLoading();
                AdMob.showRewardVideoAd();
            } else {
                ControllScreenDialog.instance().addDialog("Chưa có video");
                this.event.rewardedVideoFailed.dispatch();
                ControllLoading.instance().hideLoading();
            }
        }
    }

    showInterstitial(placementName = "DefaultInterstitial") {
        if (this.existAds === true) {
            if (SocketController.instance().dataMySeft.vip === true) {
                this.event.interstitialFailedToLoad.dispatch();
            } else {
                console.log("this.ktLoadAds : " + this.ktLoadAds);
                if (this.ktLoadAds === true) {
                    ControllLoading.instance().showLoading();
                    AdMob.showInterstitial();
                } else {
                    this.event.interstitialFailedToLoad.dispatch();
                }
            }
        }
    }

    showBanner() {
        if (this.existAds === true) {

        }
    }
    hideBanner() {
        if (this.existAds === true) {

        }
    }

}