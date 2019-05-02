import BaseView from "../../../BaseView.js";
import ShopTNItemMenuTab from "./ShopTNItemMenuTab.js";
import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNMenuTab extends BaseView {
    constructor(typeMenu) {
        super(game, null);
        this.event = {
            change_menu: new Phaser.Signal()
        }
        this.positionShop = MainData.instance().positionShop;
        this.bg = new SpriteBase(this.positionShop.playlist_bg_menu);
        this.addChild(this.bg);

        this.typeTab = typeMenu;

        this.tabGem = new ShopTNItemMenuTab(ShopTNItemMenuTab.GEM, this.chooseTabGem, this);
        if (this.typeTab === ShopTNItemMenuTab.GEM) {
            this.tabGem.active();
        } else {
            this.tabGem.deactive();
        }
        this.addChild(this.tabGem);

        this.tabTicket = new ShopTNItemMenuTab(ShopTNItemMenuTab.TICKET, this.chooseTabTicket, this);
        this.tabTicket.x = 213 * MainData.instance().scale;
        if (this.typeTab === ShopTNItemMenuTab.TICKET) {
            this.tabTicket.active();
        } else {
            this.tabTicket.deactive();
        }
        this.addChild(this.tabTicket);

        this.tabHeart = new ShopTNItemMenuTab(ShopTNItemMenuTab.HEART, this.chooseTabHeart, this);
        this.tabHeart.x = 426 * MainData.instance().scale;
        if (this.typeTab === ShopTNItemMenuTab.HEART) {
            this.tabHeart.active();
        } else {
            this.tabHeart.deactive();
        }
        this.addChild(this.tabHeart);


    }

    chooseTabGem() {
        if (this.typeTab === ShopTNItemMenuTab.GEM) {

        } else {
            this.tabGem.active();
            this.tabTicket.deactive();
            this.tabHeart.deactive();
            this.typeTab = ShopTNItemMenuTab.GEM;

            this.event.change_menu.dispatch(this.typeTab);
        }
    }
    chooseTabTicket() {
        if (this.typeTab === ShopTNItemMenuTab.TICKET) {

        } else {
            this.tabGem.deactive();
            this.tabTicket.active();
            this.tabHeart.deactive();
            this.typeTab = ShopTNItemMenuTab.TICKET;
            this.event.change_menu.dispatch(this.typeTab);
        }
    }
    chooseTabHeart() {
        if (this.typeTab === ShopTNItemMenuTab.HEART) {

        } else {
            this.tabGem.deactive();
            this.tabTicket.deactive();
            this.tabHeart.active();
            this.typeTab = ShopTNItemMenuTab.HEART;
            this.event.change_menu.dispatch(this.typeTab);
        }
    }
}