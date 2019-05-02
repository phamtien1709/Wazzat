import ControllSound from "../ControllSound.js";

export default class LoadAudioSource {
    constructor() {
        this.loadDataComplete = new Phaser.Signal();
        this.loadDataFail = new Phaser.Signal();
    }
    beginLoadAudio(audioSource) {
        ControllSound.instance().loadSound(audioSource.url);
        ControllSound.instance().event.loadComplete.add(this.loadComplete, this);
        ControllSound.instance().event.loadFail.add(this.loadFail, this);
    }

    loadStart() {
        LogConsole.log('loadStart');
    }

    loadComplete() {
        LogConsole.log('load TT');
        this.loadDataComplete.dispatch();
    }

    loadFail() {
        this.loadDataFail.dispatch();
    }

    addEventLoadComplete(callback, scope) {
        this.loadDataComplete.add(callback, scope);
    }


    removeEventLoadComplete(callback, scope) {
        this.loadDataComplete.remove(callback, scope);
    }

    remove() {
        ControllSound.instance().event.loadComplete.remove(this.loadComplete, this);
    }

}