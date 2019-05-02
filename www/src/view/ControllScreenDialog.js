import SocketController from "../controller/SocketController.js";
import ConfigScreenName from "../config/ConfigScreenName.js";
import Timeout from "../modules/practiceMenu/PopupPractice/Ingame/Timeout.js";
import LosePopup from "../modules/practiceMenu/PopupPractice/Ingame/LosePopup.js";
import Reward from "../modules/practiceMenu/PopupPractice/Ingame/Reward.js";
import NotReward from "../modules/practiceMenu/PopupPractice/Ingame/NotReward.js";
import DoneSoloMode from "../modules/practiceMenu/PopupPractice/Ingame/DoneSoloMode.js";
import AnimClaimReward from "../modules/menu/QuestAndAchievement/items/AnimClaimReward.js";
import QuestClaimPopup from "../modules/menu/QuestAndAchievement/Sprites/QuestClaimPopup.js";
import AchievementClaimPopup from "../modules/menu/QuestAndAchievement/Sprites/AchievementClaimPopup.js";
import DailyRewardPopup from "./dailyreward/screen/DailyRewardPopup.js";
import ControllScreen from "./ControllScreen.js";
import ChatScreen from "../modules/menu/Navbar/NavBarFourScreen/Mail/screen/ChatScreen.js";
import SongDetailScreen from "./songDetail/SongDetailScreen.js";

import PopupConfirmBuyPlayList from "./popup/PopupConfirmBuyPlayList.js";
import PopupBuyDone from "./popup/PopupBuyDone.js";
import ShopCommand from "../model/shop/datafield/ShopCommand.js";
import SendShopBuyPlayList from "../model/shop/server/senddata/SendShopBuyPlayList.js";
import PopupInviteFriend from "./popup/PopupInviteFriend.js";
import PopupDialog from "./popup/PopupDialog.js";
import PopupConfirm from "./popup/PopupConfirm.js";
import SwitchScreen from "./component/SwitchScreen.js";
import SetttingScreen from "./setting/SettingScreen.js";
import SettingGameScreen from "./setting/screen/SettingGameScreen.js";
import SettingAccountScreen from "./setting/screen/SettingAccountScreen.js";
import SettingAccountUserName from "./setting/screen/SettingAccountUserName.js";
import UserProfile from "./userprofile/UserProfile.js";
import ShopNew from "./shopnew/ShopNew.js";
import ShopSortPlayList from "./shopnew/item/playlist/ShopSortPlayList.js";
import ShopTNPopupConfirmBuy from "./shopnew/item/tainguyen/ShopTNPopupConfirmBuy.js";
import QuestDailyClaimPopup from "../modules/menu/QuestAndAchievement/QuestDailyClaimPopup.js";
import TextScroller from "./component/TextScroller.js";
import ShopDetailPlayList from "./shopnew/item/playlist/ShopDetailPlayList.js";
import LevelUp from "./levelup/LevelUp.js";
import PopupBadConnection from "./popup/PopupBadConnection.js";
import EventGame from "../controller/EventGame.js";
import SettingProfileScreen from "./setting/screen/SettingProfileScreen.js";
import SettingGiftCode from "./setting/screen/SettingGiftcodeScreen.js";
import SendOnlineModeCRQuickJoin from "../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRQuickJoin.js";
import OnlineModeCRDataCommand from "../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import OnlineModeChooseIconChat from "./onlinemode/item/OnlineModeChooseIconChat.js";
import MainData from "../model/MainData.js";
import PlayScriptScreen from "./playscript/playScriptScreen.js";
import LimitTurn from "./turnBase/item/LimitTurn.js";
import PopupSuggetsRating from "./popup/PopupSuggetsRating.js";
import MailSystemScreen from "../modules/menu/Navbar/NavBarFourScreen/Mail/screen/MailSystemScreen.js";
import ShopTNItemMenuTab from "./shopnew/item/tainguyen/ShopTNItemMenuTab.js";
import ControllLoading from "./ControllLoading.js";
import PopupNotEnoughResource from "./popup/PopupNotEnoughResource.js";
import LastWeekResultScreen from "./turnBase/item/LastWeekResultScreen.js";
import ControllLocalStorage from "../controller/ControllLocalStorage.js";
import SqlLiteController from "../SqlLiteController.js";
import Language from "../model/Language.js";

export default class ControllScreenDialog extends Phaser.Group {
    static instance() {
        if (this.controllScreenDialog) {

        } else {
            this.controllScreenDialog = new ControllScreenDialog();
        }

        return this.controllScreenDialog;
    }

