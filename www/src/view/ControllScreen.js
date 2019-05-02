import ConfigScreenName from "../config/ConfigScreenName.js";
import LoginScreen from "./login/LoginScreen.js";
import MenuScreen from "./menu/MenuScreen.js";
import OnlineModeScreen from "./onlinemode/OnlineModeScreen.js";
import QuestAndAchievementScreen from "../modules/menu/QuestAndAchievement/QuestAndAchievementScreen.js";
import TurnBaseScreen from "./turnBase/TurnBaseScreen.js";
import SoloModeScreen from "./solomode/SoloModeScreen.js";
import NewUserScreen from "./newuser/NewUserScreen.js";
import EventModeScreen from "./eventmode/EventModeScreen.js";
import Ranking from "./ranking/Ranking.js";
import ControllLoading from "./ControllLoading.js";
import MainData from "../model/MainData.js";
import ControllScreenDialog from "./ControllScreenDialog.js";

export default class ControllScreen extends Phaser.Group {
    constructor() {
        super(game)
        this.screen = null;
    }

    static instance() {
        if (this.controllScreen) {

        } else {
            this.controllScreen = new ControllScreen();
        }

        return this.controllScreen;
    }

    removeScreen() {
        if (this.screen !== null) {
            this.removeChild(this.screen);
            this.screen.destroy();
            this.screen = {};
            this.screen = null;
        }
    }

    changeScreen(screenName, data = null) {
        this.removeScreen();
        LogConsole.log(screenName);
        MainData.instance().state = screenName;
        ControllLoading.instance().showLoading();
        ControllScreenDialog.instance().removeTextScroll();
        switch (screenName) {
            case ConfigScreenName.LOGIN:
                this.screen = new LoginScreen();
                break;
            case ConfigScreenName.MAIN_MENU:
                this.screen = new MenuScreen();
                break;
            case ConfigScreenName.ONLINE_MODE:
                this.screen = new OnlineModeScreen();
                ControllScreenDialog.instance().removeAllItem();
                break;
            case ConfigScreenName.QUEST_ACHIEVEMENT:
                this.screen = new QuestAndAchievementScreen(data);
                break;
            case ConfigScreenName.TURN_BASE:
                if (data !== null) {
                    this.screen = new TurnBaseScreen(data.opponent, data.type, data);
                } else {
                    this.screen = new TurnBaseScreen(data, data);
                }
                break;
            case ConfigScreenName.SOLO_MODE:
                this.screen = new SoloModeScreen(data);
                break;
            case ConfigScreenName.NEW_USER:
                this.screen = new NewUserScreen();
                break;
            case ConfigScreenName.EVENT_MODE:
                this.screen = new EventModeScreen();
                break;
            case ConfigScreenName.RANKING_ALL:
                this.screen = new Ranking();
                break;
        }

        this.addChild(this.screen);
    }
}