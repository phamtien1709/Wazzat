import BaseView from "../../BaseView.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ShopVipItem from "../item/vip/ShopVipItem.js";
import ListView from "../../../../libs/listview/list_view.js";
import ShopTNItemHeader from "../item/tainguyen/ShopTNItemHeader.js";
import SocketController from "../../../controller/SocketController.js";
import ControllLoading from "../../ControllLoading.js";
import MainData from "../../../model/MainData.js";
import IPAIOS from "../../../IPAIOS.js";
import IPA from "../../../IPA.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ControllDialog from "../../ControllDialog.js";
import ShopVipDetails from "../item/vip/ShopVipDetails.js";
import ShopVipDetailItem from "../item/vip/ShopVipDetailItem.js";
import Language from "../../../model/Language.js";

export default class VipScreen extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal()
        }
        this.vipDetail = null;

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_Vip);


        let parantVip = new Phaser.Group(game, 0, 0, null);
        this.listVip = new ListView(game, parantVip, new Phaser.Rectangle(0, 0, game.width, game.height - 270), {
            direction: 'y',
            padding: 38,
            searchForClicks: true
        });
        parantVip.x = 0;
        parantVip.y = 135;
        this.addChild(parantVip);

        this.header = new ShopTNItemHeader();
        this.header.event.back.add(this.chooseBackMenu, this);
        this.addChild(this.header);

        this.addEvent();
    }



    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);

        if (MainData.instance().platform === "ios") {
            IPAIOS.instance().event.buy_complete.add(this.buyItemComplete, this);
            IPAIOS.instance().event.buy_error.add(this.buyItemError, this);
        } else {
            IPA.instance().event.buy_complete.add(this.buyItemComplete, this);
            IPA.instance().event.buy_error.add(this.buyItemError, this);
        }


        if (SocketController.instance().dataMySeft.vip === true) {
            this.addDataVip();
        } else {
            if (MainData.instance().dataPackage === null) {
                if (MainData.instance().platform === "ios") {
                    IPAIOS.instance().getDataInapp();
                } else {
                    IPA.instance().getDataInapp();
                }
            } else {
                this.dataServer = MainData.instance().dataPackage;
                this.buildData();
                ControllLoading.instance().hideLoading();
            }
        }
    }


    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);

        if (MainData.instance().platform === "ios") {
            IPAIOS.instance().event.buy_complete.remove(this.buyItemComplete, this);
            IPAIOS.instance().event.buy_error.remove(this.buyItemError, this);
        } else {
            IPA.instance().event.buy_complete.remove(this.buyItemComplete, this);
            IPA.instance().event.buy_error.remove(this.buyItemError, this);
        }
    }

    buyItemComplete(data) {
        console.log("buyItemComplete------ ");
        console.log(data);

        ControllLoading.instance().hideLoading();

        if (data.status === "OK") {
            let userVars = [];
            userVars.push(new SFS2X.SFSUserVariable("vip", true));
            userVars.push(new SFS2X.SFSUserVariable("vip_expired", parseInt(data.vip_expired) * 1000));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));
            ControllDialog.instance().addUpToVip();

            console.log("data.vip_expired : " + data.vip_expired);

            SocketController.instance().dataMySeft.vip = true;
            SocketController.instance().dataMySeft.vip_expired = parseInt(data.vip_expired) * 1000;

            this.addDataVip();
        } else {

        }
    }

    buyItemError(str) {
        ControllLoading.instance().hideLoading();
        if (str !== "") {
            ControllScreenDialog.instance().addDialog(str);
        }
    }

    getData(data) {
        switch (data.cmd) {
            case ShopCommand.RESOURCE_PACKAGE_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    MainData.instance().dataPackage = data.params;
                    this.dataServer = MainData.instance().dataPackage;
                    this.buildData();
                }
                ControllLoading.instance().hideLoading();
                break;
        }
    }

    buildData() {
        console.log("buildData------");

        this.listVip.removeAll();
        this.listVip.reset();

        for (let i = 0; i < this.dataServer.getSFSArray("resource_packages").size(); i++) {
            let resource = this.dataServer.getSFSArray("resource_packages").getSFSObject(i);
            console.log(resource);
            if (resource.getUtfString("resource_type") === "VIP") {
                let item = new ShopVipItem(resource);
                item.event.show_details.add(this.addDetailVip, this);
                item.x = (game.width - item.width) / 2;
                this.listVip.add(item);
            }
        }
    }

    addDataVip() {
        this.removeDetailVip();

        this.itemVip = new ShopVipItem(null, true);
        this.itemVip.x = 35;
        this.itemVip.y = 137;
        this.addChild(this.itemVip);


        this.txtTitle = game.add.text(35, 443, Language.instance().getData("162"), {
            fill: "#ffFFFF",
            fontSize: 26,
            font: "GilroybOLD"
        }, this);
        this.addChild(this.txtTitle);

        let arrText = [
            Language.instance().getData("149"),
            Language.instance().getData("150"),
            Language.instance().getData("151"),
            Language.instance().getData("152"),
            Language.instance().getData("153"),
            Language.instance().getData("154"),
            Language.instance().getData("155"),
            Language.instance().getData("156")
        ]
        this.listVip.removeAll();
        this.listVip.destroy();

        let parentListVip = new Phaser.Group(game, 0, 0, null);
        this.listVip = new ListView(game, parentListVip, new Phaser.Rectangle(0, 0, game.width, game.height - 700), {
            direction: 'y',
            padding: 10,
            searchForClicks: false
        });

        parentListVip.x = 0;
        parentListVip.y = 520;
        this.addChild(parentListVip);

        for (let i = 0; i < arrText.length; i++) {
            let item = new ShopVipDetailItem(arrText[i], "#ffffff", "left");
            item.x = 35;
            this.listVip.add(item);
        }

    }


    addDetailVip(data) {
        this.removeDetailVip();
        this.vipDetail = new ShopVipDetails(data);
        this.vipDetail.event.close.add(this.removeDetailVip, this);
        this.vipDetail.x = (game.width - this.vipDetail.width) / 2;
        this.vipDetail.y = (game.height - this.vipDetail.height) / 2;
        ControllDialog.instance().addChild(this.vipDetail);
    }

    removeDetailVip() {
        if (this.vipDetail !== null) {
            ControllDialog.instance().removeChild(this.vipDetail);
            this.vipDetail.destroy();
            this.vipDetail = null;
        }
    }


    chooseBackMenu() {
        this.event.close.dispatch();
    }


    destroy() {
        this.listVip.removeAll();
        this.listVip.destroy();
        this.removeDetailVip();
        this.removeEvent();
        super.destroy();
    }
}