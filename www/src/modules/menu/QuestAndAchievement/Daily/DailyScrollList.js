import QuestDoneSprite from "../Sprites/QuestDoneSprite.js";
import QuestDoingDaily from "../Sprites/QuestDoingDaily.js";
import ListView from "../../../../../libs/listview/list_view.js";
import Language from "../../../../model/Language.js";

export default class DailyScrollList extends Phaser.Sprite {
    constructor() {
        super(game, 0, 102 * window.GameConfig.RESIZE, null);
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.headerScroll;
        this.listScroll;
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
    }

    addHeaderScroll() {
        this.headerScroll = new Phaser.Sprite(game, 0, 0, 'otherSprites', 'tab-list');
        this.addChildInHeaderScroll(this.positionQAndAConfig.scroll.daily.header);
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

    setQuestsAndQuestLogs(quests) {
        this.quests = quests;
        this.addListScroll();
    }

    addListScroll() {
        // LogConsole.log(this.quests);
        for (let i = 0; i < this.quests.length; i++) {
            LogConsole.log(this.quests[i]);
            if (this.quests[i].achieved < this.quests[i].required) {
                let quest = new QuestDoingDaily();
                quest.addRequireAndReward(this.quests[i]);
                this.listView.add(quest);
            } else {
                let quest = new QuestDoneSprite();
                quest.addRequireAndReward(this.quests[i]);
                this.listView.add(quest);
            }
        }
    }

    destroy() {
        this.listView.destroy();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}