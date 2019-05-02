import MainData from "../model/MainData.js";
import ControllDialog from "../view/ControllDialog.js";
import ControllLoading from "../view/ControllLoading.js";

export default class AjaxServerMail {
    constructor() {
        this.coreUrl = window.RESOURCE.admin_domain;
        // this.coreUrl = "https://admin.gamezoka.com/";
        this.mainUrl = "";
        this.method = "";
        this.params = {};
    }

    static get LIMIT_10() {
        return 20;
    }

    static get OFF_SET_0() {
        return 0;
    }

    static instance() {
        if (this.ajaxServer) {

        } else {
            this.ajaxServer = new AjaxServerMail();
        }
        return this.ajaxServer;
    }

    sendData(callback) {
        //LogConsole.log('sendDatasendDatasendDatasendDatasendData');
        //LogConsole.log(this.params);
        $.ajax({
            type: this.method,
            url: this.mainUrl,
            data: this.params,
            dataType: "JSON",
            success: function (response) {
                // LogConsole.log(this.mainUrl);
                // LogConsole.log(response);
                callback(response);
            },
            error: function (response) {
                // LogConsole.log('CUONGCUONG')
                LogConsole.log(response);
                // ControllLoading.instance
                ControllDialog.instance().addDialog('Lỗi');
                ControllLoading.instance().hideLoading();
            }
        });
    }

    countMessage(user_id) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/countMessage`;
        this.params = {
            user_id: user_id,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    listConversation(user_from, user_to, limit, offset) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/listConversation`;
        this.params = {
            user_from: user_from,
            user_to: user_to,
            limit: limit,
            offset: offset,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    listMessage(user_id, limit, offset) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/getMessenger`;
        this.params = {
            user_id: user_id,
            limit: limit,
            offset: offset,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    sendMessage(user_from, user_to, message) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/sendMessenger`;
        this.params = {
            user_from: user_from,
            user_to: user_to,
            message: message,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    getNotiSystem(user_id, limit, offset) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/getNotification`;
        this.params = {
            user_id: user_id,
            limit: limit,
            offset: offset,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    seeNoticeSystem(user_id, message_id) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/seenNotification`;
        this.params = {
            user_id: user_id,
            message_id: message_id,
            token: MainData.instance().token
        };
        this.method = "GET";
    }

    settingAccount(user_id, user_name, gender, avatar, description) {
        this.cleanData();
        this.mainUrl = `${this.coreUrl}api/settingGame`;
        this.params = {
            user_id: user_id,
            user_name: user_name,
            gender: gender,
            avatar: avatar,
            description: description,
            token: MainData.instance().token
        };
        this.method = "POST";
    }

    cleanData() {
        this.coreUrl = window.RESOURCE.admin_domain;
        // this.coreUrl = "https://admin.gamezoka.com/";
        this.mainUrl = "";
        this.method = "";
        this.params = {};
    }
}