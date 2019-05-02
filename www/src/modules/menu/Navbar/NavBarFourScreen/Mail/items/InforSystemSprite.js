import SpriteBase from "../../../../../../view/component/SpriteBase.js";
import TextBase from "../../../../../../view/component/TextBase.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class InforSystemSprite extends BaseGroup {
    constructor(messenger) {
        super(game);
        this.positionLoadConfig = JSON.parse(game.cache.getText('positionLoadConfig'));
        this.messenger = messenger;
        this.afterInit();
    }

    afterInit() {
        this.ava;
        this.name;
        this.from;
        this.time;
        this.ava = new SpriteBase(this.positionLoadConfig.mail_system.mailDetail.ava);
        this.addChild(this.ava);
        this.name = new TextBase(this.positionLoadConfig.mail_system.mailDetail.name, this.positionLoadConfig.mail_system.mailDetail.name.text);
        this.addChild(this.name);
        this.from = new TextBase(this.positionLoadConfig.mail_system.mailDetail.from, this.positionLoadConfig.mail_system.mailDetail.from.text);
        this.addChild(this.from);
        //
        var date = new Date;
        date.setTime(this.messenger.created);

        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();

        var year = date.getFullYear();
        var month = date.getMonth(); // beware: January = 0; February = 1, etc.
        var day = date.getDate();
        this.time = new TextBase(this.positionLoadConfig.mail_system.mailDetail.time, `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`);
        this.addChild(this.time);
    }

    get height() {
        return 131 * window.GameConfig.RESIZE;
    }
}