    buyItem(data) {
        //data la ShopPlayList
        if (SocketController.instance().dataMySeft.diamond < data.price) {
            this.addPopupMoney(data);
        } else {
            this.addPopupBuy(data);
        }
    }
    addPopupBuyDone(playlist_id, solo_mode = false) {
        this.removePopupBuyDone();
        this.popupBuyDone = new PopupBuyDone(playlist_id, solo_mode);
        this.popupBuyDone.event.OK.add(this.chooseBuyDoneOk, this);
        this.addChild(this.popupBuyDone);
    }

    chooseBuyDoneOk() {
        this.removePopupBuyDone();
    }

    removePopupBuyDone() {
        if (this.popupBuyDone !== null) {
            this.removeChild(this.popupBuyDone);
            this.popupBuyDone.destroy();
            this.popupBuyDone = null;
        }
    }
    //
    addPopupQAndA(type) {
        this.removePopupQAndA();
        this.qAndAPopup = new QuestAndAchievementScreen(type);
        this.qAndAPopup.setQuestAndQuestLogs();
        this.qAndAPopup.signalBack.add(this.onQAndAPopupBack, this);
        // this.qAndAPopup.setQuestAndQuestLogs(this.quests, this.quest_logs, this.next_quest);
        this.addChild(this.qAndAPopup);
    }

    onQAndAPopupBack() {
        this.removePopupQAndA();
        window.smartFoxSignal.sendData(DataCommand.QUEST_LOAD_REQUEST, null);
    }

    removePopupQAndA() {
        if (this.qAndAPopup !== null) {
            this.removeChild(this.qAndAPopup);
            this.qAndAPopup.destroy();
            this.qAndAPopup = null;
        }
    }

    addPopupBuy(data) {
        this.removePopupBuy();
        this.popupBuy = new PopupConfirmBuyPlayList();
        this.popupBuy.event.OK.add(this.chooseOk, this);
        this.popupBuy.event.CANCLE.add(this.chooseCanle, this);
        this.popupBuy.setData(data);
        this.addChild(this.popupBuy);
    }
    chooseOk(data) {
        if (SocketController.instance().dataMySeft.diamond < data.price) {
            this.addPopupMoney(data);
        } else {
            ControllLoading.instance().showLoading();
            SocketController.instance().sendData(ShopCommand.SHOP_BUY_PLAYLIST_REQUEST, SendShopBuyPlayList.begin(data.id));
        }
        this.removePopupBuy();
    }
    chooseCanle() {
        this.removePopupBuy();
    }

    removePopupBuy() {
        if (this.popupBuy !== null) {
            this.removeChild(this.popupBuy);
            this.popupBuy.destroy();
            this.popupBuy = null;
        }
    }

    addPopupMoney(data) {
        //data la ShopPlayList
        this.removePopupBuy();
        this.popupMoney = new PopupConfirmBuyPlayList();
        this.popupMoney.event.OK.add(this.chooseMoneyOk, this);
        this.popupMoney.event.CANCLE.add(this.chooseMoneyCancle, this);
        this.popupMoney.setContent(Language.instance().getData("180"));
        this.popupMoney.setData(data);
        this.addChild(this.popupMoney);
    }
    chooseMoneyOk(data) {
        this.addShop(1);
        this.removePopupMoney();
    }
    chooseMoneyCancle() {
        this.removePopupMoney();
    }

    removePopupMoney() {
        if (this.popupMoney !== null) {
            this.removeChild(this.popupMoney);
            this.popupMoney.destroy();
            this.popupMoney = null;
        }
    }

    addPlaylistDetail(playlist_id) {
        LogConsole.log("addPlaylistDetail");
        this.removePlaylistDetail();
        this.detail = new ShopDetailPlayList(playlist_id);
        this.detail.addEventBack(this.removePlaylistDetail, this);
        this.addChild(this.detail);
    }

    removePlaylistDetail() {
        if (this.detail !== null) {
            this.removeChild(this.detail);
            this.detail.destroy();
            this.detail = null;
        }
    }

    addLevelUp(level_up_to) {
        setTimeout(() => {
            this.beginAddUpLevel(level_up_to);
        }, 2500);
    }

    beginAddUpLevel(level_up_to) {
        this.removeLevelUp();
        this.levelUp = new LevelUp(level_up_to);
        this.levelUp.event.close.add(this.closeLevelUp, this);
        this.addChild(this.levelUp);
    }

    closeLevelUp() {
        this.removeLevelUp();
    }

