import MainData from "./model/MainData.js";
import SocketController from "./controller/SocketController.js";
import DataCommand from "./model/DataCommand.js";

export default class OneSignalPush {
    constructor() {
        if (window.plugins) {
            if (window.plugins.OneSignal) {
                console.log("OneSignalPush------------------");
                var notificationOpenedCallback = function (jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                };

                var notifyId = function (evt) {
                    console.log('notifyId: ' + JSON.stringify(evt));
                    MainData.instance().userOneSingal = evt.userId;
                    MainData.instance().tokenOneSignal = evt.pushToken;

                    console.log("userOneSingal : " + MainData.instance().userOneSingal);
                    console.log("tokenOneSignal : " + MainData.instance().tokenOneSignal);
                    if (SocketController.instance().roomLobby !== null) {
                        let params = new SFS2X.SFSObject();
                        params.putUtfString("user_one_signal", MainData.instance().userOneSingal);
                        params.putUtfString("token_one_signal", MainData.instance().tokenOneSignal);
                        SocketController.instance().sendDataOneSignal(DataCommand.ONE_SIGNAL_UPDATE_REQUEST, params);
                    }
                }

                window.plugins.OneSignal
                    .startInit("4cb998ce-7a56-4eb5-90f5-06f2834da6fc")
                    .handleNotificationOpened(notificationOpenedCallback)
                    .endInit();

                window.plugins.OneSignal.getIds(notifyId);
            }
        }
    }

    static instance() {
        if (this.onesignal) {

        } else {
            this.onesignal = new OneSignalPush();
        }

        return this.onesignal;
    }
}