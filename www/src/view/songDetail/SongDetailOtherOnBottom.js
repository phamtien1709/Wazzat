import ControllSoundFx from "../../controller/ControllSoundFx.js";
import SongDetailScreen from "./SongDetailScreen.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import Language from "../../model/Language.js";

export default class SongDetailOtherOnBottom extends Phaser.Sprite {
    constructor(x, y, configs) {
        super(game, x, y, null);
        this.configsValue = configs;

        this.linkMp3 = "";
        this.linkYoutube = "";

        for (let i = 0; i < this.configsValue.song_links.length; i++) {
            const ele = this.configsValue.song_links[i];
            if (ele.link_type == SongDetailScreen.LINK_ZING_MP3) {
                this.linkMp3 = ele.link;
            }
            if (ele.link_type == SongDetailScreen.LINK_YOUTUBE) {
                this.linkYoutube = ele.link;
            }
        }

        this.songDetailScreenConfig = JSON.parse(game.cache.getText('songDetailScreenConfig'));
        this.txtListenFull;
        this.line;
        this.iconZing;
        this.iconYoutube;
        this.afterInit();
    }

    afterInit() {
        this.addTxtListenFull(this.songDetailScreenConfig.otherOnBottom.txtListenFull);
        this.addLine(this.songDetailScreenConfig.otherOnBottom);
        this.addIconZing(this.songDetailScreenConfig.otherOnBottom.icon_zing);
        this.addIconYoutube(this.songDetailScreenConfig.otherOnBottom.icon_youtube);
    }

    addTxtListenFull(configs) {
        this.txtListenFull = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("261"), configs.configs);
        this.txtListenFull.anchor.set(0.5, 0);
        this.addChild(this.txtListenFull);
    }

    addLine(configs) {
        this.line = new Phaser.Sprite(game, configs.line_long.x * window.GameConfig.RESIZE, configs.line_long.y * window.GameConfig.RESIZE, configs.line_long.nameAtlas, configs.line_long.nameSprite);
        this.line.anchor.set(0.5, 0);
        var line_gradient = new Phaser.Sprite(game, configs.line.x * window.GameConfig.RESIZE, configs.line.y * window.GameConfig.RESIZE, configs.line.nameAtlas, configs.line.nameSprite);
        line_gradient.anchor.set(0.5);
        this.line.addChild(line_gradient);
        this.addChild(this.line);
    }

    addIconZing(configs) {
        this.icon_zing = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.icon_zing.anchor.set(0.5);
        this.icon_zing.inputEnabled = true;
        this.icon_zing.events.onInputUp.add(this.clickZing, this);
        this.addChild(this.icon_zing);
    }

    clickZing() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreenDialog.instance().addDialog("Hệ thống đang phát triển tính năng này. Bạn vui lòng quay lại sau nhé!");
    }

    addIconYoutube(configs) {
        this.icon_youtube = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.icon_youtube.anchor.set(0.5);
        this.icon_youtube.inputEnabled = true;
        this.icon_youtube.events.onInputUp.add(this.clickYoutube, this);
        this.addChild(this.icon_youtube);
    }

    clickYoutube() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        LogConsole.log(`Youtube: ${this.configsValue.songLink}`);
        ControllScreenDialog.instance().addDialog("Hệ thống đang phát triển tính năng này. Bạn vui lòng quay lại sau nhé!");
    }
}