    removeLevelUp() {
        if (this.levelUp !== null) {
            this.removeChild(this.levelUp);
            this.levelUp.destroy();
            this.levelUp = null;

            ControllLoading.instance().showLoading();
            SqlLiteController.instance().getCheckVote();
            SqlLiteController.instance().event.get_check_vote.add(this.getCheckVote, this);
        }
    }

    getCheckVote(voteCheck) {
        console.log("getCheckVote : " + voteCheck);
        ControllLoading.instance().hideLoading();
        SqlLiteController.instance().event.get_check_vote.remove(this.getCheckVote, this);
        if (voteCheck === "") {
            this.checkShowVote(SocketController.instance().dataMySeft.level);
        } else {
            if (voteCheck === "VoteSau") {
                this.checkShowVote(SocketController.instance().dataMySeft.level);
            } else {

            }
        }
    }

    checkShowVote(level) {
        console.log("voteCheck : " + level);
        if (level > 5) {
            let currentCheck = level - 6;
            if (currentCheck % 2 === 0) {
                ControllScreenDialog.instance().addSuggetRating();
            }
        } else if (level === 5) {
            ControllScreenDialog.instance().addSuggetRating();
        }
    }

    addDetailSong(data) {
        this.removeDetailSong();
        this.detailSong = new SongDetailScreen(data);
        this.addChild(this.detailSong);
    }

    removeDetailSong() {
        if (this.detailSong !== null) {
            this.removeChild(this.detailSong);
            this.detailSong.destroy();
            this.detailSong = null;
        }
    }


