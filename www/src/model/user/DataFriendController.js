export default class DataFriendController {
    constructor() {
        this.objData = {};
        this.arrIdFriend = [];
    }

    setOnOff(id, is_online) {
        console.log("id : " + id);
        console.log("is_online : " + is_online);
        if (this.objData.hasOwnProperty(id)) {
            let item = this.objData[id];
            item.is_online = is_online;
        }
    }
    setFriend(id, item) {
        if (this.objData.hasOwnProperty(id)) {

        } else {
            this.arrIdFriend.push(id);
        }
        this.objData[id] = item;
    }

    removeFriend(id) {
        console.log("removeFriend : " + id);
        console.log(this.objData);
        if (this.objData.hasOwnProperty(id)) {
            console.log("--------------");
            let index = this.arrIdFriend.indexOf(id);
            if (index > -1) {
                this.arrIdFriend.splice(index, 1);
            }
            delete this.objData[id];
        }
    }

    getFriends() {
        let arr = [];
        for (let i = 0; i < this.arrIdFriend.length; i++) {
            arr.push(this.objData[this.arrIdFriend[i]]);
        }

        arr = arr.sort(this.compareOnline);
        return arr;
    }

    compareOnline(a) {
        if (a.is_online === true) {
            return -1;
        } else {
            return 1;
        }
    }

    resetData() {
        this.objData = {};
        this.arrIdFriend = [];
    }
}