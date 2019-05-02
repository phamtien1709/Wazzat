import BaseView from "../../../BaseView.js";
import EventModeClockItem from "./EventModeClockItem.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import EventModeTimeItem from "./EventModeTimeItem.js";
import ImageLoader from "../../../component/ImageLoader.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ButtonScale9WithText from "../../../component/ButtonScale9WithText.js";
import EventModeRoomWinItem from "./EventModeRoomWinItem.js";
import MainData from "../../../../model/MainData.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import Language from "../../../../model/Language.js";

export default class EventModeRoomItem extends BaseView {
    static get STATE_FINISHED() {
        return "FINISHED";
    }
    static get STATE_STARTED() {
        return "STARTED";
    }
    static get STATE_COMING() {
        return "COMING";
    }

    constructor(data, idx = 0) {
        super(game, null);
        this.event = {
            choose_item: new Phaser.Signal(),
            view_history: new Phaser.Signal()
        }
        this.data = data;
        this.positionEventMode = MainData.instance().positionEventMode;

        this.btnChoose = new ButtonBase(this.positionEventMode.selectroom_bg_default, this.chooseEvent, this);
        this.btnChoose.alpha = 0;
        this.addChild(this.btnChoose);

        this.bg = new ImageLoader(this.positionEventMode.selectroom_bg_default.nameAtlas, this.positionEventMode.selectroom_bg_default.nameSprite);
        this.bg.setSize(569 * MainData.instance().scale, 160 * MainData.instance().scale);
        this.bg.beginLoad(this.data.banner, idx);
        this.addChild(this.bg);

        /*
        this.countUser = new ButtonScale9WithText(this.positionEventMode.queueroom_button_count_user, 20);
        this.addChild(this.countUser);*/

        this.bgWin = new EventModeRoomWinItem(this.data.reward_1st);
        this.bgWin.x = 18 * MainData.instance().scale;
        this.bgWin.y = 19 * MainData.instance().scale;
        this.addChild(this.bgWin);

        this.txtNameEvent = new TextBase(this.positionEventMode.selectroom_text_event_name, this.data.name);
        this.addChild(this.txtNameEvent);

        if (this.data.state === EventModeRoomItem.STATE_COMING) {
            this.timeEvent = new EventModeTimeItem(this.data.start_at, this.data.finish_at);
            this.timeEvent.x = 18 * MainData.instance().scale;
            this.timeEvent.y = this.txtNameEvent.y + this.txtNameEvent.height;
            this.addChild(this.timeEvent);
        } else if (this.data.state === EventModeRoomItem.STATE_STARTED) {

            this.countUser = new ButtonScale9WithText(this.positionEventMode.queueroom_button_count_user, this.data.number_user);
            this.addChild(this.countUser);

            this.bgWin.x = 106 * MainData.instance().scale;

            this.clock = new EventModeClockItem();
            this.clock.x = 18 * MainData.instance().scale;
            this.clock.y = this.txtNameEvent.y + this.txtNameEvent.height + 3 * MainData.instance().scale;
            this.clock.setTimer(this.data.finish_at);
            this.addChild(this.clock);
        } else {
            this.txtXemKetqua = new TextBase(this.positionEventMode.selectroom_text_xemketqua, Language.instance().getData("26"));
            this.txtXemKetqua.y = this.txtNameEvent.y + this.txtNameEvent.height + 3 * MainData.instance().scale;
            this.addChild(this.txtXemKetqua);
        }

        if (this.data.vip === true) {
            this.iconVip = new SpriteBase(this.positionEventMode.selectroom_icon_vip);
            this.addChild(this.iconVip);
        }

    }

    setCuu(ccu) {
        if (this.countUser) {
            this.countUser.text = ccu;
        }
    }

    chooseEvent() {
        if (this.data.state === EventModeRoomItem.STATE_STARTED) {
            if (this.clock.getTime() > 5) {
                this.event.choose_item.dispatch(this.data);
            } else {
                ControllScreenDialog.instance().addDialog(Language.instance().getData("27"));
            }
        } else if (this.data.state === EventModeRoomItem.STATE_COMING) {

        } else {
            this.event.view_history.dispatch(this.data.id);
        }
    }

    get width() {
        return 640 * MainData.instance().scale;
    }

    get height() {
        return 160 * MainData.instance().scale;
    }
}