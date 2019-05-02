import RankingUserTop3Sprite from "../../../modules/win/Ranking/RankingUserTop3Sprite.js";
import RankingTopOtherUserSprite from "../../../modules/win/Ranking/RankingTopOtherUserSprite.js";
import RankingTabOwner from "../../../modules/win/Ranking/RankingTabOwner.js";
import RankingButtonOption from "../../../modules/win/Ranking/RankingButtonOption.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ListView from "../../../../libs/listview/list_view.js";
import EventGame from "../../../controller/EventGame.js";
import ControllLoading from "../../ControllLoading.js";
import RankingItemHelp from "../../ranking/item/RankingItemHelp.js";
import MainData from "../../../model/MainData.js";
import DataCommand from "../../../common/DataCommand.js";
import Common from "../../../common/Common.js";
import RankingObjOwner from "../data/RankingObjOwner.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class RankingSoloMode extends BaseGroup {
    constructor() {
        super(game);
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.arrHelps = [
            Language.instance().getData("307"),
            Language.instance().getData("308")];
        this.event = {
            back: new Phaser.Signal()
        }
        //
        this.typeButton = 1;
        this.checkAddHelp = false;
        this.arrThisWeek;
        this.arrLastWeek;
        this.tabUnder = null;
        this.popupHelp = null;
        this.tab4To10;
        this.listView;
        this.tabUser;
        this.rankingListThisWeek = [];
        this.rankingListLastWeek = [];
        this.idxThisWeek = 0;
        this.idxLastWeek = 0;
        this.idx = null;
        this.checkLoadMore = false;
        this.checkFirstClickThisWeek = false;
        this.checkFirstClickLastWeek = false;
        this.addEventExtension();
    }

    setData(rankingListThisWeek, rankingListLastWeek, playlist) {
        this.rankingListThisWeek = rankingListThisWeek;
        this.rankingListLastWeek = rankingListLastWeek;
        this.playlist = playlist;
        ControllLoading.instance().showLoading();
        this.afterInit();
    }

    sendGetRankingOption() {
        this.sendSoloModeRanking(this.playlist.id);
    }

    sendSoloModeRanking(playlistId) {
        if (this.typeButton == 1) {
            this.sendThisWeekRanking(playlistId);
        } else {
            this.sendLastWeekRanking(playlistId);
        }
    }

    sendLastWeekRanking(playlistId) {
        ControllLoading.instance().showLoading();
        var params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlistId);
        params.putInt("from_idx", this.idxLastWeek + 1);
        params.putInt("to_idx", this.idxLastWeek + 20);
        SocketController.instance().sendData(DataCommand.SOLO_MODE_TOP10_LAST_WEEK_REQUEST, params);
    }

    sendThisWeekRanking(playlistId) {
        ControllLoading.instance().showLoading();
        var params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlistId);
        params.putInt("from_idx", this.idxThisWeek + 1);
        params.putInt("to_idx", this.idxThisWeek + 20);
        SocketController.instance().sendData(DataCommand.SOLO_MODE_TOP10_THIS_WEEK_REQUEST, params);
    }
    //
    afterInit() {
        this.addBG();
        this.btnRankingLastWeek;
        this.btnRankingThisWeek;
        this.addParentSprite();
        this.addButtonSwitch();
        this.addHeaderRank(this.positionRankingConfig.header);
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode_ranking);
        //
        this.sendGetRankingOption();
        ControllSoundFx.instance().playSound(ControllSoundFx.showranking);
        //
    }

    addBG() {
        var bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        bg.input.useHandCursor = false;
        this.addChild(bg);
    }

    addHeaderRank(configs) {
        var header_rank = new Phaser.Sprite(game, configs.tab.x * window.GameConfig.RESIZE, configs.tab.y * window.GameConfig.RESIZE, configs.tab.nameAtlas, configs.tab.nameSprite);
        var arrow = new Phaser.Sprite(game, configs.back.x * window.GameConfig.RESIZE, configs.back.y * window.GameConfig.RESIZE, configs.back.nameAtlas, configs.back.nameSprite);
        arrow.anchor.set(0.5);
        arrow.inputEnabled = true;
        arrow.events.onInputUp.add(this.onBack, this);
        header_rank.addChild(arrow);
        //
        var lineDoc = new Phaser.Sprite(game, configs.line_doc.x * window.GameConfig.RESIZE, configs.line_doc.y * window.GameConfig.RESIZE, configs.line_doc.nameAtlas, configs.line_doc.nameSprite);
        this.addChild(lineDoc);
        //
        var txt_header_rank = game.add.text(configs.name.x * window.GameConfig.RESIZE, configs.name.y * window.GameConfig.RESIZE, this.playlist.name, configs.name.configs);
        txt_header_rank.anchor.set(0.5, 0);
        header_rank.addChild(txt_header_rank);
        this.addChild(header_rank);
        //
        this.btnHelp = new Phaser.Button(game, this.positionRankingConfig.help_btn.x, this.positionRankingConfig.help_btn.y, this.positionRankingConfig.help_btn.nameAtlas, this.onClickHelp, this, null, this.positionRankingConfig.help_btn.nameSprite);
        this.addChild(this.btnHelp);
    }

    onClickHelp() {
        this.checkAddHelp = !this.checkAddHelp;
        if (this.checkAddHelp == true) {
            this.addPopupHelp();
        } else {
            this.removePopupHelp();
        }
    }

    addPopupHelp() {
        this.removePopupHelp();
        this.popupHelp = new RankingItemHelp(this.arrHelps[this.typeButton - 1]);
        this.popupHelp.y = 83 * MainData.instance().scale;
        this.popupHelp.x = game.width - this.popupHelp.width - 71 * MainData.instance().scale;
        game.world.add(this.popupHelp);

    }
    removePopupHelp() {
        if (this.popupHelp !== null) {
            game.world.remove(this.popupHelp);
            this.popupHelp.destroy();
            this.popupHelp = null
        }
    }

    onBack() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.back.dispatch();
        this.destroy();
        this.rankingListThisWeek = [];
        this.rankingListLastWeek = [];
    }

    addButtonSwitch() {
        this.btnRankingLastWeek = new RankingButtonOption(this.positionRankingConfig.button_ranking_last_week, "LAST_WEEK");
        this.btnRankingLastWeek.addTextLastWeek();
        this.btnRankingLastWeek.addInput();
        this.btnRankingLastWeek.addEventInput(this.onClickLastWeek, this);
        this.btnRankingLastWeek.setWidth();
        this.addChild(this.btnRankingLastWeek);
        this.btnRankingThisWeek = new RankingButtonOption(this.positionRankingConfig.button_ranking_this_week, "THIS_WEEK");
        this.btnRankingThisWeek.addTextThisWeek();
        this.btnRankingThisWeek.addInput();
        this.btnRankingThisWeek.addEventInput(this.onClickThisWeek, this);
        this.btnRankingThisWeek.setWidth();
        this.addChild(this.btnRankingThisWeek);
    }

    onClickLastWeek() {
        if (this.rankingListLastWeek.length > 0) {
            ControllLoading.instance().showLoading();
            this.typeButton = 2;
            this.idxLastWeek = 0;
            this.btnRankingLastWeek.changeEffectShow();
            this.btnRankingThisWeek.changeEffectHide();
            this.changeTabList();
        } else {
            this.listView.removeAll();
            this.listView.reset();
            this.idx = 0;
            this.countItem = 0;
            ControllLoading.instance().showLoading();
            this.typeButton = 2;
            this.btnRankingLastWeek.changeEffectShow();
            this.btnRankingThisWeek.changeEffectHide();
            this.sendGetRankingOption();
            var user = this.posLastWeek;
            this.addTabUnder(user);
        }
    }

    onClickThisWeek() {
        if (this.rankingListThisWeek.length > 0) {
            ControllLoading.instance().showLoading();
            this.typeButton = 1;
            this.idxThisWeek = 0;
            this.btnRankingThisWeek.changeEffectShow();
            this.btnRankingLastWeek.changeEffectHide();
            this.changeTabList();
        } else {
            this.listView.removeAll();
            this.listView.reset();
            this.idx = 0;
            this.countItem = 0;
            ControllLoading.instance().showLoading();
            this.typeButton = 1;
            this.btnRankingThisWeek.changeEffectShow();
            this.btnRankingLastWeek.changeEffectHide();
            this.sendGetRankingOption();
            var user = this.posThisWeek;
            this.addTabUnder(user);
        }
    }

    changeTabList() {
        if (this.typeButton === 1) {
            this.listView.removeAll();
            this.listView.reset();
            this.ktBuild = false;
            this.idx = 0;
            this.countItem = 0;
            this.buildItemPage();
            var user = this.posThisWeek;
            this.addTabUnder(user);
        } else {
            this.listView.removeAll();
            this.listView.reset();
            this.ktBuild = false;
            this.idx = 0;
            this.countItem = 0;
            this.buildItemPage();
            var user = this.posLastWeek;
            this.addTabUnder(user);
        }
    }

    showList() {
        if (this.typeButton === 1) {
            if (this.idx !== null) {
                this.buildItemPage();
                var user = this.posThisWeek;
                this.addTabUnder(user);
            } else {
                this.idx = 0;
                this.countItem = 0;
                this.buildItemPage();
                var user = this.posThisWeek;
                this.addTabUnder(user);
            }
        } else {
            if (this.idx !== null) {
                this.buildItemPage();
                var user = this.posLastWeek;
                this.addTabUnder(user);
            } else {
                this.idx = 0;
                this.countItem = 0;
                this.buildItemPage();
                var user = this.posLastWeek;
                this.addTabUnder(user);
            }
        }
    }

    addParentSprite() {
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 206 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 311) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        this.listView.events.changeIndex.add(this.changeIndex, this);
        this.listView.scroller.events.onInputUp.add(this.scrollerInputUp, this);
    }

    scrollerInputUp() {
        if (this.checkLoadMore === true) {
            if (this.typeButton === 1) {
                ControllLoading.instance().showLoading();
                this.sendGetRankingOption();
            } else {
                ControllLoading.instance().showLoading();
                this.sendGetRankingOption();
            }
        }
    }

    changeIndex() {
        let idx = this.listView.getIdx();

        if (this.typeButton === 1) {
            if (this.idxThisWeek > 6) {
                if (idx > this.idxThisWeek) {
                    if (this.checkLoadMore === false) {
                        if (this.arrThisWeek.length < 100) {
                            this.checkLoadMore = true;
                            this.idxThisWeek += 2;
                        }
                    }
                } else {
                    this.buildChangeIndex(idx);
                }
            }
        } else {
            if (this.idxLastWeek > 6) {
                if (idx > this.idxLastWeek) {
                    if (this.checkLoadMore === false) {
                        if (this.arrLastWeek.length < 100) {
                            this.checkLoadMore = true;
                            this.idxLastWeek += 2;
                        }
                    }
                } else {
                    this.buildChangeIndex(idx);
                }
            }
        }
    }
    addChildScrollMap() {
        this.showList();
    }

    setRankingThisWeek(arr, timeCountDownThisWeekPractice, posThisWeek) {
        if (arr) {
            this.arrThisWeek = arr;
        }
        this.posThisWeek = posThisWeek;
        this.addTimeCountDown(timeCountDownThisWeekPractice);
        this.addChildScrollMap();
        // ControllLoading.instance().hideLoading();
    }

    setRankingLastWeek(arr, posLastWeek) {
        if (arr) {
            this.arrLastWeek = arr;
        }
        this.posLastWeek = posLastWeek;
        this.addChildScrollMap();
        // ControllLoading.instance().hideLoading();
    }

    addTimeCountDown(timeCountDownThisWeekPractice) {
        this.btnRankingThisWeek.addTimeCountDown(timeCountDownThisWeekPractice);
    }

    filterOwnerRanking(arr, callback) {
        let obj = arr.filter(ele => ele.user_id == SocketController.instance().socket.mySelf.getVariable('user_id').value);
        callback(obj);
    }

    addTabUnder(user) {
        if (user == undefined) {
            user = {
                number_of_correct: 0,
                playlist_id: 0,
                rank: "N/A",
                user_name: SocketController.instance().dataMySeft.user_name,
                avatar: SocketController.instance().socket.mySelf.getVariable('avatar').value,
                user_id: SocketController.instance().socket.mySelf.getVariable('user_id').value
            }
        }
        if (this.tabUnder !== null) {
            this.removeChild(this.tabUnder);
            this.tabUnder.destroy();
            this.tabUnder = null;
        }
        this.tabUnder = new RankingTabOwner(user);
        this.addChild(this.tabUnder);
    }

    buildChangeIndex(idx) {
        if (this.countItem === (idx + 1) && this.ktBuild === false) {
            this.buildItemPage();
        }
    }

    buildItemPage() {
        let arr = [];
        if (this.typeButton == 1) {
            arr = this.arrThisWeek;
        } else {
            arr = this.arrLastWeek;
        }
        this.ktBuild = true;
        if (this.typeButton === 1) {
            this.idxThisWeek = arr.length - 2;
        } else {
            this.idxLastWeek = arr.length - 2;
        }
        for (let i = this.idx; i < arr.length; i++) {
            let item;
            if (i + 1 == 3) {
                item = new RankingUserTop3Sprite(arr[i], i, true);
            } else if (i + 1 < 3) {
                item = new RankingUserTop3Sprite(arr[i], i, false);
            } else if (i + 1 == arr.length) {
                item = new RankingTopOtherUserSprite(arr[i], i, true);
            } else {
                item = new RankingTopOtherUserSprite(arr[i], i, false);
            }
            this.listView.add(item);
            //
            this.idx++;
            this.countItem++;
            if (this.countItem % 10 === 0 && this.idx < arr.length) {
                this.ktBuild = false;
                break;
            }
            if (this.idx === arr.length) {
                this.ktBuild = false;
            }
        }
        game.time.events.add(1500, this.hideLoading, this);
    }

    addEventExtension() {
        EventGame.instance().event.backButton.add(this.onBack, this);
        SocketController.instance().events.onExtensionResponse.add(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SOLO_MODE_TOP10_THIS_WEEK_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                if (this.idxThisWeek === 1) {
                    this.rankingListThisWeek = [];
                }
                this.posThisWeek = new RankingObjOwner();
                Common.handleRankingList(evtParams.params, this.rankingListThisWeek, this.posThisWeek, () => {
                    Common.handleTime(evtParams.params, (timeCountDownThisWeekPractice) => {
                        this.rankingThisWeek(timeCountDownThisWeekPractice);
                    });
                });
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
        if (evtParams.cmd == DataCommand.SOLO_MODE_TOP10_LAST_WEEK_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                if (this.idxLastWeek === 1) {
                    this.rankingListLastWeek = [];
                }
                this.posLastWeek = new RankingObjOwner();
                Common.handleRankingList(evtParams.params, this.rankingListLastWeek, this.posLastWeek, () => {
                    this.rankingLastWeek();
                });
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
    }
    hideLoading() {
        this.checkLoadMore = false;
        ControllLoading.instance().hideLoading();
    }

    rankingThisWeek(timeCountDownThisWeekPractice) {
        this.setRankingThisWeek(this.rankingListThisWeek, timeCountDownThisWeekPractice, this.posThisWeek);
    }
    rankingLastWeek() {
        this.setRankingLastWeek(this.rankingListLastWeek, this.posLastWeek);
    }

    destroy() {
        // clearTimeout(this.timeout);
        this.removeEventExtension();
        this.removePopupHelp();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}