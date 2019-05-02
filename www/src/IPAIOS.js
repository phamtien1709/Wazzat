import SocketController from "./controller/SocketController.js";
import ShopCommand from "./model/shop/datafield/ShopCommand.js";
import MainData from "./model/MainData.js";
import SendShopPlayListLoad from "./model/shop/server/senddata/SendShopPlayListLoad.js";
import SendShopGetResourcePackage from "./model/shop/server/senddata/SendShopGetResourcePackage.js";
import ControllLoading from "./view/ControllLoading.js";
import Language from "./model/Language.js";

export default class IPAIOS {
    constructor() {
        this.ktIPA = false;
        this.ktCall = false;

        this.event = {
            buy_complete: new Phaser.Signal(),
            buy_error: new Phaser.Signal()
        }
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);

        if (window.Cocoon && Cocoon.InApp) {
            this.ktIPA = true;
            this.service = Cocoon.InApp;
            this.service.on("purchase", {
                start: (productId) => {
                    console.log("purchase started " + productId);
                },
                error: (productId, error) => {
                    console.log("purchase failed " + productId + " error: " + JSON.stringify(error));
                    this.event.buy_error.dispatch(error.message);
                },
                complete: (purchase) => {
                    console.log("purchase completed " + JSON.stringify(purchase));
                }
            });

            // this.Service initialization
            this.service.initialize({
                autofinish: true
            }, (error) => {
                console.log(error);
            }
            );
            this.service.setValidationHandler(this.setupCompletePurchase.bind(this));


        }
    }

    setupCompletePurchase(receipt, productId, completion) {
        console.log("setValidationHandler");
        console.log(productId);

        this.callToServerIos(
            this.data.getInt("id"),
            this.data.getInt("quantity"),
            this.data.getUtfString("resource_type"),
            this.data.getInt("price"),
            receipt
        );
    }


    callToServerIos(resourcePackageId, resourceQuantity,
        resourceType, resourcePrice, receiptBase64Data) {
        ControllLoading.instance().showLoading();

        console.log("receiptBase64Data: " + receiptBase64Data);
        console.log("callToServerIos");
        let postData = {
            userId: SocketController.instance().dataMySeft.user_id,
            resourcePackageId: resourcePackageId,
            resourceQuantity: resourceQuantity,
            resourceType: resourceType,
            resourcePrice: resourcePrice,
            receiptBase64Data: receiptBase64Data
        };
        console.log("url : " + window.RESOURCE.in_app_apple_validator);
        console.log("postData");
        console.log(postData);
        $.ajax({
            url: window.RESOURCE.in_app_apple_validator,
            type: "POST",
            data: postData,
            dataType: "json",
            success: (res) => {
                LogConsole.log("callToServerAndroid");
                LogConsole.log(res);
                this.event.buy_complete.dispatch(res);
            },
            error: (xhr, ajaxOptions, thrownError) => {
                console.error("Error get server infomation");
                console.error(thrownError);
                console.error(xhr.status);
                console.error(xhr.responseJSON);
                this.event.buy_error.dispatch(Language.instance().getData("183"));
            }
        })
    }

    buyItem(data) {
        if (this.ktIPA) {
            this.data = data;
            this.ktCall = false;

            let productId = data.getUtfString("pack_name");

            this.service.purchase(productId, 1, (error) => {
                console.log("error")
                console.log(error);
                this.event.buy_error.dispatch(error.message);
            });

            this.service.isPurchased(productId); //check if a product is purchased
        }
    }

    getDataInapp() {
        if (MainData.instance().dataPackage === null) {
            this.ktLoad = true;
            let payment_service = "";
            if (this.ktIPA === true) {
                if (device.platform.toLowerCase() === "android") {
                    payment_service = SendShopGetResourcePackage.GOOGLE_PLAY;
                } else if (device.platform.toLowerCase() === "ios") {
                    payment_service = SendShopGetResourcePackage.APPLE;
                } else if (device.platform.toLowerCase() === "amazon-fireos") {
                    payment_service = SendShopGetResourcePackage.AMAZON_IAP;
                } else {
                    payment_service = SendShopGetResourcePackage.GAME;
                }
            } else {
                payment_service = SendShopGetResourcePackage.GAME;
            }
            SocketController.instance().sendData(ShopCommand.RESOURCE_PACKAGE_LOAD_REQUEST, SendShopGetResourcePackage.begin(payment_service));
        }
    }

    getData(data) {
        switch (data.cmd) {
            case ShopCommand.RESOURCE_PACKAGE_LOAD_RESPONSE:
                if (this.ktLoad === true) {
                    this.ktLoad = false;
                    if (data.params.getUtfString("status") === "OK") {
                        MainData.instance().dataPackage = data.params;
                    }
                }
                break;
        }
    }

    static instance() {
        if (this.ipa) {

        } else {
            this.ipa = new IPAIOS();
        }
        return this.ipa;
    }
}