import BaseView from "../../BaseView.js";
import ShopNewButtonBotMenu from "./ShopNewButtonBotMenu.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";

export default class ShopNewMenuBot extends BaseView {
    constructor(idxTab = 0) {
        super(game, null);
        this.event = {
            change_menu: new Phaser.Signal()
        }
        this.positionShop = MainData.instance().positionShop;

        this.idxTab = idxTab;
        let arrButton = [{
            obj: {
                x: 0,
                y: 0,
                nameAtlas: "shop",
                nameSprite: "Icon_Playlist_active"
            },
            content: "Playlist"
        }, {
            obj: {
                x: 0,
                y: 0,
                nameAtlas: "shop",
                nameSprite: "Icon_Tainguyen_active"
            },
            content: "Tài nguyên"
        }, {
            obj: {
                x: 0,
                y: 0,
                nameAtlas: "shop",
                nameSprite: "Icon_Hotro_active"
            },
            content: "Hỗ trợ"
        }, {
            obj: {
                x: 0,
                y: 0,
                nameAtlas: "shop",
                nameSprite: "Icon_Vip_active"
            },
            content: "Vip"
        }]

        this.line = new SpriteBase(this.positionShop.bot_menu_line_top);
        this.addChild(this.line);


        this.arrButtonTab = [];
        let beginX = 0;
        for (let i = 0; i < arrButton.length; i++) {
            let item = new ShopNewButtonBotMenu(this.positionShop.bot_menu_bg_button, this.chooseButton, this);
            item.setButton(arrButton[i], i);
            item.x = beginX;
            beginX += item.width;
            this.addChild(item);
            if (i === this.idxTab) {
                item.active();
            } else {
                item.deactive();
            }
            this.arrButtonTab.push(item);
        }
    }

    chooseButton(item) {
        LogConsole.log("chooseButton")
        LogConsole.log(item);
        let idx = item.getIdx();

        if (idx === this.idxTab) {

        } else {
            for (let i = 0; i < this.arrButtonTab.length; i++) {
                let item = this.arrButtonTab[i];
                if (item.getIdx() !== idx) {
                    item.deactive();
                } else {
                    item.active();
                }
            }
            this.idxTab = idx;
            this.event.change_menu.dispatch(this.idxTab);
        }
    }

    setButtonActive(idx) {
        this.arrButtonTab[this.idxTab].deactive();
        this.idxTab = idx;
        this.arrButtonTab[this.idxTab].active();
    }
}