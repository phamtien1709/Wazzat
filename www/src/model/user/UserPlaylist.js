import ShopUserPlayListMapping from "../shop/data/ShopUserPlayListMapping.js";

export default class UserPlaylist {
    constructor() {
        this.is_highlight = 0;
        this.used_times = 0;
        this.thumb = "";
        this.created = 0;
        this.is_owner = 0;
        this.description = "";
        this.active = 0;
        this.is_default = 0;
        this.genre_id = 0;
        this.price = 0;
        this.is_general = 0;
        this.name = "";
        this.purchased_count = 0;
        this.id = 0;
        this.vipInt = 0;
        this.vip = false;
        this.is_solo_mode = 0;
        this.updated = 0;
        this.country_id = 0;
        this.region = "";

        this.user = new ShopUserPlayListMapping();
    }
}