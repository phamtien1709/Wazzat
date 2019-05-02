import PopupConfirmItem from "../../../view/popup/item/PopupConfirmItem.js";
import Language from "../../../model/Language.js";
import ImageLoaderIllegal from "../../../Component/ImageLoaderIllegal.js";

export default class IllegalTurnPopup extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'screen-dim');
        this.input.useHandCursor = false;
        this.signalInput = new Phaser.Signal();
        this.afterInit();
        // this.popup = null;
    }

    afterInit() {
        this.avaOpp;
        this.nameOpp;
        this.avaUrl;
    }

    setAvaUrl(url, vip = false) {
        this.avaUrl = url;
        this.vip = vip;
    }

    setTxtNameOpp(name) {
        this.txtNameOpp = name;
    }

    addPopup() {
        this.removePopupConfirm();
        this.popup = new PopupConfirmItem();
        this.popup.x = 35 * window.GameConfig.RESIZE;
        this.popup.y = 372 * window.GameConfig.RESIZE;
        this.popup.setTextCancle(Language.instance().getData("309"));
        this.popup.setContent(`${this.txtNameOpp}${Language.instance().getData("310")}`);
        this.popup.txtContent.addColor('#ffab4f', 0);
        this.popup.txtContent.addColor('#000000', this.txtNameOpp.length);
        this.popup.event.OK.add(this.onOK, this);
        this.popup.event.CANCLE.add(this.onCancle, this);
        this.addChild(this.popup);
        this.addAvaAndNameOpp();
    }

    onOK() {
        LogConsole.log('onOK');
        this.popup.destroy();
        this.popup = null;
        this.signalInput.dispatch("OK");
        this.destroy();
    }

    onCancle() {
        LogConsole.log('ononCancle');
        this.popup.destroy();
        this.popup = null;
        this.signalInput.dispatch("CANCLE");
        this.destroy();
    }

    removePopupConfirm() {
        if (this.popup !== null && this.popup !== undefined) {
            this.popup.destroy();
            this.popup = null;
        }
    }

    addAvaAndNameOpp() {
        this.avaOpp = new ImageLoaderIllegal(0);
        this.avaOpp.x = 284 * window.GameConfig.RESIZE;
        this.avaOpp.beginLoad(this.avaUrl);
        // this.avaOpp.anchor.set(0.5);
        this.avaOpp.addMaskAva(184);
        this.avaOpp.setScale();
        this.popup.addChild(this.avaOpp);
        //
        if (this.vip === true) {
            this.frameVip = new Phaser.Sprite(game, this.avaOpp.x, this.avaOpp.y + 5, 'vipSource', 'Ava_Popup')
            this.frameVip.anchor.set(0.5);
            this.popup.addChild(this.frameVip);
        }
    }
}