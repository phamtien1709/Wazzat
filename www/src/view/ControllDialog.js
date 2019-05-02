import DisconnectPopup from "./disconnect/DisconnectPopup.js";
import PlayScriptScreen from "./playscript/playScriptScreen.js";
import PopupDialog from "./popup/PopupDialog.js";
import BigAvatar from "./userprofile/item/BigAvatar.js";
import UpToVip from "./vip/items/UpToVip.js";

export default class ControllDialog extends Phaser.Group {
    constructor() {
        super(game)
        this.disconnect = null;
        this.playScript = null;
        this.dialog = null;
        this.bigAva = null;
        this.plsWait = null;
        this.upVip = null;
    }

    static instance() {
        if (this.controllDialog) {

        } else {
            this.controllDialog = new ControllDialog();
        }

        return this.controllDialog;
    }

    addPopupDisconnect() {
        this.removePopupDisconnect();
        this.disconnect = new DisconnectPopup();
        this.addChild(this.disconnect);
    }
    removePopupDisconnect() {
        if (this.disconnect !== null) {
            this.removeChild(this.disconnect);
            this.disconnect.destroy();
            this.disconnect = null;
        }
    }

    addPlayScript() {
        this.removePlayScript();
        this.playScript = new PlayScriptScreen();
        this.addChild(this.playScript);
    }
    removePlayScript() {
        if (this.playScript !== null) {
            this.removeChild(this.playScript);
            this.playScript.destroy();
            this.playScript = null;
        }
    }


    addDialog(content) {
        this.removeDialog();
        this.dialog = new PopupDialog(content);
        this.dialog.event.OK.add(this.removeDialog, this);
        this.addChild(this.dialog);
    }
    removeDialog() {
        if (this.dialog !== null) {
            this.removeChild(this.dialog);
            this.dialog.destroy();
            this.dialog = null;
        }
    }

    addBigAva(url) {
        this.removeBigAva();
        this.bigAva = new BigAvatar(url);
        this.addChild(this.bigAva);
    }
    removeBigAva() {
        if (this.bigAva !== null) {
            this.removeChild(this.bigAva);
            this.bigAva.destroy();
            this.bigAva = null;
        }
    }

    addPlsWait() {
        this.removePlsWait();
        this.plsWait = new Phaser.Text(game, game.width / 2, game.height / 2, 'Bạn vui lòng chờ một chút\nđể làm mới lại lần tiếp theo  ...', {
            "font": "GilroyMedium",
            "fill": "#ffffff",
            "fontSize": 19,
            "align": "center"
        });
        this.plsWait.anchor.set(0.5);
        let tweenPlsWait = game.add.tween(this.plsWait).to({ alpha: 0 }, 1500, "Linear", true);
        tweenPlsWait.start();
        this.addChild(this.plsWait);
    }

    addUpToVip() {
        this.removeUpToVip();
        this.upVip = new UpToVip();
        this.addChild(this.upVip);
    }
    removeUpToVip() {
        if (this.upVip !== null) {
            this.removeChild(this.upVip);
            this.upVip.destroy();
            this.upVip = null;
        }
    }


    removePlsWait() {
        if (this.plsWait !== null) {
            this.removeChild(this.plsWait);
            this.plsWait.destroy();
            this.plsWait = null;
        }
    }

    removeAllItem() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}