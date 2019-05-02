import SocketController from "../../../controller/SocketController.js";

export default class RankingObjOwner {
    constructor() {
        this.rank = 'N/A';
        this.user_id = SocketController.instance().dataMySeft.user_id;
        this.playlist_id = 0;
        this.number_of_correct = 0;
        this.user_entity = {
            user_name: SocketController.instance().dataMySeft.user_name,
            avatar: SocketController.instance().dataMySeft.avatar
        }
    }
}