import RankingButtonOption from "../Ranking/RankingButtonOption.js";

import RankingUserTop3Sprite from "../Ranking/RankingUserTop3Sprite.js";
import RankingTopOtherUserSprite from "../Ranking/RankingTopOtherUserSprite.js";
import RankingTab4To10 from "../Ranking/RankingTab4To10.js";
import RankingTabOwner from "../Ranking/RankingTabOwner.js";
import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import ListView from "../../../../libs/listview/list_view.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class RankingScreen extends BaseGroup {
    constructor(state) {
        super(game)
        this.state = state;
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.afterInit();
    }

    afterInit() {
        this.typeButton = 1;
        this.arrThisWeek;
        this.arrLastWeek;
        this.tab4To10;
        this.listView;
        this.tabUser;
        this.addBG();
        this.btnRankingLastWeek;
        this.btnRankingThisWeek;
        this.addParentSprite();
        this.addButtonSwitch();
        this.addHeaderRank(this.positionRankingConfig.header);
    }

    addBG() {
        var bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        bg.input.useHandCursor = false;
        this.addChild(bg);
    }

    addHeaderRank(configs) {
        var header_rank = new Phaser.Sprite(game, configs.tab.x, configs.tab.y, configs.tab.nameAtlas, configs.tab.nameSprite);
        var arrow = new Phaser.Sprite(game, configs.back.x, configs.back.y, configs.back.nameAtlas, configs.back.nameSprite);
        arrow.anchor.set(0.5);
        arrow.inputEnabled = true;
        arrow.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            // this.sendRequestMenuChallenges();
            this.destroy();
            this.state.rankingListThisWeek = [];
            this.state.rankingListLastWeek = [];
        }, this);
        header_rank.addChild(arrow);
        var lineDoc = new Phaser.Sprite(game, configs.line_doc.x, configs.line_doc.y, configs.line_doc.nameAtlas, configs.line_doc.nameSprite);

        var txt_header_rank = game.add.text(configs.name.x, configs.name.y, this.state.params.playlist.name, configs.name.configs);
        // var txt_header_rank = new Phaser.Text(game, configs.name.x, configs.name.y, "Những bản Rock Bất hủ của Bức Tường", configs.name.configs);
        txt_header_rank.anchor.set(0.5, 0);
        header_rank.addChild(txt_header_rank);
        this.addChild(header_rank);
    }

    sendRequestMenuChallenges() {
        LogConsole.log('send menu');
        SocketController.instance().sendData(DataCommand.MAIN_MENU_LOAD_REQUEST, null);
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
        this.typeButton = 2;
        this.btnRankingLastWeek.changeEffectShow();
        this.btnRankingThisWeek.changeEffectHide();
        this.showList();
    }

    onClickThisWeek() {
        this.typeButton = 1;
        this.btnRankingThisWeek.changeEffectShow();
        this.btnRankingLastWeek.changeEffectHide();
        this.showList();
    }

    showList() {
        this.listView.removeAll();
        this.listView.reset();
        let arr = [];
        var user;
        if (this.typeButton == 1) {
            arr = this.arrThisWeek;
            this.filterOwnerRanking(this.arrThisWeek, (obj) => {
                // LogConsole.log(obj);
                user = obj[0];
            });
        } else {
            arr = this.arrLastWeek;
            this.filterOwnerRanking(this.arrLastWeek, (obj) => {
                // LogConsole.log(obj);
                user = obj[0];
            });
        }
        if (arr.length > 3) {
            for (let i = 0; i < 3; i++) {
                let item = new RankingUserTop3Sprite(arr[i], i);
                this.listView.add(item);
            }
            this.addTab4To10();
            for (let i = 3; i < arr.length; i++) {
                let item = new RankingTopOtherUserSprite(arr[i], i);
                this.listView.add(item);
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                let item = new RankingUserTop3Sprite(arr[i], i);
                this.listView.add(item);
            }
            this.addTab4To10();
        }
        this.addTabUnder(user);
    }

    addParentSprite() {
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 346;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 1080, 1500);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
    }

    addChildScrollMap() {
        this.showList();
    }

    setRankingThisWeek(arr, timeCountDownThisWeekPractice) {
        if (arr) {
            this.arrThisWeek = arr;
        } else {
            this.arrThisWeek = this.positionRankingConfig.users;
        }
        this.addTimeCountDown(timeCountDownThisWeekPractice);
        this.addChildScrollMap();
    }

    setRankingLastWeek(arr) {
        if (arr) {
            this.arrLastWeek = arr;
        } else {
            this.arrLastWeek = this.positionRankingConfig.users2;
        }
    }

    addTimeCountDown(timeCountDownThisWeekPractice) {
        // LogConsole.log(timeCountDownThisWeekPractice);
        this.btnRankingThisWeek.addTimeCountDown(timeCountDownThisWeekPractice);
    }

    filterOwnerRanking(arr, callback) {
        let obj = arr.filter(ele => ele.user_id == SocketController.instance().socket.mySelf.getVariable('user_id').value);
        callback(obj);
    }

    addTabUnder(user) {
        // LogConsole.log(user);
        if (user == undefined) {
            user = {
                number_of_correct: 0,
                playlist_id: 0,
                rank: "N/A",
                user_entity: {
                    user_name: SocketController.instance().dataMySeft.user_name,
                    avatar: SocketController.instance().socket.mySelf.getVariable('avatar').value
                },
                user_id: SocketController.instance().socket.mySelf.getVariable('user_id').value
            }
        }
        let tabUnder = new RankingTabOwner(user);
        this.addChild(tabUnder);
    }

    addTab4To10() {
        this.tab4To10 = new RankingTab4To10();
        this.listView.add(this.tab4To10);
    }
}