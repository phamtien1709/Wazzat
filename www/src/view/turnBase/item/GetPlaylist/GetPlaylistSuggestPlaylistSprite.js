import ShopPlayList from "../../../../model/shop/data/ShopPlayList.js";
import ShopCommand from "../../../../model/shop/datafield/ShopCommand.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import DataUser from "../../../../model/user/DataUser.js";
import ControllLoadCacheUrl from "../../../component/ControllLoadCacheUrl.js";

export default class GetPlaylistSuggestPlaylistSprite extends Phaser.Sprite {
    constructor(configs, value) {
        // LogConsole.log(configs);
        // LogConsole.log(value);
        super(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.configsValue = value;
        this.initChild();
    }

    addEvent() {
        // SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.buy_playlist.add(this.buyPlaylistDone, this);
    }
    removeEvent() {
        // SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.buy_playlist.remove(this.buyPlaylistDone, this);
    }
    getData(data) {
        //LogConsole.log("ShopPlayList : " + data.params.getDump());   
        switch (data.cmd) {
            case ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE:
                // LogConsole.log(data.params.getDump());
                this.signalInput.dispatch({
                    isBuyDone: true
                })
                break;
        }
    }

    buyPlaylistDone() {
        this.signalInput.dispatch({
            isBuyDone: true
        })
    }

    initChild() {
        this.avaThumb = null;
        this.tabGem = null;
        this.txtPlaylist = null;
        this.txtGem = null;
        this.signalInput = new Phaser.Signal();
        this.inputEnabled = true;
        this.txtNoHasPlaylist = null;
        this.addEvent();
    }

    checkHasSuggestPlaylist(playlist, callback) {
        if (playlist) {
            if (playlist.id == null) {
                callback(false);
            } else {
                callback(true);
            }
        } else {
            callback(false);
        }
    }

    addInput(callback, scope) {
        this.removeEventInput(callback, scope);
        this.addEventInput(callback, scope);
        this.events.onInputUp.add(this.onClickSprite, this);
    }

    addEventInput(callback, scope) {
        // callback();
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.configsValue.isFree == 1) {
            // LogConsole.log('suggest playlist');
            this.signalInput.dispatch({
                id: this.configsValue.id,
                isBuy: null
            });
        }
        if (this.configsValue.isFree == 0) {
            var playlistBuy = new ShopPlayList();
            playlistBuy = Object.assign({}, playlistBuy, this.configsValue);
            // LogConsole.log(playlistBuy);
            ControllScreenDialog.instance().buyItem(playlistBuy);
        }
    }

    addThumb() {
        this.thumb = new Phaser.Sprite(game, 35 * window.GameConfig.RESIZE, 19 * window.GameConfig.RESIZE, 'songDetailSprites', 'Nhactre');
        this.thumb.scale.set(105 / 165);
        //
        var maskThumb = new Phaser.Graphics(game, 0, 0);
        maskThumb.beginFill(0xffffff);
        maskThumb.drawRoundedRect(35 * window.GameConfig.RESIZE, 19 * window.GameConfig.RESIZE, 105 * window.GameConfig.RESIZE, 105 * window.GameConfig.RESIZE, 20 * window.GameConfig.RESIZE);
        this.addChild(maskThumb);
        this.addChild(this.thumb);
        this.thumb.mask = maskThumb;
    }

    addTextNoHasPlaylist() {
        this.txtNoHasPlaylist = new Phaser.Text(game, this.width / 2 * window.GameConfig.RESIZE, this.height / 2 * window.GameConfig.RESIZE, 'BẠN ĐÃ ĐỦ HẾT PLAYLIST', {
            "font": "GilroyBold",
            "fill": "white",
            "align": "center",
            "fontSize": 30
        });
        this.txtNoHasPlaylist.anchor.set(0.5);
        this.addChild(this.txtNoHasPlaylist);
    }

    addTabGem(configs1, configs2) {
        if (this.configsValue.isFree == 0) {
            this.tabGem = new Phaser.Sprite(game, configs1.x * window.GameConfig.RESIZE, configs1.y * window.GameConfig.RESIZE, configs1.nameAtlas, configs1.nameSprite);
            this.addChild(this.tabGem);
        } else if (this.configsValue.isFree == 1) {
            this.tabGem = new Phaser.Text(game, configs2.x * window.GameConfig.RESIZE, configs2.y * window.GameConfig.RESIZE, configs2.text, configs2.configs);
            this.tabGem.anchor.set(1, 0);
            this.addChild(this.tabGem);
        }

    }

    addTxtPlaylist(name, configs) {
        this.txtPlaylist = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, name, configs.configs);
        this.addChild(this.txtPlaylist);
    }

    addTxtGem(price, configs) {
        if (this.configsValue.isFree == 0) {
            this.txtGem = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, price, configs.configs);
            let gem = new SpriteBase(configs.gem);
            this.tabGem.addChild(gem);
            this.tabGem.addChild(this.txtGem);
        }
    }

    beginLoadThumb(url) {
        this.key = url;
        if (game.cache.checkImageKey(url)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(url);
        }
    }

    loadStart() {

    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        if (game.cache.checkImageKey(this.key)) {
            this.thumb.loadTexture(`${this.key}`);
        }
    }

    destroy() {
        this.removeEvent();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}