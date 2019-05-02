import ShopPlayList from "../../../model/shop/data/ShopPlayList.js";
import SocketController from "../../../controller/SocketController.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../BaseGroup.js";

export default class PracticePopupPlaylistSprite extends BaseGroup {
    constructor(x, y, configs, index) {
        super(game);
        this.x = x;
        this.y = y;
        this.positionConfigs = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.valueScale = window.GameConfig.SCALE_PLAYLIST_PRACTICE;
        this.configs = configs;
        this.thumbUrl = null;
        this.thumb;
        this.namePlaylist = null;
        this.boxPrice = null;
        this.btnChoose;
        this.maskThumb;
        this.signalInput = new Phaser.Signal();
        this.signalBuyPlaylist = new Phaser.Signal();
        this.signalGetRanking = new Phaser.Signal();
        this.index = index;
        this.id = Math.random() * 10;
        this.addEvent();
    }

    afterCreate() {
        this.addThumb();
        this.addNamePlaylist();
        if (this.configs.is_owner !== 1) {
            this.addBoxPrice(this.positionPracticeScreenConfig.practice_box_price);
        } else {
            this.addBtnChoose(this.positionPracticeScreenConfig.btn_choose);
        }
    }

    addThumb() {
        this.maskThumb = new Phaser.Graphics(game, 0, 0);
        this.maskThumb.beginFill(0xffffff);
        this.maskThumb.drawRoundedRect(0, 0, 165 * window.GameConfig.RESIZE, 165 * window.GameConfig.RESIZE, 10 * window.GameConfig.RESIZE);
        this.addChild(this.maskThumb);
        this.thumb = new Phaser.Sprite(game, 0, 0, 'songDetailSprites', 'Nhactre');
        this.thumb.scale.set(window.GameConfig.SCALE_PLAYLIST_PRACTICE * window.GameConfig.RESIZE);
        let rank = new Phaser.Sprite(game, 10, 10, 'practiceMenuSprites', 'Ranking');
        this.thumb.addChild(rank);
        this.thumb.mask = this.maskThumb;
        this.thumb.inputEnabled = true;
        this.thumb.events.onInputUp.add(this.clickThumb, this);
        this.addChild(this.thumb);
    }

    clickThumb() {
        this.signalGetRanking.dispatch(this.configs);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.btnChoose.inputEnabled = false;
        let value = {
            name: this.configs.name,
            id: this.configs.id
        }
        this.practicePlaylist = value;
        this.signalInput.dispatch(value);

        this.timeoutInput = setTimeout(() => {
            this.btnChoose.inputEnabled = true
        }, 500);
    }

    addBtnChoose(configs) {
        this.btnChoose = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, configs.btn.y * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnChoose.inputEnabled = true;
        this.btnChoose.events.onInputUp.add(this.onClickSprite, this);
        let txtChoose = new Phaser.Text(game, configs.txt.x * window.GameConfig.RESIZE, configs.txt.y * window.GameConfig.RESIZE, Language.instance().getData("226"), configs.txt.configs);
        txtChoose.anchor.set(0.5, 0);
        this.btnChoose.addChild(txtChoose);
        this.addChild(this.btnChoose);
    }

    addNamePlaylist() {
        this.namePlaylist = new Phaser.Text(game, 0, 180 * window.GameConfig.RESIZE, this.configs.name, {
            "font": "Gilroy",
            "fill": "#ffffff",
            "wordWrap": true,
            "wordWrapWidth": 150,
            "maxLines": 2,
            "fontSize": 20
        });
        this.addChild(this.namePlaylist);
    }

    addBoxPrice(configs) {
        LogConsole.log('has price');
        this.boxPrice = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.boxPrice.inputEnabled = true;
        this.boxPrice.events.onInputUp.add(this.onClickBuy, this);
        let gem = this.addGem(this.positionPracticeScreenConfig.practice_gem_box_price);
        let price = this.addPrice(this.positionPracticeScreenConfig.practice_txt_price);
        let sumWidth = gem.width + price.width;
        price.x = ((this.boxPrice.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.boxPrice.width - sumWidth) / 2) + price.width + 5 * window.GameConfig.RESIZE;
        this.boxPrice.addChild(gem);
        this.boxPrice.addChild(price);
        this.addChild(this.boxPrice);
    }

    onClickBuy() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.playlistBuy = new ShopPlayList();
        this.playlistBuy = Object.assign({}, this.playlistBuy, this.configs);
        ControllScreenDialog.instance().buyItem(this.playlistBuy);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addPrice(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.configs.price, configs.configs);
    }

    loadThumb() {
        this.key = this.configs.thumb;
        if (game.cache.checkImageKey(this.configs.thumb)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.key);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            try {
                if (game.cache.checkImageKey(this.key)) {
                    this.thumb.loadTexture(`${this.key}`);
                } else {
                    this.thumb.loadTexture('songDetailSprites', 'Nhactre');
                }
            } catch (error) {

            }
        }, this.index * 100);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }

    addEventInput(callback, scope) {
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }
    getData(data) {
        switch (data.cmd) {
            case ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE:
                if (data.params.getUtfString('status') == "OK") {
                    if (data.params.getInt('playlist_id') == this.configs.id) {
                        ControllScreenDialog.instance().addPopupBuyDone(this.configs.id, true);
                        this.signalBuyPlaylist.dispatch(this.configs);
                    }
                }
                break;
        }
    }

    destroy() {
        clearTimeout(this.timeoutInput);
        this.removeEvent();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        super.destroy();
    }
}