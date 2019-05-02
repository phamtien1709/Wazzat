import ImageLoader from "../../Component/ImageLoader.js";
import SpriteBase from "../../view/component/SpriteBase.js";
import LevelPlaylist from "../../view/base/LevelPlaylist.js";
import BaseGroup from "../../view/BaseGroup.js";

export default class UserSpriteLeft extends BaseGroup {
    constructor(configs) {
        super(game)
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.configs = configs;
        this.afterInit();
    }

    setPosition() {
        this.x = -this.positionPlayConfig.avaOpp.x * window.GameConfig.RESIZE;
    }

    afterInit() {
        this.maskAva;
        this.ava;
        this.frameAva;
        this.name;
        this.nameValue;
        this.scoreText;
        this.scoreValue;
        this.trueOrFalse;
        this.playlistLevel;
    }

    setAva(keyAva, vip) {
        this.keyAva = keyAva;
        this.vip = vip;
        this.addAva();
    }

    setNameAndScore(name, score) {
        this.nameValue = name;
        this.scoreValue = score;
        this.addNameAndScore();
    }

    setLevelPlaylist(mapping) {
        //145, 324
        this.playlistLevel = new LevelPlaylist();
        this.playlistLevel.x = 78 * window.GameConfig.RESIZE;
        this.playlistLevel.y = this.positionPlayConfig.scoreTextOpp.y * window.GameConfig.RESIZE;
        this.playlistLevel.setData(mapping);
        this.addChild(this.playlistLevel);
    }

    makeTweenAvaLoading() {
        var tween = game.add.tween(this).to({ x: 0 }, 1200, Phaser.Easing.Exponential.Out, false);
        tween.start();
    }

    makeTweenAva() {
        let tweenPlaylistlevel = game.add.tween(this.playlistLevel).to({ y: 310 * window.GameConfig.RESIZE }, 300, "Linear", false);
        tweenPlaylistlevel.start();
        tweenPlaylistlevel.onComplete.add(() => { this.scoreText.revive() }, this);
        //
        this.scoreText.revive();
    }

    makeDefaultScreenNotTween() {
        this.playlistLevel.y = 310 * window.GameConfig.RESIZE;
        this.scoreText.revive();
    }

    addAva() {
        this.ava = new ImageLoader(this.positionPlayConfig.avaOpp.x * window.GameConfig.RESIZE, this.positionPlayConfig.avaOpp.y * window.GameConfig.RESIZE, 'ava-default', this.keyAva, 1);
        this.ava.sprite.anchor.set(0.5);
        // this.ava.sprite.scale.set(window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        this.ava.event.loadAvaDone.add((thumbUrl) => {
            this.ava.sprite.width = 151;
            this.ava.sprite.height = 151;
        }, this);
        //
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill(0xffffff);
        this.maskAva.drawCircle(this.positionPlayConfig.avaOpp.x * window.GameConfig.RESIZE, this.positionPlayConfig.avaOpp.y * window.GameConfig.RESIZE, 151);
        this.maskAva.anchor.set(0.5);
        this.ava.sprite.mask = this.maskAva;
        //
        this.addChild(this.ava.sprite);
        this.addChild(this.maskAva);
        //
        if (this.vip === true) {
            this.frameAva = new Phaser.Sprite(game, this.positionPlayConfig.avaOpp.x * window.GameConfig.RESIZE, (this.positionPlayConfig.avaOpp.y + 2) * window.GameConfig.RESIZE, this.positionPlayConfig.frame_ava_vip_left.nameAtlas, this.positionPlayConfig.frame_ava_vip_left.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(120 / 80 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, this.positionPlayConfig.avaOpp.x * window.GameConfig.RESIZE, this.positionPlayConfig.avaOpp.y * window.GameConfig.RESIZE, this.positionPlayConfig.frame_ava_left.nameAtlas, this.positionPlayConfig.frame_ava_left.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(150 / 80 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        }
    }

    addNameAndScore() {
        this.name = new Phaser.Text(game, this.positionPlayConfig.nameFBOpp.x * window.GameConfig.RESIZE, this.positionPlayConfig.nameFBOpp.y * window.GameConfig.RESIZE, this.nameValue, this.positionPlayConfig.nameFBOpp.configs);
        this.name.anchor.set(0.5);
        this.addChild(this.name);
        //
        this.scoreText = new Phaser.Text(game, this.positionPlayConfig.scoreTextOpp.x * window.GameConfig.RESIZE, this.positionPlayConfig.scoreTextOpp.y * window.GameConfig.RESIZE, this.scoreValue, this.positionPlayConfig.scoreTextOpp.configs);
        this.scoreText.anchor.set(0.5);
        this.scoreText.kill();
        this.addChild(this.scoreText);
        //
    }

    setScore(score) {
        let tweenScore = game.add.tween(this.scoreText).to({ text: score }, 300, "Linear", false);
        tweenScore.start();
        tweenScore.onUpdateCallback(() => {
            this.scoreText.text = parseInt(this.scoreText.text);
        }, this);
    }

    addDotOnline() {
        if (this.configs.is_online == true) {
            this.dotOnline = new SpriteBase(this.positionPlayConfig.dot_online_left);
        } else {
            this.dotOnline = new SpriteBase(this.positionPlayConfig.dot_offline_left);
        }
        this.addChild(this.dotOnline);
    }
}