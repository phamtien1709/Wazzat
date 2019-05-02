import MainData from "../model/MainData.js";

export default class ConfigPlatform {
    static get ANDROID() {
        return "ANDROID"
    }
    static get IOS() {
        return "IOS"
    }
    static get WEB() {
        return "WEB"
    }
    static get UNKNOWN() {
        return "UNKNOWN"
    }

    static getNamePlatform() {
        if (MainData.instance().platform === "and") {
            return ConfigPlatform.ANDROID;
        } else if (MainData.instance().platform === "ios") {
            return ConfigPlatform.IOS;
        } else {
            return ConfigPlatform.WEB;
        }
    }
}
