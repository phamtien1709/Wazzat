import PracticePopupPlaylistSprite from "./PracticePopupPlaylistSprite.js";
import PracticePopupListPlaylistParentSprite from "./PracticePopupListPlaylistParentSprite.js";

import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ListView from "../../../../libs/listview/list_view.js";

export default class PracticePopupPractice extends Phaser.Sprite {
    constructor(configs, state) {
        super(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        this.btn_x = null;
        this.state = state;
        this.square_box = null;
        this.txt_header = null;
        this.signalInputX = new Phaser.Signal();
        // this.anchor.set(0.5);
    }

    afterCreate(positionConfigs, playlists) {
        this.playlists = playlists;
        this.positionConfigs = positionConfigs;
        this.addSquareConfigs(this.positionConfigs.practice_square_white);
        this.addBtnX(this.positionConfigs.practice_btn_x);
        this.addTextHeader(this.positionConfigs.practice_txt_header);
        this.addPlaylists();
    }

    addSquareConfigs(configs) {
        game.cache.addNinePatch(configs.name, configs.nameAtlas, configs.nameSprite, configs.left, configs.right, configs.top, configs.bottom);
        this.square_box = new Phaser.NinePatchImage(game, configs.x, configs.y, configs.name);
        this.square_box.targetWidth = configs.width;
        this.square_box.targetHeight = configs.height;
        this.square_box.UpdateImageSizes();
        this.addChild(this.square_box);
    }

    addTextHeader(configs) {
        this.txt_header = new Phaser.Text(game, configs.x, configs.y, configs.text, configs.configs);
        this.txt_header.anchor.set(0.5);
        this.addChild(this.txt_header);
    }

    addBtnX(configs) {
        this.btn_x = new Phaser.Sprite(game, configs.x, configs.y, configs.nameSprite);
        this.btn_x.anchor.set(0.5);
        this.btn_x.inputEnabled = true;
        this.btn_x.events.onInputUp.add(this.onClickBtnX, this);
        this.addChild(this.btn_x);
    }

    addPlaylists() {
        var listPlaylistBeginX = 0;
        var listPlaylistBeginY = 0;
        var groupPlaylists = new PracticePopupListPlaylistParentSprite(30, 233);
        var gr = new Phaser.Group(game, this);
        gr.x = this.square_box.x;
        gr.y = this.square_box.y;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(30, 60, 900, 850);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        groupPlaylists.height = 668;
        for (let i = 0; i < this.playlists.length; i++) {
            let spritePlaylist = new PracticePopupPlaylistSprite(
                listPlaylistBeginX,
                listPlaylistBeginY,
                this.playlists[i], this.state
            );
            spritePlaylist.afterCreate();
            spritePlaylist.loadThumb();
            //
            groupPlaylists.add(spritePlaylist);
            if (i % 3 == 0 && i > 0) {
                listPlaylistBeginX = 0;
                listPlaylistBeginY += window.GameConfig.CONFIGS_POPUP_PRACTICE.y;
                groupPlaylists.height += window.GameConfig.CONFIGS_POPUP_PRACTICE.y;
                this.addLine(groupPlaylists, this.positionConfigs.practice_line_scroll);
            } else {
                listPlaylistBeginX += window.GameConfig.CONFIGS_POPUP_PRACTICE.x;
            }

        }
        this.listView.add(groupPlaylists);
    }

    onClickBtnX() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInputX.dispatch();
    }

    addEventInputX(callback, scope) {
        // callback();
        this.signalInputX.add(callback, scope);
    }
    removeEventInputX(callback, scope) {
        this.signalInputX.remove(callback, scope);
    }

    addLine(groupPlaylists, configs) {
        var line = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        line.scale.set(1, 3);
        groupPlaylists.addChild(line);
    }
}