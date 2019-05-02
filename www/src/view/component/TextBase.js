import MainData from "../../model/MainData.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";

const defaultOptions = {
    font: "Gilroy",
    fontSize: 40 * MainData.instance().scale,
    fill: "white",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "middle"
}
export default class TextBase extends Phaser.Text {
    constructor(objConfig, lbDes) {
        super(game, objConfig.x * MainData.instance().scale, objConfig.y * MainData.instance().scale, lbDes,
            Object.assign({}, defaultOptions, objConfig.style));
        this.changeStyle(objConfig.style);

    }

    setButton(callback, scope) {
        this.onInputUp = new Phaser.Signal();

        this.onInputUp.add(callback, scope);

        this.inputEnabled = true;

        this.events.onInputOver.add(this.over, this);
        this.events.onInputOut.add(this.out, this);
        this.events.onInputDown.add(this.down, this);
        this.events.onInputUp.add(this.up, this);
    }

    over(item) {
        LogConsole.log("over text button");
    }

    out(item) {
        LogConsole.log("out text button");
    }

    down(item) {
        LogConsole.log("down text button");
    }

    up(item) {
        LogConsole.log("up text button");
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);

        this.onInputUp.dispatch(item);
    }


    changeStyle(style) {
        // LogConsole.log(this);
        let style1 = {};
        for (let pro in style) {
            if (pro === "maxLines") {

            } else {
                if (Number.isFinite(style[pro])) {
                    style1[pro] = style[pro] * MainData.instance().scale;
                } else {
                    style1[pro] = style[pro];
                }
            }
        }
        style1 = Object.assign({}, this.style, style1);
        //LogConsole.log("changeStyle : ");
        //LogConsole.log(style1);
        this.setStyle(style1);
    }
}