import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import MainData from "../../model/MainData.js";
import DataUser from "../../model/user/DataUser.js";

export default class DisconnectPopup extends Phaser.Button {
    constructor() {
        super(game, 0, 0, 'screen-dim');
        this.input.useHandCursor = false;
        this.positionDisconnectConfig = JSON.parse(game.cache.getText('positionDisconnectConfig'));
        this.popup;
        this.signalInput = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.addPopup(this.positionDisconnectConfig.popup);
    }

    addPopup(configs) {
        this.popup = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + configs.y) * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.animDisc;
        this.btn;
        this.txtDisconnect;
        this.addChild(this.popup);
        this.addAnim();
        this.addBtn(this.positionDisconnectConfig.btn);
        this.addTxtDisconnect(this.positionDisconnectConfig.txtDis);
    }

    addAnim() {
        this.animDisc = new Phaser.Sprite(game, 285 * window.GameConfig.RESIZE, 60 * window.GameConfig.RESIZE, 'disconnect');
        this.animDisc.anchor.set(0.5, 0);
        var runAnimDisc = this.animDisc.animations.add('run_anim_dis');
        this.animDisc.animations.play('run_anim_dis', 20, true);
        this.popup.addChild(this.animDisc);
    }

    addBtn(configs) {
        this.btn = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btn.inputEnabled = true;
        // this.btn.anchor.set(0.5, 0);
        this.btn.events.onInputUp.addOnce(this.onClickRetry, this);
        this.popup.addChild(this.btn);
        this.txtBtn;
        this.addTxtBtn(this.positionDisconnectConfig.txtBtn);
    }

    onClickRetry() {
        this.btn.inputEnabled = false;
        LogConsole.log("Retry");
        this.onConnectServer();
    }

    onConnectServer() {
        //DataUser.instance().resetData();
        //MainData.instance().soloModePlaylists = [];
        ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
        this.destroy();
    }

    addTxtDisconnect(configs) {
        this.txtDisconnect = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs); this.txtDisconnect.anchor.set(0.5, 0);
        this.popup.addChild(this.txtDisconnect);
    }

    addTxtBtn(configs) {
        this.txtBtn = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.txtBtn.anchor.set(0.5, 0);
        this.btn.addChild(this.txtBtn);
    }

    addEventInput(callback, scope) {
        this.signalInput.add(callback, scope);
    }

    destroy() {
        // EventGame.instance().event.onConnectServer.remove(this.onConnectServer, this);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}