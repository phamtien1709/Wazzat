export default class ControllSoundFx {
    constructor() {
        this.sound = null;
        this.playId = null;
        this.currentLoad = null;
        this.dic = {};
        this.arrSrc = [];
        this.idxLoad = 0;
        this.isLoading = false;
        this.arrsSoundFx = [
            ControllSoundFx.buttonclick,
            ControllSoundFx.dailyreward,
            ControllSoundFx.clickbuttonplayeventmode,
            ControllSoundFx.getrewardsolomode,
            ControllSoundFx.joineventmode,
            ControllSoundFx.losesolomode,
            ControllSoundFx.popupeventmodeend,
            ControllSoundFx.popupfinishachievement,
            ControllSoundFx.popupfinishquest,
            ControllSoundFx.popupinviteroom,
            ControllSoundFx.popuplevelup,
            ControllSoundFx.showranking,
            ControllSoundFx.takereward,
            ControllSoundFx.winturnbase,
            ControllSoundFx.winturnbasepartymode,
            ControllSoundFx.loseturnbasepartymode,
            ControllSoundFx.gameovereventmode,
            ControllSoundFx.streakanswer
        ]
    }
    static instance() {
        if (this.controllSound) {

        } else {
            this.controllSound = new ControllSoundFx();
            // this.arrsSoundFx = [
            //     ControllSoundFx.buttonclick,
            //     ControllSoundFx.dailyreward,
            //     ControllSoundFx.clickbuttonplayeventmode,
            //     ControllSoundFx.getrewardsolomode,
            //     ControllSoundFx.joineventmode,
            //     ControllSoundFx.losesolomode,
            //     ControllSoundFx.popupeventmodeend,
            //     ControllSoundFx.popupfinishachievement,
            //     ControllSoundFx.popupfinishquest,
            //     ControllSoundFx.popupinviteroom,
            //     ControllSoundFx.popuplevelup,
            //     ControllSoundFx.showranking,
            //     ControllSoundFx.takereward,
            //     ControllSoundFx.winturnbase
            // ];
        }

        return this.controllSound;
    }

    static get buttonclick() {
        return "img/sound/soundfx/buttonclick.mp3";
    }
    static get dailyreward() {
        return "img/sound/soundfx/dailyreward.mp3"
    }
    static get clickbuttonplayeventmode() {
        return "img/sound/soundfx/clickbuttonplayeventmode.mp3"
    }
    static get getrewardsolomode() {
        return "img/sound/soundfx/getrewardsolomode.mp3"
    }
    static get joineventmode() {
        return "img/sound/soundfx/joineventmode.mp3"
    }
    static get losesolomode() {
        return "img/sound/soundfx/losesolomode.mp3"
    }
    static get popupeventmodeend() {
        return "img/sound/soundfx/popupeventmodeend.mp3"
    }
    static get loseturnbase() {
        return "img/sound/soundfx/loseturnbasepartymode.mp3"
    }
    static get popupfinishachievement() {
        return "img/sound/soundfx/popupfinishachievement.mp3"
    }
    static get popupfinishquest() {
        return "img/sound/soundfx/popupfinishquest.mp3"
    }
    static get popupinviteroom() {
        return "img/sound/soundfx/popupinviteroom.mp3"
    }
    static get popuplevelup() {
        return "img/sound/soundfx/popuplevelup.mp3"
    }
    static get showranking() {
        return "img/sound/soundfx/showranking.mp3"
    }
    static get takereward() {
        return "img/sound/soundfx/takereward.mp3"
    }
    static get winturnbase() {
        return "img/sound/soundfx/winturnbase.mp3"
    }
    static get winturnbasepartymode() {
        return "img/sound/soundfx/winturnbasepartymode.mp3"
    }
    static get loseturnbasepartymode() {
        return "img/sound/soundfx/loseturnbasepartymode.mp3"
    }
    static get gameovereventmode() {
        return "img/sound/soundfx/gameovereventmode.mp3"
    }

    static get streakanswer() {
        return "img/sound/soundfx/streakanswer.mp3"
    }


    loadSoundArray(arrSrc) {
        if (this.isLoading === false) {
            this.arrSrc = arrSrc;
            this.isLoading = true;
            this.idxLoad = 0;
            this.loadItemInArray(this.arrSrc[this.idxLoad]);
        }
    }

    loadItemInArray(src) {
        // LogConsole.log('loadItemInArray');
        // LogConsole.log(src);
        if (this.dic[src]) {
            this.checkLoadContinuteArray();
        } else {
            this.dic[src] = new Howl({
                src: [src]
            });
            this.dic[src].on('load', () => {

                this.checkLoadContinuteArray();
            });
            this.dic[src].on('loaderror', () => {
                this.checkLoadContinuteArray();
            });
        }
    }
    checkLoadContinuteArray() {

        this.idxLoad++;
        if (this.idxLoad < this.arrSrc.length) {
            this.loadItemInArray(this.arrSrc[this.idxLoad]);
        } else {
            this.isLoading = false;
        }
        this.removeSound();
    }


    beginLoad() {
        LogConsole.log("beginLoad sound -------------------");
        this.loadSoundArray(this.arrsSoundFx);
    }

    playSound(src) {
        if (game.paused === false) {
            if (window.GameConfig.SOUND_FX == true) {
                this.removeSound();
                if ('ctx' in Howler && Howler.ctx !== null) {
                    if (Howler.ctx.state === 'suspended' || Howler.ctx.state === 'interrupted') {
                        Howler.ctx.resume();
                    }
                }
                Howler.mute(false);
                Howler.volume(1);
                Howler._autoResume();

                this.src = src;
                if (this.dic[src]) {
                    this.sound = this.dic[src];
                    this.playId = this.sound.play();
                } else {
                    this.sound = new Howl({
                        src: [src]
                    });
                    this.sound.on('end', () => {
                        // console.log('Finish play');
                    });
                    this.playId = this.sound.play();
                }
            }
        }
    }

    removeSound() {
        if (this.sound !== null && this.playId !== null) {
            this.sound.stop(this.playId);
            this.sound = null;
        }
    }
}