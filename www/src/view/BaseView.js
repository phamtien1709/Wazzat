import SocketController from "../controller/SocketController.js";
export default class BaseView extends Phaser.Group {
    constructor() {
        super(game, null);
        this.afterCreate();
    }

    afterCreate() {

    }

    checkShowInvite(data) {

    }

    formatName(text, lent, suffix = true) {
        if (text.length > lent) {
            var fName = text.substring(0, lent);

            if (suffix === false)
                return fName;

            return fName.trim() + '...';
        }
        return text;
    }

    swap(arr, x, y) {
        let b = arr[y];
        arr[y] = arr[x];
        arr[x] = b;
    }

    financial(x) {
        return Number.parseFloat(x).toFixed(1);
    }
    compare(a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    }

    compareOwner(a, b) {
        if (a.is_owner < b.is_owner)
            return 1;
        if (a.is_owner > b.is_owner)
            return -1;
        return 0;
    }
    compareUserPlaylistMappingUpdate(a, b) {
        if (a.hasOwnProperty("user") && b.hasOwnProperty("user")) {
            if (a.user.updated < b.user.updated)
                return 1;
            if (a.user.updated > b.user.updated)
                return -1;
            return 0;
        }
    }

    sortAZ(a, b) {
        let nameA = a.name.toUpperCase(); // ignore upper and lowercase
        let nameB = b.name.toUpperCase(); // ignore upper and lowercase

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }

    sortNewPlayList(a, b) {
        let nameA = a.created;
        let nameB = b.created;

        if (nameA < nameB) {
            return 1;
        }
        if (nameA > nameB) {
            return -1;
        }
        return 0;
    }

    sortPhoBien(a, b) {
        let purchased_countA = a.purchased_count;
        let purchased_countB = b.purchased_count;
        if (purchased_countA < purchased_countB) {
            return 1;
        }
        if (purchased_countA > purchased_countB) {
            return -1;
        }

        return 0;
    }

    getTime() {
        let d = new Date();
        let n = d.getTime();
        return n;
    }

    xoa_dau(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }

    tweenItemPopup(item, vy) {
        game.add.tween(item).to({
            y: vy
        }, 200, Phaser.Easing.Exponential.In, true);
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {

    }

    destroy() {
        this.removeAllItem();
        super.destroy();

        let typeData = "";
        for (let str in this) {
            if (this[str] !== null && this[str] !== undefined) {
                typeData = this[str].constructor.name;
                if (typeData !== "Function"
                ) {
                    game.tweens.removeFrom(this[str]);
                    this[str] = null;
                }
            }
        }
        typeData = null;
    }

    removeAllItem() {
        if (this.children) {
            while (this.children.length > 0) {
                let item = this.children[0];
                if (item !== null) {
                    this.removeChild(item);
                    item.destroy();
                    item = {};
                    item = null;
                }
            }
        }
    }

    kill() {
        this.callAll("kill");
    }
    revive() {
        this.callAll("revive");
    }
}