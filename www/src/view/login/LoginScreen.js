import MainData from "../../model/MainData.js";
import FacebookMobile from "../../FacebookMobile.js";
import SocketController from "../../controller/SocketController.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import EventGame from "../../controller/EventGame.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import ControllLoading from "../ControllLoading.js";
import ConfigPlatform from "../../config/ConfigPlatform.js";
import ControllDialog from "../ControllDialog.js";
import Common from "../../common/Common.js";
import PlayingLogic from "../../controller/PlayingLogic.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import ScreenLoading from "../../modules/loading/ScreenLoading.js";
import TetTheme from "../../modules/loading/TetTheme.js";
import SqlLiteController from "../../SqlLiteController.js";
import Language from "../../model/Language.js";
import BaseGroup from "../BaseGroup.js";
export default class LoginScreen extends BaseGroup {
    constructor() {
        super(game);
        this.positionBootConfig = JSON.parse(game.cache.getText('positionBootConfig'));
        this.afterInit();
    }

    afterInit() {
        let dance = new ScreenLoading();
        this.addChild(dance);
        this.addLogoSprite();
        //
        var hasInternet = false;
        ControllLoading.instance().hideLoading();
        Common.getGame((response) => {
            LogConsole.log("success--------");
            LogConsole.log(response);
            LogConsole.log(response.resource);
            if (response.resource !== undefined) {
                hasInternet = true;
                clearInterval(interval);
                this.definedGame(response);
            } else {
                ControllLoading.instance().hideLoading();
                // alert('Your Internet is Disconnected! Please restart app!');
                ControllScreenDialog.instance().addDialog('Kiểm tra kết nối của bạn trước khi vào game');
            }
        })
        ControllLoading.instance().showLoading();
        var interval = setInterval(() => {
            Common.getGame((response) => {
                LogConsole.log("success--------");
                LogConsole.log(response);
                LogConsole.log(response.resource);
                if (response.resource !== undefined) {
                    hasInternet = true;
                    clearInterval(interval);
                    ControllLoading.instance().hideLoading();
                    this.definedGame(response);
                } else {
                    ControllLoading.instance().hideLoading();
                    ControllScreenDialog.instance().addDialog('Kiểm tra kết nối của bạn trước khi vào game');
                }
            })
        }, 5000);
    }

    addThemeTET() {
        var themeTET = new TetTheme();
        this.addChild(themeTET);
    }

