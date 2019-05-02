import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import ResultWinItemSprite from "../../../../modules/win/ResultWin/ResultWinItemSprite.js";
import SongDetailScreen from "../../../songDetail/SongDetailScreen.js";
import BaseView from "../../../BaseView.js";
import ControllSound from "../../../../controller/ControllSound.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";

export default class ButtonSongResult extends Phaser.Sprite {
    constructor(configValues, result, opponentResult = null, index) {
        super(game, 285, 0, null);
        this.configValues = configValues;
        this.result = result;
        this.opponentResult = opponentResult;
        this.inputEnabled = true;
        this.ktPlay = false;
        this.index = index;
        this.anchor.set(0.5, 0);
        this.event = {
            playSound: new Phaser.Signal(),
            pauseSound: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        let scopeSongDetail = new Phaser.Button(game, -114, 0, 'otherSprites', () => {
            let songDetail = new SongDetailScreen(this.configValues);
            ControllScreenDialog.instance().addChild(songDetail);
        }, this, null, 'Song_Result');
        this.addChild(scopeSongDetail);
        let line_box_win = new Phaser.Sprite(game, 0, (135) * window.GameConfig.RESIZE, 'otherSprites', 'line-box-win');
        line_box_win.anchor.set(0.5);
        this.addChild(line_box_win);
        //-160,114, 230
        this.imgAlbum = new ResultWinItemSprite(-160 * window.GameConfig.RESIZE, (70) * window.GameConfig.RESIZE, this.configValues);
        this.imgAlbum.loadAva(this.configValues.thumb, this.index);
        this.imgAlbum.inputEnabled = true;
        this.imgAlbum.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            if (this.ktPlay == true) {
                this.pauseSound();
            } else {
                this.event.playSound.dispatch(this.index);
            }
            // this.imgAlbum.playSound();
        }, this);
        //
        let maskAlbum = new Phaser.Graphics(game, 0 * window.GameConfig.RESIZE, 0 * window.GameConfig.RESIZE);
        maskAlbum.beginFill(0xffffff);
        maskAlbum.drawRoundedRect(-(220 / 2) * window.GameConfig.RESIZE, -(220 / 2) * window.GameConfig.RESIZE, 220 * window.GameConfig.RESIZE, 220 * window.GameConfig.RESIZE, 10);
        maskAlbum.anchor.set(0.5);
        this.imgAlbum.mask = maskAlbum;
        this.imgAlbum.addChild(maskAlbum);
        let nameSong = this.configValues.song;
        let baseTrimText = new BaseView();
        nameSong = baseTrimText.formatName(nameSong, 21);
        //-99, 95
        let txt_song = new Phaser.Text(game, -99 * window.GameConfig.RESIZE, (55) * window.GameConfig.RESIZE, `${nameSong}`, {
            font: `Gilroy`,
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: 500,
            maxLines: 1,
            fontSize: 22
        });
        txt_song.anchor.set(0, 0.5);
        this.addChild(txt_song);
        let txt_singer = new Phaser.Text(game, -99 * window.GameConfig.RESIZE, (81) * window.GameConfig.RESIZE, `${this.configValues.singer}`, {
            font: `Gilroy`,
            fill: "#93909d",
            fontSize: 19
        });
        txt_singer.anchor.set(0, 0.5);
        this.addChild(txt_singer);
        if (this.result.result.toUpperCase() == "CORRECT") {
            let correct = game.add.sprite(230 * window.GameConfig.RESIZE, (51) * window.GameConfig.RESIZE, 'otherSprites', 'v_icon');
            correct.anchor.set(0.5);
            this.addChild(correct);
            let txt_correct = new Phaser.Text(game, 230 * window.GameConfig.RESIZE, (77) * window.GameConfig.RESIZE, `${this.result.answer_time.toFixed(1)}s`, {
                font: `GilroyMedium`,
                fill: "#07cf81",
                fontSize: 17
            });
            txt_correct.anchor.set(0.5);
            this.addChild(txt_correct);
        } else {
            let wrong = game.add.sprite(230 * window.GameConfig.RESIZE, (51) * window.GameConfig.RESIZE, 'otherSprites', 'x_icon');
            wrong.anchor.set(0.5);
            this.addChild(wrong);
            let txt_wrong = new Phaser.Text(game, 230 * window.GameConfig.RESIZE, (77) * window.GameConfig.RESIZE, `${this.result.answer_time.toFixed(1)}s`, {
                font: `GilroyMedium`,
                fill: "#ff1d58",
                fontSize: 17
            });
            txt_wrong.anchor.set(0.5);
            this.addChild(txt_wrong);
        }
        //
        if (this.opponentResult !== null) {
            if (this.opponentResult.result.toUpperCase() == "CORRECT") {
                let correct = game.add.sprite(-230 * window.GameConfig.RESIZE, (51) * window.GameConfig.RESIZE, 'otherSprites', 'v_icon');
                correct.anchor.set(0.5);
                this.addChild(correct);
                let txt_correct = new Phaser.Text(game, -230 * window.GameConfig.RESIZE, (77) * window.GameConfig.RESIZE, `${this.opponentResult.answer_time.toFixed(1)}s`, {
                    font: `GilroyMedium`,
                    fill: "#07cf81",
                    fontSize: 17
                });
                txt_correct.anchor.set(0.5);
                this.addChild(txt_correct);
            } else {
                let wrong = game.add.sprite(-230 * window.GameConfig.RESIZE, (51) * window.GameConfig.RESIZE, 'otherSprites', 'x_icon');
                wrong.anchor.set(0.5);
                this.addChild(wrong);
                let txt_wrong = new Phaser.Text(game, -230 * window.GameConfig.RESIZE, (77) * window.GameConfig.RESIZE, `${this.opponentResult.answer_time.toFixed(1)}s`, {
                    font: `GilroyMedium`,
                    fill: "#ff1d58",
                    fontSize: 17
                });
                txt_wrong.anchor.set(0.5);
                this.addChild(txt_wrong);
            }
        }
        //
        this.addChild(this.imgAlbum);
    }

    pauseSound() {
        this.ktPlay = false;
        this.imgAlbum.stopSound();
        ControllSound.instance().pauseSound();
    }

    stopSound() {
        this.ktPlay = false;
        this.imgAlbum.stopSound();
    }

    playSound() {
        if (this.ktPlay === false) {
            this.ktPlay = true;
            ControllSound.instance().playsound(this.configValues.listenLink);
            this.imgAlbum.playsound();
        }
    }

    get height() {
        return 135;
    }
}