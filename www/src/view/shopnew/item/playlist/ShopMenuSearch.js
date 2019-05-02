import BaseView from "../../../BaseView.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ShopItemButtonMenu from "./ShopItemButtonMenu.js";
import DataConst from "../../../../model/DataConst.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import Language from "../../../../model/Language.js";
import MainData from "../../../../model/MainData.js";

export default class ShopMenuSearch extends BaseView {
    constructor() {
        super(game, null)
    }

    afterCreate() {
        this.event = {
            close: new Phaser.Signal(),
            change_menu: new Phaser.Signal(),
            choose_sort: new Phaser.Signal()
        }

        this.type = DataConst.Local;

        this.positionShop = MainData.instance().positionShop;
        this.bgMenu = new ButtonBase(this.positionShop.playlist_bg_menu);
        this.bgMenu.height = 89 * MainData.instance().scale;
        this.addChild(this.bgMenu);

        this.btnNhacViet = new ShopItemButtonMenu(DataConst.getNameRegion(DataConst.Local), this.chooseNhacViet, this);
        this.btnNhacViet.active();
        this.addChild(this.btnNhacViet);

        this.btnQuocTe = new ShopItemButtonMenu(DataConst.getNameRegion(DataConst.International), this.chooseQuocTe, this);
        this.btnQuocTe.x = this.btnNhacViet.width * MainData.instance().scale;
        this.btnQuocTe.deactive();
        this.addChild(this.btnQuocTe);

        this.btnChooseSort = new ButtonWithText(this.positionShop.bg_tab_menu_select, Language.instance().getData("135"), this.btnChooseSort, this);
        this.addChild(this.btnChooseSort);
    }

    setTextSort(textSort) {
        this.btnChooseSort.setText(textSort);
    }

    btnChooseSort() {
        this.event.choose_sort.dispatch();
    }

    chooseClose() {
        LogConsole.log("chooseClose");
        //this.addKeyBoard();
        this.event.close.dispatch();

    }
    chooseNhacViet() {
        LogConsole.log("chooseNhacViet");
        if (this.type === DataConst.International) {
            this.type = DataConst.Local;
            this.btnNhacViet.active();
            this.btnQuocTe.deactive();
            this.event.change_menu.dispatch(DataConst.Local);
        }
    }

    chooseQuocTe() {
        LogConsole.log("chooseQuocTe");
        if (this.type === DataConst.Local) {
            this.type = DataConst.International;

            this.btnNhacViet.deactive();
            this.btnQuocTe.active();
            this.event.change_menu.dispatch(DataConst.International);
        }
    }
}