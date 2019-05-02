import ShopPlayList from "../../../model/shop/data/ShopPlayList.js";
import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../../view/component/ControllLoadCacheUrl.js";

export default class PracticePopupPlaylistSprite extends Phaser.Sprite {
    constructor(x, y, configs, state) {
        super(game, x, y, null);
        this.state = state;
        this.positionConfigs = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.valueScale = window.GameConfig.SCALE_PLAYLIST_PRACTICE;
        // this.scale.set(this.valueScale);
        this.configs = configs;
        this.thumbUrl = null;
        this.thumb;
        this.namePlaylist = null;
        this.boxPrice = null;
        this.btnChoose;
        this.maskThumb;
        this.signalInput = new Phaser.Signal();
        // LogConsole.log(this.configs);
    }

    afterCreate() {
        // this.inputEnabled = true;
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
        this.maskThumb.drawRoundedRect(0, 0, 280, 280, 20);
        this.addChild(this.maskThumb);
        this.thumb = new Phaser.Sprite(game, 0, 0, 'songDetailSprites', 'Nhactre');
        this.thumb.scale.set(window.GameConfig.SCALE_PLAYLIST_PRACTICE);
        this.thumb.mask = this.maskThumb;
        this.addChild(this.thumb);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.inputEnabled = false;
        let value = {
            name: this.configs.name,
            id: this.configs.id
        }
        this.state.practicePlaylist = value;
        this.sendSelectedPlaylistSoloMode(this.configs.id);
    }

    sendSelectedPlaylistSoloMode(id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", id);
        SocketController.instance().sendData(DataCommand.SOLO_MODE_PLAYLIST_SELECTED_REQUEST, params);
    }

    addBtnChoose(configs) {
        this.btnChoose = new Phaser.Sprite(game, configs.btn.x, configs.btn.y, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btnChoose.inputEnabled = true;
        this.btnChoose.events.onInputUp.add(this.onClickSprite, this);
        let txtChoose = new Phaser.Text(game, configs.txt.x, configs.txt.y, Language.instance().getData("226"), configs.txt.configs);
        txtChoose.anchor.set(0.5, 0);
        this.btnChoose.addChild(txtChoose);
        // this.btnChoose.scale.set(1 / this.valueScale);
        this.addChild(this.btnChoose);
    }

    addNamePlaylist() {
        this.namePlaylist = new Phaser.Text(game, 0, 305, this.configs.name, {
            "font": "36px Gilroy",
            "fill": "#ffffff",
            "boundsAlignH": "center",
            "boundsAlignV": "middle",
            "fontWeight": 400,
            "wordWrap": true,
            "wordWrapWidth": 260
        });
        this.addChild(this.namePlaylist);
    }

    addBoxPrice(configs) {
        LogConsole.log('has price');
        this.boxPrice = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        this.boxPrice.inputEnabled = true;
        this.boxPrice.events.onInputUp.add(this.onClickBuy, this);
        // this.boxPrice.scale.set(1 / this.valueScale);
        let gem = this.addGem(this.positionConfigs.practice_gem_box_price);
        let price = this.addPrice(this.positionConfigs.practice_txt_price);
        let sumWidth = gem.width + price.width;
        price.x = ((this.boxPrice.width - sumWidth) / 2) - 5;
        gem.x = ((this.boxPrice.width - sumWidth) / 2) + price.width + 10;
        this.boxPrice.addChild(gem);
        this.boxPrice.addChild(price);
        this.addChild(this.boxPrice);
    }

    onClickBuy() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        var playlistBuy = new ShopPlayList();
        playlistBuy = Object.assign({}, playlistBuy, this.configs);
        LogConsole.log(playlistBuy);
        // ControllWorld.instance().buyItem(playlistBuy);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
    }

    addPrice(configs) {
        return new Phaser.Text(game, configs.x, configs.y, this.configs.price, configs.configs);
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
        this.thumb.loadTexture(`${this.key}`);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }

    addEventInput(callback, scope) {
        // callback();
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }
}