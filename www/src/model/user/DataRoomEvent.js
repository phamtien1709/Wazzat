import RoomEvent from "../eventmode/data/RoomEvent.js";
import EventModeRoomItem from "../../view/eventmode/item/selectroom/EventModeRoomItem.js";

export default class DataRoomEvent {
    constructor() {
        this.dataEvent = {};
        this.isStart = [];
        this.isWaitting = [];
        this.isEnd = [];
    }

    resetData() {
        this.dataEvent = {};
        this.isStart = [];
        this.isWaitting = [];
        this.isEnd = [];
    }

    setData(data) {
        let item = new RoomEvent();
        item = Object.assign({}, item, data);
        this.dataEvent[item.id] = item;

        if (item.state === EventModeRoomItem.STATE_COMING) {
            this.isWaitting.push(item.id);
        } else if (item.state === EventModeRoomItem.STATE_STARTED) {
            this.isStart.push(item.id);
        } else {
            this.isEnd.push(item.id);
        }
    }

    changeState(event_id, event_state) {
        if (this.dataEvent.hasOwnProperty(event_id)) {
            this.dataEvent[event_id].state = event_state;
            let index = this.isWaitting.indexOf(event_id);
            if (index > -1) {
                this.isWaitting.splice(index, 1);
            }
            index = this.isStart.indexOf(event_id);
            if (index > -1) {
                this.isStart.splice(index, 1);
            }
            index = this.isEnd.indexOf(event_id);
            if (index > -1) {
                this.isEnd.splice(index, 1);
            }

            if (this.dataEvent[event_id].state === EventModeRoomItem.STATE_COMING) {
                this.isWaitting.push(event_id);
            } else if (this.dataEvent[event_id].state === EventModeRoomItem.STATE_STARTED) {
                this.isStart.push(event_id);
            } else {
                this.isEnd.push(event_id);
            }
        }
    }

    getWaittingRoom() {
        let arrData = [];
        for (let i = 0; i < this.isWaitting.length; i++) {
            arrData.push(this.dataEvent[this.isWaitting[i]]);
        }
        return arrData.sort(this.sortByTime);
    }

    getStartRoom() {
        let arrData = [];
        for (let i = 0; i < this.isStart.length; i++) {
            arrData.push(this.dataEvent[this.isStart[i]]);
        }
        return arrData.sort(this.sortByTime);
    }

    getEndRoom() {
        let arrData = [];
        for (let i = 0; i < this.isEnd.length; i++) {
            arrData.push(this.dataEvent[this.isEnd[i]]);
        }
        return arrData.sort(this.sortByTimeEnd);
    }


    sortByTimeEnd(a, b) {
        if (a.finish_at < b.finish_at) {
            return 1;
        } else if (a.finish_at > b.finish_at) {
            return -1;
        } else {
            return 0;
        }
    }
    sortByTime(a, b) {
        if (a.start_at < b.start_at) {
            return -1;
        } else if (a.start_at > b.start_at) {
            return 1;
        } else {
            return 0;
        }
    }


}