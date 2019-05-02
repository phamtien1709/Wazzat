import ShopUserPlayListMapping from "./ShopUserPlayListMapping.js";

export default class ShopPlayList {
    constructor() {
        this.is_highlight = 0;
        this.thumb = "";
        this.created = 0;
        this.is_owner = 0;
        this.is_default = 0;
        this.genre_id = 0;
        this.songs = "";
        this.price = 0;
        this.is_general = 0;
        this.name = "";
        this.id = 0;
        this.vip = 0;
        this.is_solo_mode = 0;
        this.updated = 0;
        this.country_id = 0;
        this.user = new ShopUserPlayListMapping();
        this.region = "";
        this.arrSong = [];
        this.questions = "";
        this.bet_id = 0;
        this.purchased_count = 0;
        this.description = "";
    }
}