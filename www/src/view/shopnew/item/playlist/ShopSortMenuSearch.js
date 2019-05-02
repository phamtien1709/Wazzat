import BaseView from "../../../BaseView.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ShopItemButtonSortMenu from "./ShopItemButtonSortMenu.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class ShopSortMenuSearch extends BaseView {
    constructor() {
        super(game, null);
    }

    static SORT_AZ() {
        return "SORT_AZ";
    }
    static SORT_NEW() {
        return "SORT_NEW";
    }
    static SORT_POP() {
        return "SORT_POP";
    }

    afterCreate() {
        this.eventChangeMenu = new Phaser.Signal();
        this.eventSearch = new Phaser.Signal();

        this.positionShop = MainData.instance().positionShop;
        this.type = ShopSortMenuSearch.sortAZ;

        this.bg = new ButtonBase(this.positionShop.sort_play_list_bg_search_menu);
        this.addChild(this.bg);

        this.sortAZ = new ShopItemButtonSortMenu(Language.instance().getData("143"), this.chooseSortAZ, this);
        this.sortAZ.active();
        this.addChild(this.sortAZ);

        this.sortNew = new ShopItemButtonSortMenu(Language.instance().getData("136"), this.chooseSortNew, this);
        this.sortNew.deactive();
        this.sortNew.x = this.sortAZ.x + 213 * MainData.instance().scale;
        this.addChild(this.sortNew);

        this.sortPhobien = new ShopItemButtonSortMenu(Language.instance().getData("137"), this.chooseSortPhobien, this);
        this.sortPhobien.deactive();
        this.sortPhobien.hideDoc();
        this.sortPhobien.x = this.sortNew.x + 213 * MainData.instance().scale;
        this.addChild(this.sortPhobien);
    }

    setMenu(type) {
        if (type === ShopSortMenuSearch.SORT_AZ) {
            this.type = ShopSortMenuSearch.SORT_AZ;
            this.sortAZ.active();
            this.sortNew.deactive();
            this.sortPhobien.deactive();
        } else if (type === ShopSortMenuSearch.SORT_NEW) {
            this.type = ShopSortMenuSearch.SORT_NEW;
            this.sortAZ.deactive();
            this.sortNew.active();
            this.sortPhobien.deactive();
        } else {
            this.type = ShopSortMenuSearch.SORT_POP;
            this.sortAZ.deactive();
            this.sortNew.deactive();
            this.sortPhobien.active();
        }
    }

    addEventChangeMenu(callback, scope) {
        this.eventChangeMenu.add(callback, scope);
    }
    removeEventChangeMenu(callback, scope) {
        this.eventChangeMenu.remove(callback, scope);
    }

    dispatchEventChangeMenu() {
        this.eventChangeMenu.dispatch(this.type);
    }

    addEventSearch(callback, scope) {
        this.eventSearch.add(callback, scope);
    }
    removeEventSearch(callback, scope) {
        this.eventSearch.remove(callback, scope);
    }

    dispatchEventSearch(data) {
        this.eventSearch.dispatch(data);
    }

    chooseSortAZ() {
        LogConsole.log("chooseSortAZ");
        if (this.type !== ShopSortMenuSearch.SORT_AZ) {
            this.type = ShopSortMenuSearch.SORT_AZ;

            this.sortAZ.active();
            this.sortNew.deactive();
            this.sortPhobien.deactive();

            this.dispatchEventChangeMenu();
        }
    }
    chooseSortNew() {
        LogConsole.log("chooseSortNew");
        if (this.type !== ShopSortMenuSearch.SORT_NEW) {
            this.type = ShopSortMenuSearch.SORT_NEW;

            this.sortAZ.deactive();
            this.sortNew.active();
            this.sortPhobien.deactive();

            this.dispatchEventChangeMenu();
        }
    }
    chooseSortPhobien() {
        LogConsole.log("chooseSortPhobien");
        if (this.type !== ShopSortMenuSearch.SORT_POP) {
            this.type = ShopSortMenuSearch.SORT_POP;

            this.sortAZ.deactive();
            this.sortNew.deactive();
            this.sortPhobien.active();

            this.dispatchEventChangeMenu();
        }
    }

    destroy() {
        this.bg.destroy();
        this.sortAZ.destroy();
        this.sortNew.destroy();
        this.sortPhobien.destroy();

        super.destroy();
    }

}