import BaseView from "../../../BaseView.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import ButtonBase from "../../../component/ButtonBase.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class ShopChooseSortPlayList extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            choose_sort: new Phaser.Signal()
        }
        this.positionShop = MainData.instance().positionShop;

        this.bgGenres = new ButtonBase(this.positionShop.sort_play_list_bg_search_menu);
        this.bgGenres.height = 165 * MainData.instance().scale;
        this.bgGenres.width = 166 * MainData.instance().scale;
        this.addChild(this.bgGenres);

        this.arrSort = [Language.instance().getData("135"), Language.instance().getData("136"), Language.instance().getData("137")];
        let beginY = 10;
        for (let i = 0; i < this.arrSort.length; i++) {
            let item = new ButtonWithText(this.positionShop.bg_tab_menu_select_item, this.arrSort[i], this.chooseItem, this);
            item.name = i;
            item.y = beginY;
            item.x = 10
            beginY += 45;
            this.addChild(item);
        }
    }

    chooseItem(evt) {
        LogConsole.log("chooseItem : " + evt.name);
        this.event.choose_sort.dispatch(evt.name, this.arrSort[parseInt(evt.name)]);
    }
}