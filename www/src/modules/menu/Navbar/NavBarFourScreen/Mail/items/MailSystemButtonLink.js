import ButtonBase from "../../../../../../view/component/ButtonBase.js";
import TextBase from "../../../../../../view/component/TextBase.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class MailSystemButtonLink extends BaseGroup {
    constructor(data) {
        super(game)
        this.positionLoadConfig = JSON.parse(game.cache.getText('positionLoadConfig'));
        this.data = data;
        this.eventClickBtn = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.txtDes;
        this.btn;
        this.addTxtDes();
        this.addBtn();
    }

    addTxtDes() {
        this.txtDes = new TextBase(this.positionLoadConfig.system_btn_link.text, this.data.description);
        // this.txtDes.anchor.set(0.5);
        this.addChild(this.txtDes);
    }

    addBtn() {
        this.btn = new ButtonBase(this.positionLoadConfig.system_btn_link, this.onClick, this);
        let txtBtnConfig = {
            "x": this.btn.x + 15,
            "y": this.btn.y + 15,
            "text": "EMAIL",
            "style": {
                "font": "GilroyBold",
                "fill": "#bfbec4",
                "fontSize": 24,
                "align": "center"
            }
        };
        let txtBtn = new TextBase(txtBtnConfig, this.data.name.toUpperCase());
        // txtBtn.anchor.set(0.5);
        this.btn.width = txtBtn.width + 30;
        this.addChild(this.btn);
        this.addChild(txtBtn);
    }

    onClick() {
        this.eventClickBtn.dispatch(this.data);
    }

    get height() {
        return 151;
    }
}