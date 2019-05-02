export default class AdmodClient {
    constructor() {
        this.countPlayTurnBase = 0;
        this.countPlayQuickPlay = 0;
        this.countPlayCreateRoom = 0;
        this.countGameOverSoloMode = 0;
        this.countWinAndTakeRewardSoloMode = 0;
        this.countTakeReward = 0;
        this.countTakeAchievementReward = 0;

        this.event = {
            onAdPresent: new Phaser.Signal(),
            onAdDismiss: new Phaser.Signal(),
            onAdLeaveApp: new Phaser.Signal(),
            onAdLoaded: new Phaser.Signal(),
            onAdFailLoad: new Phaser.Signal()
        }


        // ca-app-pub-7806638519709442/2457978580 - facebook
        // ca-app-pub-7806638519709442/5254244813 - non fb
        AdMob.createBanner({
            adId: "ca-app-pub-7806638519709442/2457978580",
            license: "dungdt@gmail.com/e27c7fbaee62a3c874560b7a5b2e80df",
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow: false,
            isTesting: true,
            overlap: true,
            offsetTopBar: false,
            bgColor: 'black'
        });

        // ca-app-pub-7806638519709442/5460666003 - facebook
        // ca-app-pub-7806638519709442/6730978014 - non fb

        AdMob.prepareInterstitial({
            adId: "ca-app-pub-7806638519709442/5460666003",
            license: "dungdt@gmail.com/e27c7fbaee62a3c874560b7a5b2e80df",
            autoShow: false,
            isTesting: true
        });


        // ca-app-pub-7806638519709442/8964796747 - facebook
        // ca-app-pub-7806638519709442/5107234799 - non fb
        AdMob.prepareRewardVideoAd({
            adId: "ca-app-pub-7806638519709442/8964796747",
            license: "dungdt@gmail.com/e27c7fbaee62a3c874560b7a5b2e80df",
            autoShow: false,
            isTesting: true
        });

        document.addEventListener("onAdLoaded", (e) => {
            //load ads thanh cong
            LogConsole.log("onAdLoaded");
            LogConsole.log(e);


        });

        document.addEventListener("onAdFailLoad", (e) => {
            //load ads loi
            LogConsole.log("onAdFailLoad");
            LogConsole.log(e);

            this.event.onAdFailLoad.dispatch(e);
        });

        document.addEventListener("onAdPresent", (e) => {
            //ads show tren man hinh
            LogConsole.log("onAdPresent");
            LogConsole.log(e);

            this.event.onAdPresent.dispatch(e);
        });

        document.addEventListener("onAdDismiss", (e) => {
            // nguoi choi tat ads
            LogConsole.log("onAdDismiss");
            LogConsole.log(e);

            this.event.onAdDismiss.dispatch(e);
        });

        document.addEventListener("onAdLeaveApp", (e) => {
            // nguoi choi click ads
            LogConsole.log("onAdLeaveApp");
            LogConsole.log(e);
            this.event.onAdLeaveApp.dispatch(e);
        });
    }
    static instance() {
        if (this.admod) {

        } else {
            this.admod = new AdmodClient();
        }

        return this.admod;
    }

    ///Interstitial ads
    playTurnBase() {
        this.countPlayTurnBase++;
    }
    showInterstitialTurnBase() {
        if (this.countPlayTurnBase > 4) {
            this.countPlayTurnBase = 0;
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
        if (this.countPlayQuickPlay > 2) {
            this.countPlayQuickPlay = 0;
            this.showInterstitial();
            return true;
        } else {
            return false
        }
    }

    playCreateRoom() {
        this.countPlayCreateRoom++;
    }
    showInterstitialCreateRoom() {
        if (this.countPlayCreateRoom > 2) {
            this.countPlayCreateRoom = 0;
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
        if (this.countGameOverSoloMode > 4) {
            this.countGameOverSoloMode = 0;
            this.showInterstitial();

            return true;
        } else {
            return false
        }
    }

    winAndTakeRewarkSoloMode() {
        this.countWinAndTakeRewardSoloMode++;
    }
    showInterstitialWinTakeRewarkSoloMode() {
        if (this.countWinAndTakeRewardSoloMode > 0) {
            this.countWinAndTakeRewardSoloMode = 0;
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
        if (this.countTakeReward > 0) {
            this.countTakeReward = 0;
            this.showInterstitial();

            return true;
        } else {
            return false;
        }
    }

    achievementTakeReward() {
        this.countTakeAchievementReward++;
    }
    showInterstitialachievementTakeReward() {
        if (this.countTakeAchievementReward > 0) {
            this.countTakeAchievementReward = 0;
            this.showInterstitial();
            return true;
        } else {
            return false;
        }
    }

    ///Reward Video ads

    showRewardVideoInappPurchase() {
        this.showRewardVideoAd();
    }
    showRewardVideoX2Daily() {
        this.showRewardVideoAd();
    }
    showRewardVideoTakeHeartSoloMode() {
        this.showRewardVideoAd();
    }
    showRewardVideoX2DiamondSoloMode() {
        this.showRewardVideoAd();
    }
    showRewardVideoLuckyWheel() {
        this.showRewardVideoAd();
    }

    ///Banner ads
    showBanerQuestScreen() {
        this.showBanner();
    }
    showBanerEventRoomScreen() {
        this.showBanner();
    }
    showBanerUserProfileScreen() {
        this.showBanner();
    }
    showBanerViewAllFriendScreen() {
        this.showBanner();
    }
    showBanerInfoSongScreen() {
        this.showBanner();
    }
    showBanerPartyModeScreen() {
        this.showBanner();
    }
    showBanerQuickPlayModeRoomScreen() {
        this.showBanner();
    }
    showBanerChooseBettingQuickPlayScreen() {
        this.showBanner();
    }
    showBanerWaitingRoomQuickPlayScreen() {
        this.showBanner();
    }
    showBanerChoosePlaylistquickPlayScreen() {
        this.showBanner();
    }
    showBanerChooseBettingCreateRoomScreen() {
        this.showBanner();
    }
    showBanerChoosePlaylistCreateRoomScreen() {
        this.showBanner();
    }
    showBanerInviteOtherUserWaitingScreen() {
        this.showBanner();
    }


    showBanner(adId = "") {
        if (AdMob) {
            if (adId !== "") {
                AdMob.removeBanner()

                AdMob.createBanner({
                    adId: admobid.banner,
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    adId: "ca-app-pub-7806638519709442/5254244813",
                    license: "dungdt@gmail.com/e27c7fbaee62a3c874560b7a5b2e80df",
                    autoShow: false,
                    isTesting: true,
                    overlap: true,
                    offsetTopBar: false,
                    bgColor: 'black',
                    success: () => {
                        AdMob.showBanner();
                    },
                    error: () => {
                        console.log("tao banner loi");
                    }
                });
            } else {
                AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
            }

        }
    }

    hideBanner() {
        if (AdMob) {
            AdMob.hideBanner();
        }
    }


    showInterstitial(adId = "") {
        if (AdMob) {
            if (adId !== "") {
                AdMob.prepareInterstitial({ adId: adId, autoShow: false });
                AdMob.isInterstitialReady((isready) => {
                    if (isready) AdMob.showInterstitial();
                });
            } else {
                AdMob.showInterstitial();
            }
        }
    }

    showRewardVideoAd(adId = "") {
        if (AdMob) {

            if (adId !== "") {
                AdMob.prepareRewardVideoAd({ adId: adId, autoShow: false },
                    () => {
                        AdMob.showRewardVideoAd();
                    },
                    () => { }
                );
            } else {
                AdMob.showRewardVideoAd();
            }

        }
    }
}