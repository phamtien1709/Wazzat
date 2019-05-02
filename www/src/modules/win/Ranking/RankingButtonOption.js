import SpriteBase from "../../../view/component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";

export default class RankingButtonOption extends Phaser.Sprite {
    constructor(configs, type) {
        super(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, null);
        this.type = type;
        this.positionRankingConfig = JSON.parse(game.cache.getText('positionRankingConfig'));
        this.initVariable();
    }

    initVariable() {
        this.timeCounter;
        this.timeIcon;
        this.btnField;
        this.txtRank;
        this.timingWeek;
        this.timeCountDownThisWeekPractice;
        this.lineUnder;
        this.timeCounter = null;
        this.addBtnField();
        if (this.type == "LAST_WEEK") {

        } else if (this.type == "THIS_WEEK") {

        }
        this.signalInput = new Phaser.Signal();
    }

    addInput() {
        this.inputEnabled = true;
        this.events.onInputUp.add(this.onClickSprite, this);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInput.dispatch();
    }

    addBtnField() {
        this.btnField = new Phaser.Sprite(game, 0, 0, 'otherSprites', "tab_highlight");
        this.btnField.scale.set(54 / 36, 1);
        this.addChild(this.btnField);
    }

    addTextThisWeek() {
        this.txtRank = new Phaser.Text(game, this.positionRankingConfig.txt_rank_this_week.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_rank_this_week.y * window.GameConfig.RESIZE, Language.instance().getData("305"), this.positionRankingConfig.txt_rank_this_week.configs);
        // this.txtRank.tint = 
        this.width = this.txtRank.width;
        this.addChild(this.txtRank);
        this.addTiming();
        this.lineUnder = new SpriteBase(this.positionRankingConfig.header.line);
        this.addChild(this.lineUnder);
    }

    addTiming() {
        this.timeIcon = new Phaser.Sprite(game, this.positionRankingConfig.clock.x * window.GameConfig.RESIZE, this.positionRankingConfig.clock.y * window.GameConfig.RESIZE, this.positionRankingConfig.clock.nameAtlas, this.positionRankingConfig.clock.nameSprite);
        this.addChild(this.timeIcon);
    }

    addTimeCountDown(timeCountDownThisWeekPractice) {
        if (this.timeCounter !== null) {
            this.timeCounter.destroy();
            this.timeCounter = null;
        }
        this.timeCountDownThisWeekPractice = timeCountDownThisWeekPractice;
        this.timeCounter = new Phaser.Text(game, this.positionRankingConfig.txt_timeCounter.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_timeCounter.y * window.GameConfig.RESIZE, this.positionRankingConfig.txt_timeCounter.text, this.positionRankingConfig.txt_timeCounter.configs);
        this.handleTimer();
        if (this.timerCount) {

        } else {
            game.time.events.remove(this.timerCount);
            this.timerCount = game.time.events.loop(1000, this.handleTimer, this);
            // this.timerCount.start();
        }
        this.addChild(this.timeCounter);
    }

    handleTimer() {
        // var now = Date.now();
        // var timeCountDown = this.timeCountDownThisWeekPractice - now;
        // LogConsole.log('asdasd');
        this.timeCountDownThisWeekPractice--;
        var hour = parseInt(this.timeCountDownThisWeekPractice / 3600);
        var min = parseInt((this.timeCountDownThisWeekPractice % 3600) / 60);
        var sec = parseInt(((this.timeCountDownThisWeekPractice % 3600) % 60));
        this.timeCounter.setText(`${hour}:${min}:${sec}`);
        //`${hour}:${min}:${sec}`
    }

    addTextLastWeek() {
        this.txtRank = new Phaser.Text(game, this.positionRankingConfig.txt_rank_last_week.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_rank_last_week.y * window.GameConfig.RESIZE, Language.instance().getData("306"), this.positionRankingConfig.txt_rank_last_week.configs);
        this.txtRank.tint = 0x93909c;
        this.width = this.txtRank.width;
        this.addChild(this.txtRank);
        //
        this.lineUnder = new SpriteBase(this.positionRankingConfig.header.line);
        this.lineUnder.kill();
        this.addChild(this.lineUnder);
    }

    setWidth() {

    }

    setHeight() {

    }
    //93909c
    changeEffectShow() {
        this.inputEnabled = false;
        this.txtRank.tint = 0xffffff;
        this.lineUnder.revive();
    }

    changeEffectHide() {
        this.inputEnabled = true;
        this.txtRank.tint = 0x93909c;
        this.lineUnder.kill();
    }

    addEventInput(callback, scope) {
        // callback();
        this.signalInput.add(callback, scope);
    }

    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }

    set width(_width) {
        this._width = _width;
    }

    get width() {
        return this._width;
    }

    destroy() {
        game.time.events.remove(this.timerCount);
        super.destroy();
    }
}