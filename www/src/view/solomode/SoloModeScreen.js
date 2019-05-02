import SoloModePickAlbum from "./screen/SoloModePickAlbum.js";
import PopupNotEnoughResource from "../popup/PopupNotEnoughResource.js";
import SoloModePlay from "./screen/SoloModePlay.js";
import DataCommand from "../../common/DataCommand.js";
import SocketController from "../../controller/SocketController.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import ControllLoading from "../ControllLoading.js";
import MainData from "../../model/MainData.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import BaseScreenSprite from "../component/BaseScreenSprite.js";
import Reward from "../../modules/practiceMenu/PopupPractice/Ingame/Reward.js";
import DoneSoloMode from "../../modules/practiceMenu/PopupPractice/Ingame/DoneSoloMode.js";
import DataUser from "../../model/user/DataUser.js";

export default class SoloModeScreen extends BaseScreenSprite {
    constructor(screen = null) {
        super();
        this.screenPickAlbum = null;
        this.screenPlay = null;
        this.event = {
            pickAlbumBack: new Phaser.Signal(),
            playGoHome: new Phaser.Signal()
        }
        this.screen = screen;
        //
        this.arrResource = [
            // Adding
            {
                type: "text",
                link: "img/config/positionPracticeScreenConfig.json",
                key: "positionPracticeScreenConfig"
            },
            {
                type: "text",
                link: "img/config/positionPracticePopupConfig.json",
                key: "positionPracticePopupConfig"
            },
            {
                type: "text",
                link: "img/config/positionRankingConfig.json",
                key: "positionRankingConfig"
            },
            {
                type: "spritesheet",
                link: "img/assetss/Animation/Timeout/TimeoutSoloMode.png",
                key: "timeout_practice",
                width: 158,
                height: 195,
                countFrame: 24
            },
            {
                type: "spritesheet",
                link: "img/assetss/Practice/Wrong338x338.png",
                key: "wrong_practice",
                width: 210,
                height: 210,
                countFrame: 23
            },
            {
                type: "spritesheet",
                link: "img/animations/RewardSoloMode/reward.png",
                key: "rewardSoloMode",
                width: 250,
                height: 250,
                countFrame: 54
            },
            {
                type: "spritesheet",
                link: "img/animations/RewardSoloMode/ticketReward.png",
                key: "rewardTicketSoloMode",
                width: 250,
                height: 250,
                countFrame: 54
            },
            {
                type: "spritesheet",
                link: "img/animations/RewardSoloMode/sptReward.png",
                key: "rewardSptSoloMode",
                width: 250,
                height: 250,
                countFrame: 54
            },
            {
                type: "atlas",
                link: "img/atlas/soloMode.png",
                key: "practiceMenuSprites",
                linkJson: "img/atlas/soloMode.json"
            }
        ]
        this.loadResource();
    }

    onLoadFileComplete() {
        //
        this.afterInit();
    }

    static get PICK_ALBUM() {
        return "screen_pick_album";
    }

    static get PLAY() {
        return "screen_play";
    }

    afterInit() {
        this.addEventExtension();
        this.defineData();
        if (this.screen == SoloModeScreen.PICK_ALBUM) {
            this.sendSoloModePlaylistsRequest();
        }
    }
    defineData() {
        // this.soloModePlaylists = [];
        this.playlist = {
            name: "",
            id: 0
        };
        this.questions = [];
        this.rewardPractice = [];
        this.archived = {};
    }
    //LOGIC CODE
    sendSoloModePlaylistsRequest() {
        ControllLoading.instance().showLoading();
        this.checkRequestSocketSoloModePlaylist();
        if (MainData.instance().isSoloModePlaylistRequest.checking == false) {
            MainData.instance().soloModePlaylists = [];
            SocketController.instance().sendData(DataCommand.SOLO_MODE_PLAYLISTS_REQUEST, null);
            //
            MainData.instance().isSoloModePlaylistRequest.checking = true;
            MainData.instance().isSoloModePlaylistRequest.updated = Date.now();
        } else {
            this.doneSoloModePlaylistResponse();
        }
    }

