import SocketController from "./controller/SocketController.js";
import ShopCommand from "./model/shop/datafield/ShopCommand.js";
import MainData from "./model/MainData.js";
import SendShopGetResourcePackage from "./model/shop/server/senddata/SendShopGetResourcePackage.js";
import Language from "./model/Language.js";

export default class IPA {
	constructor() {
		this.ktIPA = false;
		SocketController.instance().events.onExtensionResponse.add(this.getData, this);
		if (typeof store !== 'undefined') {
			this.ktIPA = true;
		}

		if (this.ktIPA === true) {
			store.verbosity = store.INFO;
			store.autoFinishTransactions = true;
			store.ready(() => {
				console.log("\\o/ STORE READY \\o/");
			});
			store.refresh();
		}

		this.ktLoad = false;

		this.event = {
			buy_complete: new Phaser.Signal(),
			buy_error: new Phaser.Signal()
		}

		this.ktCall = false;
	}

	static instance() {
		if (this.ipa) {

		} else {
			this.ipa = new IPA();
		}
		return this.ipa;
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

				if (MainData.instance().tokenYanAccount === "") {
					payment_service = SendShopGetResourcePackage.FACEBOOK;
				} else {
					payment_service = SendShopGetResourcePackage.GAME;
				}
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
						LogConsole.log(data.params);
						if (this.ktIPA === true) {
							let arrProduct = [];
							/*
							store.register({
								id: "wazzat.diamond.tinny",
								alias: "wazzat.diamond.tinny",
								type: store.CONSUMABLE
							});*/

							for (let i = 0; i < MainData.instance().dataPackage.getSFSArray("resource_packages").size(); i++) {
								let dataPackage = MainData.instance().dataPackage.getSFSArray("resource_packages").getSFSObject(i);
								if (dataPackage.getUtfString("pack_name") !== "") {
									store.register({
										id: dataPackage.getUtfString("pack_name"),
										alias: dataPackage.getUtfString("pack_name"),
										type: store.CONSUMABLE
									});
								}
							}

							store.refresh();
						}
					}
				}
				break;
		}
	}

	buyItem(data) {
		if (this.ktIPA === true) {

			this.ktCall = false;

			let pack_name = data.getUtfString("pack_name");
			//pack_name = pack_name;
			//pack_name = "wazzat.diamond.tinny";
			//this.data.getUtfString("pack_name");
			console.log("pack_name : " + pack_name);



			store.order(pack_name).then(() => {
				console.log('success')
			}).error((err) => {
				console.log('error..' + err.code);
				this.event.buy_error.dispatch(err.code);
			});


			store.when(pack_name).approved((product) => {
				console.log("approved");
				console.log(product);
				if (device.platform == 'android' || device.platform == 'Android') {
					console.log("1111111111111");
					product.finish();
				} else {
					console.log("2222222222222");
					product.verify();
				}
			});

			store.validator = (product) => {

				console.log("validator");
				console.log(product);
			}

			store.when(pack_name).verified((product) => {
				if (product.hasOwnProperty("transaction")) {
					if (product.transaction.hasOwnProperty("appStoreReceipt")) {
						if (this.ktCall === false) {
							this.ktCall = true;
							this.callToServerIos(
								data.getInt("id"),
								data.getInt("quantity"),
								data.getUtfString("resource_type"),
								data.getInt("price"),
								product.transaction.appStoreReceipt
							)
							product.finish();
						}
					}
				}
			});

			store.error((error) => {
				console.log('ERROR ' + error.code + ': ' + error.message);
				this.event.buy_error.dispatch(error.message);
			});


			store.when(pack_name).cancelled((order) => {
				console.log("cancelled");
				console.log(order);
				this.event.buy_error.dispatch("");
			});

			store.when(pack_name).error((order) => {
				console.log("error");
				console.log(order);
				this.event.buy_error.dispatch("");
			});




			store.when(pack_name).updated((product) => {
				console.log("updated");
				console.log(product);
				if (product.loaded && product.valid && product.state === store.APPROVED && product.transaction != null) {
					product.finish();
				}
			});

			//store.trigger("refreshed");

			store.when(pack_name).finished((p) => {
				console.log("finished----------------------------");
				console.log(pack_name + " finished " + p.state + ", title is " + p.title + " " + JSON.stringify(p));
				console.log(p);


				let transid;
				let receipt;
				if (device.platform == 'android' || device.platform == 'Android') {
					if (this.ktCall === false) {
						this.ktCall = true;
						transid = p.transaction.purchaseToken;
						receipt = JSON.parse(p.transaction.receipt);
						this.callToServerAndroid(
							receipt.orderId,
							receipt.packageName,
							receipt.productId,
							receipt.purchaseToken,
							receipt.purchaseTime,
							data.getInt("id"),
							data.getInt("quantity"),
							data.getUtfString("resource_type"),
							data.getInt("price")
						)
					}
				}
				else {
					transid = p.transaction.id;
				}
			});


		} else {
			this.event.buy_error.dispatch(Language.instance().getData("182"));
		}


	}


	callToServerFacebook(linkProduct) {
		// console.log("callToServerFacebook : " + linkProduct);
		FB.ui(
			{
				method: "pay",
				action: "purchaseitem",
				product: linkProduct
			},
			this.buyFacebookItemComplete.bind(this)
		);
	}

	buyFacebookItemComplete(result) {
		console.log("result -----------------");
		console.log(result);
		if (result === undefined) {
			this.event.buy_error.dispatch(Language.instance().getData("183"));
		} else {
			if (result.hasOwnProperty("status") && result.status === "completed") {
				let postData = {
					signed_request: result.signed_request
				};
				console.log("url : " + window.RESOURCE.in_app_facebook_validator);
				console.log("postData");
				console.log(postData);
				$.ajax({
					url: window.RESOURCE.in_app_facebook_validator,
					type: "POST",
					data: postData,
					dataType: "json",
					success: (res) => {
						LogConsole.log("callToServerFacebook");
						LogConsole.log(res);
						if (res.hasOwnProperty("error_message")) {
							this.event.buy_error.dispatch(res.error_message);
						} else {
							this.event.buy_complete.dispatch(res);
						}
					},
					error: (xhr, ajaxOptions, thrownError) => {
						console.error("Error get server infomation");
						console.error(thrownError);
						console.error(xhr.status);
						console.error(xhr.responseJSON);
						if (xhr.hasOwnProperty("error_message")) {
							this.event.buy_error.dispatch(xhr.error_message);
						} else {
							this.event.buy_error.dispatch(Language.instance().getData("183"));
						}
					}
				})
			} else {
				this.event.buy_error.dispatch(Language.instance().getData("183"));
			}
		}
	}


	callToServerIos(resourcePackageId, resourceQuantity,
		resourceType, resourcePrice, receiptBase64Data) {

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

	callToServerAndroid(orderId, packageName, productId, purchaseToken,
		purchaseTime, resourcePackageId, resourceQuantity,
		resourceType, resourcePrice) {

		console.log("callToServerAndroid");

		let postData = {
			userId: SocketController.instance().dataMySeft.user_id,
			orderId,
			packageName,
			productId,
			purchaseToken,
			purchaseTime,
			resourcePackageId,
			resourceQuantity,
			resourceType,
			resourcePrice
		};
		console.log("postData");
		console.log(postData);
		$.ajax({
			url: window.RESOURCE.in_app_google_validator,
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
}