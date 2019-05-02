import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import OnlineModeItemLoadingMeAnswer from "./OnlineModeItemLoadingMeAnswer.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeItemMeAnswer extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.positionOnlineMode = MainData.instance().positionCreateRoom

        this.bg = new SpriteBase(this.positionOnlineMode.bg_me_answer1);
        this.bg.anchor.setTo(0.5, 0.5);
        this.bg.x = this.bg.width / 2;
        this.bg.y = this.bg.height / 2;
        this.addChild(this.bg);

        this.bgWin = new SpriteBase(this.positionOnlineMode.bg_win_me_answer1);
        this.bgWin.anchor.setTo(0.5, 0.5);
        this.bgWin.x = this.bgWin.width / 2;
        this.bgWin.y = this.bgWin.height / 2;
        this.addChild(this.bgWin);

        this.loading = new OnlineModeItemLoadingMeAnswer();
        this.loading.visible = false;
        this.addChild(this.loading);

        this.fail = new SpriteBase(this.positionOnlineMode.bg_me_fail);
        this.fail.x = (this.bgWin.width - this.fail.width) / 2;
        this.fail.y = (this.bgWin.height - this.fail.height) / 2;
        this.addChild(this.fail);

        this.txtTime = new TextBase(this.positionOnlineMode.bg_me_txt_time, "");
        this.addChild(this.txtTime);

        this.setDefault();
    }

    setBeginLoad() {
        this.loading.visible = true;
        this.loading.setBeginLoad();
    }

    setDefault() {
        this.bg.visible = true;
        this.bgWin.visible = false;
        this.fail.visible = false;
        this.txtTime.text = "";
    }

    setData(data) {
        this.bg.visible = false;
        this.bgWin.visible = true;
        this.loading.visible = false;

        if (data.correct_answer) {
            this.txtTime.text = this.financial(data.time);
            this.txtTime.x = (this.bgWin.width - this.txtTime.width) / 2;
            this.txtTime.y = (this.bgWin.height - this.txtTime.height) / 2 + 3 * MainData.instance().scale;
        } else {
            this.fail.visible = true;
        }
    }

    set alpha(_alpha) {
        if (this.children) {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].alpha = _alpha;
            }
        }
    }
}