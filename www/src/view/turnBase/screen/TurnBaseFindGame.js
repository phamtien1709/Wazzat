import SocketController from "../../../controller/SocketController.js";
import Buddy from "../../../model/onlinemodecreatroom/data/Buddy.js";
import OnlineModeCRDataField from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataField.js";
import FindGameSuggestionFriend from "../item/FindGameSuggestionFriend.js";
import FindGameRandomUser from "../item/FindGameRandomUser.js";
import FindGameHeaderAndTextInField from "../item/FindGameHeaderAndTextInField.js";
import FindGameFriendlist from "../item/FindGameFriendlist.js";
import DataCommand from "../../../common/DataCommand.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllLoading from "../../ControllLoading.js";
import KeyBoard from "../../component/KeyBoard.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import EventGame from "../../../controller/EventGame.js";
import DataFriendSearch from "../../../model/friend/DataFriendSearch.js";
import FindGameSearchResultScreen from "../item/FindGameSearchResultScreen.js";
import MainData from "../../../model/MainData.js";
import DataUser from "../../../model/user/DataUser.js";
import BaseGroup from "../../BaseGroup.js";
export default class TurnBaseFindGame extends BaseGroup {
    constructor() {
        super(game);
        this.event = {
            choose_playlist: new Phaser.Signal(),
            onBack: new Phaser.Signal(),
            challengeGame: new Phaser.Signal()
        }
        this.typeOfSearchFriend = TurnBaseFindGame.NAME;
        this.valueKeyboard = "";
        this.screenSearchResult = null;
        this.isClickSearch = false;
        this.afterInit();
    }

    static get NAME() {
        return "NAME";
    }

    static get ID() {
        return "ID";
    }

    static get MUST_INT() {
        return "Bạn phải nhập đúng ID(là số)!";
    }

    static get MUST_GREATER_3() {
        return "Bạn phải nhập ít nhất 3 ký tự!";
    }

