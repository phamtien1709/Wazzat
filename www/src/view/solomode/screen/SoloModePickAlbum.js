import PracticePopupListPlaylistParentSprite from "../items/PracticePopupListPlaylistParentSprite.js";
import PracticePopupPlaylistSprite from "../items/PracticePopupPlaylistSprite.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ListView from "../../../../libs/listview/list_view.js";
import RankingSoloMode from "../items/RankingSoloMode.js";
import EventGame from "../../../controller/EventGame.js";
import MainData from "../../../model/MainData.js";
import BaseScreenSprite from "../../component/BaseScreenSprite.js";
import Language from "../../../model/Language.js";

export default class SoloModePickAlbum extends BaseScreenSprite {
    constructor() {
        super(game, 640 * window.GameConfig.RESIZE, 0, 'bg-playlist');
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.event = {
            pickAlbum: new Phaser.Signal(),
            refreshPickAlbum: new Phaser.Signal()
        };
        this.signalInputX = new Phaser.Signal();
        this.headerTab;
        this.scrollTab;
        this.playlists;
        this.state = null;
        this.isChoosedAlbum = false;
        this.afterInit();
    }

    afterInit() {
        this.onClickRankAlbum = false;
        //
        this.addEventExtension();
        this.addTweenScreen();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode);
    }

    addTweenScreen() {
        let tween = game.add.tween(this).to({
            x: 0
        }, 200, "Linear", false);
        tween.start();
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Button(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, () => { }, this, null, configs.tab_chonplaylist.nameSprite);
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
        this.addTxtPractice(this.positionPracticeScreenConfig.header.txt_practice);
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerTab.addChild(this.btnBack);
    }

    onBack() {
        if (this.onClickRankAlbum == false) {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.signalInputX.dispatch();
            let tween = game.add.tween(this).to({
                x: 1080 * window.GameConfig.RESIZE
            }, 200, "Linear", false);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }

    addTxtPractice(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("312"), configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x * window.GameConfig.RESIZE, configs.tabGem.y * window.GameConfig.RESIZE, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.positionPracticeScreenConfig.header.gem);
        let txtGem = this.addTxtGem(this.positionPracticeScreenConfig.header.txtGem);
        let sumWidth = gem.width + txtGem.width;
        txtGem.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGemHeader.width - sumWidth) / 2) + txtGem.width + 5 * window.GameConfig.RESIZE;
        this.tabGemHeader.addChild(gem);
        this.tabGemHeader.addChild(txtGem);
        //
        this.headerTab.addChild(this.tabGemHeader);
    }

    addTabHeartHeader(configs) {
        this.tabHeartHeader = new Phaser.Sprite(game, configs.tabHeart.x * window.GameConfig.RESIZE, configs.tabHeart.y * window.GameConfig.RESIZE, configs.tabHeart.nameAtlas, configs.tabHeart.nameSprite);
        //
        let heart = this.addHeart(this.positionPracticeScreenConfig.header.heart);
        this.txtHeart = this.addTxtHeart(this.positionPracticeScreenConfig.header.txtHeart);
        let sumWidth = heart.width + this.txtHeart.width;
        this.txtHeart.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        heart.x = ((this.tabGemHeader.width - sumWidth) / 2) + this.txtHeart.width + 5 * window.GameConfig.RESIZE;
        this.tabHeartHeader.addChild(heart);
        this.tabHeartHeader.addChild(this.txtHeart);
        //
        this.headerTab.addChild(this.tabHeartHeader);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtGem(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
    }
    addHeart(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtHeart(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value, configs.configs);
    }

    addPlaylists(playlists) {
        this.playlists = playlists.sort(this.sortPlaylist);
        this.playlists = this.playlists.sort(this.sortUpdatePlaylist);
        //
        var listPlaylistBeginX = 0;
        var listPlaylistBeginY = 0;
        this.groupPlaylists = new PracticePopupListPlaylistParentSprite(0, 200 * window.GameConfig.RESIZE);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 230 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 0, 570 * window.GameConfig.RESIZE, (game.height - 206) * window.GameConfig.RESIZE);
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
                this.playlists[i - 1],
                i
            );
            spritePlaylist.afterCreate();
            spritePlaylist.loadThumb();
            spritePlaylist.signalInput.add(this.onChoosedAlbum, this);
            spritePlaylist.signalBuyPlaylist.add(this.buyPlaylistSoloMode, this);
            spritePlaylist.signalGetRanking.add(this.playlistGetRanking, this);
            //
            this.groupPlaylists.add(spritePlaylist);
            if (i % 3 == 0 && i > 0) {
                listPlaylistBeginX = 0;
                listPlaylistBeginY += window.GameConfig.CONFIGS_POPUP_PRACTICE.y * window.GameConfig.RESIZE;
                this.addLine(this.groupPlaylists, this.positionPracticeScreenConfig.practice_line_scroll, listPlaylistBeginY);
            } else {
                listPlaylistBeginX += window.GameConfig.CONFIGS_POPUP_PRACTICE.x * window.GameConfig.RESIZE;
            }
        }
        if (this.playlists.length % 3 == 0) {
            this.groupPlaylists.height += this.playlists.length / 3 * (window.GameConfig.CONFIGS_POPUP_PRACTICE.y * window.GameConfig.RESIZE);
        } else {
            this.groupPlaylists.height += (this.playlists.length / 3 + 1) * (window.GameConfig.CONFIGS_POPUP_PRACTICE.y * window.GameConfig.RESIZE);
        }
        this.listView.add(this.groupPlaylists);
        //
        this.addHeaderTab(this.positionPracticeScreenConfig.header);
    }

    onChoosedAlbum(album) {
        //
        if (this.isChoosedAlbum === false) {
            this.isChoosedAlbum = true;
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode_quiz_play_button);
            //
            this.event.pickAlbum.dispatch(album);
        }
    }

    buyPlaylistSoloMode(playlist) {
        this.addNewBoughtPlaylist(playlist, MainData.instance().soloModePlaylists)
        this.event.refreshPickAlbum.dispatch();
    }

    addNewBoughtPlaylist(playlist, playlists) {
        for (let i = 0; i < playlists.length; i++) {
            if (playlists[i].id === playlist.id) {
                playlists[i].is_owner = 1;
                playlists[i].user_playlist_mapping = {
                    active: 1,
                    created: new Date().getTime(),
                    current_level_score: 0,
                    exp_score: 0,
                    id: 0,
                    level: 0,
                    next_level_score: 50,
                    playlist_id: playlist.id,
                    updated: new Date().getTime(),
                    user_id: SocketController.instance().dataMySeft.user_id
                };
            }
        }
    }
    playlistGetRanking(playlist) {
        this.RankingScreen = new RankingSoloMode();
        this.RankingScreen.setData([], [], playlist);
        this.RankingScreen.event.back.add(this.onBackRanking, this);
        this.addChild(this.RankingScreen);
        this.onClickRankAlbum = true;
    }
    onBackRanking() {
        this.onClickRankAlbum = false;
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
        if (a1.is_owner == 1 && a2.is_owner == 1) {
            if (a1.user_playlist_mapping) {
                if (a1.user_playlist_mapping.updated > a2.user_playlist_mapping.updated) {
                    return -1;
                } else if (a1.user_playlist_mapping.updated < a2.user_playlist_mapping.updated) {
                    return 1;
                } else {
                    return 0;
                }
            }
        } else {
            return 0;
        }
    }

    addLine(groupPlaylists, configs, listPlaylistBeginY) {
        var line = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE + listPlaylistBeginY, configs.nameAtlas, configs.nameSprite);
        // line.scale.set(1, 3);
        groupPlaylists.addChild(line);
    }

    addEventInputX(callback, scope) {
        // callback();
        this.signalInputX.add(callback, scope);
    }
    removeEventInputX(callback, scope) {
        this.signalInputX.remove(callback, scope);
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.onBack, this);
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }

    onUpdateUserVars() {
        if (SocketController.instance().dataMySeft.heart !== parseInt(this.txtHeart.text)) {
            this.txtHeart.text = SocketController.instance().dataMySeft.heart;
        }
    }

    onExtensionResponse(evtParams) {

    }

    destroy() {
        this.removeEventExtension();
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