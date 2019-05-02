import ControllSoundFx from "../../controller/ControllSoundFx.js";
import ControllSound from "../../controller/ControllSound.js";
import ControllLoadCacheUrl from "../component/ControllLoadCacheUrl.js";

export default class SongDetailSprite extends Phaser.Sprite {
    constructor(x, y, configsValue) {
        super(game, x, y, null);
        this.ava;
        this.btnPlay;
        this.btnPause;
        this.nameSong;
        this.nameSinger;
        this.checkAudioStop = false;
        this.configsValue = configsValue;
        this.songListen;
        this.urlSong = this.configsValue.listenLink;
        this.key = '';
        this.isPlay = false;
        this.tween;
        this.spriteTween;
        // tween-time
        this.songDetailScreenConfig = JSON.parse(game.cache.getText('songDetailScreenConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addAva(this.songDetailScreenConfig.songDetail.ava);
        this.addNameSong(this.songDetailScreenConfig.songDetail.nameSong);
        this.addNameSinger(this.songDetailScreenConfig.songDetail.nameSinger);
        this.loadToPlay();
    }

    loadToPlay() {
        this.checkAudioStop = false;
        if (game.cache.checkSoundKey(this.urlSong)) {
            this.onLoadAudio();
        } else {
            let loader = new Phaser.Loader(game);
            loader.crossOrigin = 'anonymous';
            loader.onLoadComplete.addOnce(this.onLoadAudio, this);
            ControllSound.instance().loadSound(this.urlSong);
            loader.start();
        }
    }

    addAva(configs) {
        this.ava = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.ava.scale.set(1 * window.GameConfig.RESIZE);
        this.ava.anchor.set(0.5, 0);
        this.addChild(this.ava);
        //
        var maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.beginFill(0xffffff);
        maskAva.drawRoundedRect((configs.x - 118) * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, 237 * window.GameConfig.RESIZE, 237 * window.GameConfig.RESIZE, 15);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        this.ava.mask = maskAva;
        this.beginLoad(this.configsValue.thumb);
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
        if (game.cache.checkImageKey(this.key)) {
            this.ava.loadTexture(this.key);
        }
    }

    addBtnPlayAndPause(configs) {
        this.btnPlay = new Phaser.Sprite(game, configs.btn_play.x * window.GameConfig.RESIZE, configs.btn_play.y * window.GameConfig.RESIZE, configs.btn_play.nameAtlas, configs.btn_play.nameSprite);
        this.btnPlay.inputEnabled = true;
        this.btnPlay.events.onInputUp.add(this.onPlay, this);
        this.btnPause = new Phaser.Sprite(game, configs.btn_pause.x * window.GameConfig.RESIZE, configs.btn_pause.y * window.GameConfig.RESIZE, configs.btn_pause.nameAtlas, configs.btn_pause.nameSprite);
        this.btnPause.inputEnabled = true;
        this.btnPause.events.onInputUp.add(this.onPause, this);
        this.btnPause.kill();
        //
        this.addChild(this.btnPlay);
        this.addChild(this.btnPause);
    }

    onPlay() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.isPlay) {
            this.tween.resume();
            ControllSound.instance().resumeSound(this.urlSong);
        } else {
            this.spriteTween = new Phaser.Sprite(game, this.ava.x - 118 * window.GameConfig.RESIZE, this.ava.y + 237 * window.GameConfig.RESIZE, 'otherSprites', 'tween-time');
            this.addChild(this.spriteTween);
            this.tween = game.add.tween(this.spriteTween.scale).to({ x: 27, y: 1 }, 10500, "Linear");
            ControllSound.instance().playsound(this.urlSong);
            this.tween.start();
            this.tween.onComplete.add(this.tweenComplete, this);
            this.checkAudioStop = false;
            this.isPlay = true;
        }
        this.btnPlay.kill();
        this.btnPause.revive();
    }

    onPause() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.tween.pause();
        ControllSound.instance().pauseSound(this.urlSong);
        this.btnPlay.revive();
        this.btnPause.kill();
    }

    onLoadAudio() {
        this.addBtnPlayAndPause(this.songDetailScreenConfig.songDetail);
    }

    tweenComplete() {
        if (this.spriteTween !== null) {
            this.spriteTween.destroy();
            this.spriteTween = null;
            this.stopAudio();
        }
    }

    stopAudio() {
        if (this.checkAudioStop == false) {
            this.checkAudioStop = true;
            this.isPlay = false;
            this.btnPause.kill();
            this.btnPlay.revive();
            ControllSound.instance().removeSound(this.urlSong);
        }
    }

    removeMethod() {
        ControllSound.instance().removeAllSound();
    }

    addNameSong(configs) {
        this.nameSong = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.configsValue.title, configs.configs);
        this.nameSong.anchor.set(0.5, 0);
        this.addChild(this.nameSong);
    }

    addNameSinger(configs) {
        this.nameSinger = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.configsValue.singer, configs.configs);
        this.nameSinger.anchor.set(0.5, 0);
        this.addChild(this.nameSinger);
    }
}