import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import LevelPlaylist from "../../base/LevelPlaylist.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../BaseGroup.js";

export default class PopupShortProfilePlaylist extends BaseGroup {
    constructor(playlist, index = 2) {
        super(game);
        this.positionUserProfile = MainData.instance().positionPopup
        this.playlist = playlist;
        this.index = index;
        this.afterInit();
    }

    afterInit() {
        this.avaPlaylist;
        this.namePlaylist;
        this.levelPlaylist;
        this.addNamePlaylist();
        this.addLevelPlaylist();
        this.addAvaPlaylist();
        this.beginLoadAvaPlaylist();
    }

    addNamePlaylist() {
        this.namePlaylist = new TextBase(this.positionUserProfile.short_profile.playlist.name_playlist, this.playlist.name);
        this.namePlaylist.anchor.set(0, 0.5);
        this.addChild(this.namePlaylist);
    }

    addLevelPlaylist() {
        this.levelPlaylist = new LevelPlaylist(this.playlist.user, false);
        this.levelPlaylist.x = 700 * window.GameConfig.RESIZE;
        this.levelPlaylist.y = 60 * window.GameConfig.RESIZE;
        this.levelPlaylist.scale.set(0.75);
        this.addChild(this.levelPlaylist);
    }

    addAvaPlaylist() {
        this.avaPlaylist = new Phaser.Sprite(game, this.positionUserProfile.short_profile.playlist.ava_playlist.x * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.playlist.ava_playlist.y * window.GameConfig.RESIZE, this.positionUserProfile.short_profile.playlist.ava_playlist.nameAtlas, this.positionUserProfile.short_profile.playlist.ava_playlist.nameSprite);
        this.avaPlaylist.scale.set(window.GameConfig.SCALE_PLAYLIST_POPUP_SHORT_PROFILE * window.GameConfig.RESIZE);
        this.addChild(this.avaPlaylist);
    }

    beginLoadAvaPlaylist() {
        // LogConsole.log(this.playlist);
        // this.key = this.playlist.thumb;
        if (game.cache.checkImageKey(this.playlist.thumb)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.playlist.thumb);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            try {
                this.avaPlaylist.loadTexture(`${this.playlist.thumb}`);
            } catch (error) {

            }
        }, this.index * 100);
    }

    get height() {
        return 170 * window.GameConfig.RESIZE;
    }
}