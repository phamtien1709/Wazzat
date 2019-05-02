import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeTimeItem extends BaseView {
    constructor(start_at, finish_at) {
        super(game, null);

        let strTime = "";
        let dateStart = new Date(start_at);
        let dateFinish = new Date(finish_at);

        let dayStart = dateStart.getDate();
        let monthStart = dateStart.getMonth() + 1;
        let yearStart = dateStart.getFullYear();
        let hourStart = dateStart.getHours();
        let minuteStart = dateStart.getMinutes();



        let dayFinish = dateFinish.getDate();
        let monthFinish = dateFinish.getMonth() + 1;
        let yearFinish = dateFinish.getFullYear();
        let hourFinish = dateFinish.getHours();
        let minuteFinish = dateFinish.getMinutes();

        if (dayFinish === dayStart) {
            strTime = hourStart + "h" + minuteStart + " - " + hourFinish + "h" + minuteFinish + " " + dayFinish + "/" + monthFinish + "/" + yearFinish;
        } else {
            strTime = hourStart + "h" + minuteStart + " " + dayStart + "/" + monthStart + " - " + hourFinish + "h" + minuteFinish + " " + dayFinish + "/" + monthFinish + "/" + yearFinish;
        }


        LogConsole.log(dayStart);
        LogConsole.log(monthStart);


        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));

        this.clock = new SpriteBase(this.positionEventMode.selectroom_icon_clock);
        this.clock.x = 0;
        this.clock.y = 2 * MainData.instance().scale;
        this.addChild(this.clock);

        this.txtTime = new TextBase(this.positionEventMode.selectroom_text_time, strTime);
        this.addChild(this.txtTime);
    }

    get width() {
        return this.clock.width + this.txtTime.width + 6 * MainData.instance().scale;
    }
}