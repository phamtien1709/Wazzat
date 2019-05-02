import SpriteBase from "../../../view/component/SpriteBase.js";
import LevelPlaylist from "../../../view/base/LevelPlaylist.js";
import ButtonGemAndExp from "../../../view/turnBase/item/button/ButtonGemAndExp.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class UserSpriteRightWin extends BaseGroup {
    constructor(configs) {
        super(game)
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.configs = configs;
        this.afterInit();
    }

    setPosition() {
        this.x = this.positionWinConfig.ava_fb.x * window.GameConfig.RESIZE;
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
        this.dotOnline;
        // this.btnExp;
        // this.btnGem;
        this.btnGemAndExp;
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
        //710, 546
        this.playlistLevel = new LevelPlaylist();
        this.playlistLevel.x = 348 * window.GameConfig.RESIZE;
        this.playlistLevel.y = 272 * window.GameConfig.RESIZE;
        this.playlistLevel.setData(mapping);
        this.addChild(this.playlistLevel);
    }

    makeTweenAvaLoading() {
        var tween = game.add.tween(this).to({ x: 0 }, 1200, Phaser.Easing.Exponential.Out, false);
        tween.start();
    }

    makeTweenAva() {
        let tweenPlaylistlevel = game.add.tween(this.playlistLevel).to({ y: 323 * window.GameConfig.RESIZE }, 300, "Linear", false);
        tweenPlaylistlevel.start();
        tweenPlaylistlevel.onComplete.add(() => { this.scoreText.revive() }, this);
    }

    makeDefaultScreenNotTween() {
        this.playlistLevel.y = 272 * window.GameConfig.RESIZE;
        this.scoreText.revive();
    }

    addAva() {
        //1380 <=> this.positionWinConfig.ava_fb.x
        if (game.cache.checkImageKey(this.keyAva)) {
            this.ava = new Phaser.Sprite(game, this.positionWinConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionWinConfig.ava_fb.y * window.GameConfig.RESIZE, this.keyAva);
        } else {
            this.ava = new Phaser.Sprite(game, this.positionWinConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionWinConfig.ava_fb.y * window.GameConfig.RESIZE, 'songDetailSprites', 'ava-default');
        }
        this.ava.anchor.set(0.5);
        // this.ava.scale.set(80 / 200 * window.GameConfig.RESIZE);
        this.ava.width = 80;
        this.ava.height = 80;
        //
        let maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.beginFill(0xffffff);
        maskAva.drawCircle(this.positionWinConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionWinConfig.ava_fb.y * window.GameConfig.RESIZE, 80);
        maskAva.anchor.set(0.5);
        this.ava.mask = maskAva;
        this.addChild(maskAva);
        //
        this.addChild(this.ava);
        //
        if (this.vip === true) {
            this.frameAva = new Phaser.Sprite(game, (this.positionWinConfig.ava_fb.x + 0) * window.GameConfig.RESIZE, (this.positionWinConfig.ava_fb.y + 3) * window.GameConfig.RESIZE, this.positionWinConfig.frame_ava_vip_right.nameAtlas, this.positionWinConfig.frame_ava_vip_right.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(200 / 200 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, this.positionWinConfig.ava_fb.x * window.GameConfig.RESIZE, this.positionWinConfig.ava_fb.y * window.GameConfig.RESIZE, this.positionWinConfig.frame_ava_right.nameAtlas, this.positionWinConfig.frame_ava_right.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(207 / 200 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        }
    }

    addNameAndScore() {
        this.name = new Phaser.Text(game, this.positionWinConfig.nameFB.x * window.GameConfig.RESIZE, this.positionWinConfig.nameFB.y * window.GameConfig.RESIZE, this.nameValue, this.positionWinConfig.nameFB.configs);
        this.name.anchor.set(1, 0.5);
        this.addChild(this.name);
        //
        this.scoreText = new Phaser.Text(game, this.positionWinConfig.scoreText.x * window.GameConfig.RESIZE, this.positionWinConfig.scoreText.y * window.GameConfig.RESIZE, this.scoreValue, this.positionWinConfig.scoreText.configs);
        this.scoreText.anchor.set(1, 0.5);
        this.scoreText.kill();
        this.addChild(this.scoreText);
        if (this.vip == true) {
            this.name.x -= 15;
            this.scoreText.x -= 15;
        }
    }

    setScore(score) {
        let tweenScore = game.add.tween(this.scoreText).to({ text: score }, 300, "Linear", false);
        tweenScore.start();
        tweenScore.onUpdateCallback(() => {
            this.scoreText.text = parseInt(this.scoreText.text);
        }, this);
    }

    addDotOnline() {
        this.dotOnline = new SpriteBase(this.positionWinConfig.dot_online_right);
        this.addChild(this.dotOnline);
    }

    addBtnWinGemAndExp() {
        this.btnGemAndExp = new ButtonGemAndExp(this.positionWinConfig.btn_gem_exp, 2, 2);
        this.btnGemAndExp.x = 320;
        this.btnGemAndExp.y = 350;
        this.btnGemAndExp.scale.set(0);
        this.addChild(this.btnGemAndExp);
        this.timeTweenBtn = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            let tween = game.add.tween(this.btnGemAndExp.scale).to({ x: 1, y: 1 }, 200, "Linear", true);
            tween.start();
        }, this)
    }

    addBtnLoseGemAndExp() {
        this.btnGemAndExp = new ButtonGemAndExp(this.positionWinConfig.btn_gem_exp, 1, 1);
        this.btnGemAndExp.x = 320;
        this.btnGemAndExp.y = 350;
        this.btnGemAndExp.scale.set(0);
        this.addChild(this.btnGemAndExp);
        this.timeTweenBtn = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            let tween = game.add.tween(this.btnGemAndExp.scale).to({ x: 1, y: 1 }, 200, "Linear", true);
            tween.start();
        }, this)
    }

    destroy() {
        game.time.events.remove(this.timeTweenBtn);
        super.destroy();
    }
}