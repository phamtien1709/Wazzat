import PopupDialogItem from "./item/PopupDialogItem.js";
import BaseView from "../BaseView.js";
import MainData from "../../model/MainData.js";
import EventGame from "../../controller/EventGame.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";

export default class PopupDialog extends BaseView {
    constructor(content = "", url = "") {
        super(game, null);

        this.url = url;

        this.event = {
            OK: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupDialogItem(content);
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = 325 * MainData.instance().scale;
        this.addChild(this.popup);
        this.popup.event.OK.add(this.chooseOk, this);

        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 900 * MainData.instance().scale);
    }

    setContentButton(str) {
        this.popup.setTextButton(str);
    }

    setContent(content) {
        this.popup.setContent(content);
    }

    chooseOk() {
        if (this.url !== "") {
            if (this.url == "maintaince") {
                ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
            }
            else if (this.url == "onSearchFriend") {
                // EventGame.instance().event.clickOKDialog.dispatch();
            } else {
                window.open(this.url);
            }
        }
        EventGame.instance().event.clickOKDialog.dispatch(this.url);
        this.event.OK.dispatch();
    }
}