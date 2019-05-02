import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import SocketController from "../../controller/SocketController.js";
import MenuStateScrollDownSprite from "./items/MenuStateScrollDownSprite.js";
import MenuBtnFindGame from "./items/MenuBtnFindGame.js";
import MenuBtnPractice from "./items/MenuBtnPractice.js";
import MenuBtnParty from "./items/MenuBtnParty.js";
import DataCommand from "../../common/DataCommand.js";
import MenuScrollList from "./items/MenuScrollList.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import MenuBtnQuest from "./items/MenuBtnQuest.js";
import MenuBtnRanking from "./items/MenuBtnRanking.js";
import MenuBtnEvent from "./items/MenuBtnEvent.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import MenuUserProfile from "./items/MenuUserProfile.js";
import BottomNavigationModule from "./items/MenuBottomNavigationModule.js";
import SoloModeScreen from "../solomode/SoloModeScreen.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import GetDailyRewardNotification from "../../model/dailyreward/getData/GetDailyRewardNotification.js";
import ControllLoading from "../ControllLoading.js";
import TurnBaseScreen from "../turnBase/TurnBaseScreen.js";
import MainData from "../../model/MainData.js";
import PopupConfirm from "../popup/PopupConfirm.js";
import Common from "../../common/Common.js";
import PlayScriptScreen from "../playscript/playScriptScreen.js";
import MenuBtnShop from "./items/MenuBtnShop.js";
import ControllInvitation from "../../controller/ControllInvitation.js";
import ControllLoadCacheUrl from "../component/ControllLoadCacheUrl.js";
import BaseGroup from "../BaseGroup.js";

export default class MenuScreen extends BaseGroup {
    constructor() {
        super(game);
        this.btnShop = null;
        this.btnEvent = null;
        this.btnQuest = null;
        this.btnRanking = null;
        this.btnFindGame = null;
        this.btnPractice = null;
        this.btnParty = null;
        this.userProfile = null;
        this.scrollList = null;
        this.navBar = null;
        this.timeoutLoading = null;
        this.timeoutShowChallenge = null;
        this.event = {
            goToFindGame: new Phaser.Signal(),
            goToTurnBasePlay: new Phaser.Signal(),
            goToParty: new Phaser.Signal(),
            goToSoloMode: new Phaser.Signal(),
            goToGift: new Phaser.Signal(),
            goToEvent: new Phaser.Signal(),
            refreshMenu: new Phaser.Signal()
        };
        this.playScript = JSON.parse(game.cache.getText('playScript'));
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.bg = new Phaser.Sprite(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
        this.afterInit();
    }

    afterInit() {
        ControllLoading.instance().showLoading();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Main_menu);
        //
        this.addEventExtension();
        //
        this.user = {
            avatar: SocketController.instance().dataMySeft.avatar,
            user_name: SocketController.instance().dataMySeft.user_name
        }
        //
        this.layoutMenu = new Phaser.Group(game);
        this.addChild(this.layoutMenu);
        this.bgFake = new MenuStateScrollDownSprite("bg_scrollMenu");
        this.layoutMenu.addChild(this.bgFake);
        this.layoutMain = new Phaser.Group(game);
        this.layoutMenu.addChild(this.layoutMain);
        this.layoutNavBar = new Phaser.Group(game);
        this.addChild(this.layoutNavBar);
        //
        this.addBtnFindGame();
        this.addBtnPractice();
        this.addBtnParty();
        this.setAnimButtonModeGame();
        //
        this.addBtnGift();
        this.addBtnQuest();
        this.addBtnEvent();
        this.addBtnRanking();
        //
        this.addUserProfile();
        //
        this.addNavBar();
        //
        this.addScollList();
        //
        this.sendRequestMenuChallenges();
        //
        this.bgFake.event.refreshMenu.add(this.refreshMenu, this);
        this.bgFake.event.scrollChange.add(this.scrollChange, this);
        this.bgFake.event.scrollDefault.add(this.scrollDefault, this);
        this.bgFake.event.scrollList.add(this.scrollListEvent, this);
    }

    checkShowInvite(data) {
        if (this.navBar !== null) {
            if (this.navBar.typeNew !== 2) {
                if (ControllInvitation.instance().getUserBlock(data.getInt('inviter_id')) === false) {
                    ControllScreenDialog.instance().addDialogInviteFriend(data, true);
                }
            }
        }
    }

    scrollListEvent(index) {
        if (this.scrollList) {
            this.scrollList.scrollEventResponse(index);
        }
    }

