import DataServer from "./DataServer.js";

export default class MainData {
    static instance() {
        if (this.mainData) {

        } else {
            this.mainData = new MainData();
        }
        return this.mainData;
    }

    static get VERSION_AND() {
        return "0.1.2";
    }

    static get VERSION_IOS() {
        return "0.0.6";
    }

    constructor() {
        this.positionCreateRoomData = null;
        this.positionDefaultResourceData = null;
        this.positionPopupData = null;
        this.positionEventModeData = null;
        this.positionRankingData = null;
        this.positionShopData = null;
        this.positionUserProfileData = null;
        this.positionDetailPlaylistData = null;
        this.silentchatData = null;
        this.udid = "";
        this.referrer = "";
        this.dataShop = null;
        this.dataPackage = null;
        this.ktUpdate = false;
        this.isShowLoading = false;
        this.playlist_reload_at = "";

        this.MODEPLAY = {
            OnlineMode: "OnlineMode",
            OnlineModeRoom: "OnlineModeRoom"
        }

        this.platform = "";
        this.response = null;
        this.ktPlayAgainOnlineMode = false;
        this.state = "";
        this.modeplay = "OnlineMode"; // quickplay , createroom
        this.dataPlayOnlineMode = {
            id: 0,
            genre_id: 0,
            bet_id: 0,
            bet_place: 0
        };
        this.scale = 1;
        this.dataJoinRoom = null;
        this.dataGennes = {};
        this.typeMenuGenes = "Local";
        this.playScript = {
            playing_guide: "",
            play_script_questions: []
        }
        this.botChallenge = {
            value: 0,
            gameLogId: 0,
            requestId: 0,
            opponentEntity: {

            },
            mode: 'isChallengeGame',
            can_be_poked: 0,
            weeklyResult: {
                userWon: 0,
                opponentWon: 0
            }
        }
        this.SIZE_AVA_UPLOAD = 2097152;
        this.STANDARD_HEIGHT = 1136;
        this.LOGED_IN = false;
        this.LOG_IN_BY_FB = false;
        this.userDescription = "";
        this.isGetUserProfileSearch = false;
        this.android_storage_link = "market://details?id=com.wazzat.musicgame";
        this.ios_storage_link = "itms-apps://itunes.apple.com/app/1440442421";

        this.idxHighest = -1;
        this.isScrollChange = false;
        this.tokenYanAccount = "";
        //
        this.menuLoadResponses = null;
        this.menuOpponentsResponse = null;
        this.init_quests_count = 0;
        this.new_friend_request_count = 0;
        this.started_event_count = 0;
        this.hoursReward = null;
        //
        this.isRefreshMenu = {
            checking: false,
            updated: 0
        };
        //
        this.userOneSingal = "";
        this.tokenOneSignal = "";
        this.menuDragging = false;

        this.dataServer = new DataServer();
        //optimize Socket
        //CHALLENGE_GAME_FIND_OPPONENTS_REQUEST
        this.isChallengeGameFindOpponents = {
            checking: false,
            updated: 0
        };
        this.friendLists = [];
        this.suggestion_users = [];
        this.random_user = null;
        //QUEST_LOAD_REQUEST
        this.isMainQuestLoad = {
            checking: false,
            updated: 0
        }
        this.mainQuestLists = [];
        this.mainQuestLogLists = [];
        this.mainNextQuest = null;
        //SOLO_MODE_PLAYLISTS_REQUEST
        this.isSoloModePlaylistRequest = {
            checking: false,
            updated: 0
        }
        this.soloModePlaylists = [];
        //DAILY_QUEST_LOAD_REQUEST
        this.isDailyQuestLoad = {
            checking: false,
            updated: 0
        };
        this.dailyQuestLists = [];
        //ACHIEVEMENT_LOAD_REQUEST
        this.isAchievementLoad = {
            checking: false,
            updated: 0
        };
        this.achievements = [];
        //message turnbase
        this.messageTurnbases = ["Làm ván đi em eeii!", "Chơi với em đi hihi", "Khó quắc à, anh chơi đi!", "Goddd damn it!"];
        //MAIL AND MESSAGE
        this.checkLoadMail = 0;
        this.checkLoadMessage = 0;
        this.mailData = null;
        this.messageData = null;
        //
        this.dataMessagesLocal = null;
        this.systemMessagesLocal = null;
        this.zoneSFS = "";
        //
        this.soloModeReward = null;
    }

    get positionCreateRoom() {
        if (this.positionCreateRoomData === null) {
            this.positionCreateRoomData = JSON.parse(game.cache.getText('positionCreateRoom'));
        }

        return this.positionCreateRoomData;
    }

    get positionDefaultSource() {
        if (this.positionDefaultResourceData === null) {
            this.positionDefaultResourceData = JSON.parse(game.cache.getText('positionDefaultSource'));
        }
        return this.positionDefaultResourceData;
    }

    get positionPopup() {
        if (this.positionPopupData === null) {
            this.positionPopupData = JSON.parse(game.cache.getText('positionPopup'));
        }
        return this.positionPopupData;
    }

    get positionEventMode() {
        if (this.positionEventModeData === null) {
            this.positionEventModeData = JSON.parse(game.cache.getText('positionEventMode'));
        }
        return this.positionEventModeData;
    }

    get positionRanking() {
        if (this.positionRankingData === null) {
            this.positionRankingData = JSON.parse(game.cache.getText('positionRanking'));
        }
        return this.positionRankingData;
    }
    get positionShop() {
        if (this.positionShopData === null) {
            this.positionShopData = JSON.parse(game.cache.getText('positionShop'));
        }
        return this.positionShopData;
    }

    get positionUserProfile() {
        if (this.positionUserProfileData === null) {
            this.positionUserProfileData = JSON.parse(game.cache.getText('positionUserProfile'));
        }
        return this.positionUserProfileData;
    }

    get positionDetailPlaylist() {
        if (this.positionDetailPlaylistData === null) {
            this.positionDetailPlaylistData = JSON.parse(game.cache.getText("positionDetailPlaylist"));
        }
        return this.positionDetailPlaylistData;
    }

    get silentchat() {
        if (this.silentchatData === null) {
            this.silentchatData = {};
            let arrDataChat = game.cache.getText('silentchat').split(",");
            for (let i = 0; i < arrDataChat.length; i++) {
                let text = arrDataChat[i].trim();
                this.silentchatData[text] = text;
            }

        }
        return this.silentchatData;
    }
}