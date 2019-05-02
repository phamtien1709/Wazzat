import RankingItemHeader from "./item/RankingItemHeader.js";
import RankingItemTabMenu from "./item/RankingItemTabMenu.js";
import SpriteScale9Base from "../component/SpriteScale9Base.js";
import RankingLevel from "./screen/RankingLevel.js";
import RankingDiamond from "./screen/RankingDiamond.js";
import RankingTurnBase from "./screen/RankingTurnBase.js";
import RankingOnlineMode from "./screen/RankingOnlineMode.js";
import RankingItemHelp from "./item/RankingItemHelp.js";
import MainData from "../../model/MainData.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import ListView from "../../../libs/listview/list_view.js";
import BaseLoadAsset from "../BaseLoadAsset.js";
import ControllLoading from "../ControllLoading.js";
import Language from "../../model/Language.js";

export default class Ranking extends BaseLoadAsset {
    constructor(tabIdx = 2) {
        super(game, null);
        this.event = {
            back: new Phaser.Signal()
        }
        this.idEvent = null;
        this.topLevel = null;
        this.topDiamond = null;
        this.topTurnBase = null;
        this.topOnlineMode = null;

        this.idEventCanClick === null;
        this.tabIdx = tabIdx;
        this.arrTabMenu = [];


        this.ktAddHelp = false;
        this.arrStringTab = [
            Language.instance().getData("127"),
            Language.instance().getData("128"),
            Language.instance().getData("129"),
            Language.instance().getData("130")];
        this.arrHelp = [
            Language.instance().getData("131"),
            Language.instance().getData("132"),
            Language.instance().getData("133"),
            Language.instance().getData("134")
        ]

        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionRanking.json",
                key: "positionRanking"
            },
            {
                type: "atlas",
                link: "img/atlas/ranking.png",
                key: "ranking",
                linkJson: "img/atlas/ranking.json"
            }
        ]

        this.loadResource();
    }

    loadFileComplete() {

        super.loadFileComplete();

        this.positionRanking = MainData.instance().positionRanking;
        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        let parentRanking = new Phaser.Group(game, 0, 0, null);
        this.listRanking = new ListView(game, parentRanking, new Phaser.Rectangle(0, 0, game.width, game.height - 310 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });
        this.listRanking.events.changeIndex.add(this.changeIndex, this);
        this.listRanking.scroller.events.onInputUp.add(this.checkLoadMore, this);
        parentRanking.x = 0;
        parentRanking.y = 200 * MainData.instance().scale;
        this.addChild(parentRanking);

        this.header = new RankingItemHeader();
        this.header.event.back.add(this.backHeader, this);
        this.header.event.help.add(this.chooseHelp, this);
        this.addChild(this.header);

        this.popupHelp = null;


        this.bgTabMenu = new SpriteScale9Base(this.positionRanking.menu_bg_all);
        this.addChild(this.bgTabMenu);

        let parentTabMenu = new Phaser.Group(game, 0, 0, null);
        this.listMenu = new ListView(game, parentTabMenu, new Phaser.Rectangle(0, 0, game.width, 100 * MainData.instance().scale), {
            direction: 'x',
            padding: 0,
            searchForClicks: true
        });

        parentTabMenu.x = 0;
        parentTabMenu.y = 100 * MainData.instance().scale;
        this.addChild(parentTabMenu);

        for (let i = 0; i < this.arrStringTab.length; i++) {
            let itemTab = new RankingItemTabMenu(this.arrStringTab[i], i);
            itemTab.event.choose_item.add(this.chooseTabMenu, this);
            if (i === this.tabIdx) {
                itemTab.active();
            } else {
                itemTab.deactive();
            }
            if (i === this.arrStringTab.length - 1) {
                itemTab.hideLineDoc();
            }
            this.listMenu.add(itemTab);

            this.arrTabMenu.push(itemTab);
        }

        this.listMenu.tweenToItem(this.tabIdx);

        this.buildListTop();

        ControllSoundFx.instance().playSound(ControllSoundFx.showranking);
    }



    chooseHelp() {
        this.ktAddHelp = !this.ktAddHelp;
        if (this.ktAddHelp === true) {
            this.addPopupHelp();
        } else {
            this.removePopupHelp();
        }
    }

    addPopupHelp() {
        this.removePopupHelp();
        this.popupHelp = new RankingItemHelp(this.arrHelp[this.tabIdx]);
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


    chooseTabMenu(idx) {
        if (idx === this.tabIdx) {

        } else {

            for (let i = 0; i < this.arrTabMenu.length; i++) {
                let item = this.arrTabMenu[i];
                if (item.getIdx() === idx) {
                    item.active();
                } else {
                    item.deactive();
                }
            }
            if (idx < this.tabIdx) {
                let min = idx - 1;
                if (min < 0) {
                    min = 0;
                }
                this.listMenu.tweenToItem(min);
            } else {
                let max = idx + 1;
                if (max > (this.arrTabMenu.length - 1)) {
                    max = this.arrTabMenu.length - 1;
                }
                this.listMenu.tweenToItem(max);
            }

            if (this.tabIdx === Ranking.TOP_LEVEL) {
                this.topLevel.kill();
            } else if (this.tabIdx === Ranking.TOP_DIAMOND) {
                this.topDiamond.kill();
            } else if (this.tabIdx === Ranking.TOP_TURNBASE) {
                this.topTurnBase.kill();
            } else if (this.tabIdx === Ranking.TOP_ONLINEMODE) {
                this.topOnlineMode.kill();
            }

            this.tabIdx = idx;
            this.buildListTop();
        }

    }

    static get TOP_LEVEL() {
        return 0;
    }
    static get TOP_DIAMOND() {
        return 1;
    }
    static get TOP_TURNBASE() {
        return 2;
    }
    static get TOP_ONLINEMODE() {
        return 3;
    }

    buildListTop() {

        this.removePopupHelp();
        this.ktAddHelp = false;

        this.listRanking.removeAll();
        this.listRanking.reset();

        switch (this.tabIdx) {
            case Ranking.TOP_LEVEL:
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Ranking_level_button);
                this.addTopLevel();
                break;
            case Ranking.TOP_DIAMOND:
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Ranking_diamond_button);
                this.addTopDiamond();
                break;
            case Ranking.TOP_TURNBASE:
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Ranking_turnbase_button);
                this.addTopTurnBase();
                break;
            case Ranking.TOP_ONLINEMODE:
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Ranking_online_button);
                this.addTopOnlineMode();
                break;
        }
    }

    removeAddEvent() {
        if (this.idEvent !== null) {
            game.time.events.remove(this.idEvent);
        }
    }

    removeAll() {
        this.removeTopDiamond();
        this.removeTopLevel();
        this.removeTopOnlineMode();
        this.removeTopTurnBase();
    }

    addEventAll() {
        if (this.topLevel !== null) {
            this.topLevel.addEvent();
        }
        if (this.topDiamond !== null) {
            this.topDiamond.addEvent();
        }
        if (this.topTurnBase !== null) {
            this.topTurnBase.addEvent();
        }
        if (this.topOnlineMode !== null) {
            this.topOnlineMode.addEvent();
        }
    }

    addTopLevel() {
        //this.removeAll();
        if (this.topLevel === null) {
            this.topLevel = new RankingLevel();
            this.topLevel.event.add_item.add(this.addItemRank, this);
            this.addChild(this.topLevel);
        }
        this.topLevel.revive();
        this.addChild(this.header);
    }
    removeTopLevel() {
        if (this.topLevel !== null) {
            this.removeChild(this.topLevel);
            this.topLevel.event.add_item.remove(this.addItemRank, this);
            this.topLevel.destroy();
            this.topLevel = null;
        }
    }

    addTopDiamond() {
        if (this.topDiamond === null) {
            this.topDiamond = new RankingDiamond();
            this.topDiamond.event.add_item.add(this.addItemRank, this);
            this.addChild(this.topDiamond);
        }
        this.topDiamond.revive();


        this.addChild(this.header);
    }
    removeTopDiamond() {
        if (this.topDiamond !== null) {
            this.topDiamond.event.add_item.remove(this.addItemRank, this);
            this.removeChild(this.topDiamond);
            this.topDiamond.destroy();
            this.topDiamond = null;
        }
    }

    addTopTurnBase() {
        // this.removeAll();
        //this.removeTopTurnBase();
        if (this.topTurnBase === null) {
            this.topTurnBase = new RankingTurnBase();
            this.topTurnBase.event.add_item.add(this.addItemRank, this);
            this.addChild(this.topTurnBase);
        }
        this.topTurnBase.revive();


        this.addChild(this.header);
    }
    removeTopTurnBase() {
        if (this.topTurnBase !== null) {
            this.removeChild(this.topTurnBase);
            this.topTurnBase.event.add_item.remove(this.addItemRank, this);
            this.topTurnBase.destroy();
            this.topTurnBase = null;
        }
    }

    addTopOnlineMode() {
        if (this.topOnlineMode === null) {
            this.topOnlineMode = new RankingOnlineMode();
            this.topOnlineMode.event.add_item.add(this.addItemRank, this);
            this.addChild(this.topOnlineMode);
        }
        this.topOnlineMode.revive();


        this.addChild(this.header);
    }
    removeTopOnlineMode() {
        if (this.topOnlineMode !== null) {
            this.removeChild(this.topOnlineMode);
            this.topOnlineMode.event.add_item.remove(this.addItemRank, this);
            this.topOnlineMode.destroy();
            this.topOnlineMode = null;
        }
    }


    changeIndex() {
        let idx = this.listRanking.getIdx();
        if (this.tabIdx === Ranking.TOP_LEVEL) {
            this.topLevel.changeIndex(idx);
        } else if (this.tabIdx === Ranking.TOP_DIAMOND) {
            this.topDiamond.changeIndex(idx);
        } else if (this.tabIdx === Ranking.TOP_TURNBASE) {
            this.topTurnBase.changeIndex(idx);
        } else if (this.tabIdx === Ranking.TOP_ONLINEMODE) {
            this.topOnlineMode.changeIndex(idx);
        }
    }

    checkLoadMore() {
        if (this.tabIdx === Ranking.TOP_LEVEL) {
            this.topLevel.checkLoadMore();
        } else if (this.tabIdx === Ranking.TOP_DIAMOND) {
            this.topDiamond.checkLoadMore();
        } else if (this.tabIdx === Ranking.TOP_TURNBASE) {
            this.topTurnBase.checkLoadMore();
        } else if (this.tabIdx === Ranking.TOP_ONLINEMODE) {
            this.topOnlineMode.checkLoadMore();
        }
    }

    addItemRank(item) {
        this.listRanking.add(item);
    }

    backHeader() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU, {});
    }

    destroy() {
        MainData.instance().positionRankingData = null;
        this.listRanking.events.changeIndex.remove(this.changeIndex, this);
        this.removePopupHelp();
        this.removeAddEvent();
        this.removeEvent();
        this.removeAll();
        this.listRanking.removeAll();
        this.listRanking.destroy();
        super.destroy();
    }
}