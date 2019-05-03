import DataCommand from "../../../../common/DataCommand.js";
import AchievementSprite from "./AchievementSprite.js";

import SocketController from "../../../../controller/SocketController.js";
import ListView from "../../../../../libs/listview/list_view.js";
import ControllLoading from "../../../../view/ControllLoading.js";
import MainData from "../../../../model/MainData.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class AchievementScrollList extends BaseGroup {
    constructor() {
        super(game)
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.event = {
            claimReward: new Phaser.Signal()
        };
        this.listScroll;
        this.afterInit();
    }

    afterInit() {
        this.sendLoadAchievementRequest();
        this.addEventExtension();
    }

    addListScroll() {
        var gr = new Phaser.Group(game);
        gr.x = 0;
        gr.y = 95 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 10, 640 * window.GameConfig.RESIZE, (game.height - 286) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        //
        for (let i = 0; i < MainData.instance().achievements.length; i++) {
            let achievement = new AchievementSprite(MainData.instance().achievements[i], i);
            achievement.event.claimReward.add(this.claimReward, this);
            this.listView.add(achievement);
        }
    }

    claimReward(achievement) {
        this.listView.destroy();
        this.event.claimReward.dispatch(achievement);
        this.destroy();
    }

    sendLoadAchievementRequest() {
        ControllLoading.instance().showLoading();
        this.checkAchievementLoadRequest();

    }

    checkAchievementLoadRequest() {
        if (MainData.instance().achievements.length > 0) {
            this.doneAchievementResponse();
        } else {
            SocketController.instance().sendData(DataCommand.ACHIEVEMENT_LOAD_REQUEST, null);
            MainData.instance().isAchievementLoad.checking = true;
            MainData.instance().isAchievementLoad.updated = Date.now();
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.ACHIEVEMENT_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleAchievementResponse(evtParams.params, () => {
                    this.sortAchievement(() => {
                        this.doneAchievementResponse();
                    });
                });
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
    }

    sortAchievement(callback) {
        MainData.instance().achievements.sort((a) => {
            if (a.achievement_log.state == "INIT") {
                return -1
            } else {
                return 0
            }
        })
        callback();
    }

    doneAchievementResponse() {
        this.addListScroll();
        this.timeOutHideLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
    }

    handleAchievementResponse(response, callback) {
        MainData.instance().achievements = [];
        var achievementArrs = [];
        let achievements = response.getSFSArray('achievements');
        for (let i = 0; i < achievements.size(); i++) {
            let achievement = achievements.getSFSObject(i);
            let reward = achievement.getInt('reward');
            let condition = achievement.getUtfString('condition');
            let is_done = false;
            if (achievement.containsKey('achievement_log')) {
                is_done = true;
            }
            let achievement_log = {
                user_id: 0,
                achievement_id: 0,
                created: 0,
                id: 0,
                state: "UNKNOWN",
                updated: 0,
                level: 0
            }
            if (is_done == true) {
                let achievementLog = achievement.getSFSObject('achievement_log');
                achievement_log.user_id = achievementLog.getInt('user_id');
                achievement_log.achievement_id = achievementLog.getInt('achievement_id');
                achievement_log.created = achievementLog.getLong('created');
                achievement_log.id = achievementLog.getLong('id');
                achievement_log.state = achievementLog.getUtfString('state');
                achievement_log.updated = achievementLog.getLong('updated');
                achievement_log.level = achievementLog.getInt('level');
            }
            let reward_type = achievement.getUtfString('reward_type');
            let medal = achievement.getUtfString('medal');
            let achieved = achievement.getInt('achieved');
            let id = achievement.getInt('id');
            let title = achievement.getUtfString('title');
            let required = achievement.getInt('required');
            let current_level = achievement.getInt('current_level');
            achievementArrs.push({
                reward: reward,
                condition: condition,
                is_done: is_done,
                reward_type: reward_type,
                medal: medal,
                achieved: achieved,
                id: id,
                title: title,
                required: required,
                achievement_log: achievement_log,
                current_level: current_level
            });
        }
        MainData.instance().achievements = achievementArrs;
        callback();
    }

    destroy() {
        clearTimeout(this.timeOutHideLoading);
        this.removeEventExtension();
        this.listView.removeAll();
        this.listView.destroy();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.listView.destroy();
        super.destroy();
    }
}