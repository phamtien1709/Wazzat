import ControllSoundFx from "../../controller/ControllSoundFx.js";
import ListView from "../../../libs/listview/list_view.js";
import ItemSettingMain from "./items/ItemSettingMain.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import MainData from "../../model/MainData.js";
import TextBase from "../component/TextBase.js";
import SocketController from "../../controller/SocketController.js";
import FacebookAction from "../../common/FacebookAction.js";
import ControllLoading from "../ControllLoading.js";
import FacebookMobile from "../../FacebookMobile.js";
import ControllDialog from "../ControllDialog.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import EventGame from "../../controller/EventGame.js";
import Language from "../../model/Language.js";

export default class SetttingScreen extends Phaser.Sprite {
    constructor() {
        super(game, 0, 0, 'bg-playlist');
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.signalInputX = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.addHeaderTab(this.positionSetting.header);
        this.addListSetting();
        this.addEventExtension();
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_setting);
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerTab.addChild(this.btnBack);
    }

    onBack() {
        //console.log('HERE HERE HERE');
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInputX.dispatch();
        let tween = game.add.tween(this).to({ x: 640 * window.GameConfig.RESIZE }, 200, "Linear", false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
    }

    addTxtSetting(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("288"), configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addListSetting() {
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 109 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0 * window.GameConfig.RESIZE, 0, 640 * window.GameConfig.RESIZE, (game.height - 130) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        //
        this.settingGame;
        this.settingAccount;
        this.settingProfile;
        this.settingNoti;
        this.settingSecret;
        this.settingLanguage;
        this.settingTerms;
        this.settingFollow;
        this.reportBug;
        this.giftCode;
        this.synsFB;
        //
        this.addSettingGame();
        this.addSettingAccount();
        this.addSettingProfile();
        // this.addGiftCode();
        this.addSynsFB();
        this.addSettingNoti();
        this.addSettingSecret();
        this.addSettingLanguage();
        this.addSettingTerms();
        this.addSettingFollow();
        this.addReportBug();
        this.addVersionPlatform();
        if (MainData.instance().tokenYanAccount == "") {
            this.addBtnLogout();
        }
        //
        // AjaxServerMail.instance().settingAccount(2, "Dep Trai", "Male", "https://graph.facebook.com/1203887379751469/picture?type=square&width=200&height=200");
        // AjaxServerMail.instance().sendData(this.onSendSettingDone.bind(this));
    }

    addSettingGame() {
        this.settingGame = new ItemSettingMain();
        this.settingGame.addType(ItemSettingMain.SETTING_GAME);
        this.settingGame.event.chooseSetting.add(this.chooseSetting, this);
        this.settingGame.addNameSetting(Language.instance().getData("276"));
        this.settingGame.addButtonRight();
        this.listView.add(this.settingGame);
    }

    addSettingAccount() {
        this.settingAccount = new ItemSettingMain();
        this.settingAccount.addType(ItemSettingMain.SETTING_ACCOUNT);
        this.settingAccount.event.chooseSetting.add(this.chooseSetting, this);
        this.settingAccount.addNameSetting(Language.instance().getData("277"));
        this.settingAccount.addButtonRight();
        this.listView.add(this.settingAccount);
    }

    addSettingProfile() {
        this.settingProfile = new ItemSettingMain();
        this.settingProfile.addType(ItemSettingMain.SETTING_PROFILE);
        this.settingProfile.event.chooseSetting.add(this.chooseSetting, this);
        this.settingProfile.addNameSetting(Language.instance().getData("278"));
        this.settingProfile.addButtonRight();
        // this.settingProfile.setDisactive();
        this.listView.add(this.settingProfile);
    }

    addSettingNoti() {
        this.settingNoti = new ItemSettingMain();
        this.settingNoti.addType(ItemSettingMain.SETTING_NOTI);
        this.settingNoti.event.chooseSetting.add(this.chooseSetting, this);
        this.settingNoti.addNameSetting(Language.instance().getData("279"));
        this.settingNoti.addButtonRight();
        this.settingNoti.setDisactive();
        this.listView.add(this.settingNoti);
    }

    addSettingSecret() {
        this.settingSecret = new ItemSettingMain();
        this.settingSecret.addType(ItemSettingMain.SETTING_SECRET);
        this.settingSecret.event.chooseSetting.add(this.chooseSetting, this);
        this.settingSecret.addNameSetting(Language.instance().getData("280"));
        this.settingSecret.addButtonRight();
        this.settingSecret.setDisactive();
        this.listView.add(this.settingSecret);
    }

    addSettingLanguage() {
        this.settingLanguage = new ItemSettingMain();
        this.settingLanguage.addType(ItemSettingMain.SETTING_LANGUAGE);
        this.settingLanguage.event.chooseSetting.add(this.chooseSetting, this);
        this.settingLanguage.addNameSetting(Language.instance().getData("281"));
        this.settingLanguage.addLanguage();
        this.settingLanguage.addButtonRight();
        this.settingLanguage.setDisactive();
        this.listView.add(this.settingLanguage);
    }

    addSettingTerms() {
        this.settingTerms = new ItemSettingMain();
        this.settingTerms.addType(ItemSettingMain.SETTING_TERMS);
        this.settingTerms.event.chooseSetting.add(this.chooseSetting, this);
        this.settingTerms.addNameSetting(Language.instance().getData("282"));
        this.settingTerms.addButtonRight();
        this.settingTerms.setDisactive();
        this.listView.add(this.settingTerms);
    }

    addSettingFollow() {
        this.settingFollow = new ItemSettingMain();
        this.settingFollow.addType(ItemSettingMain.SETTING_FOLLOW);
        this.settingFollow.event.chooseSetting.add(this.chooseSetting, this);
        this.settingFollow.addNameSetting(Language.instance().getData("283"));
        // this.settingFollow.addButtonRight();
        this.settingFollow.addFacebookIcon();
        this.settingFollow.addInstagramIcon();
        // this.settingFollow.setDisactive();
        this.listView.add(this.settingFollow);
    }

    addReportBug() {
        this.reportBug = new ItemSettingMain();
        this.reportBug.addType(ItemSettingMain.REPORT_BUG);
        this.reportBug.event.chooseSetting.add(this.chooseSetting, this);
        this.reportBug.addNameSetting(Language.instance().getData("284"));
        this.reportBug.addButtonRight();
        this.reportBug.setDisactive();
        this.listView.add(this.reportBug);
    }

    addGiftCode() {
        this.giftCode = new ItemSettingMain();
        this.giftCode.addType(ItemSettingMain.GIFT_CODE);
        this.giftCode.event.chooseSetting.add(this.chooseSetting, this);
        this.giftCode.addNameSetting(Language.instance().getData("285"));
        this.giftCode.addButtonRight();
        this.listView.add(this.giftCode);
    }

    addSynsFB() {
        this.synsFB = new ItemSettingMain();
        this.synsFB.addType(ItemSettingMain.SYNS_FB);
        this.synsFB.event.chooseSetting.add(this.chooseSetting, this);
        this.synsFB.addNameSetting(Language.instance().getData("286"));
        this.synsFB.addButtonRight();
        this.listView.add(this.synsFB);
    }

    addVersionPlatform() {
        this.versionPlatform = new ItemSettingMain();
        this.versionPlatform.addType(ItemSettingMain.VERSION_PLATFORM);
        this.versionPlatform.event.chooseSetting.add(this.chooseSetting, this);
        this.versionPlatform.addNameSetting(Language.instance().getData("287"));
        this.versionPlatform.addVersion();
        this.versionPlatform.setDisactive();
        this.listView.add(this.versionPlatform);
    }

    chooseSetting(type) {
        // console.log(type);
        switch (type) {
            case ItemSettingMain.SETTING_GAME:
                ControllScreenDialog.instance().addSettingGameScreen();
                break;
            case ItemSettingMain.SETTING_ACCOUNT:
                ControllScreenDialog.instance().addSettingAccountScreen();
                break;
            case ItemSettingMain.SETTING_PROFILE:
                ControllScreenDialog.instance().addSettingProfileScreen();
                break;
            case ItemSettingMain.GIFT_CODE:
                ControllScreenDialog.instance().addSettingGiftcode();
                break;
            case ItemSettingMain.SYNS_FB:
                this.synsWithFacebook();
                break;
        }
    }

    addBtnLogout() {
        this.btnLogout = new Phaser.Button(game, this.positionSetting.btn_logout.x, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionSetting.btn_logout.y), this.positionSetting.btn_logout.nameAtlas, this.onClickLogout, this, null, this.positionSetting.btn_logout.nameSprite);
        this.btnLogout.anchor.set(0.5, 0);
        let txtLogout = new TextBase(this.positionSetting.txt_logout, Language.instance().getData("303"));
        txtLogout.anchor.set(0.5);
        this.btnLogout.addChild(txtLogout);
        this.listView.add(this.btnLogout);
    }
    onClickLogout() {
        if (MainData.instance().LOG_IN_BY_FB == true) {
            // console.log('LOG_IN_BY_FBLOG_IN_BY_FB');
            FacebookAction.instance().logout((response) => {
                // console.log('onClickLogoutonClickLogoutonClickLogout');
                // console.log(response);
                if (response.status == "unknown") {
                    MainData.instance().LOG_IN_BY_FB = false;
                    SocketController.instance().sendLogout();
                }
            });
        } else {
            SocketController.instance().sendLogout();
        }
    }

    synsWithFacebook() {
        if (MainData.instance().LOG_IN_BY_FB !== true) {
            ControllLoading.instance().showLoading();
            // console.log("Let's syns FB" + MainData.instance().platform);
            if (MainData.instance().platform !== "web") {
                // checkLoginState()
                FacebookMobile.instance().login();
                ControllLoading.instance().showLoading();
            } else {
                FB.login(function (response) {
                    if (response.status == 'unknown') {
                        alert("Đăng nhập lỗi, hãy đăng nhập lại! :'(");
                    }
                    if (response.status == 'connected') {
                        let authResponse = response.authResponse;
                        //
                        let data = {
                            userId: SocketController.instance().dataMySeft.user_id,
                            fbId: authResponse.userID,
                            accessToken: authResponse.accessToken
                        }
                        $.ajax({
                            type: "POST",
                            url: window.RESOURCE.fb_sync_api,
                            data: data,
                            dataType: "json",
                            success: function (response) {
                                if (response.status == "Failed") {
                                    ControllDialog.instance().addDialog(response.message);
                                } else if (response.status == "OK") {
                                    ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
                                    ControllScreenDialog.instance().removeAllItem();
                                    ControllDialog.instance().removeAllItem();
                                }
                            },
                            error: function () {
                                ControllDialog.instance().addDialog('Liên kết bị lỗi');
                            }
                        });
                        // this.onLoginSuccess(response);
                        // console.log(authResponse);
                        // console.log(window.RESOURCE);
                        // ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
                    }
                }, {
                        scope: 'email, user_gender, user_friends'
                    });
            }
        } else {
            // LogConsole.log("It's already login FB");
            ControllDialog.instance().addDialog("It's already login FB!");
        }
    }

    addEventExtension() {
        FacebookMobile.instance().event.loginComplete.add(this.loginFbMobileComplete, this);
        EventGame.instance().event.backButton.add(this.onBack, this);
    }

    removeEventExtension() {
        FacebookMobile.instance().event.loginComplete.remove(this.loginFbMobileComplete, this);
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }

    loginFbMobileComplete(authResponse) {
        // console.log('loginFbMobileCompleteloginFbMobileComplete');
        // console.log(authResponse);
        //
        let data = {
            userId: SocketController.instance().dataMySeft.user_id,
            fbId: authResponse.userID,
            accessToken: authResponse.accessToken
        }
        $.ajax({
            type: "POST",
            url: window.RESOURCE.fb_sync_api,
            data: data,
            dataType: "json",
            success: function (response) {
                if (response.status == "Failed") {
                    ControllDialog.instance().addDialog(response.message);
                } else if (response.status == "OK") {
                    ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
                    ControllScreenDialog.instance().removeAllItem();
                    ControllDialog.instance().removeAllItem();
                }
            }
        });
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