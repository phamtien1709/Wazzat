import BaseView from "../../../BaseView.js";
import MainData from "../../../../model/MainData.js";
import TextBase from "../../../component/TextBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import ShopItemPlayList from "./ShopItemPlayList.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import Language from "../../../../model/Language.js";

export default class ShopListPlayList extends BaseView {
    static get PHO_BIEN() {
        return "phobien";
    }
    static get NEW() {
        return "new";
    }
    static get TOP() {
        return "top";
    }

    constructor(type) {
        super(game, null);
        this.type = type;
        this.detail = null;
        this.popupBuy = null;
        this.popupMoney = null;

        this.positionShop = MainData.instance().positionShop;
        this.eventViewAll = new Phaser.Signal();

        let strTitle = Language.instance().getData("2");
        if (this.type == ShopListPlayList.PHO_BIEN) {
            strTitle = Language.instance().getData("2");
        } else if (this.type == ShopListPlayList.NEW) {
            strTitle = Language.instance().getData("3");
        } else if (this.type == ShopListPlayList.TOP) {
            strTitle = Language.instance().getData("4");
        }



        this.parentList = game.add.group();
        this.parentList.x = 34 * MainData.instance().scale;
        this.parentList.y = 95 * MainData.instance().scale;
        this.addChild(this.parentList);

        this.lbTitle = new TextBase(this.positionShop.playlist_lb_title, strTitle);
        this.addChild(this.lbTitle);

        this.lbViewAll = new TextBase(this.positionShop.playlist_lb_viewall, Language.instance().getData("1"));
        this.lbViewAll.setTextBounds(0, 0, 237 * MainData.instance().scale, 31 * MainData.instance().scale);
        // this.lbViewAll.setButton(this.chooseViewAll, this);
        this.addChild(this.lbViewAll);

        this.btnViewAll = new ButtonBase(this.positionShop.playlist_button_buy, this.chooseViewAll, this);
        this.btnViewAll.x = this.lbViewAll.x;
        this.btnViewAll.y = this.lbViewAll.y;
        this.btnViewAll.width = 237 * MainData.instance().scale;
        this.btnViewAll.height = 31 * MainData.instance().scale;
        this.btnViewAll.alpha = 0;
        this.addChild(this.btnViewAll);
    }

    addLine() {
        LogConsole.log("addLine--------------");
        this.line = new SpriteScale9Base(this.positionShop.shop_line);
        this.line.x = (game.width - this.line.width) / 2;
        // this.line.alpha = 0.4;
        this.line.y = 435 * MainData.instance().scale;
        this.addChild(this.line);
        LogConsole.log("end--------------");
    }

    addEventViewAll(callback, scope) {
        LogConsole.log("addEventViewAll");
        this.eventViewAll.add(callback, scope);
    }
    removeEventViewAll(callback, scope) {
        this.eventViewAll.remove(callback, scope);
    }
    dispatchEventViewAll() {
        this.eventViewAll.dispatch(this.type);
    }

    chooseViewAll() {
        LogConsole.log("chooseViewAll");
        this.dispatchEventViewAll();
    }

    removeAllParentList() {
        while (this.parentList.children.length > 0) {
            let item = this.parentList.children[0];
            this.parentList.removeChild(item);
            item.destroy();
            item = null;
        }
    }

    buildPlayList(playlist, type, genres) {
        LogConsole.log("buildPlayList");
        // this.listPlayList.removeAll();
        // this.listPlayList.reset();
        this.removeAllParentList();

        let idx = -1;
        let beginX = 0;
        let beginY = 0;
        for (let i = 0; i < playlist.length; i++) {
            if (playlist[i].is_owner != 1 && playlist[i].region === type) {
                if (playlist[i].genre_id === genres || genres === -1) {
                    idx++;
                    if (idx < 3) {
                        let item = new ShopItemPlayList();
                        item.event.CHOOSE.add(this.chooseItemShop, this);
                        item.event.BUY.add(this.buyItemShop, this);
                        item.setData(playlist[i], idx);
                        this.parentList.addChild(item);
                        item.x = beginX;
                        item.y = beginY;
                        beginX += item.width + 35 * MainData.instance().scale;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    chooseItemShop(data) {
        ControllScreenDialog.instance().addPlaylistDetail(data.id);
    }
    buyItemShop(data) {
        ControllScreenDialog.instance().buyItem(data);
    }

    get width() {
        return game.width;
    }
    get height() {
        return 435 * MainData.instance().scale;
    }

    destroy() {
        this.removeAllParentList();
        this.removeAllItem();

        ControllScreenDialog.instance().removePlaylistDetail();
        ControllScreenDialog.instance().removePopupBuy();
        ControllScreenDialog.instance().removePopupMoney();

        super.destroy();
    }
}