    definedGame(response) {
        MainData.instance().isRefreshMenu.checking = false;
        MainData.instance().menuLoadResponses = null;
        //

        if (response.resource.hasOwnProperty("language")) {
            Language.instance().changeDataLanguage(response.resource.language);
        } else {
            Language.instance().changeDataLanguage("vn");
        }

        let versionClient = 0;
        let versionServer = 0;
        if (MainData.instance().platform === "and") {
            versionClient = PlayingLogic.instance().convertVersionToInt(MainData.VERSION_AND);
            if (response.resource.hasOwnProperty("android_version")) {
                versionServer = PlayingLogic.instance().convertVersionToInt(response.resource.android_version);
            } else {
                versionServer = PlayingLogic.instance().convertVersionToInt(MainData.VERSION_AND);
            }

        } else if (MainData.instance().platform === "ios") {
            versionClient = PlayingLogic.instance().convertVersionToInt(MainData.VERSION_IOS);
            if (response.resource.hasOwnProperty("ios_version")) {
                versionServer = PlayingLogic.instance().convertVersionToInt(response.resource.ios_version);
            } else {
                versionServer = PlayingLogic.instance().convertVersionToInt(MainData.VERSION_IOS);
            }
        }


        if (versionClient < versionServer) {
            MainData.instance().ktUpdate = true;
        }

        window.RESOURCE = Object.assign({}, window.RESOURCE, response.resource);

        if (MainData.instance().ktUpdate) {
            if (MainData.instance().platform === "and") {
                ControllScreenDialog.instance().addDialog(Language.instance().getData("322"), window.RESOURCE.android_storage_link, Language.instance().getData("323"));

            } else if (MainData.instance().platform === "ios") {
                ControllScreenDialog.instance().addDialog(Language.instance().getData("322"), window.RESOURCE.ios_storage_link, Language.instance().getData("323"));
            }
            ControllLoading.instance().hideLoading();
        } else {
            EventGame.instance().event.onConnectServer.add(this.onConnectServer, this);
            if (window.isTest) {
                if (window.cordova && typeof device !== 'undefined') {
                    FacebookMobile.instance().init();
                    FacebookMobile.instance().event.loginComplete.add(this.loginFbMobileComplete, this);
                    FacebookMobile.instance().event.loginStatusUnknown.add(this.loginStatusUnknown, this);
                    FacebookMobile.instance().event.loginError.add(this.loginErrorFbMobileComplete, this);
                } else {
                    this.initFaceBook(() => {
                        //
                        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.LoginScreen);
                        //
                        checkLoginState((isConnectedFB, fbId, accessToken) => {
                            //
                            ControllLoading.instance().hideLoading();
                            /**
                             * When check Login Facebook return success, get 3 value isConnectedFB, 
                             * fbId, accessToken to transmission to func getServerInfomationAjax()
                             */
                            if (isConnectedFB == true && fbId != null && accessToken != null) {
                                MainData.instance().LOG_IN_BY_FB = true;
                                ControllLoading.instance().showLoading();
                                this.getServerInfomationAjax(fbId, accessToken, (response) => {
                                    if (response.status == 'OK') {
                                        MainData.instance().response = response;
                                        MainData.instance().userId = response.userId;
                                        MainData.instance().token = response.token;
                                        MainData.instance().isNewUser = response.isNewUser;
                                        this.sfsInfo = response.sfs_info;
                                        this.initServer();
                                    } else if (response.status == "Failed") {
                                        ControllLoading.instance().hideLoading();
                                        ControllScreenDialog.instance().addDialog(response.message);
                                    } else {
                                        ControllDialog.instance().addPopupDisconnect();
                                        ControllDialog.instance().addDialog(Language.instance().getData("324"));
                                    }
                                });
                            } else {
                                //
                                this.addButtonFBLogin();
                                if (window.cordova && typeof device !== 'undefined') {
                                    this.addButtonPlayNow();
                                }
                                if (window.isTest === false) {
                                    this.addButtonPlayNow();
                                }
                            }
                        });
                    });
                }
            } else {
                ControllLoading.instance().hideLoading();
                this.addButtonPlayNow();
                //
            }
        }

    }

    loginErrorFbMobileComplete() {
        //
        ControllLoading.instance().hideLoading();
        this.addButtonFBLogin();
        if (window.cordova && typeof device !== 'undefined') {
            ControllDialog.instance().addPopupDisconnect();
            this.addButtonPlayNow();
        }
        if (window.isTest === false) {
            this.addButtonPlayNow();
        }
    }

    loginStatusUnknown() {
        this.addButtonFBLogin();
        this.addButtonPlayNow();
        ControllLoading.instance().hideLoading();
    }

    loginFbMobileComplete(responseLogin) {
        MainData.instance().LOG_IN_BY_FB = true;
        LogConsole.log(responseLogin);
        this.getServerInfomationAjax(responseLogin.userID, responseLogin.accessToken, (response) => {
            if (response.status == 'OK') {
                LogConsole.log(response);
                MainData.instance().response = response;
                MainData.instance().userId = response.userId;
                MainData.instance().token = response.token;
                MainData.instance().isNewUser = response.isNewUser;
                this.sfsInfo = response.sfs_info;
                this.initServer();
            } else if (response.status == "Failed") {
                ControllLoading.instance().hideLoading();
                ControllScreenDialog.instance().addDialog(response.message);
            } else {
                this.addButtonPlayNow();
                ControllDialog.instance().addPopupDisconnect();
                console.warn("Could not get login & sfs informations from webservice");
            }
        });
    }

    onConnectServer() {
        LogConsole.log('onConnectServeronConnectServer');
        // LogConsole.log(`${MainData.instance().userId} - ${MainData.instance().token}`);
        this.loginSFS(MainData.instance().userId, MainData.instance().token);
    }

    addButtonFBLogin() {
        if (Language.instance().currentLanguage == "en") {
            this.fbBtn = game.add.button(
                this.positionBootConfig.btn_fb_en.x * window.GameConfig.RESIZE,
                (game.height - MainData.instance().STANDARD_HEIGHT + this.positionBootConfig.btn_fb_en.y) * window.GameConfig.RESIZE,
                this.positionBootConfig.btn_fb_en.nameAtlas,
                this.onclickFBLoginBt,
                this,
                null,
                this.positionBootConfig.btn_fb_en.nameSprite
            );
            this.fbBtn.anchor.set(0.5);
            this.fbBtn.scale.set(0.9);
            this.addChild(this.fbBtn);
        } else {
            this.fbBtn = game.add.button(
                this.positionBootConfig.btn_fb.x * window.GameConfig.RESIZE,
                (game.height - MainData.instance().STANDARD_HEIGHT + this.positionBootConfig.btn_fb.y) * window.GameConfig.RESIZE,
                this.positionBootConfig.btn_fb.nameAtlas,
                this.onclickFBLoginBt,
                this,
                null,
                this.positionBootConfig.btn_fb.nameSprite
            );
            this.fbBtn.anchor.set(0.5);
            this.fbBtn.scale.set(0.9);
            this.addChild(this.fbBtn);
        }
    }

    addButtonPlayNow() {
        if (Language.instance().currentLanguage == "en") {
            this.playNowBtn = game.add.button(
                this.positionBootConfig.btn_play_now_en.x * window.GameConfig.RESIZE,
                (game.height - MainData.instance().STANDARD_HEIGHT + this.positionBootConfig.btn_play_now_en.y) * window.GameConfig.RESIZE,
                this.positionBootConfig.btn_play_now_en.nameAtlas,
                this.onclickPlayNow,
                this,
                null,
                this.positionBootConfig.btn_play_now_en.nameSprite
            );
            this.playNowBtn.anchor.set(0.5);
            this.playNowBtn.scale.set(0.9);
            this.addChild(this.playNowBtn);
        } else {
            this.playNowBtn = game.add.button(
                this.positionBootConfig.btn_play_now.x * window.GameConfig.RESIZE,
                (game.height - MainData.instance().STANDARD_HEIGHT + this.positionBootConfig.btn_play_now.y) * window.GameConfig.RESIZE,
                this.positionBootConfig.btn_play_now.nameAtlas,
                this.onclickPlayNow,
                this,
                null,
                this.positionBootConfig.btn_play_now.nameSprite
            );
            this.playNowBtn.anchor.set(0.5);
            this.playNowBtn.scale.set(0.9);
            this.addChild(this.playNowBtn);
        }
    }

    onclickPlayNow() {
        // this.loginSFS();
        SocketController.instance().ktLogin = false;
        SocketController.instance().loginSFSByDevice((response) => {
            if (response.status == 'OK') {
                LogConsole.log(response);
                MainData.instance().response = response;
                MainData.instance().userId = response.userId;
                MainData.instance().token = response.token;
                MainData.instance().isNewUser = response.isNewUser;
                this.sfsInfo = response.sfs_info;
                // console.log('loginSFSByDevice');
                this.initServer();
            } else if (response.status == "Failed") {
                ControllLoading.instance().hideLoading();
                ControllScreenDialog.instance().addDialog(response.message);
            } else {
                ControllDialog.instance().addPopupDisconnect();
                console.warn("Could not get login & sfs informations from webservice");
            }
        });
    }

    onclickFBLoginBt() {
        SocketController.instance().ktLogin = false;
        // LogConsole.log('fb login');
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Login_buttons);

        if (window.cordova && typeof device !== 'undefined') {
            FacebookMobile.instance().login();
            ControllLoading.instance().showLoading();
        } else {
            FB.login(function (response) {
                if (response.status == 'unknown') {
                    alert(Language.instance().getData("324"));
                }
                if (response.status == 'connected') {
                    ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
                }
            }, {
                    scope: 'email, user_gender, user_friends'
                });
        }
    }

    addLogoSprite() {
        let logo = game.add.sprite(
            this.positionBootConfig.logo.x * window.GameConfig.RESIZE,
            this.positionBootConfig.logo.y * window.GameConfig.RESIZE,
            `${this.positionBootConfig.logo.nameAtlas}`,
            `${this.positionBootConfig.logo.nameSprite}`
        );
        logo.anchor.set(0.5);
        this.addChild(logo);
    }

    loginSFS(userId, token) {
        SocketController.instance().loginSFS(userId, token);
    }

    initFaceBook(callback) {
        FB.init({
            appId: window.RESOURCE.fb_app,
            cookie: true,
            xfbml: true,
            version: 'v3.1'
        });
        callback();
    }

    /**
     *  Get response from server to get sfsInfo, userID and token in DB, 
     *  callback response to connect sfs and do more event.
     *   
     * @param {*} id : user ID FB
     * @param {*} accessToken : accessTokenFB
     * @param {*} callback : function when ajax success
     */
    getServerInfomationAjax(id, accessToken, callback) {
        var postData = {
            "fbId": id,
            "accessToken": accessToken,
            "device": ConfigPlatform.getNamePlatform()
        };
        $.ajax({
            url: window.RESOURCE.login_url,
            type: "POST",
            data: postData,
            dataType: "json",
            success: function (res) {
                // console.log(res);
                callback(res);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.error("Error get server infomation");
                console.error(thrownError);
                console.error(xhr.status);
                console.error(xhr.responseJSON);
                callback({ "status": "ERROR_LOGIN" });
            }
        })
    }

    initServer() {
        // Create configuration object
        let configServer = {
            host: "",
            port: 0,
            useSSL: 0,
            zone: "",
            debug: false
        };
        if (this.sfsInfo) {
            configServer.host = this.sfsInfo.sfs_host;
            configServer.port = this.sfsInfo.sfs_port;
            configServer.useSSL = this.sfsInfo.sfs_ssl;
            configServer.zone = this.sfsInfo.sfs_zone;
            configServer.debug = this.sfsInfo.sfs_debug;

            SqlLiteController.instance().zoneName = configServer.zone;
        }
        LogConsole.log(this.sfsInfo);
        SocketController.instance().initListenerSfs(configServer);
        //connect
        SocketController.instance().connect();
    }

    destroy() {
        EventGame.instance().event.onConnectServer.remove(this.onConnectServer, this);
        FacebookMobile.instance().event.loginComplete.remove(this.loginFbMobileComplete, this);
        FacebookMobile.instance().event.loginError.remove(this.loginErrorFbMobileComplete, this);
        FacebookMobile.instance().event.loginStatusUnknown.remove(this.loginStatusUnknown, this);
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