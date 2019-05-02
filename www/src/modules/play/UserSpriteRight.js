import SpriteBase from "../../view/component/SpriteBase.js";
import LevelPlaylist from "../../view/base/LevelPlaylist.js";
import BaseGroup from "../../view/BaseGroup.js";

export default class UserSpriteRight extends BaseGroup {
    constructor(configs) {
        super(game)
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.configs = configs;
        this.afterInit();
    }

    setPosition() {
        this.x = this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE;
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
        //710, 324
        this.playlistLevel = new LevelPlaylist();
        this.playlistLevel.x = 413 * window.GameConfig.RESIZE;
        this.playlistLevel.y = this.positionPlayConfig.scoreText.y * window.GameConfig.RESIZE;
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
        //1380 <=> this.positionPlayConfig.ava_fb.x
        if (game.cache.checkImageKey(this.keyAva)) {
            this.ava = new Phaser.Sprite(game, this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionPlayConfig.ava_fb.y * window.GameConfig.RESIZE, this.keyAva);
        } else {
            this.ava = new Phaser.Sprite(game, this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionPlayConfig.ava_fb.y * window.GameConfig.RESIZE, 'songDetailSprites', 'ava-default');
        }
        this.ava.anchor.set(0.5);
        // this.ava.scale.set(window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        this.ava.width = 151;
        this.ava.height = 151;
        //
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill(0xffffff);
        this.maskAva.drawCircle(this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionPlayConfig.ava_fb.y * window.GameConfig.RESIZE, 151);
        this.maskAva.anchor.set(0.5);
        this.ava.mask = this.maskAva;
        // this.ava.addChild(maskAva);
        //
        this.addChild(this.ava);
        this.addChild(this.maskAva);
        //
        if (this.vip === true) {
            this.frameAva = new Phaser.Sprite(game, this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE, (this.positionPlayConfig.ava_fb.y + 2) * window.GameConfig.RESIZE, this.positionPlayConfig.frame_ava_vip_right.nameAtlas, this.positionPlayConfig.frame_ava_vip_right.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(120 / 80 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, this.positionPlayConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionPlayConfig.ava_fb.y * window.GameConfig.RESIZE, this.positionPlayConfig.frame_ava_right.nameAtlas, this.positionPlayConfig.frame_ava_right.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(150 / 80 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        }
    }

    addNameAndScore() {
        this.name = new Phaser.Text(game, this.positionPlayConfig.nameFB.x * window.GameConfig.RESIZE, this.positionPlayConfig.nameFB.y * window.GameConfig.RESIZE, this.nameValue, this.positionPlayConfig.nameFB.configs);
        this.name.anchor.set(0.5);
        this.addChild(this.name);
        //
        this.scoreText = new Phaser.Text(game, this.positionPlayConfig.scoreText.x * window.GameConfig.RESIZE, this.positionPlayConfig.scoreText.y * window.GameConfig.RESIZE, this.scoreValue, this.positionPlayConfig.scoreText.configs);
        this.scoreText.anchor.set(0.5);
        this.scoreText.kill();
        this.addChild(this.scoreText);
    }

    setScore(score) {
        let tweenScore = game.add.tween(this.scoreText).to({ text: score }, 300, "Linear", false);
        tweenScore.start();
        tweenScore.onUpdateCallback(() => {
            // LogConsole.log('vao');
            this.scoreText.text = parseInt(this.scoreText.text);
        }, this);
        // this.scoreText.setText(score);
    }

    addDotOnline() {
        this.dotOnline = new SpriteBase(this.positionPlayConfig.dot_online_right);
        this.addChild(this.dotOnline);
    }
}