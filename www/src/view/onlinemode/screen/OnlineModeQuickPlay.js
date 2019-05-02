import BaseView from "../../BaseView.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";

import SwitchScreen from "../../component/SwitchScreen.js";
import OnlineModeListGenres from "../screenitem/quickplay/OnlineModeListGenres.js";
import OnlineModeListBet from "../screenitem/quickplay/OnlineModeListBet.js";
import OnlineModeListPlaylist from "../screenitem/quickplay/OnlineModeListPlaylist.js";
import Genres from "../../../model/onlineMode/data/Genres.js";
import OnlineModeQuickPlayWaitting from "./OnlineModeQuickPlayWaitting.js";
import SocketController from "../../../controller/SocketController.js";
import SendOnlineModeFindGame from "../../../model/onlineMode/server/senddata/SendOnlineModeFindGame.js";
import OnlineModeCommand from "../../../model/onlineMode/dataField/OnlineModeCommand.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeQuickPlay extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.chooseGenes = null;
        this.chooseBet = null;
        this.choosePlaylist = null;
        this.playGame = null;
        this.event = {
            back: new Phaser.Signal()
        }
        this.bg = new Phaser.Image(game, 0, 0, "bg-playlist")
        this.addChild(this.bg);

        this.addChooseGenes();

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Party_online_mode_quickplay);

        this.addEvent();
    }


    getData(data) {
        switch (data.cmd) {
            case OnlineModeCommand.ONLINE_MODE_FIND_GAME_RESPONSE:
                if (data.params.getUtfString("status") === "FAILED") {
                    this.chooseBack();
                }
                break;
        }
    }

    addEventAll() {
        if (this.chooseGenes !== null) {
            this.chooseGenes.addEvent();
        }
        if (this.chooseBet !== null) {
            this.chooseBet.addEvent();
        }
        if (this.choosePlaylist !== null) {
            this.choosePlaylist.addEvent();
        }
    }

    addChooseGenes() {
        this.removeChooseGenes();
        this.chooseGenes = new OnlineModeListGenres();
        this.chooseGenes.event.back.add(this.chooseBack, this);
        this.chooseGenes.event.next_bet.add(this.addChooseBet, this);
        this.addChild(this.chooseGenes);

        if (this.chooseBet !== null) {
            SwitchScreen.instance().beginSwitch(this.chooseBet, this.chooseGenes, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChooseBetComplete, this);
        } else if (this.choosePlaylist !== null) {
            SwitchScreen.instance().beginSwitch(this.choosePlaylist, this.chooseGenes, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChoosePlaylistComplete, this);
        } else if (this.playGame !== null) {
            SwitchScreen.instance().beginSwitch(this.playGame, this.chooseGenes, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenplayGameComplete, this);
        } else {
            this.addEventAll();
        }
    }



    tweenChooseBetComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenChooseBetComplete, this);
        this.removeChooseBet();
        this.addEventAll();
    }

    tweenChoosePlaylistComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenChoosePlaylistComplete, this);
        this.removeChoosePlaylist();
        this.addEventAll();
    }
    tweenChooseGenesComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenChooseGenesComplete, this);
        this.removeChooseGenes();
        this.addEventAll();
    }

    tweenplayGameComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenplayGameComplete, this);
        this.removePlayGame();
        this.addEventAll();
    }

    removeChooseGenes() {
        if (this.chooseGenes !== null) {
            this.removeChild(this.chooseGenes);
            this.chooseGenes.destroy();
            this.chooseGenes = null;
        }
    }

    addChooseBet(data) {
        this.removeChooseBet();
        this.chooseBet = new OnlineModeListBet(data);
        this.chooseBet.event.back.add(this.chooseBack, this);
        this.chooseBet.event.choose_bet.add(this.addChoosePlaylist, this);
        this.chooseBet.event.backGenres.add(this.addChooseGenes, this);
        this.addChild(this.chooseBet);

        if (this.chooseGenes !== null) {
            SwitchScreen.instance().beginSwitch(this.chooseGenes, this.chooseBet, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChooseGenesComplete, this);
        } else if (this.choosePlaylist !== null) {
            SwitchScreen.instance().beginSwitch(this.choosePlaylist, this.chooseBet, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChoosePlaylistComplete, this);
        } else {
            this.addEventAll();
        }
    }

    removeChooseBet() {
        if (this.chooseBet !== null) {
            this.removeChild(this.chooseBet);
            this.chooseBet.destroy();
            this.chooseBet = null;
        }
    }

    addChoosePlaylist(data) {
        this.removeChoosePlaylist();
        this.choosePlaylist = new OnlineModeListPlaylist(data);
        this.choosePlaylist.event.back.add(this.chooseBack, this);
        this.choosePlaylist.event.backGenres.add(this.addChooseGenes, this);
        this.choosePlaylist.event.backBet.add(this.addChooseBet, this);
        this.addChild(this.choosePlaylist);

        if (this.chooseBet !== null) {
            SwitchScreen.instance().beginSwitch(this.chooseBet, this.choosePlaylist, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChooseBetComplete, this);
        } else {
            this.addEventAll();
        }
    }

    removeChoosePlaylist() {
        if (this.choosePlaylist !== null) {
            this.removeChild(this.choosePlaylist);
            this.choosePlaylist.destroy();
            this.choosePlaylist = null;
        }
    }

    addPlayGame(data) {
        this.removePlayGame();
        let dataGennes = new Genres();
        if (this.choosePlaylist !== null) {
            dataGennes = this.choosePlaylist.getGenres();
            MainData.instance().dataGennes = dataGennes;
        } else {
            dataGennes = MainData.instance().dataGennes;
        }

        this.playGame = new OnlineModeQuickPlayWaitting(data, dataGennes);
        this.playGame.event.back.add(this.chooseBack, this);
        this.playGame.event.play_again.add(this.playAgain, this);
        //this.playGame.addEventExitRoom(this.addChooseGenes, this);
        this.addChild(this.playGame);

        if (this.choosePlaylist !== null) {
            SwitchScreen.instance().beginSwitch(this.choosePlaylist, this.playGame, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChoosePlaylistComplete, this);
        }
        if (this.chooseBet !== null) {
            this.removeChooseBet();
        }
        if (this.chooseGenes !== null) {
            this.removeChooseGenes();
        }
    }

    playAgain() {
        SocketController.instance().sendData(OnlineModeCommand.ONLINE_MODE_FIND_GAME_REQUEST,
            SendOnlineModeFindGame.begin(
                MainData.instance().dataPlayOnlineMode.id,
                MainData.instance().dataPlayOnlineMode.genre_id,
                MainData.instance().dataPlayOnlineMode.bet_id));
    }

    removePlayGame() {
        if (this.playGame !== null) {
            this.removeChild(this.playGame);
            this.playGame.destroy();
            this.playGame = null;
        }
    }

    chooseBack() {
        LogConsole.log("chooseBack-quicplay");
        this.event.back.dispatch();
    }

    destroy() {

        this.removeEvent();
        super.destroy();
    }
}