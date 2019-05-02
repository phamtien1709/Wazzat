import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNItemMenuTab extends Phaser.Button {
    static get GEM() {
        return "DIAMOND";
    }
    static get TICKET() {
        return "TICKET";
    }
    static get HEART() {
        return "HEART";
    }
    constructor(type, callback, scope) {
        super(game, 0, 0, null, callback, scope);

        this.positionShop = MainData.instance().positionShop;
        this.bg = new SpriteBase(this.positionShop.sort_play_list_icon_active_search_menu);
        this.bg.height = 89;
        this.bg.y = 0;
        this.bg.alpha = 0;
        this.addChild(this.bg);

        if (type === ShopTNItemMenuTab.GEM) {
            this.icon = new SpriteBase(this.positionShop.tn_tab_icon_gem);
            this.iconActive = new SpriteBase(this.positionShop.tn_tab_icon_gem_active);
        } else if (type === ShopTNItemMenuTab.TICKET) {
            this.icon = new SpriteBase(this.positionShop.tn_tab_icon_ticket);
            this.iconActive = new SpriteBase(this.positionShop.tn_tab_icon_ticket_active);
        } else if (type === ShopTNItemMenuTab.HEART) {
            this.icon = new SpriteBase(this.positionShop.tn_tab_icon_heart);
            this.iconActive = new SpriteBase(this.positionShop.tn_tab_icon_heart_active);
        }

        this.icon.x = (this.width - this.icon.width) / 2;
        this.icon.y = (this.height - this.icon.height) / 2;

        this.iconActive.x = (this.width - this.iconActive.width) / 2;
        this.iconActive.y = (this.height - this.iconActive.height) / 2;

        this.addChild(this.icon);
        this.addChild(this.iconActive);

        this.lineActive = new SpriteBase(this.positionShop.sort_play_list_icon_active_search_menu);
        this.lineActive.y = 83;
        this.addChild(this.lineActive);
    }

    active() {
        this.icon.visible = false;
        this.iconActive.visible = true;
        this.lineActive.visible = true;
    }

    deactive() {
        this.icon.visible = true;
        this.iconActive.visible = false;
        this.lineActive.visible = false;
    }

    get width() {
        return 213 * MainData.instance().scale;
    }
    get height() {
        return 89 * MainData.instance().scale;
    }

}