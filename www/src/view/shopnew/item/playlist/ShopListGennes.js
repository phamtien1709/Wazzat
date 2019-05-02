import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";
import ListView from "../../../../../libs/listview/list_view.js";
import MainData from "../../../../model/MainData.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ShopItemGennes from "./ShopItemGennes.js";
import Language from "../../../../model/Language.js";


export default class ShopListGennes extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            choose: new Phaser.Signal(),
            view_all: new Phaser.Signal(),
            search: new Phaser.Signal()
        }

        this.genres = -1;
        this.itemGenresActive = null;
        this.positionShop = MainData.instance().positionShop;


        this.lbTitle = new TextBase(this.positionShop.gennes_lb_title, Language.instance().getData("0"));
        this.addChild(this.lbTitle);

        this.lbViewAll = new TextBase(this.positionShop.gennes_lb_viewall, Language.instance().getData("1"));
        this.lbViewAll.setButton(this.chooseViewAll, this);
        this.lbViewAll.setTextBounds(0, 0, 237 * MainData.instance().scale, 31 * MainData.instance().scale);
        this.addChild(this.lbViewAll);

        let parentGenres = new Phaser.Group(game, 0, 0, null);
        this.listGenres = new ListView(game, parentGenres, new Phaser.Rectangle(0, 0, game.width - 69 * MainData.instance().scale, 220 * MainData.instance().scale), {
            direction: 'x',
            padding: 18 * MainData.instance().scale,
            searchForClicks: true
        });

        parentGenres.x = 34 * MainData.instance().scale;
        parentGenres.y = 0;
        this.addChild(parentGenres);

        this.line = new SpriteScale9Base(this.positionShop.shop_line);
        this.line.x = (game.width - this.line.width) / 2;
        this.line.y = 191 * MainData.instance().scale;
        //this.line.alpha = 0.4;
        this.addChild(this.line);

        this.btnSearch = new ButtonBase(this.positionShop.playlist_menu_search_icon, this.chooseSearch, this);
        this.btnSearch.x = 580 * MainData.instance().scale;
        this.btnSearch.y = 20 * MainData.instance().scale;
        this.addChild(this.btnSearch);
    }

    buildListGenres(genres, type) {
        this.listGenres.removeAll();
        this.listGenres.reset();
        let idx = -1;
        for (let i = 0; i < genres.length; i++) {
            if (genres[i].region === type) {
                idx++;
                let item = new ShopItemGennes(this.chooseItem, this);
                item.y = 95 * MainData.instance().scale;
                item.setData(genres[i], idx);
                this.listGenres.add(item);
            }
        }
    }

    chooseSearch() {
        this.event.search.dispatch();
    }

    chooseViewAll() {
        this.event.view_all.dispatch("");
    }
    chooseItem(item) {
        //LogConsole.log("chooseItem : " + JSON.stringify(item.getData()));

        if (this.genres === -1) {
            this.itemGenresActive = item;
            this.itemGenresActive.active();
            this.genres = item.getData().id;
            this.event.choose.dispatch(item.getData().id);
        } else {
            if (this.genres === item.getData().id) {
                item.deactive();
                this.genres = -1;
                this.itemGenresActive = null;
                this.event.choose.dispatch(-1);
            } else {
                this.itemGenresActive.deactive();
                item.active();
                this.genres = item.getData().id;
                this.itemGenresActive = item;
                this.event.choose.dispatch(item.getData().id);
            }
        }
        this.listGenres.tweenToItem(item.idx, 0.5);


    }

    get width() {
        return game.width;
    }
    get height() {
        return 220 * MainData.instance().scale;
    }
}