import SpriteBase from "../../../../view/component/SpriteBase.js";

export default class QuestDoneSprite extends Phaser.Sprite {
    constructor() {
        super(game, 0, 0, 'otherSprites', 'tab-friend');
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.afterInit();
    }

    afterInit() {
        this.required;
        this.reward;
    }

    addRequireAndReward(quest) {
        this.required = new Phaser.Text(game, this.positionQAndAConfig.scroll.require_done.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.require_done.y * window.GameConfig.RESIZE, quest.quest, this.positionQAndAConfig.scroll.require_done.configs);
        this.required.anchor.set(0, 0.5);
        this.addChild(this.required);
        let tick = new Phaser.Sprite(game, this.positionQAndAConfig.scroll.doneIcon.x * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.doneIcon.y * window.GameConfig.RESIZE, this.positionQAndAConfig.scroll.doneIcon.nameAtlas, this.positionQAndAConfig.scroll.doneIcon.nameSprite);
        tick.anchor.set(1, 0);
        this.addChild(tick);
        //
        let line = new SpriteBase(this.positionQAndAConfig.line_under);
        this.addChild(line);
    }
}