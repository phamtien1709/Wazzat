import SongDetailSprite from "./SongDetailSprite.js";
import SongDetailButtonShare from "./SongDetailButtonShare.js";
import SongDetailButtonLike from "./SongDetailButtonLike.js";
import SongDetailOtherOnBottom from "./SongDetailOtherOnBottom.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import SocketController from "../../controller/SocketController.js";
import IronSource from "../../IronSource.js";
import DataCommand from "../../common/DataCommand.js";
import ControllLoading from "../ControllLoading.js";
import Common from "../../common/Common.js";

export default class SongDetailScreen extends Phaser.Button {
    constructor(configsValue) {
        super(game, 0, 0, 'bg_create_room');
        this.songDetailScreenConfig = JSON.parse(game.cache.getText('songDetailScreenConfig'));
        this.configsValue = configsValue;
        this.afterInit();
    }

    static get LINK_ZING_MP3() {
        return 'mp3zing';
    }

    static get LINK_YOUTUBE() {
        return 'youtube';
    }

    afterInit() {
        this.headerTab;
        this.songDetail;
        this.btnShare;
        this.btnLike;
        this.otherOnBottom;
        //
        this.addHeaderTab(this.songDetailScreenConfig.header);
        this.addBtnShare();
        this.addBtnLike();
        //
        IronSource.instance().showBanerInfoSongScreen();
        this.addEventExtension();
        this.sendGetDetail();
    }

    sendGetDetail() {
        ControllLoading.instance().showLoading();
        let params = new SFS2X.SFSObject();
        params.putLong('song_id', this.configsValue.id);
        SocketController.instance().sendData(DataCommand.SONG_DETAIL_REQUEST, params);
    }

    addEventExtension() {
        SocketController.instance().events.onExtensionResponse.add(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().events.onExtensionResponse.remove(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SONG_DETAIL_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleResponseSong(evtParams.params);
                ControllLoading.instance().hideLoading();
                this.addSongDetail();
                this.addOtherOnBottom();
            }
        }
    }

    handleResponseSong(params) {
        let song = params.getSFSObject('song');
        if (song.containsKey('file_path')) {
            let file_path = song.getUtfString('file_path');
            let singer = song.getSFSObject('singer');
            let avaSinger = singer.getUtfString('avatar');
            let title = song.getUtfString('title');
            this.configsValue.fileName = file_path;
            this.configsValue.listenLink = file_path;
            this.configsValue.thumb = avaSinger;
            this.configsValue.title = title;
        }
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.borderDiamond;
        this.diamond;
        this.txtDiamond;
        this.addButtonBack(configs);
        this.addBorderDiamond(configs);
        this.addDiamond(configs);
        // this.add
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.btn_back.x * window.GameConfig.RESIZE, configs.btn_back.y * window.GameConfig.RESIZE, configs.btn_back.nameAtlas, configs.btn_back.nameSprite);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerTab.addChild(this.btnBack);
    }

    onBack() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.destroy();
        this.songDetail.removeMethod();
    }

    addBorderDiamond(configs) {
        this.borderDiamond = new Phaser.Sprite(game, configs.border_diamond.x * window.GameConfig.RESIZE, configs.border_diamond.y * window.GameConfig.RESIZE, configs.border_diamond.nameAtlas, configs.border_diamond.nameSprite);
        this.headerTab.addChild(this.borderDiamond);
    }

    addDiamond(configs) {
        this.diamond = new Phaser.Sprite(game, configs.diamond.x * window.GameConfig.RESIZE, configs.diamond.y * window.GameConfig.RESIZE, configs.diamond.nameAtlas, configs.diamond.nameSprite);
        this.borderDiamond.addChild(this.diamond);
        this.txtDiamond = new Phaser.Text(game, configs.txt_diamond.x * window.GameConfig.RESIZE, configs.txt_diamond.y * window.GameConfig.RESIZE, Common.shortValueNumber(SocketController.instance().dataMySeft.diamond, 2), configs.txt_diamond.configs);
        this.borderDiamond.addChild(this.txtDiamond);
        let wdt = this.diamond.width + this.txtDiamond.width;
        this.txtDiamond.x = (this.borderDiamond.width - wdt) / 2;
        this.diamond.x = this.txtDiamond.x + this.txtDiamond.width + 10;
    }

    addSongDetail() {
        this.songDetail = new SongDetailSprite(320 * window.GameConfig.RESIZE, 160 * window.GameConfig.RESIZE, this.configsValue);
        this.addChild(this.songDetail);
    }

    addBtnShare() {
        this.btnShare = new SongDetailButtonShare(35 * window.GameConfig.RESIZE, 535 * window.GameConfig.RESIZE);
        this.addChild(this.btnShare);
    }

    addBtnLike() {
        this.btnLike = new SongDetailButtonLike(329 * window.GameConfig.RESIZE, 535 * window.GameConfig.RESIZE);
        this.addChild(this.btnLike);
    }

    addOtherOnBottom() {
        this.otherOnBottom = new SongDetailOtherOnBottom(0, 705 * window.GameConfig.RESIZE, this.configsValue);
        this.addChild(this.otherOnBottom);
    }

    destroy() {
        // this.removeEvent();
        this.removeEventExtension();
        IronSource.instance().hideBanner();
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