import BaseView from "../../BaseView.js";
import ShopSong from "../../../model/shop/data/ShopSong.js";
import MainData from "../../../model/MainData.js";
import AvatarAlbum from "../../base/AvatarAlbum.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllSound from "../../../controller/ControllSound.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";

export default class OnlineModeItemPlayerListResult extends BaseView {
    constructor(data, idx) {
        super(game, null);
        this.event = {
            play: new Phaser.Signal()
        }

        this.idx = idx;
        this.data = new ShopSong();
        this.data = Object.assign({}, this.data, data);
        this.ktPlay = false;
        this.songListen = null;
        this.btnPlaySound = null;

        this.positionOnlineMode = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist', this.chooseChitiet, this);
        this.bg.alpha = 0;
        this.bg.width = this.width - 180 * MainData.instance().scale;
        this.bg.height = this.height;
        this.bg.x = 180 * MainData.instance().scale;
        this.addChild(this.bg);

        if (data.playerChoose.correct_answer) {
            this.icon_true = new SpriteBase(this.positionOnlineMode.icon_true_result);
        } else {
            this.icon_true = new SpriteBase(this.positionOnlineMode.icon_fail_result);
        }
        this.addChild(this.icon_true);

        this.txtTime = new TextBase(this.positionOnlineMode.text_time_player_list_result, this.financial(data.playerChoose.time) + "s");
        if (data.playerChoose.correct_answer) {
            this.txtTime.changeStyle({
                "fill": "green"
            });
        } else {
            this.txtTime.changeStyle({
                "fill": "red"
            });
        }
        this.txtTime.x = this.icon_true.x + (this.icon_true.width - this.txtTime.width) / 2;
        this.addChild(this.txtTime);


        this.ava = new AvatarAlbum();
        this.ava.setSize(84 * MainData.instance().scale, 84 * MainData.instance().scale);
        this.ava.x = 90 * MainData.instance().scale;
        this.ava.y = 27 * MainData.instance().scale;
        this.ava.beginLoad(this.data.song.thumb, this.idx);
        this.addChild(this.ava);

        this.btnPlaySound = new ButtonBase(this.positionOnlineMode.button_play_sound_player_list_result, this.choosePlaySound, this);
        this.addChild(this.btnPlaySound);

        this.txtNameSong = new TextBase(this.positionOnlineMode.text_name_song_player_list_result, this.formatName(this.data.song.song, 22, true));
        this.txtNameSong.setTextBounds(0, 0, 375 * MainData.instance().scale, 31 * MainData.instance().scale);
        this.addChild(this.txtNameSong);

        this.txtNameCasi = new TextBase(this.positionOnlineMode.text_name_casi_player_list_result, this.data.song.singer);
        this.addChild(this.txtNameCasi);

        this.line = new SpriteBase(this.positionOnlineMode.line_item_player_list);
        this.line.width = this.width - 60 * MainData.instance().scale;
        this.line.x = 35 * MainData.instance().scale;
        this.line.y = this.height;
        this.addChild(this.line);
    }

    stopAudio() {
        this.removeBtnPlay();
        this.btnPlaySound = new ButtonBase(this.positionOnlineMode.button_play_sound_player_list_result, this.choosePlaySound, this);
        this.addChild(this.btnPlaySound);
    }

    chooseChitiet() {
        LogConsole.log("chooseChitiet");
        ControllScreenDialog.instance().addDetailSong(this.data.song);
    }

    choosePlaySound() {
        this.event.play.dispatch(this.data.song.id);
    }

    playSound() {
        LogConsole.log("playSound");
        if (this.ktPlay === false) {
            this.ktPlay = true;
            ControllSound.instance().playsound(this.data.song.listenLink);

        } else {
            ControllSound.instance().resumeSound();
        }

        this.removeBtnPlay();

        this.btnPlaySound = new ButtonBase(this.positionOnlineMode.button_pause_sound_player_list_result, this.choosePauseSound, this);
        this.addChild(this.btnPlaySound);
    }

    removeBtnPlay() {
        if (this.btnPlaySound !== null) {
            this.removeChild(this.btnPlaySound);
            this.btnPlaySound.destroy();
            this.btnPlaySound = null;
        }
    }

    choosePauseSound() {
        this.pauseSound();
    }

    pauseSoundOut() {
        this.ktPlay = false;
        this.stopAudio();
    }

    pauseSound() {
        if (this.ktPlay) {
            ControllSound.instance().pauseSound();
        }
        this.stopAudio();
    }

    get width() {
        return 570 * MainData.instance().scale;
    }
    get height() {
        return 140 * MainData.instance().scale;
    }
}