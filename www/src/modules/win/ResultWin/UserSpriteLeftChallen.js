import ImageLoader from "../../../Component/ImageLoader.js";
import SpriteBase from "../../../view/component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import LevelPlaylist from "../../../view/base/LevelPlaylist.js";
import ControllScreenDialog from "../../../view/ControllScreenDialog.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class UserSpriteLeftChallen extends BaseGroup {
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
        this.playlistLevel.x = 140 * window.GameConfig.RESIZE;
        this.playlistLevel.y = 155 * window.GameConfig.RESIZE;
        this.playlistLevel.setData(mapping);
        this.addChild(this.playlistLevel);
    }

    makeTweenAvaLoading() {
        var tween = game.add.tween(this).to({ x: 0 }, 1200, Phaser.Easing.Exponential.Out, false);
        tween.start();
    }

    makeTweenAva() {
        let tweenPlaylistlevel = game.add.tween(this.playlistLevel).to({ y: 200 * window.GameConfig.RESIZE }, 300, "Linear", false);
        tweenPlaylistlevel.start();
        tweenPlaylistlevel.onComplete.add(() => { this.scoreText.revive() }, this);
        this.scoreText.revive();
    }

    makeDefaultScreenNotTween() {
        this.playlistLevel.y = 190 * window.GameConfig.RESIZE;
        this.scoreText.revive();
    }

    addAva() {
        this.ava = new ImageLoader(this.positionWinConfig.avaOpp.x * window.GameConfig.RESIZE, 168 * window.GameConfig.RESIZE, 'ava-default', this.keyAva, 0)
        this.ava.sprite.anchor.set(0.5);
        // this.ava.sprite.scale.set(80 / 200 * window.GameConfig.RESIZE);
        this.ava.sprite.inputEnabled = true;
        this.ava.event.loadAvaDone.add(() => {
            this.ava.sprite.width = 80;
            this.ava.sprite.height = 80;
        }, this);
        this.ava.sprite.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            // ControllWorld.instance().addUserProfile(this.configs.id);
            ControllScreenDialog.instance().addUserProfile(this.configs.id);
        }, this);
        //
        let maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.beginFill(0xffffff);
        maskAva.drawCircle(this.positionWinConfig.avaOpp.x * window.GameConfig.RESIZE, 168 * window.GameConfig.RESIZE, 80);
        maskAva.anchor.set(0.5);
        this.ava.sprite.mask = maskAva;
        this.addChild(maskAva);
        //
        this.addChild(this.ava.sprite);
        //
        if (this.vip === true) {
            this.frameAva = new Phaser.Sprite(game, this.positionWinConfig.avaOpp.x * window.GameConfig.RESIZE, (168 + 2) * window.GameConfig.RESIZE, this.positionWinConfig.frame_ava_vip_left.nameAtlas, this.positionWinConfig.frame_ava_vip_left.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(196 / 200 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, this.positionWinConfig.avaOpp.x * window.GameConfig.RESIZE, 168 * window.GameConfig.RESIZE, this.positionWinConfig.frame_ava_left.nameAtlas, this.positionWinConfig.frame_ava_left.nameSprite);
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(205 / 200 * window.GameConfig.RESIZE);
            this.addChild(this.frameAva);
        }
    }

    addNameAndScore() {
        this.name = new Phaser.Text(game, this.positionWinConfig.nameFBOpp.x * window.GameConfig.RESIZE, 140 * window.GameConfig.RESIZE, this.nameValue, this.positionWinConfig.nameFBOpp.configs);
        this.name.anchor.set(0, 0.5);
        this.addChild(this.name);
        //
        this.scoreText = new Phaser.Text(game, this.positionWinConfig.scoreTextOpp.x * window.GameConfig.RESIZE, 170 * window.GameConfig.RESIZE, this.scoreValue, {
            "font": "GilroyMedium",
            "fill": "#93909d",
            "fontSize": 23
        });
        this.scoreText.anchor.set(0, 0.5);
        this.scoreText.kill();
        this.addChild(this.scoreText);
        if (this.vip == true) {
            this.name.x += 15;
            this.scoreText.x += 15;
        }
    }

    setScore(score) {
        let tweenScore = game.add.tween(this.scoreText).to({ text: score }, 300, "Linear", false);
        tweenScore.start();
        tweenScore.onUpdateCallback(() => {
            // LogConsole.log('vao');
            this.scoreText.text = parseInt(this.scoreText.text);
        }, this);
    }

    addDotOnline() {
        if (this.configs.is_online == true) {
            this.dotOnline = new SpriteBase(this.positionWinConfig.dot_online_left_challen);
        } else {
            this.dotOnline = new SpriteBase(this.positionWinConfig.dot_offline_left_challen);
        }
        this.addChild(this.dotOnline);
    }
}