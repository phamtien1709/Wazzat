import ImageLoader from "../../../Component/ImageLoader.js";
import GetPlaylistSuggestPlaylist from "./GetPlaylist/GetPlaylistSuggestPlaylist.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import ListView from "../../../../libs/listview/list_view.js";
import LevelPlaylist from "../../base/LevelPlaylist.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class ChallPlaylistGroupMenuModule extends BaseGroup {
    constructor(friend) {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.friend = friend;
        this.afterInit();
    }

    afterInit() {
        this.signalBuyPlaylistDone = new Phaser.Signal();
        this.event = {
            choosePlaylist: new Phaser.Signal(),
            backScreen: new Phaser.Signal()
        }
    }

    //DISPLAY CODE
    addChallPlayListGroup(playlists, suggestion_playlist) {
        //
        this.listView;
        this.addGroupChallPlaylist();
        this.addTabHeaderChoosePlaylist();
        this.addTextHeader();
        this.addBtnBackToMenu();
        //87
        //683.5
        this.getPlaylistSuggestPlaylist = new GetPlaylistSuggestPlaylist();
        this.getPlaylistSuggestPlaylist.event.choosedPlaylist.add(this.choosedSuggestPlaylist, this);
        this.getPlaylistSuggestPlaylist.afterGetPlaylistDone(suggestion_playlist);
        this.getPlaylistSuggestPlaylist.signalBuyPlaylistDone.add(this.suggestPlaylistCallback, this);
        this.getPlaylistSuggestPlaylist.addSuggestPlaylist();
        this.addChild(this.getPlaylistSuggestPlaylist);
        //
        // var loadArrs = [];
        if (suggestion_playlist !== null) {
            if (suggestion_playlist.id == null) {
                var gr = new Phaser.Group(game);
                gr.x = 0;
                gr.y = 105 * window.GameConfig.RESIZE;
                this.addChild(gr);
                const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 381) * window.GameConfig.RESIZE);
                const options = {
                    direction: 'y',
                    overflow: 100,
                    padding: 0,
                    searchForClicks: true
                }
                this.listView = new ListView(game, gr, bounds, options);
            } else {
                var gr = new Phaser.Group(game);
                gr.x = 0;
                gr.y = 248 * window.GameConfig.RESIZE;
                this.addChild(gr);
                const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 381) * window.GameConfig.RESIZE);
                const options = {
                    direction: 'y',
                    overflow: 100,
                    padding: 0,
                    searchForClicks: true
                }
                this.listView = new ListView(game, gr, bounds, options);
            }
        } else {
            var gr = new Phaser.Group(game);
            gr.x = 0;
            gr.y = 105 * window.GameConfig.RESIZE;
            this.addChild(gr);
            const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 270) * window.GameConfig.RESIZE);
            const options = {
                direction: 'y',
                overflow: 100,
                padding: 0,
                searchForClicks: true
            }
            this.listView = new ListView(game, gr, bounds, options);
        }
        // LogConsole.log(playlists);
        for (let playlist = 0; playlist < playlists.length; playlist++) {
            this.createTabPlaylist(playlists[playlist], playlist);
        }
        this.loadLayerClassPlaylist();
    }

    choosedSuggestPlaylist(response) {
        this.event.choosePlaylist.dispatch(response);
    }

    suggestPlaylistCallback() {
        this.signalBuyPlaylistDone.dispatch();
        this.removeAllChild();
        this.destroyAll();
        this.destroy();
    }

    addGroupChallPlaylist() {
        this.challPlaylistGroup = new Phaser.Group(game);
        this.addChild(this.challPlaylistGroup);
        // position of challplaylist
        this.challPlaylistGroup.position.x = 0;
        let bg_challPlaylist = new Phaser.Button(game, 0, 0, 'bg_create_room');
        this.addChild(bg_challPlaylist);
    }

    addTabHeaderChoosePlaylist() {
        this.tab_chonplaylist = new Phaser.Sprite(game, this.positionMainConfig.tab_chonplaylist.x * window.GameConfig.RESIZE, this.positionMainConfig.tab_chonplaylist.y * window.GameConfig.RESIZE, this.positionMainConfig.tab_chonplaylist.nameAtlas, this.positionMainConfig.tab_chonplaylist.nameSprite);
        this.tab_chonplaylist.anchor.set(0.5, 0);
        this.addChild(this.tab_chonplaylist);
    }

    addTextHeader() {
        let txt_chonplaylist = new Phaser.Text(game, this.positionMainConfig.txt_chonplaylist.x * window.GameConfig.RESIZE, this.positionMainConfig.txt_chonplaylist.y * window.GameConfig.RESIZE, Language.instance().getData("251"), this.positionMainConfig.txt_chonplaylist.configs);
        txt_chonplaylist.anchor.set(0.5);
        this.tab_chonplaylist.addChild(txt_chonplaylist);
    }

    addBtnBackToMenu() {
        let arrow_chonplaylist = new Phaser.Button(game, this.positionMainConfig.arrow_chonplaylist.x * window.GameConfig.RESIZE, this.positionMainConfig.arrow_chonplaylist.y * window.GameConfig.RESIZE, this.positionMainConfig.arrow_chonplaylist.nameAtlas, () => { }, this, null, this.positionMainConfig.arrow_chonplaylist.nameSprite);
        arrow_chonplaylist.anchor.set(0.5);
        this.tab_chonplaylist.addChild(arrow_chonplaylist);
        arrow_chonplaylist.events.onInputDown.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.event.backScreen.dispatch();
            this.destroyAll();
        });
    }

    loadLayerClassPlaylist() {
        // 990
        let tab_gem = new Phaser.Sprite(game, this.positionMainConfig.tab_gem_playlist.x * window.GameConfig.RESIZE, this.positionMainConfig.tab_gem_playlist.y * window.GameConfig.RESIZE, this.positionMainConfig.tab_gem_playlist.nameAtlas, this.positionMainConfig.tab_gem_playlist.nameSprite);
        tab_gem.anchor.set(1, 0);
        // tab_gem.scale.set(0.8);
        let gem_playlist = new Phaser.Sprite(game, this.positionMainConfig.gem_playlist.x * window.GameConfig.RESIZE, this.positionMainConfig.gem_playlist.y * window.GameConfig.RESIZE, this.positionMainConfig.gem_playlist.nameAtlas, this.positionMainConfig.gem_playlist.nameSprite);
        tab_gem.addChild(gem_playlist);
        let txt_gem_playlist = new Phaser.Text(game, this.positionMainConfig.txt_gem_playlist.x * window.GameConfig.RESIZE, this.positionMainConfig.txt_gem_playlist.y * window.GameConfig.RESIZE, `${SocketController.instance().socket.mySelf.getVariable('diamond').value}`, this.positionMainConfig.txt_gem_playlist.configs);
        tab_gem.addChild(txt_gem_playlist);
        let sumWidth = gem_playlist.width + txt_gem_playlist.width;
        txt_gem_playlist.x = (((tab_gem.width - sumWidth) / 2) - 2.5) - tab_gem.width;
        gem_playlist.x = (((tab_gem.width - sumWidth) / 2) + txt_gem_playlist.width + 5) - tab_gem.width;
        this.tab_chonplaylist.addChild(tab_gem);
        // end <-- tab chon playlist -->
        //change btn plts
        //1776
        var btn_change_playlist = new Phaser.Button(game, this.positionMainConfig.btn_change_playlist.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionMainConfig.btn_change_playlist.y) * window.GameConfig.RESIZE, this.positionMainConfig.btn_change_playlist.nameAtlas, this.onClickChangePlaylist, this, null, this.positionMainConfig.btn_change_playlist.nameSprite);
        btn_change_playlist.anchor.set(0.5);
        this.addChild(btn_change_playlist);
        //110
        let txt_change_playlist = new Phaser.Text(game, this.positionMainConfig.txt_change_playlist.x * window.GameConfig.RESIZE, this.positionMainConfig.txt_change_playlist.y * window.GameConfig.RESIZE, Language.instance().getData("252"), this.positionMainConfig.txt_change_playlist.configs);
        txt_change_playlist.anchor.set(0.5);
        btn_change_playlist.addChild(txt_change_playlist);
        // end change btn plts
    }

    onClickChangePlaylist() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreenDialog.instance().addShop(0);
    }

    createTabPlaylist(playlist, index) {
        // LogConsole.log(playlist);
        let tab_playlist = new Phaser.Button(game, this.positionMainConfig.tab_playlist.x * window.GameConfig.RESIZE, (this.positionMainConfig.tab_playlist.y + index * 193) * window.GameConfig.RESIZE, this.positionMainConfig.tab_playlist.nameAtlas, () => { }, this, null, this.positionMainConfig.tab_playlist.nameSprite);
        tab_playlist.anchor.set(0.5, 0);
        //
        var maskThumb = new Phaser.Graphics(game, 0, 0);
        maskThumb.beginFill(0xffffff);
        maskThumb.drawRoundedRect(-283 * window.GameConfig.RESIZE, 5 * window.GameConfig.RESIZE, 105 * window.GameConfig.RESIZE, 105 * window.GameConfig.RESIZE, 10 * window.GameConfig.RESIZE);
        tab_playlist.addChild(maskThumb);
        //
        let imgPlaylist = new ImageLoader(-283 * window.GameConfig.RESIZE, 5, 'Nhactre', playlist.thumb, index);
        imgPlaylist.sprite.scale.set(105 / 165);
        // imgPlaylist.sprite.anchor.set(0, 0.5);
        imgPlaylist.sprite.mask = maskThumb;
        tab_playlist.addChild(imgPlaylist.sprite);
        //
        let txt_playlist = new Phaser.Text(game, this.positionMainConfig.txt_playlist.x * window.GameConfig.RESIZE, this.positionMainConfig.txt_playlist.y * window.GameConfig.RESIZE, `${playlist.name}`, this.positionMainConfig.txt_playlist.configs);
        // txt_playlist.anchor.set(0, 0.5);
        tab_playlist.addChild(txt_playlist);
        let playlistLevel = new LevelPlaylist();
        playlistLevel.x = this.positionMainConfig.level_playlist.x * window.GameConfig.RESIZE;
        playlistLevel.y = this.positionMainConfig.level_playlist.y * window.GameConfig.RESIZE;
        if (playlist.user) {
            playlistLevel.setData(playlist.user);
        }
        tab_playlist.addChild(playlistLevel);
        this.resizeTxtAndLevel(txt_playlist, playlistLevel);
        //
        console.log('BDHSFBD');
        console.log(playlist);
        if (playlist.vip === true) {
            let vipIcon = new Phaser.Sprite(game, -282.5, 82, 'vipSource', 'Lable_Vip');
            // vipIcon.scale.set(1.3);
            tab_playlist.addChild(vipIcon);
        }
        //
        tab_playlist.id = playlist.id;
        tab_playlist.name = playlist.name;
        this.addChild(tab_playlist);
        tab_playlist.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.event.choosePlaylist.dispatch({
                id: tab_playlist.id,
                name: tab_playlist.name
            });
        });
        LogConsole.log(tab_playlist.height);
        this.addLineUnder(tab_playlist);
        this.listView.add(tab_playlist);
    }

    resizeTxtAndLevel(txt_playlist, playlistLevel) {
        // console.log(txt_playlist.height, playlistLevel.height);
        let sumHeight = txt_playlist.height + playlistLevel.height;
        let distance = (139 - sumHeight) / 2;
        txt_playlist.y = distance - 15 * window.GameConfig.RESIZE;
        playlistLevel.y = txt_playlist.y + txt_playlist.height + 7;
    }

    addLineUnder(sprite) {
        let line = new SpriteBase(this.positionMainConfig.line_under);
        sprite.addChild(line);
    }

    destroyAll() {
        this.removeAllChild();
        this.destroy();
        if (this.listView) {
            this.listView.removeAll();
            if (this.listView.y) {
                this.listView.reset();
            }
            this.listView.destroy();
        }
    }

    removeAllChild() {
        // SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        if (this.children !== null) {
            while (this.children.length > 0) {
                let item = this.children[0];
                this.removeChild(item);
                item.destroy();
                item = null;
            }
        }
    }

    destroy() {
        this.listView.removeAll();
        this.listView.destroy();
        if (this.children !== null) {
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
        super.destroy();
    }
}