import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";

export default class ButtonGemAndExp extends Phaser.Button {
    constructor(configs, gem, exp, scope) {
        super(game, 0, 0, configs.tab.nameAtlas, () => { }, scope, null, configs.tab.nameSprite);
        this.configs = configs;
        this.gemCount = gem;
        this.expCount = exp;
        this.anchor.set(0.5);
        this.gem;
        this.exp;
        this.txtGem;
        this.txtExp;
        this.addGemAndExp();
    }

    addGemAndExp() {
        this.gem = new SpriteBase(this.configs.gem);
        this.addChild(this.gem);
        this.exp = new SpriteBase(this.configs.exp);
        this.addChild(this.exp);
        this.txtGem = new TextBase(this.configs.txt1, `+${this.gemCount}`);
        this.addChild(this.txtGem);
        this.txtExp = new TextBase(this.configs.txt2, `+${this.expCount}`);
        this.addChild(this.txtExp);
        //
        let sumGemTxtGem = this.gem.width + this.txtGem.width;
        let sumExpTxtExp = this.exp.width + this.txtExp.width;
        // console.log('dafdsuhfdsoffds');
        // console.log(sumGemTxtGem, sumExpTxtExp);
        this.txtGem.x = (- this.width / 2 - sumGemTxtGem) / 2 + 5 * window.GameConfig.RESIZE;
        this.gem.x = (- this.width / 2 - sumGemTxtGem) / 2 + this.txtGem.width + 10 * window.GameConfig.RESIZE;
        this.txtExp.x = (this.width / 2 - sumExpTxtExp) / 2 - 10 * window.GameConfig.RESIZE;
        this.exp.x = (this.width / 2 - sumExpTxtExp) / 2 + this.txtGem.width - 5 * window.GameConfig.RESIZE;
    }
}