    refreshMenu() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    scrollChange() {
        this.btnShop.scrollChange();
        this.btnQuest.scrollChange();
        this.btnEvent.scrollChange();
        this.btnRanking.scrollChange();
        //
        this.btnFindGame.setPosY(225);
        this.btnParty.setPosY(225);
        this.btnPractice.setPosY(225);
        //
        this.layoutMain.addChild(this.btnFindGame);
        this.layoutMain.addChild(this.btnParty);
        this.layoutMain.addChild(this.btnPractice);
        this.bgFake.isScrollChange = true;
        this.userProfile.scrollChange();
        this.timeoutLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1200);
    }
    scrollDefault() {
        //
        this.btnShop.scrollDefault();
        this.btnQuest.scrollDefault();
        this.btnEvent.scrollDefault();
        this.btnRanking.scrollDefault();
        //
        this.btnFindGame.setPosYDefault(this.positionMenuConfig.btn_findgame.y * window.GameConfig.RESIZE);
        this.btnParty.setPosYDefault(this.positionMenuConfig.btn_party.y * window.GameConfig.RESIZE);
        this.btnPractice.setPosYDefault(this.positionMenuConfig.btn_practice.y * window.GameConfig.RESIZE);
        //
        this.bgFake.addChild(this.btnParty);
        this.bgFake.addChild(this.btnPractice);
        this.bgFake.addChild(this.btnFindGame);
        this.bgFake.isScrollChange = false;
        this.userProfile.scrollDefault();
        this.timeoutLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1200);
    }
    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
        //
        this.bgFake.event.refreshMenu.remove(this.refreshMenu, this);
        this.bgFake.event.scrollChange.remove(this.scrollChange, this);
        this.bgFake.event.scrollDefault.remove(this.scrollDefault, this);
    }
    //
    sendRequestMenuChallenges() {
        if (MainData.instance().menuLoadResponses == null) {
            SocketController.instance().sendDataGetMenu(DataCommand.MAIN_MENU_LOAD_REQUEST, 'MAIN_MENU_LOAD_REQUEST');
        } else {
            this.checkRequestSocketMainMenuCheck();
            if (MainData.instance().isRefreshMenu.checking == false) {
                // ControllLoading.instance().hideLoading();
                SocketController.instance().sendData(DataCommand.MAIN_MENU_CHECK_UPDATE_REQUEST, null);
                //
                this.timeoutShowChallenge = setTimeout(() => {
                    this.scrollList.displayListChallenge();
                    this.bgFake.addChildren(this.scrollList);
                }, 800);
                this.refreshButNotRefresh();
                //
                MainData.instance().isRefreshMenu.checking = true;
                MainData.instance().isRefreshMenu.updated = Date.now();
            } else {
                // ControllLoading.instance().hideLoading();
                //
                this.timeoutShowChallenge = setTimeout(() => {
                    this.scrollList.displayListChallenge();
                    this.bgFake.addChildren(this.scrollList);
                }, 800);
                this.refreshButNotRefresh();
            }
            //
            if (MainData.instance().isScrollChange == true) {
                this.scrollChange();
            } else {
                this.scrollDefault();
            }
            //
        }
    }

    checkRequestSocketMainMenuCheck() {
        if (MainData.instance().isRefreshMenu.checking == true) {
            let now = Date.now();
            if ((now - MainData.instance().isRefreshMenu.updated) < 6000) {
                MainData.instance().isRefreshMenu.checking = true;
            } else {
                MainData.instance().isRefreshMenu.checking = false;
            }
        } else {
            MainData.instance().isRefreshMenu.checking = false;
        }
    }

    //
    setAnimButtonModeGame() {
        var countAnim = 1;
        this.timeLoopAnim = game.time.create(true);
        this.timeLoopAnim.loop(Phaser.Timer.SECOND * 8, () => {
            if (countAnim == 1) {
                this.btnFindGame.startAnim();
            } else if (countAnim == 2) {
                this.btnParty.startAnim();
            } else if (countAnim == 3) {
                this.btnPractice.startAnim();
            }
            countAnim++;
            if (countAnim == 4) {
                countAnim = 1;
            }
        }, this);
        this.timeLoopAnim.start();
    }
    //
    addBtnEvent() {
        this.removeBtnEvent();
        this.btnEvent = new MenuBtnEvent();
        this.btnEvent.event.gotToEvent.add(this.onClickEventMode, this);
        this.layoutMain.addChild(this.btnEvent);
    }
    onClickEventMode() {
        ControllScreen.instance().changeScreen(ConfigScreenName.EVENT_MODE);
    }
    removeBtnEvent() {
        if (this.btnEvent !== null) {
            this.removeChild(this.btnEvent);
            this.btnEvent.destroy();
            this.btnEvent = null;
        }
    }
    //
    addBtnRanking() {
        this.removeBtnRanking();
        this.btnRanking = new MenuBtnRanking();
        this.btnRanking.btn.events.onInputUp.add(this.onClickRanking, this);
        this.layoutMain.addChild(this.btnRanking);
    }
    onClickRanking() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreen.instance().changeScreen(ConfigScreenName.RANKING_ALL);

    }
    removeBtnRanking() {
        if (this.btnRanking !== null) {
            this.removeChild(this.btnRanking);
            this.btnRanking.destroy();
            this.btnRanking = null;
        }
    }
    //
    addBtnFindGame() {
        this.removeBtnFindGame();
        this.btnFindGame = new MenuBtnFindGame();
        this.btnFindGame.event.onClickFindGame.add(this.onClickFindGame, this);
        this.addChild(this.btnFindGame);
    }
    onClickFindGame() {
        ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE);
    }
    removeBtnFindGame() {
        if (this.btnFindGame !== null) {
            this.removeChild(this.btnFindGame);
            this.btnFindGame.destroy();
            this.btnFindGame = null;
        }
    }
    //
    addBtnGift() {
        this.removeBtnGift();
        this.btnShop = new MenuBtnShop();
        this.btnShop.event.goToShop.add(this.onShopBtnInput, this);
        this.btnShop.event.refreshMenu.add(this.refreshMenu, this);
        this.layoutMain.addChild(this.btnShop);
    }
    removeBtnGift() {
        if (this.btnShop !== null) {
            this.removeChild(this.btnShop);
            this.btnShop.destroy();
            this.btnShop = null;
        }
    }
    onGiftBtnInput(hours_reward_setting) {
        this.hours_reward_setting = hours_reward_setting;
        this.userProfile.claimHourReward(this.hours_reward_setting);
    }
    onShopBtnInput() {
        ControllScreenDialog.instance().addShop(0);
    }
    onShared(response) {
        if (response.hasOwnProperty(error_code)) {

        } else {
            this.sendShareResult();
        }
    }
    sendShareResult() {
        SocketController.instance().sendData(DataCommand.FB_USER_SHARED_RESULT_REQUEST, null);
    }
    //
    addBtnParty() {
        this.removeBtnParty();
        this.btnParty = new MenuBtnParty();
        this.btnParty.event.goToParty.add(this.goToParty, this);
        this.addChild(this.btnParty);
    }
    removeBtnParty() {
        if (this.btnParty !== null) {
            this.removeChild(this.btnParty);
            this.btnParty.destroy();
            this.btnParty = null;
        }
    }
    goToParty() {
        ControllScreen.instance().changeScreen(ConfigScreenName.ONLINE_MODE);
    }

    addBtnPractice() {
        this.removeBtnPractice();
        this.btnPractice = new MenuBtnPractice();
        this.btnPractice.event.onClickPractice.add(this.onClickPracticeBtn, this); this.addChild(this.btnPractice);
    }
    removeBtnPractice() {
        if (this.btnPractice !== null) {
            this.removeChild(this.btnPractice);
            this.btnPractice.destroy();
            this.btnPractice = null;
        }
    }
    onClickPracticeBtn() {
        ControllScreen.instance().changeScreen(ConfigScreenName.SOLO_MODE, SoloModeScreen.PICK_ALBUM);
    }
    //
    addBtnQuest() {
        this.removeBtnQuest();
        this.btnQuest = new MenuBtnQuest();
        this.btnQuest.btn.events.onInputUp.add(this.onClickQAndA, this)
        this.layoutMain.addChild(this.btnQuest);
    }
    onClickQAndA() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreen.instance().changeScreen(ConfigScreenName.QUEST_ACHIEVEMENT, 2);
    }
    removeBtnQuest() {
        if (this.btnQuest !== null) {
            this.removeChild(this.btnQuest);
            this.btnQuest.destroy();
            this.btnQuest = null;
        }
    }
    //
    addNavBar() {
        this.removeNavBar();
        this.navBar = new BottomNavigationModule();
        this.navBar.createButtonOnNavigation();
        this.navBar.event.backMenu.add(this.backMenu, this);
        this.navBar.event.changeOtherScreen.add(this.changeOtherScreen, this);
        this.layoutNavBar.addChild(this.navBar);
    }
    backMenu() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    changeOtherScreen() {
        if (this.layoutMenu.x !== (-game.width - 300)) {
            // console.log('YSYSYF');
            let tween = game.add.tween(this.layoutMenu).to({
                x: -game.width - 300
            }, 500, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                // this.destroy();
            }, this);

        }
    }
    removeNavBar() {
        if (this.navBar !== null) {
            this.removeChild(this.navBar);
            this.navBar.destroy();
            this.navBar = null;
        }
    }
    //
    addUserProfile() {
        this.removeUserProfile();
        this.userProfile = new MenuUserProfile();
        this.userProfile.event.claimHourRewardDone.add(this.claimHourRewardDone, this);
        this.layoutMain.addChild(this.userProfile);
    }
    claimHourRewardDone() {
        this.userProfile.event.claimHourRewardDone.remove(this.claimHourRewardDone, this);
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    removeUserProfile() {
        if (this.userProfile !== null) {
            this.layoutMain.removeChild(this.userProfile);
            this.userProfile.destroy();
            this.userProfile = null;
        }
    }
    //
    addScollList() {
        this.removeScrollList();
        this.scrollList = new MenuScrollList();
        this.scrollList.event.playGame.add(this.onPlayGameScrollList, this);
        this.scrollList.event.nudgeFriend.add(this.nudgeFriend, this);
        this.scrollList.event.deleteChallenge.add(this.deleteChallenge, this);
    }
    removeScrollList() {
        if (this.scrollList !== null) {
            this.removeChild(this.scrollList);
            this.scrollList.destroy();
            this.scrollList = null;
        }
    }
    onPlayGameScrollList(evtParams) {
        ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE, evtParams);
    }
    nudgeFriend(value) {
        var params = new SFS2X.SFSObject();
        params.putInt('opponent_id', value.opponentEntity.id);
        SocketController.instance().sendData(DataCommand.POKE_USER_REQUEST, params);
    }

    deleteChallenge(opponentIds) {
        if (opponentIds.length > 0) {
            let opponent_ids = new SFS2X.SFSArray();
            for (i = 0; i < opponentIds.length; i++) {
                opponent_ids.addInt(opponentIds[i]);
            }
            let popup = new PopupConfirm("Bạn có muốn xóa lời thách đấu này không?");
            popup.event.CANCLE.add(() => {
                popup.destroy();
            }, this);
            popup.event.OK.add(() => {
                popup.destroy();
                //
                ControllLoading.instance().showLoading();
                var params = new SFS2X.SFSObject();
                params.putSFSArray('opponent_ids', opponent_ids);
                SocketController.instance().sendData(DataCommand.TURNBASE_DELETE_GAME_REQUEST, params);
            }, this);
            ControllScreenDialog.instance().addChild(popup);
        }
        //
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.MAIN_MENU_LOAD_RESPONSE) {
            //
            // ControllLoading.instance().hideLoading();
            //
            this.scrollList.handleMainMenuLoadResponse(evtParams.params, 1, (menuLoadResponses, init_quests_count, new_friend_request_count, started_event_count, hoursReward, playScript) => {
                MainData.instance().menuLoadResponses = menuLoadResponses;
                //
                this.scrollList.displayListChallenge();
                this.bgFake.addChildren(this.scrollList);
                this.bgFake.addChild(this.btnParty);
                this.bgFake.addChild(this.btnPractice);
                this.bgFake.addChild(this.btnFindGame);
                //
                //
                if (MainData.instance().isScrollChange == true) {
                    this.scrollChange();
                } else {
                    this.scrollDefault();
                }
                //
                MainData.instance().new_friend_request_count = new_friend_request_count;
                MainData.instance().started_event_count = started_event_count;
                MainData.instance().hoursReward = hoursReward;
                MainData.instance().playScript = playScript;
                MainData.instance().init_quests_count = init_quests_count;
                //
                this.btnQuest.addDotNoti(MainData.instance().init_quests_count);
                this.btnEvent.addDotNoti(MainData.instance().started_event_count);
                this.navBar.addFriendRequest(MainData.instance().new_friend_request_count);
                //
                if (MainData.instance().playScript.playing_guide == PlayScriptScreen.INIT) {
                    ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE, {
                        opponent: this.playScript.demoData.opponent,
                        type: TurnBaseScreen.TUTORIAL
                    })
                }
                if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_TURNBASE) {
                    this.addChild(PlayScriptScreen.instance());
                }
                if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_GET_QUEST) {
                    this.PlayScriptScreen = new PlayScriptScreen();
                    this.PlayScriptScreen.afterInit();
                    this.PlayScriptScreen.addStep8AcceptChallenge();
                    this.PlayScriptScreen.event.step8.add(this.acceptChallenge, this);
                    this.addChild(this.PlayScriptScreen);
                }
            });
            //
            SocketController.instance().sendRequestDataMessages();
            SocketController.instance().sendRequestSystemMessages();

        }
        if (evtParams.cmd == DataCommand.DAILY_REWARD_NOTIFICATION) {
            GetDailyRewardNotification.begin(evtParams.params, (dailyRewardSettings, dailyRewardLog) => {
                LogConsole.log(dailyRewardSettings);
                LogConsole.log(dailyRewardLog);
                setTimeout(() => {
                    ControllScreenDialog.instance().changeScreen(ConfigScreenName.DAILY_REWARD, {
                        dailyRewardSettings: dailyRewardSettings,
                        dailyRewardLog: dailyRewardLog
                    });
                }, 500);
            });
            // }
        }
        if (evtParams.cmd == DataCommand.POKE_USER_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            }
        }
        if (evtParams.cmd == DataCommand.TURNBASE_DELETE_GAME_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                // ControllLoading.instance().hideLoading();
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            } else {
                // ControllLoading.instance().hideLoading();
            }
        }
        if (evtParams.cmd == DataCommand.PLAY_SCRIPT_DONE_ALL_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                MainData.instance().playScript.playing_guide = PlayScriptScreen.DONE_ALL;
                PlayScriptScreen.instance().destroy();
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            }
        }
        if (evtParams.cmd == DataCommand.MAIN_MENU_CHECK_UPDATE_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                //
                //
                Common.handleCheckUpdateMainMenu(evtParams.params, (init_quests_count, new_friend_request_count, started_event_count, hoursReward, playScript) => {
                    MainData.instance().init_quests_count = init_quests_count;
                    MainData.instance().new_friend_request_count = new_friend_request_count;
                    MainData.instance().started_event_count = started_event_count;
                    MainData.instance().hoursReward = hoursReward;
                    MainData.instance().playScript = playScript;
                    //
                    this.refreshButNotRefresh();
                });
                //
                if (MainData.instance().isScrollChange == true) {
                    this.scrollChange();
                } else {
                    this.scrollDefault();
                }
            }
        }
    }

    refreshButNotRefresh() {
        //
        this.btnQuest.addDotNoti(MainData.instance().init_quests_count);
        this.btnEvent.addDotNoti(MainData.instance().started_event_count);
        this.navBar.addFriendRequest(MainData.instance().new_friend_request_count);
        //
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.INIT) {
            ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE, {
                opponent: this.playScript.demoData.opponent,
                type: TurnBaseScreen.TUTORIAL
            })
        }
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_TURNBASE) {
            this.addChild(PlayScriptScreen.instance());
        }
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_GET_QUEST) {
            this.PlayScriptScreen = new PlayScriptScreen();
            this.PlayScriptScreen.afterInit();
            this.PlayScriptScreen.addStep8AcceptChallenge();
            this.PlayScriptScreen.event.step8.add(this.acceptChallenge, this);
            this.addChild(this.PlayScriptScreen);
        }
    }

    acceptChallenge() {
        this.scrollList.acceptChallengeBot();
    }

    onUpdateUserVars() {
        if (this.user.avatar !== SocketController.instance().dataMySeft.avatar) {
            this.user.avatar = SocketController.instance().dataMySeft.avatar;
            this.addUserProfile();
        }
        if (this.user.user_name !== SocketController.instance().dataMySeft.user_name) {
            this.user.user_name = SocketController.instance().dataMySeft.user_name;
            this.userProfile.updateValue(MenuUserProfile.UPDATE_NAME);
        }
    }

    removeAllChild() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }

    destroy() {
        if (this.timeoutLoading !== null) {
            clearTimeout(this.timeoutLoading);
        }
        if (this.timeoutShowChallenge !== null) {
            clearTimeout(this.timeoutShowChallenge);
        }
        this.removeEventExtension();
        this.timeLoopAnim.stop();
        this.timeLoopAnim.destroy();
        ControllLoadCacheUrl.instance().resetLoad();
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