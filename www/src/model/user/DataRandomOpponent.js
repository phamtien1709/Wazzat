export default class DataRandomOpponent {
    constructor() {
        this.event = {
            call_load: new Phaser.Signal()
        }
        this.arrUser = [];
    }
    resetData() {
        this.arrUser = [];
    }

    setUser(data) {
        this.arrUser.push(data);
    }

    getUser() {
        if (this.arrUser.length > 0) {
            let data = this.arrUser[0];
            this.arrUser.splice(0, 1);
            if (this.arrUser.length === 1) {
                this.event.call_load.dispatch();
            }
            return data;
        } else {
            return null;
        }
    }

    getArrLenght() {
        return this.arrUser.length;
    }

}