import DataGenreBeGiven from "./DataGenreBeGiven.js";
import ControllLoadCacheUrl from "../../../view/component/ControllLoadCacheUrl.js";

export default class PlaylistBegivenSprite extends Phaser.Sprite {
    constructor(x, y, genre, indexSprite) {
        super(game, x, y, null);
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        this.indexSprite = indexSprite;
        this.genre = new DataGenreBeGiven();
        this.genre = Object.assign({}, this.genre, genre);
        // LogConsole.log(this.genre);
        this.thumb;
        this.name;
        this.afterInit();
    }

    afterInit() {
        this.addThumb();
        this.addName(this.positionIsNewUserConfig.received.txt_playlist);
    }

    addThumb() {
        this.thumb = new Phaser.Sprite(game, 0, 0, 'otherSprites', 'Nhactre');
        this.thumb.scale.set(165 / 165 * window.GameConfig.RESIZE);
        let maskThumb = new Phaser.Graphics(game, 0, 0);
        maskThumb.beginFill(0xffffff);
        maskThumb.drawRoundedRect(0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE, 165 * window.GameConfig.RESIZE, 165 * window.GameConfig.RESIZE, 10);
        maskThumb.anchor.set(0.5);
        this.thumb.addChild(maskThumb);
        this.thumb.mask = maskThumb;
        this.key;
        this.addChild(this.thumb);
        this.beginLoad(this.genre.thumb);
    }

    beginLoad(url) {
        if (url) {
            this.key = url;
        }
        if (game.cache.checkImageKey(this.key)) {
            this.onLoad();
        } else {
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.key);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            this.thumb.loadTexture(this.key);
        }, this.indexSprite * 100);
    }


    addName(configs) {
        this.name = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.genre.name, configs.configs);
        this.addChild(this.name);
    }
}