import SocketController from "./controller/SocketController.js";
import DataCommand from "./model/DataCommand.js";
import SendFbUserInvite from "./model/server/senddata/SendFbUserInvite.js";
import MainData from "./model/MainData.js";

export default class FacebookMobile {
    constructor() {
        this.event = {
            loginComplete: new Phaser.Signal(),
            loginError: new Phaser.Signal(),
            logoutDone: new Phaser.Signal(),
            logoutErr: new Phaser.Signal(),
            loginStatusUnknown: new Phaser.Signal()
        }
    }

    static instance() {
        if (this.fbMobile) {

        } else {
            this.fbMobile = new FacebookMobile();
        }

        return this.fbMobile;
    }

    init() {
        facebookConnectPlugin.getLoginStatus(this.getLoginStatusSuccess.bind(this), this.getLoginStatusFail.bind(this))
    }

    getLoginStatusSuccess(data) {
        console.log('getLoginStatus succeed, statua written in log');
        console.log(data);
        if (data.status === "connected") {
            MainData.instance().LOG_IN_BY_FB = true;
            this.onLoginSuccess(data);
        } else if (data.status === "unknown") {
            this.event.loginStatusUnknown.dispatch();
        }
    }

    login() {
        facebookConnectPlugin.login(['public_profile', 'email', 'user_gender', 'user_friends'], this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
    }

    logout(callback) {
        facebookConnectPlugin.logout((success) => {
            MainData.instance().LOG_IN_BY_FB = false;
            let status = "";
            if (success == "OK") {
                status = "unknown";
            }
            callback({
                status: status
            });
        }, (failure) => {
            console.log('logout fail!');
            console.log(failure);
            callback(failure);
        });
    }

    getLoginStatusFail(error) {
        console.log('getLoginStatus fail, error written in log');
        console.log(error);
    }

    onLoginSuccess(userData) {
        console.log('login succeed, userData written in log');
        console.log(userData);
        this.event.loginComplete.dispatch(userData.authResponse);
    }
    onLoginError(error) {
        console.log('login fail, error written in log');
        console.log(error);
        this.event.loginError.dispatch();
    }

    logEvent(event, valueToSum = 1) {
        facebookConnectPlugin.logEvent(MainData.instance().platform + "_" + event, {}, valueToSum, this.onLogEventSuccess.bind(this), this.onLogEventError.bind(this));
    }

    onLogEventSuccess(data) {
        console.log('onLogEventSuccess');
        console.log(data)
    }
    onLogEventError(error) {
        console.log('onLogEventError');
        console.log(error)
    }

    share() {


        let data = game.canvas.toDataURL("image/png");
        console.log("data image------------");
        console.log(data);

        let options = {
            message: 'Wazzat so tài âm nhạc', // not supported on some apps (Facebook, Instagram)
            subject: 'Wazzat', // fi. for email
            files: [data]
        };

        // an array of filenames either locally or remotely
        // url: 'https://wazzat.vn/game/index.php'

        window.plugins.socialsharing.shareWithOptions(
            options,
            (evt) => {
                console.log('share ok');
                console.log(evt);
                SocketController.instance().sendData(DataCommand.FB_USER_SHARED_RESULT_REQUEST, null);
            },
            (errormsg) => {
                console.log('share fail');
                console.log(errormsg);
            });

        /*
        let options = {
            method: "send",
            caption: "So Tài Âm Nhạc",
            link: "C:\Users\Yan Digital\Pictures\Feedback\{0BB9A26D-385E-439D-8449-E76A861EF47F}\Capture001.png",
            description: "So Tài Âm Nhạc",
            picture: "C:\Users\Yan Digital\Pictures\Feedback\{0BB9A26D-385E-439D-8449-E76A861EF47F}\Capture001.png",
            image: "C:\Users\Yan Digital\Pictures\Feedback\{0BB9A26D-385E-439D-8449-E76A861EF47F}\Capture001.png"
        }

        facebookConnectPlugin.showDialog(options, this.shareSuccess.bind(this), this.shareError.bind(this))*/
    }

    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }

    shareSuccess(result) {
        console.log('showDialog success, data written in log');
        console.log(result);
        SocketController.instance().sendData(DataCommand.FB_USER_SHARED_RESULT_REQUEST, null);
    }

    shareError(error) {
        console.log('showDialog fail, error written in log');
        console.log(error);
    }

    invite() {
        console.log("invite");
        let options = {
            method: "apprequests",
            message: "So Tài Âm Nhạc",
            data: {},
            title: "So Tài Âm Nhạc",
            actionType: 'askfor',
            filters: 'app_non_users'
        }
        facebookConnectPlugin.showDialog(options, this.inviteSuccess.bind(this), this.inviteError.bind(this))
    }
    inviteSuccess(result) {
        console.log('inviteSuccess success, data written in log');
        console.log(result);
        if (typeof result === "object") {
            if (result.hasOwnProperty("requestId")) {
                SocketController.instance().sendData(DataCommand.FB_USER_INVITE_FRIEND_REQUEST, SendFbUserInvite.begin(result.requestId, result.recipientsIds));
            }
        }
    }
    inviteError(error) {
        console.log('inviteError fail, error written in log');
        console.log(error);
    }
}