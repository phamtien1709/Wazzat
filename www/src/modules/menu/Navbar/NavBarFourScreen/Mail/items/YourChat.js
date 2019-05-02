import TextBase from "../../../../../../view/component/TextBase.js";
import SpriteScale9Base from "../../../../../../view/component/SpriteScale9Base.js";
import ChatScreen from "../screen/ChatScreen.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class YourChat extends BaseGroup {
    constructor(text, timeValue, isLastMess) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        if ((text == ":)") || (text == "(:")) {
            this.txtMess = "(smile)";
        } else if ((text == ":(") || (text == "):")) {
            this.txtMess = "(sad)";
        } else this.txtMess = text;
        this.timeValue = timeValue;
        this.checkShowTime = false;
        this.isLastMess = isLastMess;
        this.index = 0;
        this.event = {
            showTime: new Phaser.Signal(),
            hideTime: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.bgText = new Phaser.Group(game)
        this.addChild(this.bgText);
        this.text = new TextBase(this.positionMenuConfig.chat_screen.txt_mess, this.txtMess);
        this.addChild(this.text);
        //
        var configSpaceBox = 40 * window.GameConfig.RESIZE;
        var configWidth = 70 * window.GameConfig.RESIZE;
        this.configHeight = 40 * window.GameConfig.RESIZE;
        var options = {
            "x": 35,
            "y": 22,
            "nameAtlas": "mailSprites",
            "nameSprite": "R_Chat_Violet",
            "left": 25,
            "right": 25,
            "top": 25,
            "bot": 25,
            "width": 0,
            "height": 0,
            "name": "messageYour"
        };
        // LogConsole.log("width:" + this.text.width);
        // LogConsole.log("height:" + this.text.height);
        options.width = (this.text.width + configSpaceBox) / window.GameConfig.RESIZE;
        options.height = (this.text.height + configSpaceBox) / window.GameConfig.RESIZE;
        this.bg = new SpriteScale9Base(options);
        this.bgText.addChild(this.bg);
        this.text.x = this.bg.x + configSpaceBox / 2;
        this.text.y = this.bg.y + configSpaceBox / 2;
        //
        this.addTimeSent();
        // this.height = this.bg.height + configHeight;
        if (this.isLastMess == true) {
            this.height = this.bg.height + this.configHeight;
        } else {
            this.height = this.bg.height + 3;
        }
        this.width = this.bg.width + configWidth;
        this.bgText.x = window.GameConfig.GAME_WIDTH - this.width;
        this.text.x += window.GameConfig.GAME_WIDTH - this.width;
        //
        this.bg.inputEnabled = true;
        this.bg.events.onInputUp.add(this.showTime, this);
    }

    showTime() {
        // LogConsole.log('showTime');
        if (this.checkShowTime == false) {
            // this.height = this.bg.height + 45;
            this.event.showTime.dispatch(this.index);
            this.txtTime.revive();
            this.checkShowTime = true;
        } else {
            // this.height = this.bg.height + 3;
            this.event.hideTime.dispatch(this.index);
            this.txtTime.kill();
            this.checkShowTime = false;
        }
    }

    setPosMess(messBefore) {
        if (messBefore !== undefined) {
            if (messBefore.type == ChatScreen.THEIR_MESS) {
                this.height = this.bg.height + this.configHeight;
            }
        } else {
            this.height = this.bg.height + this.configHeight;
        }
    }

    addTimeSent() {
        this.timeValue = this.handleTime();
        // LogConsole.log(this.timeValue);  // =  [DD-MM-YYYY, HH:MM]
        this.txtTime = new Phaser.Text(game, this.positionMenuConfig.chat_screen.txt_mess_time.x * window.GameConfig.RESIZE, this.bg.height + this.positionMenuConfig.chat_screen.txt_mess_time.y * window.GameConfig.RESIZE, `${this.timeValue[1]} - ${this.timeValue[0]}`, this.positionMenuConfig.chat_screen.txt_mess_time.style);
        this.addChild(this.txtTime);
        this.txtTime.kill();
    }

    handleTime() {
        let timeValue = new Date(this.timeValue);
        //
        let timeGet = timeValue.toISOString().split('T');
        timeGet[1] = timeGet[1].split('.000Z');
        timeGet[1] = timeGet[1][0];
        let DMY = timeGet[0];
        let HM = timeGet[1];;
        return [DMY, HM];
    }
    //set width and get width
    set width(_width) {
        this._width = _width;
    }

    get width() {
        return this._width;
    }
    set height(_height) {
        this._height = _height;
    }

    get height() {
        return this._height;
    }
}