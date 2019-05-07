import MainData from "../../../model/MainData.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";

export default class OnlineModeItemGenres extends Phaser.Button {
    constructor(data, idx, callback, callbackContext) {
        super(game, 0, 0, null, callback, callbackContext);
        this.idx = idx;
        this.data = data;
        LogConsole.log(data);
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        this.positionCreateRoom = MainData.instance().positionCreateRoom;
        this.objSprite = this.positionIsNewUserConfig.chooseMain.genres;
        let dataSprite = this.objSprite["nhac_tre"];

        if (this.objSprite.hasOwnProperty(data.code)) {
            dataSprite = this.objSprite[data.code];
        }
        LogConsole.log(dataSprite);

        this.bgGenres = new SpriteBase(dataSprite);
        this.addChild(this.bgGenres);

        if (data.hasOwnProperty("number_player")) {
            this.countPlayer = new ButtonWithText(this.positionCreateRoom.quickplay_bg_count_player, data.number_player);
        } else {
            this.countPlayer = new ButtonWithText(this.positionCreateRoom.quickplay_bg_count_player, "0");
        }
        this.addChild(this.countPlayer);

        let vx = 0;
        if (this.idx % 2 === 0) {
            this.x = -this.width - 118 * MainData.instance().scale;
            vx = 35 * MainData.instance().scale;
        } else {
            this.x = this.width * 2 + (35 + 26 + 118) * MainData.instance().scale;
            vx = this.width + (35 + 26) * MainData.instance().scale;
        }


    }

    setEffect() {
        LogConsole.log("setEffect" + this.idx);
        let vx = 0;
        if (this.idx % 2 === 0) {
            this.x = -this.width - 118 * MainData.instance().scale;
            vx = 35 * MainData.instance().scale;
        } else {
            this.x = this.width * 2 + (35 + 26 + 118) * MainData.instance().scale;
            vx = this.width + (35 + 26) * MainData.instance().scale;
        }

        game.add.tween(this).to({
            x: vx
        }, 200, Phaser.Easing.Power1, true, 150 + 50 * (this.idx + 1));
    }


    get width() {
        return this.bgGenres.width;
    }

    get height() {
        return this.bgGenres.height;
    }

    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
        this.countPlayer.setText(data.number_player);
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    destroy() {
        super.destroy();
    }
}