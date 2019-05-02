import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeItemLoadingMeAnswer extends BaseView {
    constructor() {
        super(game, null);

    }
    afterCreate() {
        this.timeCount = 10000;
        this.eventLoadingComplete = new Phaser.Signal();
        this.positionOnlineMode = MainData.instance().positionCreateRoom;
        this.loaderPerc = 0;
        this.beginLoad = false;
        this.maxLoading = 100;
        this.constLoading = 5000 / 10000;

        this.bg = new SpriteBase(this.positionOnlineMode.bg_loading_answer_me);
        this.addChild(this.bg);

        this.bgLoading = new SpriteBase(this.positionOnlineMode.bg_sansang_answer_me);
        this.addChild(this.bgLoading);

        this.maskLoading = new Phaser.Graphics(game, this.bgLoading.width / 2, this.bgLoading.height / 2);
        this.maskLoading.anchor.setTo(0.5, 0.5);
        this.addChild(this.maskLoading);
        this.bgLoading.mask = this.maskLoading;

        this.drawMask();

        this.timerToCountTime = this.game.time.create(true);
        this.timerToCountTime.loop(50, this.onTimerToCountTime, this);

    }

    addEventLoadingComplete(callback, scope) {
        this.eventLoadingComplete.add(callback, scope);
    }
    removeEventLoadingComplete(callback, scope) {
        this.eventLoadingComplete.remove(callback, scope);
    }
    dispatchEventLoadingComplete() {
        this.timerToCountTime.destroy();
        this.eventLoadingComplete.dispatch();
    }

    onTimerToCountTime() {
        this.drawMask();
    }
    drawMask() {
        if (this.beginLoad) {
            if (this.loaderPerc < 100) {
                this.loaderPerc += this.constLoading;

                if (this.loaderPerc > this.maxLoading) {
                    this.loaderPerc = this.maxLoading;
                    if (this.loaderPerc === 100) {
                        //this.dispatchEventLoadingComplete();
                    }
                }


                this.maskLoading.clear();
                // this.maskLoading.lineStyle(10, 0xffffff);   
                this.maskLoading.beginFill(0xffffff)
                this.maskLoading.rotation += 0.1;
                if (this.loaderPerc === 100) {
                    this.maskLoading.arc(0, 0, this.bgLoading.width / 2 + 4 * MainData.instance().scale, this.game.math.degToRad(0), this.game.math.degToRad(360), true);
                } else {
                    this.maskLoading.arc(0, 0, this.bgLoading.width / 2 + 4 * MainData.instance().scale, this.game.math.degToRad(270), this.game.math.degToRad(270 - (this.loaderPerc * 3.6)), true);
                }
                this.maskLoading.endFill()
            } else { }
        }
    }

    setMaxLoading(max) {
        this.maxLoading = max;
    }

    setBeginLoad() {
        this.timerToCountTime.start();
        this.beginLoad = true;
    }

    destroy() {
        this.maskLoading.clear();
        this.timerToCountTime.stop();
        this.timerToCountTime.destroy();
        super.destroy();
    }
}