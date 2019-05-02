import SocketController from "../controller/SocketController.js";
import DataCommand from "../model/DataCommand.js";
import SendFbUserInvite from "../model/server/senddata/SendFbUserInvite.js";
import FacebookMobile from "../FacebookMobile.js";

export default class FacebookAction {
    constructor() {
        this.event = {
            share: new Phaser.Signal()
        };
    }
    static instance() {
        if (this.fbAction) {

        } else {
            this.fbAction = new FacebookAction();
        }

        return this.fbAction;
    }

    share() {
        // Dynamically gather and set the FB share data. 
        LogConsole.log("share------------------------------");
        // Open FB share popup
        if (window.cordova && typeof device !== 'undefined') {
            FacebookMobile.instance().share();
        } else {

            var FBDesc = 'So Tài Âm Nhạc';
            var FBTitle = 'So Tài Âm Nhạc';
            var FBLink = 'https://wazzat.vn/home/';
            var FBPic = "https://cdn.gamezoka.com/storage/assets/icon.png";

            //LogConsole.log(window.document.querySelector('canvas').toDataURL());

            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.shares',
                action_properties: JSON.stringify({
                    object: {
                        'og:url': FBLink,
                        'og:title': FBTitle,
                        'og:description': FBDesc,
                        'og:image': FBPic
                    }
                })
            },
                function (response) {
                    //FacebookAction.instance().event.share.dispatch(response);
                    // LogConsole.log(response);
                    // Action after response
                    if (response.hasOwnProperty("error_code")) {

                    } else {
                        SocketController.instance().sendData(DataCommand.FB_USER_SHARED_RESULT_REQUEST, null);
                    }
                });
        }
    }

    inviteFriend() {
        if (window.cordova && typeof device !== 'undefined') {
            FacebookMobile.instance().invite();
        } else {
            FB.ui({
                method: 'apprequests',
                message: 'Come and play MusicQuiz with me!'
            }, (response) => {
                //LogConsole.log(response);
                if (typeof response === "object") {
                    SocketController.instance().sendData(DataCommand.FB_USER_INVITE_FRIEND_REQUEST, SendFbUserInvite.begin(response.request, response.to));
                }
            })
        }
    }

    logout(callback) {
        if (window.cordova && typeof device !== 'undefined') {
            FacebookMobile.instance().logout((response) => {
                callback(response);
            });
        } else {
            FB.logout((response) => {
                // callback(response);
                callback(response);
            });
        }
    }
}