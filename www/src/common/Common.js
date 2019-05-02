import DataFieldListGame from "./DataFieldListGame.js";
import PlayScriptScreen from "../view/playscript/playScriptScreen.js";
import MainData from "../model/MainData.js";

export default class Common {

    /**
     * Switch display button when click another. 
     * I will higlight the button is clicked and blur others
     * it using in "Navigation menu" & "Shop top menu".
     * 
     * @param {*} activeBtnArr array of all active button
     * @param {*} btnArr array of all normal button
     * @param {*} btn normal button
     * @param {*} activeBtn activate button
     */
    static switchButton(btnArr, activeBtnArr, btn, activeBtn) {
        // LogConsole.log("btnArr:" + btnArr[0]);
        // LogConsole.log("activeBtnArr" + activeBtnArr[0]);
        for (let i = 0; i < activeBtnArr.length; i++) {
            activeBtnArr[i].kill();
        }
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].revive();
        }
        btn.kill();
        activeBtn.revive();
    }
    /**
     * Move group from beside to main screen (from width to position.x = 0)
     * @param {*} group group to move
     */
    static show(group) {
        game.add.tween(group).to({ x: 0 }, 100, "Linear", true);
    }
    static hide(group) {
        game.add.tween(group).to({ x: game.width }, 100, "Linear", true);
    }

    static handleArrsGames(arrs, arrsJSON, mode) {
        // LogConsole.log(arrs.getDump());
        if (arrs.size() > 0) {
            for (let i = 0; i < arrs.size(); i++) {
                let obj = arrs.getSFSObject(i);
                let opponentEntity = obj.getSFSObject('opponent_entity');
                let userName = opponentEntity.getUtfString('user_name');
                let avatar = opponentEntity.getUtfString('avatar');
                let experienceScore = opponentEntity.getInt('experience_score');
                let idOpponent = opponentEntity.getInt('id');
                let turnCount = obj.getInt('turn_count');
                let weeklyResult = obj.getSFSObject('weekly_result');
                let userWon = weeklyResult.getInt('user_won');
                let opponentWon = weeklyResult.getInt('opponent_won');
                let userGameLog = obj.getLong('user_play_log');
                let id = obj.getLong('id');
                arrsJSON.push({
                    opponentEntity: {
                        userName: userName,
                        avatar: avatar,
                        experienceScore: experienceScore,
                        id: idOpponent,
                    },
                    turnCount: turnCount,
                    weeklyResult: {
                        userWon: userWon,
                        opponentWon: opponentWon,
                    },
                    id: id,
                    userGameLog: userGameLog,
                    mode: mode
                })
            }
        }
    }

    static handleArrMainMenuLoad(arrs, arrsJSON, callback) {
        if (arrs.size() > 0) {
            for (let i = 0; i < arrs.size(); i++) {
                let obj = arrs.getSFSObject(i);
                let user_id = obj.getInt(DataFieldListGame.user_id);
                let user_name = obj.getUtfString(DataFieldListGame.user_name);
                let avatar = obj.getUtfString(DataFieldListGame.avatar);
                let weekly_result = obj.getSFSObject(DataFieldListGame.weekly_result);
                let user_won = weekly_result.getInt(DataFieldListGame.user_won);
                let opponent_won = weekly_result.getInt(DataFieldListGame.opponent_won);
                let status = obj.getUtfString(DataFieldListGame.status);
                let updated = obj.getLong(DataFieldListGame.updated);
                let updatedConverted = Common.formatChallengeGameUpdated(updated);
                let challenge_msg = obj.getUtfString(DataFieldListGame.challenge_msg);
                let vip = obj.getBool(DataFieldListGame.vip);
                //
                let can_be_poked = null;
                let poked = 0;
                let poked_at = 0;
                if (status == "THEIR_TURN") {
                    if (obj.containsKey(DataFieldListGame.can_be_poked)) {
                        can_be_poked = obj.getInt(DataFieldListGame.can_be_poked);
                    }
                } else if (status == "YOUR_TURN") {
                    if (obj.containsKey(DataFieldListGame.poked)) {
                        poked = obj.getInt(DataFieldListGame.poked);
                        poked_at = obj.getLong(DataFieldListGame.poked_at);
                    }
                }
                let turn_count = obj.getInt(DataFieldListGame.turn_count);
                let is_online = obj.getBool(DataFieldListGame.is_online);
                //
                let challenge_request_id = obj.getLong(DataFieldListGame.challenge_request_id);
                arrsJSON.push({
                    opponentEntity: {
                        id: user_id,
                        userName: user_name,
                        avatar: avatar,
                        is_online: is_online,
                        vip
                    },
                    weeklyResult: {
                        userWon: user_won,
                        opponentWon: opponent_won
                    },
                    turnCount: turn_count,
                    status: status,
                    can_be_poked: can_be_poked,
                    poked: poked,
                    poked_at: poked_at,
                    updated: updatedConverted,
                    base_updated: updated,
                    challenge_request_id: challenge_request_id,
                    challenge_msg: challenge_msg
                })
            }
        }
        callback();
    }

    static handleCheckUpdateMainMenu(params, callback) {
        let init_quests_count = params.getInt('init_quests_count');
        let new_friend_request_count = params.getLong('new_friend_request_count');
        let started_event_count = params.getLong('started_event_count');
        //
        let playScript = {
            playing_guide: "",
            play_script_questions: []
        }
        if (params.containsKey('play_script')) {
            var play_script = params.getSFSObject('play_script');
            if (play_script.containsKey('playing_guide')) {
                playScript.playing_guide = play_script.getUtfString('playing_guide');
            }
        }
        if (playScript.playing_guide == PlayScriptScreen.DONE_GET_QUEST) {
            MainData.instance().botChallenge = {
                "value": 0,
                "gameLogId": MainData.instance().menuLoadResponses.challengeGames[0].userGameLog,
                "requestId": MainData.instance().menuLoadResponses.challengeGames[0].id,
                "opponentEntity": MainData.instance().menuLoadResponses.challengeGames[0].opponentEntity,
                "mode": 'isChallengeGame',
                "can_be_poked": MainData.instance().menuLoadResponses.challengeGames[0].can_be_poked,
                "weeklyResult": {
                    userWon: 0,
                    opponentWon: 0
                }
            }
        }
        if (params.containsKey('hours_reward')) {
            let hours_reward = params.getSFSObject('hours_reward');
            let hoursReward = {
                hours_reward_id: hours_reward.getInt('hours_reward_id'),
                user_id: hours_reward.getInt('user_id'),
                created: hours_reward.getLong('created'),
                state: hours_reward.getUtfString('state'),
                updated: hours_reward.getLong('updated')
            }
        }
        callback(init_quests_count, new_friend_request_count, started_event_count, {}, playScript);
    }

    static getGender(user) {
        var gender = "MALE";
        if (user.gender == "UNKNOWN") {
            gender = "MALE";
        } else {
            gender = "FEMALE";
        }
        return gender;
    }

    static getTwoOfFourAnswer(answerA, answerB, answerC, answerD, question) {
        LogConsole.log(question);
        var arrEnable = [];
        var arrDisable = [];
        if (question.correctAnswer == 1) {
            arrEnable.push(answerA);
            arrDisable.push(answerB);
            arrDisable.push(answerC);
            arrDisable.push(answerD);
        } else if (question.correctAnswer == 2) {
            arrEnable.push(answerB);
            arrDisable.push(answerA);
            arrDisable.push(answerC);
            arrDisable.push(answerD);
        } else if (question.correctAnswer == 3) {
            arrEnable.push(answerC);
            arrDisable.push(answerB);
            arrDisable.push(answerA);
            arrDisable.push(answerD);;
        } else {
            arrEnable.push(answerD);
            arrDisable.push(answerB);
            arrDisable.push(answerC);
            arrDisable.push(answerA);
        }
        arrDisable.splice(Math.floor(Math.random() * arrDisable.length), 1);
        // LogConsole.log(arrDisable);
        for (let i = 0; i < arrDisable.length; i++) {
            arrDisable[i].hide();
        }
    }

    static formatName(text, lent, suffix = true) {
        if (text.length > lent) {
            var fName = text.substring(0, lent);

            if (suffix === false)
                return fName;

            return fName.trim() + '...';
        }
        return text;
    }

    static formatChallengeGameUpdated(time) {
        let txtTime = "";
        let now = Date.now();
        let timeRemain = now - time;
        timeRemain = parseInt(timeRemain / 1000);
        let timeMonth = 2592000;
        let timeWeek = 604800;
        let timeDay = 86400;
        let timeHour = 3600;
        let timeMin = 60;
        let calcMonth = parseInt((timeRemain / timeMonth).toFixed(0));
        //
        if (calcMonth > 0) {
            txtTime = `${calcMonth} tháng trước`;
        } else {
            let calWeek = parseInt(timeRemain / timeWeek);
            if (calWeek > 0) {
                txtTime = `${calWeek} tuần trước`;
            } else {
                let calDate = parseInt(timeRemain / timeDay);
                if (calDate > 0) {
                    txtTime = `${calDate} ngày trước`;
                } else {
                    let calHour = parseInt(timeRemain / timeHour);
                    if (calHour > 0) {
                        txtTime = `${calHour} giờ trước`;
                    } else {
                        let calMin = parseInt(timeRemain / timeMin);
                        if (calMin > 0) {
                            txtTime = `${calMin} phút trước`;
                        } else {
                            txtTime = `vài giây trước`;
                        }
                    }
                }
            }
        }
        return txtTime;
    }
    static handleRankingList(params, arr, userPos, callback) {
        if (params.containsKey('solo_mode_top10_last_week')) {
            var responses = params.getSFSArray('solo_mode_top10_last_week');
        } else {
            var responses = params.getSFSArray('solo_mode_top10_this_week');
        }
        for (let i = 0; i < responses.size(); i++) {
            let response = responses.getSFSObject(i);
            let user_id = response.getInt('user_id');
            let number_of_correct = response.getInt('number_of_correct');
            let playlist_id = response.getInt('playlist_id');
            // let user_entity = response.getSFSObject('user_entity');
            let avatar = response.getUtfString('avatar');
            let user_name = response.getUtfString('user_name');
            let vip = false;
            if (response.containsKey('vip')) {
                vip = response.getBool('vip');
            }
            let rankingObj = {
                rank: i + 1,
                user_id: user_id,
                playlist_id: playlist_id,
                number_of_correct: number_of_correct,
                user_name: user_name,
                avatar: avatar,
                vip: vip
            }
            arr.push(rankingObj);
        }
        if (params.containsKey('position')) {
            let position = params.getSFSObject('position');
            // console.log(position.getDump());
            if (position.getDump() !== '[ Empty SFSObject ]') {
                let pos = position.getLong('pos');
                let user_id = position.getInt('user_id');
                let playlist_id = position.getInt('playlist_id');
                let number_of_correct = position.getInt('number_of_correct');
                userPos.rank = pos;
                userPos.user_id = user_id;
                userPos.playlist_id = playlist_id;
                userPos.number_of_correct = number_of_correct;
            }
        }
        callback();
    }
    static handleTime(res, callback) {
        var expired_timestamp = res.getLong('expired_timestamp');
        var now = Date.now();
        var timeCountDown = parseInt((expired_timestamp - now) / 1000);
        callback(timeCountDown);
    }

    static setQuestLogs(questLog, questLogs) {
        if (questLog !== null) {
            questLogs.push(questLog);
        }
    }

    static changeQuestLogsOnClaim(id, questLogs) {
        console.log(questLogs);
        for (let i = 0; i < questLogs.length; i++) {
            if (questLogs[i].id == id) {
                questLogs[i].state = "REWARDED";
            }
        }
    }

    static getGame(callback) {
        var configsUrl = window.linkResource;
        $.ajax({
            type: "GET",
            url: configsUrl,
            success: function (response) {
                callback(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                callback({ "status": "ERROR" });
            }
        });
    }

    static filterResponseGames() {
        MainData.instance().menuLoadResponses.waitingGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "THEIR_TURN");
        MainData.instance().menuLoadResponses.doneGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "NO_GAME");
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "YOUR_TURN");
        MainData.instance().menuLoadResponses.waitingGames = MainData.instance().menuLoadResponses.waitingGames.sort((a, b) => b.can_be_poked - a.can_be_poked);
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuLoadResponses.challengeGames.sort((a, b) => b.poked - a.poked);
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuLoadResponses.challengeGames.sort((a, b) => b.poked_at - a.poked_at);
    }

    static isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static shortValueNumber(num, digits = 0) {
        if (num > 999999) {
            let units = [' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'],
                decimal;

            for (var i = units.length - 1; i >= 0; i--) {
                decimal = Math.pow(1000, i + 1);

                if (num <= -decimal || num >= decimal) {
                    return +(num / decimal).toFixed(digits) + units[i];
                }
            }

        }
        return num;
    }
}