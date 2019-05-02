
import ShopNewMenuBot from "./item/ShopNewMenuBot.js";
import ShopScreen from "./screen/ShopScreen.js";
import VipScreen from "./screen/VipScreen.js";
import BuyDiamondScreen from "./screen/BuyDiamondScreen.js";
import HelpScreen from "./screen/HelpScreen.js";
import SwitchScreen from "../component/SwitchScreen.js";
import MainData from "../../model/MainData.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import BaseLoadAsset from "../BaseLoadAsset.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import ControllScreen from "../ControllScreen.js";


export default class ShopNew extends BaseLoadAsset {

    constructor(idxTab = 0, typeSubTab = "") {
        super(game, null);

        this.event = {
            close: new Phaser.Signal(),
            view_all_shop: new Phaser.Signal(),
            search_shop: new Phaser.Signal()
        }

        this.ktTween = false;
        this.shop = null;
        this.vip = null;
        this.buyDiamond = null;
        this.help = null;
        this.idxTab = idxTab;
        this.typeSubTab = typeSubTab;
        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        this.addChild(this.bg);

        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionShop.json",
                key: "positionShop"
            },
            {
                type: "atlas",
                link: "img/atlas/shop.png",
                key: "shop",
                linkJson: "img/atlas/shop.json"
            }
        ];

        this.loadResource();

    }

    loadFileComplete() {

        super.loadFileComplete();

        this.menuBot = new ShopNewMenuBot(this.idxTab);
        this.menuBot.event.change_menu.add(this.change_menu, this);
        this.menuBot.y = game.height - 120 * MainData.instance().scale;
        this.addChild(this.menuBot);

        game.time.events.add(Phaser.Timer.SECOND * 0.1, this.change_menu, this, this.idxTab);

        //this.change_menu(this.idxTab);
    }

    change_menu(idxTab) {
        if (this.ktTween === false) {
            this.idxTab = idxTab;
            switch (idxTab) {
                case 0:
                    FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_Vip_button);
                    this.addShop();
                    break;
                case 1:
                    FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_resource_button);
                    this.addBuyDiamond();
                    break;
                case 2:
                    FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_items_support_butotn);
                    this.addHelp();
                    break;
                case 3:
                    FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_Vip_button);
                    this.addVip();
                    // ControllDialog.instance().addDialog('Tính năng vip sắp ra mắt');
                    break;
            }
            this.addChild(this.menuBot);
        }
    }
    tweenVipComplete() {
        this.ktTween = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenVipComplete, this);
        if (this.shop !== null) {
            this.shop.addEvent();
        }
        this.removeVip();
    }
    tweenHelpComplete() {
        this.ktTween = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenHelpComplete, this);
        if (this.shop !== null) {
            this.shop.addEvent();
        }
        this.removeHelp();
    }
    tweenBuyDiamondComplete() {
        this.ktTween = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenBuyDiamondComplete, this);
        if (this.shop !== null) {
            this.shop.addEvent();
        }
        this.removeBuyDiamond();
    }
    tweenShopComplete() {
        this.ktTween = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenShopComplete, this);
        this.removeShop();
    }

    addShop() {
        this.removeShop();
        this.shop = new ShopScreen();
        this.shop.event.close.add(this.chooseClose, this);
        this.shop.event.buyVip.add(this.buyVip, this);
        this.addChild(this.shop);

        if (this.vip !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.vip, this.shop, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenVipComplete, this);
        } else if (this.help !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.help, this.shop, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenHelpComplete, this);
        } else if (this.buyDiamond !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.buyDiamond, this.shop, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenBuyDiamondComplete, this);
        } else {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(null, this.shop, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenShopBeginComplete, this);
        }
    }

    buyVip() {
        this.change_menu(3);
        this.menuBot.setButtonActive(3);
    }

    shopSearch(objData) {
        this.event.search_shop.dispatch(objData);
    }
    showAllShop(objData) {
        this.event.view_all_shop.dispatch(objData);
    }

    tweenShopBeginComplete() {
        if (this.shop !== null) {
            this.ktTween = false;
            SwitchScreen.instance().event.tweenComplete.remove(this.tweenShopBeginComplete, this);
            this.shop.addEvent();
        }
    }

    removeShop() {
        if (this.shop !== null) {
            this.removeChild(this.shop);
            this.shop.destroy();
            this.shop = null;
        }
    }

    addVip() {
        this.removeVip();
        this.vip = new VipScreen();
        this.vip.event.close.add(this.chooseClose, this);
        this.addChild(this.vip);

        if (this.shop !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.shop, this.vip, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenShopComplete, this);
        }
        if (this.buyDiamond !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.buyDiamond, this.vip, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenBuyDiamondComplete, this);
        }
        if (this.help !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.help, this.vip, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenHelpComplete, this);
        }

    }
    removeVip() {
        if (this.vip !== null) {
            this.removeChild(this.vip);
            this.vip.destroy();
            this.vip = null;
        }
    }

    addBuyDiamond() {
        this.removeBuyDiamond();
        this.buyDiamond = new BuyDiamondScreen(this.typeSubTab);
        this.buyDiamond.event.close.add(this.chooseClose, this);
        this.addChild(this.buyDiamond);
        if (this.shop !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.shop, this.buyDiamond, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenShopComplete, this);
        }
        if (this.help !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.help, this.buyDiamond, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenHelpComplete, this);
        }
        if (this.vip !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.vip, this.buyDiamond, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenVipComplete, this);
        }

        this.typeSubTab = "";
    }
    removeBuyDiamond() {
        if (this.buyDiamond !== null) {
            this.removeChild(this.buyDiamond);
            this.buyDiamond.destroy();
            this.buyDiamond = null;
        }
    }

    addHelp() {
        this.removeHelp();
        this.help = new HelpScreen();
        this.help.event.close.add(this.chooseClose, this);
        this.addChild(this.help);
        if (this.vip !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.vip, this.help, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenVipComplete, this);
        }
        if (this.shop !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.shop, this.help, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenShopComplete, this);
        }
        if (this.buyDiamond !== null) {
            this.ktTween = true;
            SwitchScreen.instance().beginSwitch(this.buyDiamond, this.help, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenBuyDiamondComplete, this);
        }
    }
    removeHelp() {
        if (this.help !== null) {
            this.removeChild(this.help);
            this.help.destroy();
            this.help = null;
        }
    }

    chooseClose() {
        if (MainData.instance().state === ConfigScreenName.MAIN_MENU) {
            ControllScreen.instance().screen.refreshMenu();
        }
        this.event.close.dispatch();
    }

    destroy() {
        MainData.instance().positionShopData = null;
        this.removeBuyDiamond();
        this.removeEvent();
        this.removeHelp();
        this.removeShop();
        this.removeVip();
        super.destroy();
    }

}