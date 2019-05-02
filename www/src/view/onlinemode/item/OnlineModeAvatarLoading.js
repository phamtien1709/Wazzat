import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeAvatarLoading extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {

        this.positionCreateRoom = MainData.instance().positionCreateRoom;
        this.spriteLoading = new SpriteBase(this.positionCreateRoom.waitting_user_loading_ava);
        this.spriteLoading.anchor.x = 0.5;
        this.spriteLoading.anchor.y = 0.5;
        this.addChild(this.spriteLoading);
        this.spriteLoading.x = this.spriteLoading.width / 2;
        this.spriteLoading.y = this.spriteLoading.height / 2;

        LogConsole.log(this.spriteLoading.x);
        LogConsole.log(this.spriteLoading.y);

        this.timerToCountTime = null;
        this.timerEvent = null;
    }

    beginLoad() {
        this.removetimer();
        this.timerToCountTime = this.game.time.create(true);
        this.timerEvent = this.timerToCountTime.loop(50, this.onTimerToCountTime, this);
        this.timerToCountTime.start();
    }
    onTimerToCountTime() {
        LogConsole.log("onTimerToCountTime");
        this.spriteLoading.rotation += 0.1;
    }
    removetimer() {
        if (this.timerToCountTime !== null) {
            game.time.events.remove(this.timerEvent);
            this.timerEvent = null;
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
            this.timerToCountTime = null;
        }
    }
    destroy() {
        this.removetimer();
        super.destroy();
    }
}