    afterInit() {
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.findgameGroup = null;
        //
        this.findGameSuggestionFriend = new FindGameSuggestionFriend();
        this.findGameSuggestionFriend.event.challengeGame.add(this.challengeGame, this);
        //
        this.findGameRandomUser = new FindGameRandomUser();
        this.findGameRandomUser.event.challengeGame.add(this.challengeGame, this);
        //
        this.findGameHeaderAndTextInField = new FindGameHeaderAndTextInField();
        this.findGameHeaderAndTextInField.event.challengeGame.add(this.getChallengeGame, this);
        this.findGameHeaderAndTextInField.event.onBack.add(this.onBackFindGame, this);
        this.findGameHeaderAndTextInField.event.onSearch.add(this.onSearchFriend, this);
        //
        this.findGameFriendlist = new FindGameFriendlist();
        this.findGameFriendlist.event.challengeGame.add(this.challengeGame, this);
        //
        //listen preload
        this.addEventExtension();
        this.sendRequestFindGame();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_turnbase_mode);
        //
    }

    //LOGIC CODE
    sendRequestFindGame() {
        this.checkRequestSocketFindGame();
        //
        if (MainData.instance().isChallengeGameFindOpponents.checking == false) {
            MainData.instance().friendLists = [];
            MainData.instance().suggestion_users = [];
            MainData.instance().random_user = null;
            //
            this.sendTurnBaseFindOpponentRequest();
        } else {
            this.handleParamsOnFindOpponentsResponse(1, () => {

            });
        }
    }

    sendTurnBaseFindOpponentRequest() {
        if (DataUser.instance().ktLoadFriend === true) {
            this.loadListFriendComplete();
        } else {
            DataUser.instance().sendGetFriendsList();
        }
        MainData.instance().isChallengeGameFindOpponents.checking = true;
        MainData.instance().isChallengeGameFindOpponents.updated = Date.now();
    }

    checkRequestSocketFindGame() {
        if (MainData.instance().isChallengeGameFindOpponents.checking == true) {
            let now = Date.now();
            if ((now - MainData.instance().isChallengeGameFindOpponents.updated) < 6000) {
                MainData.instance().isChallengeGameFindOpponents.checking = true;
            } else {
                MainData.instance().isChallengeGameFindOpponents.checking = false;
            }
        } else {
            MainData.instance().isChallengeGameFindOpponents.checking = false;
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.clickOKDialog.add(this.clickOKDialog, this);
        EventGame.instance().event.searchFriendBackUserProfile.add(this.searchFriendBackUserProfile, this);
        //
        KeyBoard.instance().event.changeTypeSearch.add(this.changeTypeSearch, this);
        KeyBoard.instance().event.enter.add(this.onSubmitSearch, this);
        KeyBoard.instance().event.submit.add(this.onSubmitSearch, this);
        KeyBoard.instance().event.cancle.add(this.keyboardCancle, this);
        //
        DataUser.instance().event.load_random_opponent_complete.add(this.loadRandomOpponentComplete, this);
        DataUser.instance().event.load_suggestion_opponent_complete.add(this.loadSuggestionUsersComplete, this);
        DataUser.instance().event.load_list_friend_complete.add(this.loadListFriendComplete, this);
    }

    loadRandomOpponentComplete() {
        MainData.instance().random_user = DataUser.instance().random_opponents.getUser();
        this.doneHandleFindOpponentsRandomAndSuggestionResponse();
    }

    loadSuggestionUsersComplete() {
        let arrUsers = [];
        for (let i = 0; i < 3; i++) {
            if (DataUser.instance().suggestion_opponents[i]) {
                let element = DataUser.instance().suggestion_opponents[i];
                arrUsers.push(element);
            }
        }
        MainData.instance().suggestion_users = arrUsers;
        //
        this.handleRandomUser();
    }

    loadListFriendComplete() {
        MainData.instance().friendLists = DataUser.instance().listFriend.getFriends();

        for (let i = 0; i < MainData.instance().friendLists.length; i++) {
            for (let j = 0; j < MainData.instance().menuOpponentsResponse.length; j++) {
                if (MainData.instance().friendLists[i].id == MainData.instance().menuOpponentsResponse[j].opponentEntity.id) {
                    MainData.instance().friendLists[i].status = MainData.instance().menuOpponentsResponse[j].status;
                    break;
                }
            }
        }
        //

        this.handleParamsOnFindOpponentsResponse(1, () => {

        });
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        KeyBoard.instance().event.changeTypeSearch.remove(this.changeTypeSearch, this);
        KeyBoard.instance().event.submit.remove(this.onSubmitSearch, this);
        KeyBoard.instance().event.enter.remove(this.onSubmitSearch, this);
        EventGame.instance().event.clickOKDialog.remove(this.clickOKDialog, this); EventGame.instance().event.searchFriendBackUserProfile.remove(this.searchFriendBackUserProfile, this);
        KeyBoard.instance().event.cancle.remove(this.keyboardCancle, this);
        //
        DataUser.instance().event.load_random_opponent_complete.remove(this.loadRandomOpponentComplete, this);
        DataUser.instance().event.load_suggestion_opponent_complete.remove(this.loadSuggestionUsersComplete, this);
        DataUser.instance().event.load_list_friend_complete.remove(this.loadListFriendComplete, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SEARCH_USER_BY_ID_RESPONSE) {
            this.searchedUsers = this.handleSearchResponse(evtParams.params);
            this.addScreenSearch(this.searchedUsers);
            ControllLoading.instance().hideLoading();
        }
        if (evtParams.cmd == DataCommand.SEARCH_USER_BY_NAME_RESPONSE) {
            this.searchedUsers = this.handleSearchResponse(evtParams.params);
            this.addScreenSearch(this.searchedUsers);
            ControllLoading.instance().hideLoading();
        }
    }

    handleParamsFriendList(params, callback) {
        if (params.getUtfString('status') == 'OK') {
            var challenges = params.getSFSArray('friends');
            for (let i = 0; i < challenges.size(); i++) {
                let challenge = challenges.getSFSObject(i);
                let userName = challenge.getUtfString('user_name');
                let avatar = challenge.getUtfString('avatar');
                let id = challenge.getInt('id');
                let is_online = challenge.getBool('is_online');
                let status = 'NO_GAME';
                let vip = challenge.getBool('vip');
                //
                for (let i = 0; i < MainData.instance().menuOpponentsResponse.length; i++) {
                    if (id == MainData.instance().menuOpponentsResponse[i].opponentEntity.id) {
                        status = MainData.instance().menuOpponentsResponse[i].status;
                        break;
                    }
                }
                MainData.instance().friendLists.push({
                    userName,
                    avatar,
                    id,
                    isOnline: is_online,
                    status,
                    vip: vip
                });
            }
        }
        callback();
    }

    doneHandleFindOpponentsRandomAndSuggestionResponse() {
        //findGameSuggestionFriend
        this.findGameSuggestionFriend.addGroupSuggestionFriend();
        this.findGameSuggestionFriend.addSuggestionFriend(MainData.instance().suggestion_users, () => { });
        this.findGameRandomUser.initGroup();
        this.findGameRandomUser.addButtonRandomUser(MainData.instance().random_user);
        this.findGameRandomUser.addBtnInviteFriendFB();
        //
        this.doneHandleFindOpponentsResponse();
    }

    doneHandleFindOpponentsResponse() {
        this.createFindGameScreenChooseFriend();
        this.addChildInScreen();
    }

    addChildInScreen() {
        this.addChild(this.findGameHeaderAndTextInField);
        this.addChild(this.findGameFriendlist);
        this.addChild(this.findGameSuggestionFriend);
        this.addChild(this.findGameRandomUser);
        //
        ControllLoading.instance().hideLoading();
    }

    addScreenSearch(searchedUsers) {
        this.removeScreenSearch();
        this.screenSearchResult = new FindGameSearchResultScreen(searchedUsers);
        this.screenSearchResult.event.refreshSearch.add(this.refreshSearch, this);
        this.screenSearchResult.event.getUserProfile.add(this.getUserProfile, this);
        this.addChild(this.screenSearchResult);
        // this.onSearchFriend();
    }
    refreshSearch() {
        this.removeScreenSearch();
        this.searchFriend(this.typeOfSearchFriend, this.valueKeyboard);
    }
    getUserProfile(id) {
        MainData.instance().isGetUserProfileSearch = true;
        KeyBoard.instance().hide();
        ControllScreenDialog.instance().addUserProfile(id);
    }
    searchFriendBackUserProfile() {
        this.onSearchFriend();
    }
    removeScreenSearch() {
        if (this.screenSearchResult !== null) {
            this.screenSearchResult.event.refreshSearch.remove(this.refreshSearch, this);
            this.screenSearchResult.event.getUserProfile.remove(this.getUserProfile, this);
            this.removeChild(this.screenSearchResult);
            this.screenSearchResult.destroy();
            this.isClickSearch = false;
            this.screenSearchResult = null;
        }
    }

    handleSearchResponse(response) {
        let users = [];
        if (response.containsKey('user_founds')) {
            let user_founds = response.getSFSArray(DataFriendSearch.user_founds);
            for (i = 0; i < user_founds.size(); i++) {
                let user = user_founds.getSFSObject(i);
                let friend_status = user.getUtfString(DataFriendSearch.friend_status);
                let user_name = user.getUtfString(DataFriendSearch.user_name);
                let is_online = user.getBool(DataFriendSearch.is_online);
                let id = user.getInt(DataFriendSearch.id);
                let avatar = user.getUtfString(DataFriendSearch.avatar);
                let vip = user.getBool(DataFriendSearch.vip)
                users.push({
                    friend_status: friend_status,
                    user_name: user_name,
                    is_online: is_online,
                    id: id,
                    avatar: avatar,
                    vip: vip
                })
            }
        }
        return users;
    }

    handleParamsOnFindOpponentsResponse(count, callback) {
        if (count == 1) {
            this.handleSuggestionUsers();
            callback();
        }
    }

    handleParamsFriendsOnFindOpponentsResponse(params, callback) {
        if (params.getUtfString('status') == 'OK') {
            var challenges = params.getSFSArray('friends');
            for (let i = 0; i < challenges.size(); i++) {
                let challenge = challenges.getSFSObject(i);
                let userName = challenge.getUtfString('user_name');
                let avatar = challenge.getUtfString('avatar');
                let id = challenge.getInt('id');
                let status = challenge.getUtfString('status');
                let is_online = challenge.getBool('is_online');
                MainData.instance().friendLists.push({
                    userName: userName,
                    avatar: avatar,
                    id: id,
                    isOnline: is_online,
                    status: status
                });
            }
        }
        callback();
    }

    handleRandomUser() {
        if (DataUser.instance().ktLoadRandomOpponent == true) {
            this.loadRandomOpponentComplete();
        } else {
            DataUser.instance().sendReloadRandomOpponent();
        }
    }

    handleSuggestionUsers() {
        if (DataUser.instance().ktLoadSuggestionOpponent == true) {
            this.loadSuggestionUsersComplete();
        } else {
            DataUser.instance().sendGetSuggestionOpponent();
        }
    }

    getBuddyListFriend(callback) {
        this.listBuddy = [];
        let buddies = SocketController.instance().socket.buddyManager.getBuddyList();
        for (let i = 0; i < buddies.length; i++) {
            let buddie = buddies[i];
            let buddy = new Buddy();
            buddy.avatar = buddie.getVariable("$" + OnlineModeCRDataField.avatar).value;
            buddy.diamond = buddie.getVariable("$" + OnlineModeCRDataField.diamond).value;
            buddy.isOnline = buddie[OnlineModeCRDataField.isOnline];
            buddy.userId = buddie.getVariable("$" + OnlineModeCRDataField.userId).value;
            buddy.userName = buddie.getVariable("$" + OnlineModeCRDataField.userName).value;
            this.listBuddy.push(buddy);
        }
        this.listBuddy = this.listBuddy.sort(this.compareOnline);
        callback();
    }

    compareOnline(a) {
        if (a.isOnline == true) {
            return -1;
        } else {
            return 1;
        }
    }

    // VIEW CODE
    createFindGameScreenChooseFriend() {
        this.sortFriendlistsOfStatus(MainData.instance().friendLists, (friendLists) => {
            if (this.findgameGroup == null || this.findgameGroup == undefined) {
                this.findgameGroup = new Phaser.Group(game);
                this.addChild(this.findgameGroup);
                const bg_findgame = new Phaser.Button(game, 0, 0, 'bg_create_room');
                this.findgameGroup.add(bg_findgame);
                //init group
                this.findGameFriendlist.afterInit();
                this.findGameFriendlist.addListFriend(friendLists);
                this.findGameHeaderAndTextInField.addHeader(friendLists.length, friendLists);
            } else {

            }
            this.findgameGroup.position.x = 0;
        });
        // })
    }

    getChallengeGame(friend) {
        LogConsole.log(friend);
        this.event.challengeGame.dispatch(friend);
    }

    mergeListOnlineToListFriend(callback) {
        var friendLists = [];
        for (let i = 0; i < this.listBuddy.length; i++) {
            for (let k = 0; k < this.friendLists.length; k++) {
                if (this.friendLists[k].id == this.listBuddy[i].userId) {
                    let friend = {
                        avatar: this.friendLists[k].avatar,
                        id: this.friendLists[k].id,
                        isOnline: this.listBuddy[i].isOnline,
                        userName: this.friendLists[k].userName,
                        status: this.friendLists[k].status
                    }
                    friendLists.push(friend);
                }
            }
        }
        callback(friendLists);
    }

    sortFriendlistsOfStatus(friendLists, callback) {
        friendLists = friendLists.sort((a) => {
            if (a.status === "NO_GAME") {
                return -1;
            }
        });
        callback(friendLists);
    }

    onBackFindGame() {
        if (this.isClickSearch == false) {
            ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        } else {
            this.removeScreenSearch();
            this.isClickSearch = false;
        }
    }
    onSearchFriend() {
        this.url = "onSearchFriend";
        let placeholder = "";
        if (this.valueKeyboard == "") {
            placeholder = "Nhập tên";
        } else {

        }
        setTimeout(() => {
            this.isClickSearch = true;
            KeyBoard.instance().show({
                maxLength: '',
                showTransparent: true,
                placeholder: placeholder,
                isSearch: true,
                isSearchFriend: true,
                typeSearch: this.typeOfSearchFriend
            });
            if (this.valueKeyboard !== "") {
                KeyBoard.instance().setValue(this.valueKeyboard)
            }
        }, 100);
    }
    challengeGame(friend) {
        this.event.challengeGame.dispatch(friend);
    }
    changeTypeSearch(type) {
        this.typeOfSearchFriend = type;
    }
    onSubmitSearch() {
        this.valueKeyboard = KeyBoard.instance().getValue();
        if (this.typeOfSearchFriend == TurnBaseFindGame.ID) {
            let id = this.valueKeyboard;
            if (id !== "NaN" && id > 0) {
                this.searchFriend(this.typeOfSearchFriend, this.valueKeyboard);
            } else {
                ControllScreenDialog.instance().addDialog(TurnBaseFindGame.MUST_INT);
            }
        } else if (this.typeOfSearchFriend == TurnBaseFindGame.NAME) {
            if (this.valueKeyboard.length > 2) {
                this.searchFriend(this.typeOfSearchFriend, this.valueKeyboard);
            } else {
                ControllScreenDialog.instance().addDialog(TurnBaseFindGame.MUST_GREATER_3, this.url);
            }
        }
        KeyBoard.instance().hide();
    }
    searchFriend(type, value) {
        this.searchedUsers = [];
        let params = new SFS2X.SFSObject();
        if (type == TurnBaseFindGame.ID) {
            params.putInt("user_id", parseInt(value));
            SocketController.instance().sendData(DataCommand.SEARCH_USER_BY_ID_REQUEST, params);
            ControllLoading.instance().showLoading();
        }
        if (type == TurnBaseFindGame.NAME) {
            params.putUtfString("user_name", value);
            SocketController.instance().sendData(DataCommand.SEARCH_USER_BY_NAME_REQUEST, params);
            ControllLoading.instance().showLoading();
        }
    }
    clickOKDialog(url) {
        if (url == this.url) this.onSearchFriend();
    }
    keyboardCancle() {
        this.removeScreenSearch();
    }

    destroy() {
        this.removeEventExtension();
        KeyBoard.instance().hide();
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