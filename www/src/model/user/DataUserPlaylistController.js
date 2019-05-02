
import SqlLiteController from "../../SqlLiteController.js";

export default class DataUserPlaylistController {
    constructor() {
        this.objData = {};
        this.objGenres = {};
        this.arrShop = [];
        this.arrMe = [];
    }

    resetData() {
        this.objData = {};
        this.objGenres = {};
        this.arrShop = [];
        this.arrMe = [];
    }
    setExpPlaylistById(id) {
        SqlLiteController.instance().updateExpPlaylist(id);
    }

}