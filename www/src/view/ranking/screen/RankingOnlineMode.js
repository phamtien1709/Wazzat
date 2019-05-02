import BaseView from "../../BaseView.js";
import SocketController from "../../../controller/SocketController.js";
import RankingCommand from "../../../model/ranking/datafield/RankingCommand.js";
import Ranking from "../Ranking.js";
import GetRankingOnlineMode from "../../../model/ranking/server/getdata/GetRankingOnlineMode.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import UserRankingOnlineMode from "../../../model/ranking/data/UserRankingOnlineMode.js";
import RankingItemTopDiamond from "../item/RankingItemTopDiamond.js";
import MainData from "../../../model/MainData.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ControllLoading from "../../ControllLoading.js";
import SendRankingIndex from "../../../model/ranking/server/senddata/SendRankingIndex.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class RankingOnlineMode extends BaseView {
    constructor() {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            add_item: new Phaser.Signal()
        }

        this.ktBuild = false;
        this.ktLoadMore = false;
        this.positionRanking = JSON.parse(game.cache.getText('positionRanking'));

        this.positionMe = -1;
        this.playlist_number = 0;
        this.arrRanking = [];
        this.idDelay = null;
        this.idx = 0;
        this.idxItem = 1;
        this.countItem = 0;
        this.rankMe = null;

        this.bgRankMe = new SpriteBase(this.positionRanking.item_ranking_bg_rank_me);
        this.bgRankMe.y = game.height - 110 * MainData.instance().scale;
        this.addChild(this.bgRankMe);

        this.txtError = new TextBase(this.positionRanking.item_ranking_txt_error, Language.instance().getData("126"));
        this.txtError.setTextBounds(0, 0, game.width, 38 * MainData.instance().scale);
        this.txtError.y = game.height - 76 * MainData.instance().scale;
        this.addChild(this.txtError);
        this.txtError.visible = false;

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Ranking_online);

        this.addEvent();
    }
    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        this.arrRanking = [];
        this.removeDelayBuild();
        this.idx = 0;
        this.countItem = 0;
        this.sendGetDataServer();
    }

    sendGetDataServer() {
        if (this.idxItem < 100) {
            ControllLoading.instance().showLoading();

            let min = this.idxItem;
            let max = this.idxItem + 9;
            if (max > 100) {
                max = 100;
            }

            SocketController.instance().sendData(RankingCommand.RANKING_ONLINE_LOAD_REQUEST,
                SendRankingIndex.begin(min, max));

        }
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }
    getData(data) {
        switch (data.cmd) {
            case RankingCommand.RANKING_ONLINE_LOAD_RESPONSE:
                let dataRanking = GetRankingOnlineMode.begin(data.params);
                for (let i = 0; i < dataRanking.top_users.length; i++) {
                    this.arrRanking.push(dataRanking.top_users[i]);
                }
                this.idxItem = this.arrRanking.length + 1;

                if (this.positionMe === -1) {
                    this.positionMe = dataRanking.position.rank;
                    this.playlist_number = dataRanking.position.count_win;
                }

                this.ktLoadMore = false;

                this.buildListRanking();
                break;

        }
    }


    removeRankMe() {
        if (this.rankMe !== null) {
            this.removeChild(this.rankMe);
            this.rankMe.destroy();
            this.rankMe = null;
        }
    }

    buildListRanking() {
        if (this.positionMe > -1) {
            this.txtError.visible = false;
            if (this.rankMe === null) {
                let data = new UserRankingOnlineMode();
                data.id = SocketController.instance().dataMySeft.id;
                data.id = SocketController.instance().dataMySeft.id;
                data.avatar = SocketController.instance().dataMySeft.avatar;
                data.user_name = SocketController.instance().dataMySeft.user_name;
                data.count_win = this.playlist_number;
                data.vip = SocketController.instance().dataMySeft.vip;

                this.rankMe = new RankingItemTopDiamond(data, this.positionMe - 1, Ranking.TOP_ONLINEMODE, true);
                this.rankMe.x = 0;
                this.rankMe.y = game.height - 108 * MainData.instance().scale;
                this.addChild(this.rankMe);
            }
        } else {
            this.txtError.visible = true;
        }
        this.buildItemPage();

        game.time.events.add(1000, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading()
    }


    changeIndex(idx) {
        if (idx === this.arrRanking.length - 1) {
            if (this.ktBuild === false) {
                this.ktBuild = true;
                this.ktLoadMore = true;
                //ControllLoading.instance().showLoading();
                //this.sendGetDataServer();
            }
        } else {
            if (this.countItem === (idx + 1) && this.ktBuild === false) {
                this.buildItemPage();
            }
        }
    }
    checkLoadMore() {
        if (this.ktLoadMore === true) {
            this.ktLoadMore = false;
            this.sendGetDataServer();
        } else {
            ControllLoading.instance().hideLoading();
        }
    }

    buildItemPage() {
        this.ktBuild = true;
        for (let i = this.idx; i < this.arrRanking.length; i++) {
            let item = new RankingItemTopDiamond(this.arrRanking[i], i, Ranking.TOP_ONLINEMODE);
            this.event.add_item.dispatch(item);
            this.idx++;
            this.countItem++;
            if (this.countItem % 10 === 0 && this.idx < this.arrRanking.length) {
                this.ktBuild = false;
                break;
            }

            if (this.idx === this.arrRanking.length) {
                this.ktBuild = false;
            }
        }
    }

    removeDelayBuild() {
        if (this.idDelay !== null) {
            game.time.events.remove(this.idDelay);
            this.idDelay = null;
        }
    }

    kill() {
        super.kill();
    }

    revive() {
        ControllLoading.instance().showLoading();
        super.revive();
        this.removeDelayBuild();
        this.idx = 0;
        this.countItem = 0;
        this.buildListRanking();
    }

    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        this.removeDelayBuild();
        this.removeEvent();
        super.destroy();
    }
}