import Common from "../../../common/Common.js";

export default class ItemBoxTextWithLabelOnTheLeft extends Phaser.Sprite {
    constructor(x, y, label, valueText) {
        super(game, x, y, "settingSprites", "Hoso_Box_Ten");
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.label = label;
        this.valueText = valueText;
        this.afterInit();
    }

    afterInit() {
        let baseTrimText = Common.formatName(this.valueText, 21);
        this.valueText = baseTrimText;
        this.labelTxt;
        this.valueTextTxt;
        this.addLabel();
        this.addValueText();
    }

    addLabel() {
        this.label = new Phaser.Text(game, this.positionSetting.setting_profile.lbl_box.x, this.positionSetting.setting_profile.lbl_box.y, this.label, this.positionSetting.setting_profile.lbl_box.style);
        this.addChild(this.label);
    }

    addValueText() {
        this.valueTextTxt = new Phaser.Text(game, this.positionSetting.setting_profile.value_box.x, this.positionSetting.setting_profile.value_box.y, this.valueText, this.positionSetting.setting_profile.value_box.style);
        this.addChild(this.valueTextTxt);
    }
}