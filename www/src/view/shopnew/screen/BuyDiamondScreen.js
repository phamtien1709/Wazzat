
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ShopTNItemHeader from "../item/tainguyen/ShopTNItemHeader.js";
import ShopTNMenuTab from "../item/tainguyen/ShopTNMenuTab.js";
import ShopTNItemMenuTab from "../item/tainguyen/ShopTNItemMenuTab.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import ScrollView from "../../component/listview/ScrollView.js";
import ShopTNItem from "../item/tainguyen/ShopTNItem.js";
import ControllLoading from "../../ControllLoading.js";
import IPA from "../../../IPA.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import IPAIOS from "../../../IPAIOS.js";
import BaseLoadAsset from "../../BaseLoadAsset.js";

export default class BuyDiamondScreen extends BaseLoadAsset {
    constructor(typeMenu = "") {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            close: new Phaser.Signal()
        }
        /*
        this.content = new TextBase({
            x: 0,
            y: 0,
            style: {}
        }, "BuyDiamondScreen")
        this.addChild(this.content);*/
        this.arrResource = [];

        this.typeMenu = typeMenu;

        this.dataServer = null;

        let obj = {
            column: 2,
            width: game.width,
            height: game.height - 356 * MainData.instance().scale,
            rowHeight: 325 * MainData.instance().scale,
            leftDistance: 80 * MainData.instance().scale,
            direction: "y",
            distanceBetweenColumns: 55 * MainData.instance().scale,
            distanceBetweenRows: 35 * MainData.instance().scale
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 230 * MainData.instance().scale;
        this.addChild(this.scroll);



        this.header = new ShopTNItemHeader();
        this.header.event.back.add(this.chooseBackMenu, this);
        this.addChild(this.header);

        if (this.typeMenu === "") {
            this.typeMenu = ShopTNItemMenuTab.GEM;
        }

        this.tabMenu = new ShopTNMenuTab(this.typeMenu);
        this.tabMenu.event.change_menu.add(this.changeMenu, this);
        this.tabMenu.y = 100 * MainData.instance().scale;
        this.addChild(this.tabMenu);

        this.addEvent();

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_resource);
    }

    loadFileComplete() {
        super.loadFileComplete();
        this.buildData();
    }

    chooseBackMenu() {
        this.event.close.dispatch();
    }

    changeMenu(type) {

        console.log("this.typeMenu : " + this.typeMenu);
        this.typeMenu = type;
        // this.removeResource();
        ControllLoading.instance().showLoading();

        if (this.typeMenu === ShopTNItemMenuTab.GEM) {
            this.arrResource = [
                {
                    type: "spritesheet",
                    link: "img/atlas/Diamond1.png",
                    key: "Diamond1",
                    width: 200,
                    height: 140,
                    countFrame: 30
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Diamond2.png",
                    key: "Diamond2",
                    width: 200,
                    height: 140,
                    countFrame: 30
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Diamond3.png",
                    key: "Diamond3",
                    width: 200,
                    height: 140,
                    countFrame: 30
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Diamond4.png",
                    key: "Diamond4",
                    width: 200,
                    height: 140,
                    countFrame: 30
                }
            ];
        } else if (this.typeMenu === ShopTNItemMenuTab.TICKET) {
            this.arrResource = [
                {
                    type: "spritesheet",
                    link: "img/atlas/Ticket1.png",
                    key: "Ticket1",
                    width: 200,
                    height: 140,
                    countFrame: 24
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Ticket2.png",
                    key: "Ticket2",
                    width: 200,
                    height: 140,
                    countFrame: 30
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Ticket3.png",
                    key: "Ticket3",
                    width: 200,
                    height: 140,
                    countFrame: 60
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Ticket4.png",
                    key: "Ticket4",
                    width: 200,
                    height: 140,
                    countFrame: 44
                }

            ];
        } else if (this.typeMenu === ShopTNItemMenuTab.HEART) {
            this.arrResource = [
                {
                    type: "spritesheet",
                    link: "img/atlas/Heart1.png",
                    key: "Heart1",
                    width: 200,
                    height: 140,
                    countFrame: 10
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Heart2.png",
                    key: "Heart2",
                    width: 200,
                    height: 140,
                    countFrame: 30
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Heart3.png",
                    key: "Heart3",
                    width: 200,
                    height: 140,
                    countFrame: 13
                },
                {
                    type: "spritesheet",
                    link: "img/atlas/Heart4.png",
                    key: "Heart4",
                    width: 200,
                    height: 140,
                    countFrame: 60
                }

            ];
        }

        this.loadResource();
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


        if (MainData.instance().dataPackage === null) {
            if (MainData.instance().platform === "ios") {
                IPAIOS.instance().getDataInapp();
            } else {
                IPA.instance().getDataInapp();
            }
        } else {
            this.dataServer = MainData.instance().dataPackage;
            this.changeMenu(this.typeMenu);
            ControllLoading.instance().hideLoading();
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


    buyItemCompleteDiamond(data) {
        console.log("buyItemCompleteDiamond ------------");

        if (data.getUtfString("status") === "OK") {
            let vx = 500 * MainData.instance().scale;
            let vy = 45 * MainData.instance().scale;
            let type = "HEART";

            if (data.getUtfString("resource_type") === "DIAMOND") {
                type = "DIAMOND";
                vx = 140 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
            } else if (data.getUtfString("resource_type") === "TICKET") {
                type = "TICKET";
                vx = 316 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
            } else if (data.getUtfString("resource_type") === "HEART") {
                type = "HEART";
                vx = 500 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
            }

            let dataObj = {
                type: type,
                reward: data.getInt("resource_up"),
                finishPoint: {
                    x: vx,
                    y: vy
                }
            }
            ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, dataObj);
        }
    }

    buyItemComplete(data) {
        console.log("buyItemComplete------ ");
        console.log(data);

        ControllLoading.instance().hideLoading();

        if (data.status === "OK") {

            let vx = 500 * MainData.instance().scale;
            let vy = 45 * MainData.instance().scale;
            let type = "HEART";
            let typeVariable = "";

            if (data.resourceType === "DIAMOND") {
                type = "DIAMOND";
                vx = 140 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
                typeVariable = "diamond"
            } else if (data.resourceType === "TICKET") {
                type = "TICKET";
                vx = 316 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
                typeVariable = "ticket"
            } else if (data.resourceType === "HEART") {
                type = "HEART";
                vx = 500 * MainData.instance().scale;
                vy = 45 * MainData.instance().scale;
                typeVariable = "heart"
            }

            let dataObj = {
                type: type,
                reward: (data.newResource - data.oldResource),
                finishPoint: {
                    x: vx,
                    y: vy
                }
            }

            console.log("data.newResource : " + data.newResource);
            let userVars = [];
            userVars.push(new SFS2X.SFSUserVariable(typeVariable, data.newResource));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));

            ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, dataObj);
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
                    this.changeMenu(this.typeMenu);
                }
                ControllLoading.instance().hideLoading();
                break;
            case ShopCommand.RESOURCE_PACKAGE_WATCHED_ADS_CLAIM_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    let dataAds = {
                        newResource: 0,
                        oldResource: 0,
                        resourceType: "DIAMOND",
                        status: "OK"
                    }
                    dataAds.newResource = data.params.getInt("new_resource");
                    dataAds.resourceType = data.params.getUtfString("resource_type");
                    dataAds.oldResource = data.params.getInt("old_resource");

                    this.buyItemComplete(dataAds);
                    MainData.instance().dataPackage = null;
                    if (MainData.instance().platform === "ios") {
                        IPAIOS.instance().getDataInapp();
                    } else {
                        IPA.instance().getDataInapp();
                    }
                }
                ControllLoading.instance().hideLoading();
                break;
            case ShopCommand.RESOURCE_BUY_SUPPORT_ITEM_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    this.buyItemCompleteDiamond(data.params);
                }
                break;
        }
    }

    buildData() {
        let list = [];
        let arrIcon = [];
        if (this.typeMenu === ShopTNItemMenuTab.GEM) {
            arrIcon = ["Diamond1", "Diamond2", "Diamond3", "Diamond4"];
        } else if (this.typeMenu === ShopTNItemMenuTab.TICKET) {
            arrIcon = ["Ticket1", "Ticket2", "Ticket3", "Ticket4"];
        } else if (this.typeMenu === ShopTNItemMenuTab.HEART) {
            arrIcon = ["Heart1", "Heart2", "Heart3", "Heart4"];
        }


        let idx = 0;
        for (let i = 0; i < this.dataServer.getSFSArray("resource_packages").size(); i++) {
            let resource = this.dataServer.getSFSArray("resource_packages").getSFSObject(i);
            if (resource.getUtfString("resource_type") === this.typeMenu) {

                console.log("mainData.platform : " + MainData.instance().platform);
                console.log("pricetype : " + resource.getUtfString("price_type"));

                if (
                    resource.getUtfString("resource_type") === ShopTNItemMenuTab.TICKET && resource.getUtfString("price_type") === "CASH" ||
                    resource.getUtfString("resource_type") === ShopTNItemMenuTab.TICKET && resource.getUtfString("price_type") === "ADS" //||
                    //resource.getUtfString("resource_type") === ShopTNItemMenuTab.GEM && resource.getUtfString("price_type") === "ADS" ||
                    //resource.getUtfString("resource_type") === ShopTNItemMenuTab.HEART && resource.getUtfString("price_type") === "ADS"
                ) {

                } else {
                    let srtIcon = "";
                    if (idx < arrIcon.length) {
                        srtIcon = arrIcon[idx];
                    } else {
                        srtIcon = arrIcon[arrIcon.length - 1];
                    }
                    let item;
                    if (resource.getUtfString("price_type") === "DIAMOND") {
                        item = new ShopTNItem(resource, srtIcon, true);
                    } else {
                        item = new ShopTNItem(resource, srtIcon);
                    }
                    list.push(item);

                    idx++;
                }
            }
        }

        this.scroll.viewList = list;

        ControllLoading.instance().hideLoading();
    }

    destroy() {
        ControllScreenDialog.instance().removeAnimClaimReward();
        this.arrResource = [
            {
                type: "spritesheet",
                link: "img/atlas/Diamond1.png",
                key: "Diamond1",
                width: 200,
                height: 140,
                countFrame: 30
            },
            {
                type: "spritesheet",
                link: "img/atlas/Diamond2.png",
                key: "Diamond2",
                width: 200,
                height: 140,
                countFrame: 30
            },
            {
                type: "spritesheet",
                link: "img/atlas/Diamond3.png",
                key: "Diamond3",
                width: 200,
                height: 140,
                countFrame: 30
            },
            {
                type: "spritesheet",
                link: "img/atlas/Diamond4.png",
                key: "Diamond4",
                width: 200,
                height: 140,
                countFrame: 30
            }, {
                type: "spritesheet",
                link: "img/atlas/Ticket1.png",
                key: "Ticket1",
                width: 200,
                height: 140,
                countFrame: 24
            },
            {
                type: "spritesheet",
                link: "img/atlas/Ticket2.png",
                key: "Ticket2",
                width: 200,
                height: 140,
                countFrame: 30
            },
            {
                type: "spritesheet",
                link: "img/atlas/Ticket3.png",
                key: "Ticket3",
                width: 200,
                height: 140,
                countFrame: 60
            },
            {
                type: "spritesheet",
                link: "img/atlas/Ticket4.png",
                key: "Ticket4",
                width: 200,
                height: 140,
                countFrame: 44
            },
            {
                type: "spritesheet",
                link: "img/atlas/Heart1.png",
                key: "Heart1",
                width: 200,
                height: 140,
                countFrame: 10
            },
            {
                type: "spritesheet",
                link: "img/atlas/Heart2.png",
                key: "Heart2",
                width: 200,
                height: 140,
                countFrame: 30
            },
            {
                type: "spritesheet",
                link: "img/atlas/Heart3.png",
                key: "Heart3",
                width: 200,
                height: 140,
                countFrame: 13
            },
            {
                type: "spritesheet",
                link: "img/atlas/Heart4.png",
                key: "Heart4",
                width: 200,
                height: 140,
                countFrame: 60
            }

        ];

        this.scroll.viewList = [];
        this.scroll.destroy();
        this.removeEvent();
        super.destroy();
    }
}