    addDialogInviteFriend(invitation, cmd = false) {
        this.removeDialogInviteFriend();
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_ALL) {
            this.inviteFriend = new PopupInviteFriend(invitation, cmd);
            this.inviteFriend.event.OK.add(this.chooseOkInviteFriend, this);
            this.inviteFriend.event.CANCLE.add(this.chooseCancleInviteFriend, this);
            this.inviteFriend.event.OK_CMD.add(this.chooseOkCmdInviteFriend, this);
            this.inviteFriend.event.CANCLE_CMD.add(this.chooseCancleCmdInviteFriend, this);
            this.addChild(this.inviteFriend);
        }
    }

    chooseOkCmdInviteFriend(id, bet_place) {
        if (SocketController.instance().dataMySeft.diamond < bet_place) {
            this.addDialogConfirnMoney(Language.instance().getData("181"));
        } else {
            SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_QUICK_JOIN_REQUEST,
                SendOnlineModeCRQuickJoin.begin(id));
        }
        this.removeDialogInviteFriend();
    }

    chooseOkInviteFriend(invitation) {
        if (SocketController.instance().dataMySeft.diamond < invitation.params.getInt("bet_place")) {
            this.addDialogConfirnMoney(Language.instance().getData("181"));
        } else {
            SocketController.instance().sendInvitationReply(invitation, SFS2X.InvitationReply.ACCEPT);
        }
        this.removeDialogInviteFriend();
    }

    chooseCancleCmdInviteFriend() {
        this.removeDialogInviteFriend();
    }

    chooseCancleInviteFriend(invitation) {
        SocketController.instance().sendInvitationReply(invitation, SFS2X.InvitationReply.REFUSE);
        this.removeDialogInviteFriend();
    }
    removeDialogInviteFriend() {
        if (this.inviteFriend !== null) {
            this.removeChild(this.inviteFriend);
            this.inviteFriend.destroy();
            this.inviteFriend = null;
        }
    }


    addDialog(content, url = "", nameButton = "") {
        this.removeDialog();
        this.dialog = new PopupDialog(content, url);
        if (nameButton !== "") {
            this.dialog.setContentButton(nameButton);
        }
        this.dialog.event.OK.add(this.removeDialog, this);
        this.addChild(this.dialog);
    }
    removeDialog() {
        if (this.dialog !== null) {
            this.removeChild(this.dialog);
            this.dialog.destroy();
            this.dialog = null;
        }
    }

    addDialogConfirnMoney(content, tryNo = "") {
        this.removeDialogConfirnMoney();
        this.dialogConfirmMoney = new PopupConfirm(content, tryNo);
        this.dialogConfirmMoney.event.OK.add(this.chooseOkConfirmMoney, this);
        this.dialogConfirmMoney.event.CANCLE.add(this.chooseCancleConfirmMoney, this);
        this.addChild(this.dialogConfirmMoney);
    }

    removeDialogConfirnMoney() {
        if (this.dialogConfirmMoney !== null) {
            this.removeChild(this.dialogConfirmMoney);
            this.dialogConfirmMoney.destroy();
            this.dialogConfirmMoney = null;
        }
    }
    chooseOkConfirmMoney() {
        this.addShop(1, ShopTNItemMenuTab.GEM);
        this.removeDialogConfirnMoney();
    }

    chooseCancleConfirmMoney() {
        this.removeDialogConfirnMoney();
    }

    addDialogConfirnTicket(content, tryNo = "") {
        this.removeDialogConfirnTicket();
        this.dialogConfirmTicket = new PopupConfirm(content, tryNo);
        this.dialogConfirmTicket.event.OK.add(this.chooseOkConfirmTicket, this);
        this.dialogConfirmTicket.event.CANCLE.add(this.chooseCancleConfirmTicket, this);
        this.addChild(this.dialogConfirmTicket);
    }

    removeDialogConfirnTicket() {
        if (this.dialogConfirmTicket !== null) {
            this.removeChild(this.dialogConfirmTicket);
            this.dialogConfirmTicket.destroy();
            this.dialogConfirmTicket = null;
        }
    }
    chooseOkConfirmTicket() {
        this.addShop(1, ShopTNItemMenuTab.TICKET);
        this.removeDialogConfirnTicket();
    }

    chooseCancleConfirmTicket() {
        this.removeDialogConfirnTicket();
    }

    addShop(idxTab, typeSubTab = "") {
        this.removeShop();
        this.shop = new ShopNew(idxTab, typeSubTab);
        this.shop.event.close.add(this.tweenRemoveShop, this);
        this.shop.event.view_all_shop.add(this.addSortShop, this);
        this.shop.event.search_shop.add(this.addSortShop, this);
        this.addChild(this.shop);

        //SwitchScreen.instance().beginSwitch(null, this.shop, false, 200);
    }
    tweenRemoveShop() {
        if (this.shop !== null) {
            SwitchScreen.instance().beginSwitch(this.shop, null, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenShopComplete, this);
        }
    }

    tweenShopComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenShopComplete, this);
        this.removeShop();
    }

    removeShop() {
        if (this.shop !== null) {
            this.removeChild(this.shop);
            this.shop.destroy();
            this.shop = null;
        }
    }

    addSortShop(objData) {
        /*
        objData = {           
            type: this.type,
            genres: this.genres,
            typeMenu = typeMenu,
            ktSearch: false
        }*/

        this.removeSortShop();
        this.sortShop = new ShopSortPlayList();
        this.sortShop.setData(objData.type, objData.genres, objData.typeMenu, objData.ktSearch);
        this.sortShop.event.back.add(this.choosebackSortShop, this);
        SwitchScreen.instance().beginSwitch(null, this.sortShop, false);
        SwitchScreen.instance().event.tweenComplete.add(this.tweenSortShopBeginComplete, this);
        this.addChild(this.sortShop);

    }

    choosebackSortShop() {
        this.addShop(0);
        this.removeSortShop();
    }
    tweenSortShopComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenSortShopComplete, this);
        this.removeSortShop();
    }
    tweenSortShopBeginComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenSortShopBeginComplete, this);
        this.sortShop.addEvent();
    }

    removeSortShop() {
        if (this.sortShop !== null) {
            this.removeChild(this.sortShop);
            this.sortShop.destroy();
            this.sortShop = null;
        }
    }

    addUserProfile(user_id, screen_idx = 0) {
        this.removeUserProfile();
        this.userProfile = new UserProfile(user_id, screen_idx);
        this.userProfile.event.back.add(this.removeUserProfile, this);
        this.addChild(this.userProfile);
    }

    removeUserProfile() {
        if (this.userProfile !== null) {
            this.removeChild(this.userProfile);
            this.userProfile.destroy();
            this.userProfile = null;
        }
    }

    addRanking(idxTab = 0) {
        this.ranking = new Ranking(idxTab);
        this.ranking.event.back.add(this.removeRanking, this);
        this.addChild(this.ranking);
    }

    removeRanking() {
        if (this.ranking !== null) {
            this.removeChild(this.ranking);
            this.ranking.destroy();
            this.ranking = null;
        }
    }

    addChatOnlineMode() {
        this.chatOnlineMode = new OnlineModeChooseIconChat();
        this.chatOnlineMode.x = 36;
        this.chatOnlineMode.y = game.height - 444;
        this.chatOnlineMode.event.close_dialog.add(this.removeChatOnlineMode, this);
        this.addChild(this.chatOnlineMode);
    }

    removeChatOnlineMode() {
        if (this.chatOnlineMode !== null) {
            this.removeChild(this.chatOnlineMode);
            this.chatOnlineMode.destroy();
            this.chatOnlineMode = null;
        }
    }

    addChatScreen(user) {
        this.removeChatScreen();
        this.chatScreen = new ChatScreen(user);
        this.addChild(this.chatScreen);
    }

    removeChatScreen() {
        if (this.chatScreen !== null) {
            this.removeChild(this.chatScreen);
            this.chatScreen.destroy();
            this.chatScreen = null;
        }
    }

    addShortUserProfile(id) {
        this.removeShortUserProfile();
        this.popupShortUserProfile = new PopupShortProfileUser(id);
        this.addChild(this.popupShortUserProfile);
    }
    removeShortUserProfile() {
        if (this.popupShortUserProfile !== null) {
            this.removeChild(this.popupShortUserProfile);
            this.popupShortUserProfile.destroy();
            this.popupShortUserProfile = null;
        }
    }

    addDailyReward(dailyRewardSettings, dailyRewardLog) {
        this.removeDailyReward();
        this.dailyReward = new DailyRewardPopup(dailyRewardSettings, dailyRewardLog);
        this.dailyReward.event.claimDone.add(this.claimDone, this);
        this.addChild(this.dailyReward);
    }
    claimDone() {
        this.removeDailyReward();
        this.event.change_menu.dispatch();
    }
    removeDailyReward() {
        if (this.dailyReward !== null) {
            this.removeChild(this.dailyReward);
            this.dailyReward.destroy();
            this.dailyReward = null;
        }
    }

    addDailyRewardPopup(quest) {
        this.removeDailyRewardPopup();
        this.dailyRewardPopup = new QuestDailyClaimPopup(quest);
        this.dailyRewardPopup.eventInput.claim.add(this.dailyRewardPopupClaim, this);
        this.addChild(this.dailyRewardPopup);
        // this.dailyRewardPopup.makeTweenPopup();
    }
    dailyRewardPopupClaim() {
        this.removeDailyRewardPopup();
    }
    removeDailyRewardPopup() {
        if (this.dailyRewardPopup !== null) {
            this.removeChild(this.dailyRewardPopup);
            this.dailyRewardPopup.destroy();
            this.dailyRewardPopup = null;
        }
    }

    addSoloModeRankingClaimPopup(playlist, reward) {
        this.removeSoloModeRankingClaimPopup();
        this.soloModeRankingClaimPopup = new PopupClaimSoloMode(playlist, reward);
        this.addChild(this.soloModeRankingClaimPopup);
    }
    removeSoloModeRankingClaimPopup() {
        if (this.soloModeRankingClaimPopup !== null) {
            this.removeChild(this.soloModeRankingClaimPopup);
            this.soloModeRankingClaimPopup.destroy();
            this.soloModeRankingClaimPopup = null;
        }
    }

    addSettingGame() {
        this.removeSettingGame();
        this.settingScreen = new SetttingScreen();
        this.addChild(this.settingScreen);
    }
    removeSettingGame() {
        if (this.settingScreen !== null) {
            this.removeChild(this.settingScreen);
            this.settingScreen.destroy();
            this.settingScreen = null;
        }
    }

    addSettingGameScreen() {
        this.removeSettingGameScreen();
        this.settingGameScreen = new SettingGameScreen();
        this.addChild(this.settingGameScreen);
    }
    removeSettingGameScreen() {
        if (this.settingGameScreen !== null) {
            this.removeChild(this.settingGameScreen);
            this.settingGameScreen.destroy();
            this.settingGameScreen = null;
        }
    }

    addSettingAccountScreen() {
        this.removeSettingAccountScreen();
        this.settingAccountScreen = new SettingAccountScreen();
        this.addChild(this.settingAccountScreen);
    }
    removeSettingAccountScreen() {
        if (this.settingAccountScreen !== null) {
            this.removeChild(this.settingAccountScreen);
            this.settingAccountScreen.destroy();
            this.settingAccountScreen = null;
        }
    }

    addSettingAccountUserNameScreen() {
        this.removeSettingAccoungUserNameScreen();
        this.settingAccountUserNameScreen = new SettingAccountUserName();
        this.addChild(this.settingAccountUserNameScreen);
    }
    removeSettingAccoungUserNameScreen() {
        if (this.settingAccountUserNameScreen !== null) {
            this.removeChild(this.settingAccountUserNameScreen);
            this.settingAccountUserNameScreen.destroy();
            this.settingAccountUserNameScreen = null;
        }
    }

    addPopupConfirmBuyItemShop(data, icon, isSup) {
        this.removePopupConfirmBuyItemShop();
        this.popupBuyItemConfirm = new ShopTNPopupConfirmBuy(data, icon, isSup);
        this.popupBuyItemConfirm.event.exit.add(this.removePopupConfirmBuyItemShop, this);
        this.addChild(this.popupBuyItemConfirm);
    }

    removePopupConfirmBuyItemShop() {
        if (this.popupBuyItemConfirm !== null) {
            this.removeChild(this.popupBuyItemConfirm);
            this.popupBuyItemConfirm.destroy();
            this.popupBuyItemConfirm = null;
        }
    }

    addTextScroll(str) {
        this.removeTextScroll();
        this.textScroll = new TextScroller(str);
        this.textScroll.event.complete.add(this.removeTextScroll, this);
        this.addChild(this.textScroll);
    }

    removeTextScroll() {
        if (this.textScroll !== null) {
            this.removeChild(this.textScroll);
            this.textScroll.destroy();
            this.textScroll = null;
        }
    }


    addBadConnection() {
        this.removeBadConnection();
        this.badConnection = new PopupBadConnection();
        this.badConnection.event.OK.add(this.chooseOkBadConnection, this);
        this.badConnection.event.CANCLE.add(this.chooseCancleBadConnection, this);
        this.addChild(this.badConnection);
    }

    chooseOkBadConnection() {
        this.removeBadConnection();
    }
    chooseCancleBadConnection() {
        EventGame.instance().event.chooseExitBadConnection.dispatch();
        this.removeBadConnection();
    }

    removeBadConnection() {
        if (this.badConnection != null) {
            this.removeChild(this.badConnection);
            this.badConnection.destroy();
            this.badConnection = null;
        }
    }
    addSettingProfileScreen() {
        this.removeSettingProfileScreen();
        this.settingProfileScreen = new SettingProfileScreen();
        this.addChild(this.settingProfileScreen);
    }
    removeSettingProfileScreen() {
        if (this.settingProfileScreen !== null) {
            this.removeChild(this.settingProfileScreen);
            this.settingProfileScreen.destroy();
            this.settingProfileScreen = null;
        }
    }


    addSuggetRating() {
        if (MainData.instance().platform !== "web") {
            this.removeSuggetRating();
            this.suggetRating = new PopupSuggetsRating();
            this.suggetRating.event.close.add(this.removeSuggetRating, this);
            this.addChild(this.suggetRating);
        }
    }

    removeSuggetRating() {
        if (this.suggetRating !== null) {
            this.removeChild(this.suggetRating);
            this.suggetRating.destroy();
            this.suggetRating = null;
        }
    }

    constructor() {
        super(game)

        this.event = {
            change_turnbase: new Phaser.Signal(),
            change_menu: new Phaser.Signal(),
            change_value_resource: new Phaser.Signal()
        }
        this.badConnection = null;
        this.popupBuy = null;
        this.popupMoney = null;
        this.detail = null;
        this.levelUp = null;
        this.popupBuyDone = null;
        this.detailSong = null;
        this.inviteFriend = null;
        this.dialog = null;
        this.dialogConfirmMoney = null;
        this.dialogConfirmTicket = null;
        this.shop = null;
        this.sortShop = null;
        this.qAndAPopup = null;
        this.popupClaimQuest = null;
        this.userProfile = null;
        this.ranking = null;
        this.chatOnlineMode = null;
        this.turnbase = null;
        this.animClaimReward = null;
        this.achievedNotification = null;
        this.chatScreen = null;
        this.popupShortUserProfile = null;
        this.dailyReward = null;
        this.dailyRewardPopup = null;
        this.soloModeRankingClaimPopup = null;
        this.screenTimeout = null;
        this.screenLosePopup = null;
        this.screenReward = null;
        this.screenNotReward = null;
        this.screenDoneSoloMode = null;
        this.animClaimReward = null;
        this.questClaimPopup = null;
        this.achievementClaimPopup = null;
        this.dailyrewardPopup = null;
        this.chatScreen = null;
        this.settingScreen = null;
        this.settingGameScreen = null;
        this.settingAccountScreen = null;
        this.settingAccountUserNameScreen = null;
        this.settingProfileScreen = null;
        this.popupBuyItemConfirm = null;
        this.textScroll = null;
        this.settingGiftcode = null;
        this.limitTurn = null;
        this.suggetRating = null;
        this.mailSystemScreen = null;
        this.popupNotEnoughResource = null;
        this.lastWeekResultScreen = null;
    }

    removeAllItem() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }


    removeScreen() {
        if (this.screen !== null) {
            this.removeChild(this.screen);
            this.screen.destroy();
            this.screen = null;
        }
    }

    addLastWeekResultScreen(opponent) {
        this.removeLastWeekResultScreen();
        this.lastWeekResultScreen = new LastWeekResultScreen(opponent);
        this.addChild(this.lastWeekResultScreen);
    }
    removeLastWeekResultScreen() {

    }

    addPopupNotEnoughResource(typeRsr) {
        this.removePopupNotEnoughResource();
        this.popupNotEnoughResource = new PopupNotEnoughResource(typeRsr);
        // this.popupNotEnoughResource.addPopup();
        // this.popupNotEnoughResource.makeTweenPopup();
        this.addChild(this.popupNotEnoughResource);
    }
    removePopupNotEnoughResource() {
        if (this.popupNotEnoughResource !== null) {
            this.removeChild(this.popupNotEnoughResource);
            this.popupNotEnoughResource.destroy();
            this.popupNotEnoughResource = null;
        }
    }

    addScreenTimeOut(data) {
        this.screenTimeout = new Timeout(data.score);
        this.screenTimeout.addPopup();
        this.screenTimeout.makeTweenPopup();
        this.addChild(this.screenTimeout);
    }
    removeScreenTimeOut() {
        if (this.screenTimeout !== null) {
            this.removeChild(this.screenTimeout);
            this.screenTimeout.destroy();
            this.screenTimeout = null;
        }
    }

    addScreenLosePopup(data) {
        this.screenLosePopup = new LosePopup(data.score);
        this.screenLosePopup.addPopup();
        this.screenLosePopup.makeTweenPopup();
        this.addChild(this.screenLosePopup);
    }
    removeScreenLosePopup() {
        if (this.screenLosePopup !== null) {
            this.removeChild(this.screenLosePopup);
            this.screenLosePopup.destroy();
            this.screenLosePopup = null;
        }
    }

    addScreenReward(data) {
        this.screenReward = new Reward(data.score, data.reward);
        this.screenReward.addPopup();
        this.screenReward.makeTweenPopup();
        this.addChild(this.screenReward);
    }
    removeScreenReward() {
        if (this.screenReward !== null) {
            this.removeChild(this.screenReward);
            this.screenReward.destroy();
            this.screenReward = null;
        }
    }

    addScreenNotReward(data) {
        this.screenNotReward = new NotReward(data.score);
        this.screenNotReward.addPopup();
        this.screenNotReward.makeTweenPopup();
        this.addChild(this.screenNotReward);
    }
    removeScreenNotReward() {
        if (this.screenNotReward !== null) {
            this.removeChild(this.screenNotReward);
            this.screenNotReward.destroy();
            this.screenNotReward = null;
        }
    }

    addScreenDoneSoloMode(data) {
        this.screenDoneSoloMode = new DoneSoloMode(data.score, data.reward, data.playlist);
        this.screenDoneSoloMode.addPopup();
        this.screenDoneSoloMode.makeTweenPopup();
        this.addChild(this.screenDoneSoloMode);
    }
    removeScreenDoneSoloMode() {
        if (this.screenDoneSoloMode !== null) {
            this.removeChild(this.screenDoneSoloMode);
            this.screenDoneSoloMode.destroy();
            this.screenDoneSoloMode = null;
        }
    }

    addAnimClaimReward(data) {
        this.animClaimReward = new AnimClaimReward(data.type, data.reward, data.finishPoint);
        this.addChild(this.animClaimReward);
    }
    removeAnimClaimReward() {
        if (this.animClaimReward !== null) {
            this.removeChild(this.animClaimReward);
            this.animClaimReward.destroy();
            this.animClaimReward = null;
        }
    }

    addQuestClaimReward(data) {
        this.questClaimPopup = new QuestClaimPopup(data);
        this.questClaimPopup.makeTweenPopup();
        this.questClaimPopup.eventInput.claim.add(this.onClaimQuest, this);
        this.addChild(this.questClaimPopup);
    }
    onClaimQuest() {
        this.removeQuestClaimReward();
        ControllScreen.instance().changeScreen(ConfigScreenName.QUEST_ACHIEVEMENT, 2);
    }
    removeQuestClaimReward() {
        if (this.questClaimPopup !== null) {
            this.removeChild(this.questClaimPopup);
            this.questClaimPopup.destroy();
            this.questClaimPopup = null;
        }
    }

    addAchievementClaimReward(data) {
        this.achievementClaimPopup = new AchievementClaimPopup(data);
        // this.achievementClaimPopup.makeTweenPopup();
        this.achievementClaimPopup.eventInput.claim.add(this.onClaimAchievement, this);
        this.addChild(this.achievementClaimPopup);
    }
    onClaimAchievement() {
        this.removeAchievementClaimReward();
        ControllScreen.instance().changeScreen(ConfigScreenName.QUEST_ACHIEVEMENT, 3);
    }
    removeAchievementClaimReward() {
        if (this.achievementClaimPopup !== null) {
            this.removeChild(this.achievementClaimPopup);
            this.achievementClaimPopup.destroy();
            this.achievementClaimPopup = null;
        }
    }

    addDailyReward(data) {
        this.dailyrewardPopup = new DailyRewardPopup(data.dailyRewardSettings, data.dailyRewardLog);
        this.dailyrewardPopup.event.claimDone.add(this.dailyrewardPopupClaimDone, this);
        this.addChild(this.dailyrewardPopup);
    }
    dailyrewardPopupClaimDone() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    removeDailyReward() {
        if (this.dailyrewardPopup !== null) {
            this.removeChild(this.dailyrewardPopup);
            this.dailyrewardPopup.destroy();
            this.dailyrewardPopup = null;
        }
    }

    addChatScreen(user) {
        this.removeChatScreen();
        this.chatScreen = new ChatScreen(user);
        this.addChild(this.chatScreen);
    }

    removeChatScreen() {
        if (this.chatScreen !== null) {
            this.removeChild(this.chatScreen);
            this.chatScreen.destroy();
            this.chatScreen = null;
        }
    }

    addMailSystemScreen(messenger) {
        this.removeMailSystemScreen();
        this.mailSystemScreen = new MailSystemScreen(messenger.message_content_id);
        this.addChild(this.mailSystemScreen);
    }
    removeMailSystemScreen() {
        if (this.mailSystemScreen !== null) {
            this.removeChild(this.mailSystemScreen);
            this.mailSystemScreen.destroy();
            this.mailSystemScreen = null;
        }
    }

    addSettingGiftcode() {
        this.removeSettingGiftcode();
        this.settingGiftcode = new SettingGiftCode();
        this.addChild(this.settingGiftcode);
    }
    removeSettingGiftcode() {
        if (this.settingGiftcode !== null) {
            this.removeChild(this.settingGiftcode);
            this.settingGiftcode.destroy();
            this.settingGiftcode = null;
        }
    }

    addLimitTurn() {
        this.removeLimitTurn();
        this.limitTurn = new LimitTurn();
        this.addChild(this.limitTurn);
    }
    removeLimitTurn() {
        if (this.limitTurn !== null) {
            this.removeChild(this.limitTurn);
            this.limitTurn.destroy();
            this.limitTurn = null;
        }
    }

    changeScreen(screenName, data = null) {
        // this.removeScreen();
        LogConsole.log(screenName);
        switch (screenName) {
            case ConfigScreenName.SOLOMODE_TIMEOUT:
                this.removeScreenTimeOut();
                this.addScreenTimeOut(data);
                break;
            case ConfigScreenName.SOLOMODE_LOSE_POPUP:
                this.removeScreenLosePopup();
                this.addScreenLosePopup(data);
                break;
            case ConfigScreenName.SOLOMODE_REWARD:
                this.removeScreenReward();
                this.addScreenReward(data);
                break;
            case ConfigScreenName.SOLOMODE_NOT_REWARD:
                this.removeScreenNotReward();
                this.addScreenNotReward(data);
                break;
            case ConfigScreenName.SOLOMODE_DONE:
                this.removeScreenDoneSoloMode();
                this.addScreenDoneSoloMode(data);
                break;
            case ConfigScreenName.ANIM_CLAIM_REWARD:
                this.removeAnimClaimReward();
                this.addAnimClaimReward(data);
                break;
            case ConfigScreenName.QUEST_CLAIM_POPUP:
                this.removeQuestClaimReward();
                this.addQuestClaimReward(data);
                break;
            case ConfigScreenName.ACHIEVEMENT_CLAIM_POPUP:
                this.removeAchievementClaimReward();
                this.addAchievementClaimReward(data);
                break;
            case ConfigScreenName.DAILY_REWARD:
                this.removeDailyReward();
                this.addDailyReward(data);
                break;
        }
    }
}