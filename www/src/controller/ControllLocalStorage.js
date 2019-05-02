import MainData from "../model/MainData.js";

export default class ControllLocalStorage {
    constructor() {
        this.ktSupport = false;

        if (typeof (Storage) !== "undefined") {
            this.ktSupport = true;
        }
        if (typeof (NativeStorage) !== "undefined") {
            this.ktSupport = true;
        }
    }

    static VOTE() {
        return "vote";
    }

    static instance() {
        if (this.controllStorage) {

        } else {
            this.controllStorage = new ControllLocalStorage();
        }

        return this.controllStorage;
    }


    setItem(key, value) {
        if (this.ktSupport) {
            if (MainData.instance().platform === "web") {
                localStorage.setItem(key, value);
            } else {
                NativeStorage.setItem(key, value, (success) => {
                }, (err) => {

                });
            }
        }
    }

    getItem(key) {
        if (this.ktSupport) {
            if (MainData.instance().platform === "web") {
                return localStorage.getItem(key);
            } else {
                NativeStorage.getItem(key, (success) => {
                    return success;
                }, (err) => {
                    return "error";
                });
            }
        }
        return "error";
    }

    removeItem(key) {
        if (this.ktSupport) {
            if (MainData.instance().platform === "web") {
                localStorage.removeItem(key);
            } else {
                NativeStorage.remove(key, (success) => {

                }, (err) => {

                })
            }
        }
    }

}