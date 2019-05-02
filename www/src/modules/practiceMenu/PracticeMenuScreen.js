import PracticePopupListPlaylistParentSprite from "./PopupPractice/PracticePopupListPlaylistParentSprite.js";

import PracticePopupPlaylistSprite from "./PopupPractice/PracticePopupPlaylistSprite.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import SocketController from "../../controller/SocketController.js";
import ListView from "../../../libs/listview/list_view.js";
import Language from "../../model/Language.js";

export default class PracticeMenuScreen extends Phaser.Button {
    constructor(state) {
        super(game, 1080, 0, 'bg-playlist');
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.state = state;
        this.input.useHandCursor = false;
        this.signalInputX = new Phaser.Signal();
        this.headerTab;
        this.scrollTab;
        this.playlists;
        this.afterInit();
    }

    afterInit() {
        this.addHeaderTab(this.positionPracticeScreenConfig.header);
        this.addTweenScreen();
        // this.addScrollTab();
    }

    addTweenScreen() {
        let tween = game.add.tween(this).to({
            x: 0
        }, 200, "Linear", false);
        tween.start();
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x, configs.tab_chonplaylist.y, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.txtGem;
        this.txtHeart;
        this.tabGemHeader;
        this.tabHeartHeader;
        this.addButtonBack(configs.btn_back);
        this.addTabGemHeader(configs);
        this.addTabHeartHeader(configs);
        this.addTxtPractice(Language.instance().getData("226"));
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerTab.addChild(this.btnBack);
    }

    onBack() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInputX.dispatch();
        let tween = game.add.tween(this).to({
            x: 1080
        }, 200, "Linear", false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
        // this.destroy();
    }

    addTxtPractice(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x, configs.y, configs.text, configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x, configs.tabGem.y, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.positionPracticeScreenConfig.header.gem);
        let txtGem = this.addTxtGem(this.positionPracticeScreenConfig.header.txtGem);
        let sumWidth = gem.width + txtGem.width;
        txtGem.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5;
        gem.x = ((this.tabGemHeader.width - sumWidth) / 2) + txtGem.width + 10;
        this.tabGemHeader.addChild(gem);
        this.tabGemHeader.addChild(txtGem);
        //
        this.headerTab.addChild(this.tabGemHeader);
    }

    addTabHeartHeader(configs) {
        this.tabHeartHeader = new Phaser.Sprite(game, configs.tabHeart.x, configs.tabHeart.y, configs.tabHeart.nameAtlas, configs.tabHeart.nameSprite);
        //
        let heart = this.addHeart(this.positionPracticeScreenConfig.header.heart);
        let txtHeart = this.addTxtHeart(this.positionPracticeScreenConfig.header.txtHeart);
        let sumWidth = heart.width + txtHeart.width;
        txtHeart.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5;
        heart.x = ((this.tabGemHeader.width - sumWidth) / 2) + txtHeart.width + 10;
        this.tabHeartHeader.addChild(heart);
        this.tabHeartHeader.addChild(txtHeart);
        //
        this.headerTab.addChild(this.tabHeartHeader);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
    }

    addTxtGem(configs) {
        return new Phaser.Text(game, configs.x, configs.y, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
    }
    addHeart(configs) {
        return new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
    }

    addTxtHeart(configs) {
        return new Phaser.Text(game, configs.x, configs.y, SocketController.instance().socket.mySelf.getVariable('heart').value, configs.configs);
    }

    addPlaylists(playlists) {
        this.playlists = playlists.sort(this.sortPlaylist);
        LogConsole.log(this.playlists);
        this.playlists = this.playlists.sort(this.sortUpdatePlaylist);
        var listPlaylistBeginX = 0;
        var listPlaylistBeginY = 0;
        var groupPlaylists = new PracticePopupListPlaylistParentSprite(0, 231);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 390;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(60, 0, 960, 1680);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 60,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        // groupPlaylists.height = 668;
        for (let i = 1; i < this.playlists.length + 1; i++) {
            let spritePlaylist = new PracticePopupPlaylistSprite(
                listPlaylistBeginX,
                listPlaylistBeginY,
                this.playlists[i - 1], this.state
            );
            spritePlaylist.afterCreate();
            spritePlaylist.loadThumb();
            //
            groupPlaylists.add(spritePlaylist);
            if (i % 3 == 0 && i > 0) {
                listPlaylistBeginX = 0;
                listPlaylistBeginY += window.GameConfig.CONFIGS_POPUP_PRACTICE.y;
                groupPlaylists.height += window.GameConfig.CONFIGS_POPUP_PRACTICE.y;
                this.addLine(groupPlaylists, this.positionPracticeScreenConfig.practice_line_scroll);
            } else {
                listPlaylistBeginX += window.GameConfig.CONFIGS_POPUP_PRACTICE.x;
            }

        }
        this.listView.add(groupPlaylists);
    }

    sortPlaylist(a1, a2) {
        if (a1.is_owner > a2.is_owner) {
            return -1;
        } else if (a1.is_owner < a2.is_owner) {
            return 1;
        } else {
            return 0;
        }
    }

    sortUpdatePlaylist(a1, a2) {
        // LogConsole.log(a1);
        if (a1.is_owner == 1 && a2.is_owner == 1) {
            if (a1.user_playlist_mapping) {
                LogConsole.log(a1.user_playlist_mapping.updated);
                LogConsole.log(a2.user_playlist_mapping.updated);
                LogConsole.log('-----------------------------');
                if (a1.user_playlist_mapping.updated > a2.user_playlist_mapping.updated) {
                    return -1;
                } else if (a1.user_playlist_mapping.updated < a2.user_playlist_mapping.updated) {
                    return 1;
                } else {
                    return 0
                }
            } else {
                return 1;
            }
        }
    }

    addLine(groupPlaylists, configs) {
        var line = new Phaser.Sprite(game, configs.x, configs.y, configs.nameAtlas, configs.nameSprite);
        line.scale.set(1, 3);
        groupPlaylists.addChild(line);
    }

    addEventInputX(callback, scope) {
        // callback();
        this.signalInputX.add(callback, scope);
    }
    removeEventInputX(callback, scope) {
        this.signalInputX.remove(callback, scope);
    }

}