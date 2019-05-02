import QuestInitSprite from "../Sprites/QuestInitSprite.js";
import QuestNotInitSprite from "../Sprites/QuestNotInitSprite.js";
import QuestDoneSprite from "../Sprites/QuestDoneSprite.js";
import QuestDoingSprite from "../Sprites/QuestDoingSprite.js";
import ListView from "../../../../../libs/listview/list_view.js";
import Language from "../../../../model/Language.js";

export default class MainScrollList extends Phaser.Sprite {
    constructor() {
        super(game, 0, 102 * window.GameConfig.RESIZE, null);
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.headerScroll;
        this.listScroll;
        this.quests;
        this.questLogs;
        this.nextQuest;
        this.listView;
        this.event = {
            claimReward: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.addHeaderScroll();
        var gr = new Phaser.Group(game);
        gr.x = 0;
        gr.y = 95 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 386) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        // this.addListScroll();
    }

    addHeaderScroll() {
        this.headerScroll = new Phaser.Sprite(game, 0, 0, 'otherSprites', 'tab-list');
        this.addChildInHeaderScroll(this.positionQAndAConfig.scroll.main.header);
        this.addChild(this.headerScroll);
    }

    addChildInHeaderScroll(configs) {
        let txtRequest = new Phaser.Text(game, configs.txt_request.x * window.GameConfig.RESIZE, configs.txt_request.y * window.GameConfig.RESIZE, Language.instance().getData("232"), configs.txt_request.configs);
        this.headerScroll.addChild(txtRequest);
        let txtReward = new Phaser.Text(game, configs.txt_reward.x * window.GameConfig.RESIZE, configs.txt_reward.y * window.GameConfig.RESIZE, Language.instance().getData("233"), configs.txt_reward.configs);
        txtReward.anchor.set(1, 0);
        this.headerScroll.addChild(txtReward);
        let line = new Phaser.Sprite(game, configs.line.x * window.GameConfig.RESIZE, configs.line.y * window.GameConfig.RESIZE, configs.line.nameAtlas, configs.line.nameSprite);
        this.headerScroll.addChild(line);
    }

    setQuestsAndQuestLogs(quests, questLogs, nextQuest) {
        this.quests = quests;
        this.questLogs = questLogs;
        this.nextQuest = nextQuest;
        this.addListScroll();
    }

    addListScroll() {
        // this.listView.removeAll();
        // this.listView.reset();
        let countRewardedItem = 0;
        for (let i = 0; i < this.quests.length; i++) {
            let ktLog = false;
            for (let k = 0; k < this.questLogs.length; k++) {
                if (this.questLogs[k].quest_id == this.quests[i].id) {
                    //TODO: if has DONE quest show tab Done
                    ktLog = true;
                    if (this.questLogs[k].state == "INIT") {
                        let quest = new QuestInitSprite();
                        quest.addRequireAndReward(this.quests[i], this.questLogs[k].id);
                        quest.event.claimReward.add(this.claimReward, this);
                        this.listView.add(quest);
                    } else if (this.questLogs[k].state == "REWARDED") {
                        countRewardedItem += 1;
                        let quest = new QuestDoneSprite();
                        quest.addRequireAndReward(this.quests[i]);
                        this.listView.add(quest);
                    }
                    break;
                }
            }

            if (ktLog === false) {
                if (this.quests[i].id == this.nextQuest.next_quest_id) {
                    let quest = new QuestDoingSprite();
                    quest.addRequireAndReward(this.quests[i], this.nextQuest);
                    this.listView.add(quest);
                } else {
                    let quest = new QuestNotInitSprite();
                    quest.addRequireAndReward(this.quests[i]);
                    this.listView.add(quest);
                }
            }
        }
        if (countRewardedItem == this.listView.grp.children.length) {
            this.listView.tweenToItem(countRewardedItem - 1);
        } else {
            this.listView.tweenToItem(countRewardedItem);
        }
        // console.log(this.listView)
        // this.addChild(this.listView.grp)
        // LogConsole.log(this.questLogs);
    }

    claimReward(quest, quest_log_id) {
        this.destroy();
        this.event.claimReward.dispatch(quest, quest_log_id);
    }

    destroy() {
        // this.listView.reset();
        if (this.listView) {
            this.listView.removeAll();
            this.listView.destroy();
        }
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}