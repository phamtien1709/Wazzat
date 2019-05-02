import DataUserGenresController from "./DataUserGenresController.js";
import DataUserPlaylistController from "./DataUserPlaylistController.js";
import SocketController from "../../controller/SocketController.js";
import ShopCommand from "../shop/datafield/ShopCommand.js";
import SendShopPlayListLoad from "../shop/server/senddata/SendShopPlayListLoad.js";
import ShopDataField from "../shop/datafield/ShopDatafield.js";
import UserGenres from "./UserGenres.js";
import UserPlaylist from "./UserPlaylist.js";
import ControllLoading from "../../view/ControllLoading.js";
import MainData from "../MainData.js";
import ControllScreen from "../../view/ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import DataCommand from "../DataCommand.js";
import DataRandomOpponent from "./DataRandomOpponent.js";
import DataRoomEvent from "./DataRoomEvent.js";
import EventModeDatafield from "../eventmode/datafield/EventModeDatafield.js";
import RoomEvent from "../eventmode/data/RoomEvent.js";
import Quest from "../../modules/menu/QuestAndAchievement/Data/Quest.js";
import QuestLog from "../../modules/menu/QuestAndAchievement/Data/QuestLog.js";
import ControllLocalStorage from "../../controller/ControllLocalStorage.js";
import PushNotifyLocal from "../../PushNotifyLocal.js";
import ShopUserPlayListMapping from "../shop/data/ShopUserPlayListMapping.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import DataFriendController from "./DataFriendController.js";
import SendLoadUserProfile from "../userprofile/server/senddata/SendLoadUserProfile.js";
import UserProfileCommand from "../userprofile/datafield/UserProfileCommand.js";
import DataFriend from "./DataFriend.js";
import SqlLiteController from "../../SqlLiteController.js";
export default class DataUser {
    constructor() {
        this.event = {
            buy_playlist: new Phaser.Signal(),
            event_update: new Phaser.Signal(),
            load_online_mode_bet_complete: new Phaser.Signal(),
            load_online_mode_room_bet_complete: new Phaser.Signal(),
            load_event_list_complete: new Phaser.Signal(),
            load_suggestion_opponent_complete: new Phaser.Signal(),
            load_playlist_level_setting_complete: new Phaser.Signal(),
            load_playlist_complete: new Phaser.Signal(),
            load_random_opponent_complete: new Phaser.Signal(),
            load_main_quest_complete: new Phaser.Signal(),
            load_list_friend_complete: new Phaser.Signal(),
            friend_status_update: new Phaser.Signal()
        }
        this.genres = new DataUserGenresController();
        this.playlist = new DataUserPlaylistController();
        this.listFriend = new DataFriendController();
        this.playlist_level_setting = {};
        this.quickplay_bet_setting = [];
        this.createroom_bet_setting = [];
        this.random_opponents = new DataRandomOpponent();
        this.random_opponents.event.call_load.add(this.sendReloadRandomOpponent, this);
        this.roomEvent = new DataRoomEvent();
        this.suggestion_opponents = [];
        this.quests = [];
        this.quest_logs = [];

        this.ktLoadOnlineModeBet = false;
        this.ktLoadOnlineModeRoomBet = false;
        this.ktLoadEventList = false;
        this.ktLoadSuggestionOpponent = false;
        this.ktLoadPlaylistLevelSetting = false;
        this.ktLoadPlaylist = false;
        this.ktLoadRandomOpponent = false;
        this.ktloadMainQuestComplete = false;
        this.ktLoadFriend = false;

        this.ktLoadingEventList = false;

        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
    }

    resetData() {
        this.genres.resetData();
        this.playlist.resetData();
        this.listFriend.resetData();
        this.playlist_level_setting = {};
        this.quickplay_bet_setting = [];
        this.createroom_bet_setting = [];
        this.random_opponents.resetData();
        this.roomEvent.resetData();
        this.suggestion_opponents = [];
        this.quests = [];
        this.quest_logs = [];
        MainData.instance().soloModePlaylists = [];

        this.ktLoadOnlineModeBet = false;
        this.ktLoadOnlineModeRoomBet = false;
        this.ktLoadEventList = false;
        this.ktLoadSuggestionOpponent = false;
        this.ktLoadPlaylistLevelSetting = false;
        this.ktLoadPlaylist = false;
        this.ktLoadRandomOpponent = false;
        this.ktloadMainQuestComplete = false;

        this.ktLoadingEventList = false;
    }

