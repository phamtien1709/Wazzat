import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ShopTNItemHeaderHoTro from "../item/tainguyen/ShopTNItemHeaderHoTro.js";
import SocketController from "../../../controller/SocketController.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import ShopTNItem from "../item/tainguyen/ShopTNItem.js";
import ScrollView from "../../component/listview/ScrollView.js";
import MainData from "../../../model/MainData.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllLoading from "../../ControllLoading.js";
import IPA from "../../../IPA.js";
import IPAIOS from "../../../IPAIOS.js";
import BaseLoadAsset from "../../BaseLoadAsset.js";

export default class HelpScreen extends BaseLoadAsset {
    constructor() {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {

            close: new Phaser.Signal()
        }
        /*this.content = new TextBase({
            x: 0,
            y: 0,
            style: {}
        }, "HelpScreen")
        this.addChild(this.content);*/
        this.arrResource = [
            {
                type: "spritesheet",
                link: "img/atlas/Mic1.png",
                key: "Mic1",
                width: 200,
                height: 140,
                countFrame: 16
            },
            {
                type: "spritesheet",
                link: "img/atlas/Mic2.png",
                key: "Mic2",
                width: 200,
                height: 140,
                countFrame: 16
            },
            {
                type: "spritesheet",
                link: "img/atlas/Mic3.png",
                key: "Mic3",
                width: 200,
                height: 140,
                countFrame: 60
            },
            {
                type: "spritesheet",
                link: "img/atlas/Mic4.png",
                key: "Mic4",
                width: 200,
                height: 140,
                countFrame: 60
            }
        ]


        let obj = {
            column: 2,
            width: game.width,
            height: game.height - 256 * MainData.instance().scale,
            rowHeight: 325 * MainData.instance().scale,
            leftDistance: 80 * MainData.instance().scale,
            direction: "y",
            distanceBetweenColumns: 55 * MainData.instance().scale,
            distanceBetweenRows: 35 * MainData.instance().scale
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 230 * MainData.instance().scale;
        this.addChild(this.scroll);


        this.loadResource();


        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_items_support);

    }

    loadFileComplete() {
        super.loadFileComplete();
        this.header = new ShopTNItemHeaderHoTro();
        this.header.event.back.add(this.chooseBackMenu, this)
        this.addChild(this.header);
        this.addEvent();
    }

    chooseBackMenu() {
        this.event.close.dispatch();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
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

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {
        LogConsole.log("cmd : " + data.cmd)
        LogConsole.log(data.params.getDump());
        switch (data.cmd) {
            case ShopCommand.RESOURCE_PACKAGE_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    MainData.instance().dataPackage = data.params;
                    this.dataServer = MainData.instance().dataPackage;
                    this.buildData();
                }
                ControllLoading.instance().hideLoading();
                break;
            case ShopCommand.RESOURCE_BUY_SUPPORT_ITEM_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    this.buyItemComplete(data.params.getInt("resource_up"));
                }
                break;
            case ShopCommand.RESOURCE_PACKAGE_WATCHED_ADS_CLAIM_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    if (data.params.getUtfString("resource_type") === "SUPPORT_ITEM") {
                        this.buyItemComplete(data.params.getInt("new_resource") - data.params.getInt("old_resource"));

                        MainData.instance().dataPackage = null;
                        if (MainData.instance().platform === "ios") {
                            IPAIOS.instance().getDataInapp();
                        } else {
                            IPA.instance().getDataInapp();
                        }
                    }
                }
                ControllLoading.instance().hideLoading();
                break;
        }
    }

    buyItemComplete(reward) {
        let dataObj = {
            type: "SUPPORT_ITEM",
            reward: reward,
            finishPoint: {
                x: 330 * MainData.instance().scale,
                y: 45 * MainData.instance().scale
            }
        }
        ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, dataObj);
    }


    buildData() {
        let list = [];
        let arrIcon = [];
        arrIcon = ["Mic1", "Mic2", "Mic3", "Mic4"];
        let idx = 0;
        for (let i = 0; i < this.dataServer.getSFSArray("resource_packages").size(); i++) {
            let resource = this.dataServer.getSFSArray("resource_packages").getSFSObject(i);
            console.log(resource);
            if (resource.getUtfString("resource_type") === "SUPPORT_ITEM") {
                console.log("mainData.platform : " + MainData.instance().platform);
                console.log("pricetype : " + resource.getUtfString("price_type"));
                /*
                if (resource.getUtfString("price_type") === "ADS") {

                } else {
                    let srtIcon = "";
                    if (idx < arrIcon.length) {
                        srtIcon = arrIcon[idx];
                    } else {
                        srtIcon = arrIcon[arrIcon.length - 1];
                    }
                    let item = new ShopTNItem(resource, srtIcon, true);
                    list.push(item);
                    idx++;
                }*/

                let srtIcon = "";
                if (idx < arrIcon.length) {
                    srtIcon = arrIcon[idx];
                } else {
                    srtIcon = arrIcon[arrIcon.length - 1];
                }
                let item = new ShopTNItem(resource, srtIcon, true);
                list.push(item);
                idx++;
            }
        }

        this.scroll.viewList = list;
    }

    destroy() {
        ControllScreenDialog.instance().removeAnimClaimReward();
        this.scroll.viewList = [];
        this.removeEvent();
        this.scroll.destroy();
        super.destroy();
    }
}