    checkRequestSocketSoloModePlaylist() {
        if (MainData.instance().isSoloModePlaylistRequest.checking == true) {
            if (MainData.instance().soloModePlaylists.length == 0) {
                MainData.instance().isSoloModePlaylistRequest.checking = false;
            } else {
                MainData.instance().isSoloModePlaylistRequest.checking = true;
            }
        } else {
            MainData.instance().isSoloModePlaylistRequest.checking = false;
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    doneSoloModePlaylistResponse() {
        this.addScreenPickAlbum();
        //
        ControllLoading.instance().hideLoading();
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SOLO_MODE_PLAYLISTS_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleSoloModePlaylistsResponse(evtParams.params, () => {
                    this.doneSoloModePlaylistResponse();
                });
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
        if (evtParams.cmd == DataCommand.SOLO_MODE_QUESTION_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleSoloModeSelectedPlaylistsResponse(evtParams.params, () => {
                    this.removeScreenPickAlbum();
                    this.updateSoloModePlaylists(MainData.instance().soloModePlaylists);
                    this.addScreenPlay();
                    //
                    ControllLoading.instance().hideLoading();
                })
            } else {
                if (evtParams.params.getUtfString('status') == "WARNING") {
                    ControllScreenDialog.instance().addPopupNotEnoughResource(PopupNotEnoughResource.HEART);
                    if (this.screenPickAlbum !== null) {
                        this.screenPickAlbum.isChoosedAlbum = false;
                        this.isChoosedAlbum = false;
                    }
                    //
                    ControllLoading.instance().hideLoading();
                } else {
                    ControllLoading.instance().hideLoading();
                }
            }
        }
        if (evtParams.cmd == DataCommand.INIT_SOLO_MODE_REWARD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleSoloModeRewardResponse(evtParams.params, () => {
                    this.sendSelectedPlaylistSoloMode(this.playlist.id);
                })
            }
        }
    }

    updateSoloModePlaylists(playlists) {
        let updated = new Date().getTime();
        playlists.forEach((element, index) => {
            if (element.id === this.playlist.id) {
                playlists[index].user_playlist_mapping.updated = updated;
            }
        });

    }