    getData(data) {
        switch (data.cmd) {
            case ShopCommand.SHOP_PLAYLIST_LOAD_RESPONSE:
            case DataCommand.INIT_SHOP_PLAYLIST_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildDataShop(data.params);
                }
                this.event.load_playlist_complete.dispatch();
                break;
            case ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE:
                console.log("SHOP_BUY_PLAYLIST_RESPONSE---------");
                ControllLoading.instance().hideLoading();
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    if (data.params.getInt("is_solo_mode") === 0) {
                        let id = data.params.getInt(ShopDataField.playlist_id);
                        let dataUser = new ShopUserPlayListMapping();
                        dataUser.playlist_id = id;
                        dataUser.user_id = SocketController.instance().dataMySeft.user_id;
                        dataUser.next_level_score = this.playlist_level_setting[dataUser.level + 1];
                        dataUser.active = 1;
                        SqlLiteController.instance().insertTableUserPlaylistMappings([dataUser], true);
                        SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.add(this.insertDataUserPlaylistMappingBuy, this);
                    }
                }
                break;
            case DataCommand.INIT_CLIENT_GAME_DATA_RESPONSE:
                this.buildInitClientData(data.params);
                break;
            case DataCommand.EVENT_UPDATE:
                this.roomEventUpdate(data.params);
                break;
            case DataCommand.TURNBASE_RELOAD_RANDOM_OPPONENT_RESPONSE:
                let ktLengRandom = this.random_opponents.getArrLenght();
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildRandomOpponent(data.params);
                }
                if (ktLengRandom === 0) {
                    this.event.load_random_opponent_complete.dispatch();
                }
                break;
            case DataCommand.INIT_ONLINE_MODE_BET_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildOnlineModeBet(data.params);
                }
                this.event.load_online_mode_bet_complete.dispatch();
                break;
            case DataCommand.INIT_ONLINE_MODE_ROOM_BET_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildOnlineModeRoomBet(data.params);
                }
                this.event.load_online_mode_room_bet_complete.dispatch();
                break;
            case DataCommand.INIT_EVENT_LIST_RESPONSE:
                if (this.ktLoadEventList === true) {
                    this.ktLoadEventList = false;
                    if (data.params.getUtfString(ShopDataField.status) === "OK") {
                        this.buildEventList(data.params);
                    }
                    this.event.load_event_list_complete.dispatch();
                }
                break;
            case DataCommand.INIT_SUGGESTION_OPPONENT_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildSuggestionOpponent(data.params);
                }
                this.event.load_suggestion_opponent_complete.dispatch();
                break;
            case DataCommand.INIT_PLAYLIST_LEVEL_SETTING_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildPlaylistLevelSetting(data.params);
                }
                this.event.load_playlist_level_setting_complete.dispatch();
                break;
            case DataCommand.INIT_MAIN_QUEST_DATA_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildMainQuest(data.params);
                }
                this.event.load_main_quest_complete.dispatch();
                break;
            case DataCommand.INIT_USER_PLAYLIST_MAPPING_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildUserPlaylistMapping(data.params);
                }
                break;
            case UserProfileCommand.USER_FRIEND_LIST_LOAD_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.buildListFriend(data.params);
                }
                this.event.load_list_friend_complete.dispatch();
                break;
            case UserProfileCommand.USER_FRIEND_ONLINE_STATUS_UPDATE:
                this.buildFriendOnlineStatusUpdate(data.params);
                break;
            case UserProfileCommand.USER_FRIEND_STATUS_UPDATE:
                this.buildFriendStatusUpdate(data.params);
                break;

        }
    }

    insertDataUserPlaylistMappingBuy() {
        SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.remove(this.insertDataUserPlaylistMappingBuy, this);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.callBuyPlaylistComplete, this);
    }

    callBuyPlaylistComplete() {
        this.event.buy_playlist.dispatch();
    }
    beginLoadData() {
        ControllLoading.instance().showLoading();
        MainData.instance().dataPackage = null;
        this.resetData();
        this.sendGetDataShop();
    }

    buildFriendStatusUpdate(data) {
        let action = data.getUtfString("action");
        if (action === "ACCEPT_ADD_REQUEST") {
            if (data.containsKey("friend")) {
                let friend = data.getSFSObject("friend");
                let item = new DataFriend();
                item.level = friend.getInt("level");
                item.user_name = friend.getUtfString("user_name");
                item.id = friend.getInt("id");
                item.avatar = friend.getUtfString("avatar");
                item.is_online = friend.getBool("is_online");
                item.vip = friend.getBool("vip");
                this.listFriend.setFriend(item.id, item);
            }
        } else if (action === "REMOVE_FRIEND") {
            if (data.containsKey("id")) {
                let id = data.getInt("id");
                this.listFriend.removeFriend(id);
            }
        }
    }

    buildFriendOnlineStatusUpdate(data) {
        this.listFriend.setOnOff(data.getInt("id"), data.getBool("is_online"));
        this.event.friend_status_update.dispatch();
    }
    buildListFriend(data) {
        let user_id = data.getInt("user_id");
        if (user_id === SocketController.instance().dataMySeft.user_id) {
            if (data.containsKey("friends")) {
                let friends = data.getSFSArray("friends");
                for (let i = 0; i < friends.size(); i++) {
                    let friend = friends.getSFSObject(i);
                    let item = new DataFriend();
                    item.level = friend.getInt("level");
                    item.user_name = friend.getUtfString("user_name");
                    item.id = friend.getInt("id");
                    item.avatar = friend.getUtfString("avatar");
                    item.is_online = friend.getBool("is_online");
                    item.vip = friend.getBool("vip");
                    // item.vip = true;
                    this.listFriend.setFriend(item.id, item);
                }

                this.ktLoadFriend = true;
            }
        }
    }

    buildUserPlaylistMapping(data) {
        if (data.containsKey("user_playlist_mappings")) {
            let arrData = [];
            let user_playlist_mappings = data.getSFSArray("user_playlist_mappings");
            for (let i = 0; i < user_playlist_mappings.size(); i++) {
                let user_playlist_mapping = user_playlist_mappings.getSFSObject(i);
                let dataUser = new ShopUserPlayListMapping();
                dataUser.user_id = user_playlist_mapping.getInt("user_id");
                dataUser.level = user_playlist_mapping.getInt("level");
                dataUser.playlist_id = user_playlist_mapping.getInt("playlist_id");
                dataUser.exp_score = user_playlist_mapping.getInt("exp_score");
                dataUser.created = user_playlist_mapping.getLong("created");
                dataUser.active = user_playlist_mapping.getInt("active");
                dataUser.id = user_playlist_mapping.getLong("id");
                dataUser.current_level_score = user_playlist_mapping.getInt("current_level_score");
                dataUser.next_level_score = user_playlist_mapping.getInt("next_level_score");
                dataUser.updated = user_playlist_mapping.getLong("updated");
                dataUser.master = user_playlist_mapping.getInt("master")

                //this.playlist.setDataMePlaylist(dataUser.playlist_id, dataUser);
                arrData.push(dataUser);
            }

            SqlLiteController.instance().insertTableUserPlaylistMappings(arrData);
            SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.add(this.insertDataUserPlaylistMappingComplete, this);
        }
    }

    insertDataUserPlaylistMappingComplete() {
        SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.remove(this.insertDataUserPlaylistMappingComplete, this);
        this.sendGetEventList();
        this.checkChangeScreen();
    }

    buildMainQuest(data) {
        if (data.containsKey("quests")) {
            let quests = data.getSFSArray('quests');
            for (let i = 0; i < quests.size(); i++) {
                let quest = new Quest();
                let questRes = quests.getSFSObject(i);
                quest.reward = questRes.getInt('reward');
                quest.id = questRes.getInt('id');
                quest.quest = questRes.getUtfString('quest');
                quest.required = questRes.getInt('required');
                quest.quest_type = questRes.getInt('quest_type');
                quest.order = questRes.getInt('order');
                quest.reward_type = questRes.getUtfString('reward_type');
                this.quests.push(quest);
            }
        }

        if (data.containsKey("quest_logs")) {
            let quest_logs = data.getSFSArray('quest_logs');
            for (let i = 0; i < quest_logs.size(); i++) {
                let quest_log = new QuestLog();
                let quest_log_res = quest_logs.getSFSObject(i);
                quest_log.user_id = quest_log_res.getInt('user_id');
                quest_log.created = quest_log_res.getLong('created');
                quest_log.quest_id = quest_log_res.getInt('quest_id');
                quest_log.id = quest_log_res.getLong('id');
                quest_log.state = quest_log_res.getUtfString('state');
                quest_log.updated = quest_log_res.getLong('updated');
                this.quest_logs.push(quest_log);
            }
        }

        this.ktloadMainQuestComplete = true;
    }

    buildRandomOpponent(data) {
        if (data.containsKey("random_opponents")) {
            let random_opponents = data.getSFSArray("random_opponents");
            for (let i = 0; i < random_opponents.size(); i++) {
                let opponents = random_opponents.getSFSObject(i);
                let dataOp = {};
                dataOp.gender = opponents.getUtfString("gender");
                dataOp.userName = opponents.getUtfString("user_name");
                dataOp.last_login = opponents.getLong("last_login");
                dataOp.genre_count = opponents.getLong("genre_count");
                dataOp.id = opponents.getInt("id");
                dataOp.avatar = opponents.getUtfString("avatar");
                dataOp.vip = opponents.getBool('vip');
                this.random_opponents.setUser(dataOp);
            }
            this.ktLoadRandomOpponent = true;
            //console.log(this.random_opponents);
        }
    }

    buildPlaylistLevelSetting(data) {
        if (data.containsKey("playlist_level_setting")) {
            let playlist_level_setting = data.getSFSArray("playlist_level_setting");
            let arrData = [];
            for (let i = 0; i < playlist_level_setting.size(); i++) {
                let playlist_level = playlist_level_setting.getSFSObject(i);
                let item = {
                    level: 0,
                    exp_score: 0,
                    id: 0,
                    song_number: 0
                }
                item.level = playlist_level.getInt("level");
                item.exp_score = playlist_level.getInt("exp_score");
                item.id = playlist_level.getInt("id");
                item.song_number = playlist_level.getInt("song_number");

                this.playlist_level_setting[item.level] = item.exp_score;
                arrData.push(item);
            }

            SqlLiteController.instance().insertTablePlaylistLevelSetting(arrData);
            SqlLiteController.instance().event.insert_data_playlist_level_setting_complete.add(this.insertDataPlaylistLevelSettingComplete, this);
        }
    }

    insertDataPlaylistLevelSettingComplete() {
        SqlLiteController.instance().event.insert_data_playlist_level_setting_complete.remove(this.insertDataPlaylistLevelSettingComplete, this);
        SqlLiteController.instance().updatePlaylistReloadAt();
        SqlLiteController.instance().event.update_playlist_reload_at_complete.add(this.updatePlaylistReloadAtComplete, this);
    }

    updatePlaylistReloadAtComplete() {
        SqlLiteController.instance().event.update_playlist_reload_at_complete.remove(this.updatePlaylistReloadAtComplete, this);
        this.sendGetUserPlaylistMapping();
    }

    buildSuggestionOpponent(data) {
        if (data.containsKey("suggestion_opponents")) {
            let suggestion_opponents = data.getSFSArray("suggestion_opponents")
            for (let i = 0; i < suggestion_opponents.size(); i++) {
                let suggestion = suggestion_opponents.getSFSObject(i);
                let itemSuggestion = {};
                itemSuggestion.gender = suggestion.getUtfString("gender");
                itemSuggestion.user_name = suggestion.getUtfString("user_name");
                itemSuggestion.last_login = suggestion.getLong("last_login");
                itemSuggestion.id = suggestion.getInt("id");
                itemSuggestion.avatar = suggestion.getUtfString("avatar");
                itemSuggestion.vip = suggestion.getBool("vip");
                this.suggestion_opponents.push(itemSuggestion);
            }

            this.ktLoadSuggestionOpponent = true;
            //console.log(this.suggestion_opponents);
        }
    }

    buildEventList(data) {
        if (data.containsKey("events")) {
            let events = data.getSFSArray(EventModeDatafield.events);
            for (let i = 0; i < events.size(); i++) {
                let event = events.getSFSObject(i);
                let item = new RoomEvent();
                item.finish_at = event.getLong(EventModeDatafield.finish_at);
                item.created = event.getLong(EventModeDatafield.created);
                item.description = event.getUtfString(EventModeDatafield.description);
                item.banner = event.getUtfString(EventModeDatafield.banner);
                item.active = event.getInt(EventModeDatafield.active);
                item.start_at = event.getLong(EventModeDatafield.start_at);
                item.event_type = event.getUtfString(EventModeDatafield.event_type);
                item.name = event.getUtfString(EventModeDatafield.name);
                item.medal = event.getUtfString(EventModeDatafield.medal);
                item.id = event.getLong(EventModeDatafield.id);
                item.state = event.getUtfString(EventModeDatafield.state);
                item.updated = event.getLong(EventModeDatafield.updated);
                if (event.containsKey(EventModeDatafield.number_user)) {
                    item.number_user = event.getInt(EventModeDatafield.number_user);
                }

                if (event.containsKey(EventModeDatafield.reward_1st)) {
                    let reward_1st = event.getSFSObject(EventModeDatafield.reward_1st);
                    item.reward_1st.diamond = reward_1st.getInt(EventModeDatafield.diamond);
                    item.reward_1st.event_id = reward_1st.getLong(EventModeDatafield.event_id);
                    item.reward_1st.ticket = reward_1st.getInt(EventModeDatafield.ticket);
                    item.reward_1st.created = reward_1st.getLong(EventModeDatafield.created);
                    item.reward_1st.event_ranking = reward_1st.getUtfString(EventModeDatafield.event_ranking);
                    item.reward_1st.updated = reward_1st.getLong(EventModeDatafield.updated);
                    item.reward_1st.support_item = reward_1st.getInt(EventModeDatafield.support_item);
                }

                this.roomEvent.setData(item);
            }

            this.ktLoadEventList = true;

            this.checkSetLocalPush();

            //console.log(this.roomEvent);
        }
    }

    buildOnlineModeRoomBet(data) {
        if (data.containsKey("online_mode_room_bet_setting")) {
            let online_mode_room_bet_setting = data.getSFSArray("online_mode_room_bet_setting");
            for (let i = 0; i < online_mode_room_bet_setting.size(); i++) {
                let online_mode_room_bet = online_mode_room_bet_setting.getSFSObject(i);
                let itemRoomBet = {}
                itemRoomBet.id = online_mode_room_bet.getInt("id");
                itemRoomBet.bet_place = online_mode_room_bet.getInt("bet_place");
                itemRoomBet.percent_of_fee = online_mode_room_bet.getInt("percent_of_fee");
                this.createroom_bet_setting.push(itemRoomBet);
            }

            this.ktLoadOnlineModeRoomBet = true;
        }
    }

    buildOnlineModeBet(data) {
        if (data.containsKey("online_mode_bet_setting")) {
            let online_mode_bet_setting = data.getSFSArray("online_mode_bet_setting");
            for (let i = 0; i < online_mode_bet_setting.size(); i++) {
                let online_mode_bet = online_mode_bet_setting.getSFSObject(i);
                let itembet = {}
                itembet.user_level_required = online_mode_bet.getInt("user_level_required");
                itembet.id = online_mode_bet.getInt("id");
                itembet.bet_place = online_mode_bet.getInt("bet_place");
                itembet.percent_of_fee = online_mode_bet.getInt("percent_of_fee");

                this.quickplay_bet_setting.push(itembet);
            }
            this.ktLoadOnlineModeBet = true;
            // console.log(this.quickplay_bet_setting);
        }
    }


    roomEventUpdate(data) {
        if (data.getUtfString(ShopDataField.status) === "OK") {
            let event_id = data.getLong("event_id");
            let event_state = data.getUtfString("event_state");
            this.roomEvent.changeState(event_id, event_state);
            this.event.event_update.dispatch();
        }
    }

    getNewPlaylist(id) {
        this.playlist.removePlaylistInArrShop(id);
        this.playlist.changeBuyItemById(id);
    }

    buildInitClientData(data) {
        if (data.getUtfString(ShopDataField.status) === "OK") {
            this.buildOnlineModeBet(data);
            this.buildOnlineModeRoomBet(data);
            this.buildEventList(data);
            this.buildSuggestionOpponent(data);
            this.buildPlaylistLevelSetting(data);
            this.buildRandomOpponent(data);
            this.buildMainQuest(data);
            this.checkSetLocalPush();
        }
        this.checkChangeScreen();
    }

    checkSetLocalPush() {
        let arrWatting = this.roomEvent.getWaittingRoom();
        if (arrWatting.length > 0) {
            for (let i = 0; i < arrWatting.length; i++) {
                let idEventPush = arrWatting[i].id;
                // ControllLocalStorage.instance().removeItem("RoomEvent" + idEventPush);

                let idRoomEventPush = ControllLocalStorage.instance().getItem("RoomEvent" + idEventPush);

                if (idRoomEventPush === "error" || idRoomEventPush === null || idRoomEventPush === "null") {
                    let currentTime = (new Date).getTime();
                    let timeSpent = arrWatting[i].start_at - currentTime;

                    if (timeSpent < 5 * 60000) {

                    } else {
                        let strTime = "";
                        let dateStart = new Date(arrWatting[i].start_at);
                        let dateFinish = new Date(arrWatting[i].finish_at);

                        let dayStart = dateStart.getDate();
                        let monthStart = dateStart.getMonth() + 1;
                        let hourStart = dateStart.getHours();
                        let minuteStart = dateStart.getMinutes();

                        let dayFinish = dateFinish.getDate();
                        let monthFinish = dateFinish.getMonth() + 1;
                        let yearFinish = dateFinish.getFullYear();
                        let hourFinish = dateFinish.getHours();
                        let minuteFinish = dateFinish.getMinutes();

                        if (dayFinish === dayStart) {
                            strTime = hourStart + "h" + minuteStart + " - " + hourFinish + "h" + minuteFinish + " " + dayFinish + "/" + monthFinish + "/" + yearFinish;
                        } else {
                            strTime = hourStart + "h" + minuteStart + " " + dayStart + "/" + monthStart + " - " + hourFinish + "h" + minuteFinish + " " + dayFinish + "/" + monthFinish + "/" + yearFinish;
                        }

                        let data = {
                            id: 999,
                            title: "Sự kiện " + arrWatting[i].name + " sắp bắt đầu",
                            text: strTime,
                            trigger: {
                                at: new Date(arrWatting[i].start_at - 5 * 60000)
                                //at: new Date((new Date).getTime() + 5 * 60000)
                            }
                        }

                        PushNotifyLocal.instance().setLocalPush(data);

                        if (PushNotifyLocal.instance().ktPush) {
                            FaceBookCheckingTools.instance().logEvent("LocalRoomEventPush");
                        }

                        ControllLocalStorage.instance().setItem("RoomEvent" + idEventPush, true)
                        // PushNotifyLocal.instance().clearPush(data);
                        break;
                    }
                }
            }
        }
    }


    buildDataShop(data) {
        if (data.getUtfString(ShopDataField.status) === "OK") {
            let genres = data.getSFSArray(ShopDataField.genres);
            let objRegion = {};
            let objData = {
                genres: [],
                playlists: []
            }
            for (let i = 0; i < genres.size(); i++) {
                let genre = genres.getSFSObject(i);
                let itemGenre = new UserGenres();
                itemGenre.code = genre.getUtfString(ShopDataField.code);
                itemGenre.genre = genre.getUtfString(ShopDataField.genre);
                itemGenre.id = genre.getInt(ShopDataField.id);
                itemGenre.region = genre.getUtfString(ShopDataField.region);
                itemGenre.parent = genre.getInt(ShopDataField.parent);
                itemGenre.priority = genre.getInt(ShopDataField.priority);
                itemGenre.active = genre.getInt(ShopDataField.active);
                objRegion[itemGenre.id] = itemGenre.region;

                objData.genres.push(itemGenre);
            }

            let playlists = data.getSFSArray(ShopDataField.playlists);
            for (let i = 0; i < playlists.size(); i++) {
                let playlist = playlists.getSFSObject(i);
                let itemPlayList = new UserPlaylist();
                itemPlayList.is_highlight = playlist.getInt(ShopDataField.is_highlight);
                itemPlayList.used_times = playlist.getInt(ShopDataField.used_times)
                itemPlayList.thumb = playlist.getUtfString(ShopDataField.thumb);
                itemPlayList.created = playlist.getLong(ShopDataField.created);
                itemPlayList.is_owner = playlist.getInt(ShopDataField.is_owner);
                itemPlayList.is_default = playlist.getInt(ShopDataField.is_default);
                itemPlayList.genre_id = playlist.getInt(ShopDataField.genre_id);
                itemPlayList.purchased = playlist.getInt(ShopDataField.purchased);
                itemPlayList.songs = playlist.getUtfString(ShopDataField.songs);
                itemPlayList.price = playlist.getInt(ShopDataField.price);
                itemPlayList.is_general = playlist.getInt(ShopDataField.is_general);
                itemPlayList.name = playlist.getUtfString(ShopDataField.name);
                itemPlayList.id = playlist.getInt(ShopDataField.id);
                itemPlayList.vip = playlist.getInt(ShopDataField.vip);
                itemPlayList.is_solo_mode = playlist.getInt(ShopDataField.is_solo_mode);
                itemPlayList.updated = playlist.getLong(ShopDataField.updated);
                itemPlayList.country_id = playlist.getInt(ShopDataField.country_id);
                itemPlayList.purchased_count = playlist.getInt(ShopDataField.purchased_count);
                itemPlayList.active = playlist.getInt(ShopDataField.active);
                itemPlayList.description = playlist.getUtfString("description");
                if (objRegion.hasOwnProperty(itemPlayList.genre_id)) {
                    itemPlayList.region = objRegion[itemPlayList.genre_id];
                }



                if (playlist.containsKey(ShopDataField.user_playlist_mapping)) {
                    let objUser = playlist.getSFSObject(ShopDataField.user_playlist_mapping);
                    if (objUser) {
                        itemPlayList.user.user_id = objUser.getInt(ShopDataField.user_id);
                        itemPlayList.user.level = objUser.getInt(ShopDataField.level);
                        itemPlayList.user.playlist_id = objUser.getInt(ShopDataField.playlist_id);
                        itemPlayList.user.exp_score = objUser.getInt(ShopDataField.exp_score);
                        itemPlayList.user.created = objUser.getLong(ShopDataField.created);
                        itemPlayList.user.active = objUser.getInt(ShopDataField.active);
                        itemPlayList.user.id = objUser.getLong(ShopDataField.id);
                        itemPlayList.user.current_level_score = objUser.getInt(ShopDataField.current_level_score);
                        itemPlayList.user.next_level_score = objUser.getInt(ShopDataField.next_level_score);
                        itemPlayList.user.updated = objUser.getLong(ShopDataField.updated);
                    }
                }

                objData.playlists.push(itemPlayList);
            }

            SqlLiteController.instance().insertDataShopPlaylist(objData);
            SqlLiteController.instance().event.insert_data_shop_playlist_complete.add(this.insertDataShopPlaylistComplete, this);
        }
    }

    insertDataShopPlaylistComplete() {
        console.log("insertDataShopPlaylistComplete--");
        //SqlLiteController.instance().getAllDataShop();
        SqlLiteController.instance().event.insert_data_shop_playlist_complete.remove(this.insertDataShopPlaylistComplete, this);
        this.sendGetPlaylistLevelSetting();
    }




    sendReloadRandomOpponent() {
        SocketController.instance().sendData(DataCommand.TURNBASE_RELOAD_RANDOM_OPPONENT_REQUEST, null);
    }

    sendGetInitClientGameData() {
        SocketController.instance().sendData(DataCommand.INIT_CLIENT_GAME_DATA_REQUEST, null);
    }
    sendGetDataShop() {
        SqlLiteController.instance().getConfigData();
        SqlLiteController.instance().event.get_config_data_complete.add(this.getConfigDataComplete, this);
    }

    getConfigDataComplete() {
        SqlLiteController.instance().event.get_config_data_complete.remove(this.getConfigDataComplete, this);
        //
        if (MainData.instance().playlist_reload_at !== window.RESOURCE.playlist_reload_at) {
            SqlLiteController.instance().resetTableShopPlaylist();
            SqlLiteController.instance().event.reset_data_shop_playlist_complete.add(this.resetTableShopPlaylistComplete, this);
        } else {
            SqlLiteController.instance().getPlaylistLevelSetting();
            SqlLiteController.instance().event.get_playlist_level_setting_complete.add(this.getPlaylistLevelSettingComplete, this);
        }
    }
    getPlaylistLevelSettingComplete(arrData) {
        SqlLiteController.instance().event.get_playlist_level_setting_complete.remove(this.getPlaylistLevelSettingComplete, this);
        for (let i = 0; i < arrData.length; i++) {
            this.playlist_level_setting[arrData[i].level] = arrData[i].exp_score;
        }
        this.sendGetUserPlaylistMapping();
    }

    resetTableShopPlaylistComplete() {
        SqlLiteController.instance().event.reset_data_shop_playlist_complete.remove(this.resetTableShopPlaylistComplete, this);
        SocketController.instance().sendData(DataCommand.INIT_SHOP_PLAYLIST_REQUEST, null);
    }

    setPlayList(data) {
        this.playlist.setDataPlayList(data);
    }

    sendGetOnlineModeBet() {
        SocketController.instance().sendData(DataCommand.INIT_ONLINE_MODE_BET_REQUEST, null);
    }
    sendGetOnlineModeRoomBet() {
        SocketController.instance().sendData(DataCommand.INIT_ONLINE_MODE_ROOM_BET_REQUEST, null);
    }
    sendGetEventList() {
        if (this.ktLoadEventList === false) {
            this.ktLoadEventList = true;
            SocketController.instance().sendData(DataCommand.INIT_EVENT_LIST_REQUEST, null);
        }
    }
    sendGetSuggestionOpponent() {
        SocketController.instance().sendData(DataCommand.INIT_SUGGESTION_OPPONENT_REQUEST, null);
    }
    sendGetPlaylistLevelSetting() {
        SocketController.instance().sendData(DataCommand.INIT_PLAYLIST_LEVEL_SETTING_REQUEST, null);
    }

    sendGetMainQuest() {
        SocketController.instance().sendData(DataCommand.INIT_MAIN_QUEST_DATA_REQUEST, null);
    }

    sendGetUserPlaylistMapping() {
        SqlLiteController.instance().resetTableUserPlaylistMappings();
        SqlLiteController.instance().event.reset_data_user_playlist_mapping_complete.add(this.resetDataUserPlaylistMappingComplete, this);
    }

    resetDataUserPlaylistMappingComplete() {
        SqlLiteController.instance().event.reset_data_user_playlist_mapping_complete.remove(this.resetDataUserPlaylistMappingComplete, this);
        SocketController.instance().sendData(DataCommand.INIT_USER_PLAYLIST_MAPPING_REQUEST, null);
    }

    sendGetFriendsList() {
        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_LIST_LOAD_REQUEST,
            SendLoadUserProfile.begin(SocketController.instance().dataMySeft.user_id));
    }


    checkChangeScreen() {
        ControllLoading.instance().hideLoading();
        if (MainData.instance().isNewUser !== undefined) {
            if (MainData.instance().isNewUser == true) {
                ControllScreen.instance().changeScreen(ConfigScreenName.NEW_USER);
            } else {
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            }
        } else {
            ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        }
    }

    static instance() {
        if (this.dataUser) {

        } else {
            this.dataUser = new DataUser();
        }

        return this.dataUser;
    }
}