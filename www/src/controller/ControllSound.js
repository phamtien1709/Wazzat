import PlayingLogic from "./PlayingLogic.js";

export default class ControllSound {
    constructor() {
        this.sound = null;
        this.playId = null;
        this.isLoading = false;
        this.src = "";
        this.event = {
            loadComplete: new Phaser.Signal(),
            playSoundComplete: new Phaser.Signal(),
            loadFail: new Phaser.Signal()
        }
        this.currentLoad = null;
        this.dic = {};
        this.arrSrc = [];
        this.idxLoad = 0;
        this.idDelayCall = null;
    }

    static instance() {
        if (this.controllSound) {

        } else {
            this.controllSound = new ControllSound();
        }

        return this.controllSound;
    }

    loadSound(src) {

        console.log("loadSound : ------- : " + src);
        this.dic[src] = new Howl({
            src: [PlayingLogic.instance().genUrlSound(src)]
        });
        this.dic[src].once('load', (evt) => {
            this.event.loadComplete.dispatch();
        });

        this.dic[src].once('loaderror', () => {
            console.log("load fail------------------- : " + src);
            this.loadSound(src);
            this.event.loadFail.dispatch();
            // goi han bao loi bai hat
        });

    }

    loadSoundArray(arrSrc) {
        if (this.isLoading === false) {

            this.src = "";
            this.arrSrc = arrSrc;
            this.isLoading = true;
            this.idxLoad = 0;
            this.loadItemInArray(this.arrSrc[this.idxLoad]);

            this.removeDelayCall();
            this.idDelayCall = game.time.events.add(Phaser.Timer.SECOND * 30, this.callLoadFail, this);
        }
    }

    removeDelayCall() {
        if (this.idDelayCall !== null) {
            game.time.events.remove(this.idDelayCall);
            this.idDelayCall = null;
        }
    }

    callLoadFail() {
        this.event.loadFail.dispatch();
        this.removeAllSound();
    }

    loadItemInArray(src) {
        // LogConsole.log('loadItemInArray');
        // LogConsole.log(src);

        if (this.dic[src]) {
            this.checkLoadContinuteArray();
        } else {
            this.dic[src] = new Howl({
                src: [PlayingLogic.instance().genUrlSound(src)]
            });
            this.dic[src].once('load', () => {
                this.checkLoadContinuteArray();
            });
            this.dic[src].once('loaderror', () => {
                this.idxLoad--;
                this.checkLoadContinuteArray();
            });
        }
    }
    checkLoadContinuteArray() {
        LogConsole.log('cccccccheckLoadContinuteArray');
        this.idxLoad++;
        if (this.idxLoad < this.arrSrc.length) {
            this.loadItemInArray(this.arrSrc[this.idxLoad]);
        } else {
            LogConsole.log('checkLoadContinuteArray');
            this.isLoading = false;
            this.event.loadComplete.dispatch();
            this.removeDelayCall();
        }
        //this.removeSound();
    }

    playsound(src) {
        if (game.paused === false) {
            this.removeSound();

            this.src = src;

            console.log(" playsound :  " + this.src);
            console.log(this.dic);


            if ('ctx' in Howler && Howler.ctx !== null) {
                if (Howler.ctx.state === 'suspended' || Howler.ctx.state === 'interrupted') {
                    Howler.ctx.resume();
                }
            }

            Howler.mute(false);
            Howler.volume(1);
            Howler._autoResume();

            if (this.dic.hasOwnProperty(src)) {
                console.log("load roi ---------");
                this.sound = this.dic[src];
                this.playId = this.sound.play();
            } else {
                console.log("chua load ---------");
                this.sound = this.dic[src] = new Howl({
                    src: [PlayingLogic.instance().genUrlSound(src)]
                });
                this.sound.once('end', () => {
                    console.log('Finish play');
                });
                this.playId = this.sound.play();
            }

        }
    }

    pauseSound() {
        if (game.paused === false) {
            if (this.sound != null) {
                this.sound.pause(this.playId);
            }
        }
    }

    resumeSound() {
        if (game.paused === false) {
            if (this.sound != null) {
                this.sound.play(this.playId);
            }
        }
    }


    removeAllSound() {

        console.log("removeAllSound--------");

        for (let src in this.dic) {
            let soundCheck = this.dic[src];
            soundCheck.stop();
            soundCheck.unload();
            soundCheck = null;
        }
        this.dic = {};
        this.isLoading = false;
        this.removeSound();
        this.src = "";

        if (this.currentLoad !== null) {
            this.currentLoad.stop(this.playId);
            this.currentLoad.unload();
            this.currentLoad = null;
        }
    }

    removeSound() {
        console.log("removeSound : " + this.src);
        if (this.sound !== null) {
            this.sound.stop(this.playId);
            this.sound.unload();
            this.sound = null;
        }

        if (this.src !== "" && this.dic[this.src]) {
            let soundCheck = this.dic[this.src];
            soundCheck.stop();
            soundCheck.unload();
            soundCheck = null;
            delete this.dic[this.src];
            this.src = "";
        }
    }

    removeSoundFromUrl(url) {
        console.log("removeSoundFromUrl---------------- : " + url);
        if (url !== "" && this.dic[url]) {
            let soundCheck = this.dic[url];
            soundCheck.stop();
            soundCheck.unload();
            soundCheck = null;

            delete this.dic[url];
        }
    }
}