    addScreenPickAlbum() {
        this.removeScreenPickAlbum();
        this.screenPickAlbum = new SoloModePickAlbum();
        this.screenPickAlbum.addPlaylists(MainData.instance().soloModePlaylists);
        this.screenPickAlbum.addEventInputX(this.onClickPracticeBtnX, this);
        this.screenPickAlbum.event.pickAlbum.add(this.onChoosedAlbum, this);
        this.screenPickAlbum.event.refreshPickAlbum.add(this.refreshPickAlbum, this);
        this.isChoosedAlbum = false;
        this.addChild(this.screenPickAlbum);
    }
    removeScreenPickAlbum() {
        if (this.screenPickAlbum !== null) {
            this.removeChild(this.screenPickAlbum);
            this.screenPickAlbum.destroy();
            this.screenPickAlbum = null;
        }
    }
    onClickPracticeBtnX() {
        this.removeScreenPickAlbum();
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    onChoosedAlbum(album) {
        if (this.isChoosedAlbum === false) {
            this.playlist = {
                name: album.name,
                id: album.id
            }
            this.isChoosedAlbum = true;
            if (MainData.instance().soloModeReward !== null) {
                this.sendSelectedPlaylistSoloMode(this.playlist.id);
            } else {
                this.sendGetSoloModeRewardRequest();
            }
        }
    }
    refreshPickAlbum() {
        this.removeScreenPickAlbum();
        this.defineData();
        //
        ControllLoading.instance().showLoading();
        MainData.instance().soloModePlaylists = [];
        SocketController.instance().sendData(DataCommand.SOLO_MODE_PLAYLISTS_REQUEST, null);
        //
        MainData.instance().isSoloModePlaylistRequest.checking = true;
        MainData.instance().isSoloModePlaylistRequest.updated = Date.now();
    }

    addScreenPlay() {
        this.removeScreenPlay();
        this.screenPlay = new SoloModePlay();
        this.screenPlay.setData(this.questions, this.archived, this.rewardPractice, this.playlist, this.highest_number_of_correct);
        this.screenPlay.afterInit();
        this.screenPlay.event.backToHome.add(this.screenPlayBackHome, this);
        this.screenPlay.event.playAgain.add(this.screenPlayPlayAgain, this);
        this.addChild(this.screenPlay);
    }
    removeScreenPlay() {
        if (this.screenPlay !== null) {
            this.removeChild(this.screenPlay);
            this.screenPlay.destroy();
            this.screenPlay = null;
        }
    }
    screenPlayBackHome() {
        this.removeScreenPlay();
        // this.event.playGoHome.dispatch();
        ControllScreen.instance().changeScreen(ConfigScreenName.SOLO_MODE, SoloModeScreen.PICK_ALBUM);
    }
    screenPlayPlayAgain(playlist) {
        this.sendSelectedPlaylistSoloMode(playlist.id);
    }

    handleSoloModePlaylistsResponse(res, callback) {
        // LogConsole.log(res.getDump());
        var responses = res.getSFSArray('general_playlists');
        for (let i = 0; i < responses.size(); i++) {
            let playlist = responses.getSFSObject(i);
            let thumb = playlist.getUtfString('thumb');
            let price = playlist.getInt('price');
            let name = playlist.getUtfString('name');
            let is_general = playlist.getInt('is_general');
            let id = playlist.getInt('id');
            let is_owner = playlist.getInt('is_owner');
            var user_playlist_mapping_outside;
            if (playlist.containsKey('user_playlist_mapping')) {
                let user_playlist_mapping = playlist.getSFSObject('user_playlist_mapping');
                let user_id = user_playlist_mapping.getInt('user_id');
                let level = user_playlist_mapping.getInt('level');
                let playlist_id = user_playlist_mapping.getInt('playlist_id');
                let created = user_playlist_mapping.getLong('created');
                let exp_score = user_playlist_mapping.getInt('exp_score');
                let active = user_playlist_mapping.getInt('active');
                let id_in = user_playlist_mapping.getLong('id');
                let current_level_score = user_playlist_mapping.getInt('current_level_score');
                let next_level_score = user_playlist_mapping.getInt('next_level_score');
                let updated = user_playlist_mapping.getLong('updated');
                user_playlist_mapping_outside = {
                    user_id: user_id,
                    level: level,
                    playlist_id: playlist_id,
                    created: created,
                    exp_score: exp_score,
                    active: active,
                    id: id_in,
                    current_level_score: current_level_score,
                    next_level_score: next_level_score,
                    updated: updated
                }
            }
            MainData.instance().soloModePlaylists.push({
                thumb: thumb,
                price: price,
                name: name,
                is_general: is_general,
                id: id,
                // is_owner: 0
                is_owner: is_owner,
                user_playlist_mapping: user_playlist_mapping_outside
            });
        }
        callback();
    }

    sendSelectedPlaylistSoloMode(id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", id);
        SocketController.instance().sendData(DataCommand.SOLO_MODE_QUESTION_REQUEST, params);
        //
        ControllLoading.instance().showLoading();
    }

    sendGetSoloModeRewardRequest() {
        SocketController.instance().sendData(DataCommand.INIT_SOLO_MODE_REWARD_REQUEST, null);
    }

    handleSoloModeSelectedPlaylistsResponse(res, callback) {
        // LogConsole.log(res.getDump());
        var questions = res.getSFSArray('questions');
        var solo_mode_archived = res.getSFSObject('solo_mode_archived');
        var highest_number_of_correct = res.getInt('highest_number_of_correct');
        this.handlePracticeQuestions(questions);
        this.handleSoloModeArchived(solo_mode_archived);
        this.highest_number_of_correct = highest_number_of_correct;
        callback();
    }

    handleSoloModeRewardResponse(res, callback) {
        var solo_mode_rewards = res.getSFSArray('solo_mode_rewards');
        this.handleSoloModeRewards(solo_mode_rewards);
        callback();
    }

    handleSoloModeArchived(archived) {
        let user_id = archived.getInt('user_id');
        let playlist_id = archived.getInt('playlist_id');
        let achieved = archived.getInt('achieved');
        let id = archived.getLong('id');
        this.archived = {
            user_id: user_id,
            playlist_id: playlist_id,
            achieved: achieved,
            id: id
        }
    }

    handleSoloModeRewards(rewards) {
        // LogConsole.log(rewards.getDump());
        var rewardArrs = [];
        for (let i = 0; i < rewards.size(); i++) {
            let rewardEntity = rewards.getSFSObject(i);
            let id = rewardEntity.getInt('id');
            let number_question = rewardEntity.getInt('number_question');
            let reward = rewardEntity.getInt('reward');
            let reward_type = rewardEntity.getUtfString('reward_type');
            rewardArrs.push({
                id: id,
                number_question: number_question,
                reward: reward,
                reward_type: reward_type
            });
        }
        this.rewardPractice = rewardArrs;
        // LogConsole.log(this.state.rewardPractice);
    }

    handlePracticeQuestions(questions) {
        // LogConsole.log(questions.getDump());
        var questionArrs = [];
        for (let i = 0; i < questions.size(); i++) {
            let question = questions.getSFSObject(i);
            let answer1 = question.getUtfString('answer1');
            let answer2 = question.getUtfString('answer2');
            let answer3 = question.getUtfString('answer3');
            let answer4 = question.getUtfString('answer4');
            let correctAnswer = question.getInt('correct_answer');
            let fileUrl = question.getUtfString('file_path');
            let listenLink = question.getUtfString('file_path');
            let idSong = question.getLong('song_id');
            questionArrs.push({
                answers: [
                    answer1,
                    answer2,
                    answer3,
                    answer4
                ],
                correctAnswer: correctAnswer,
                songEntity: {
                    listenLink: listenLink,
                    id: idSong,
                    fileUrl: fileUrl
                }
            });
        }
        this.questions = questionArrs;

    }

    destroy() {
        this.removeEventExtension();
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