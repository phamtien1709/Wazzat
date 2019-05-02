import SocketController from "../SocketController.js";
import ControllSound from "../ControllSound.js";


export default class LoadAllSource {
    constructor() {
        ControllSound.instance().event.loadComplete.add(this.loadSourceComplete, this);
    }

    loadSourceComplete() {
        SocketController.instance().sendLoading(100);
    }

    beginLoad(dataSource) {
        this.dataSource = dataSource;
        let arrSource = [];
        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].type == "audio") {
                arrSource.push(dataSource[i].url);
            }
        }

        ControllSound.instance().loadSoundArray(arrSource);
    }

    loadStart() {
        LogConsole.log("loadStart----------");
    }

    onFileComplete(progress, key, error, loadedFileCount, totalFileCount) {
        LogConsole.log("progress " + progress);
        LogConsole.log("key " + key);
        LogConsole.log("error " + error);
        LogConsole.log("loadedFileCount " + loadedFileCount);
        LogConsole.log("totalFileCount " + totalFileCount);
        SocketController.instance().sendLoading(progress);
    }

    loadComplete() {
        LogConsole.log("loadComplete---------- : ");
        //this.music = new Phaser.Sound(game);
        // game.sound.play(this.dataSource[0].url);
    }

    update() {
        // LogConsole.log("this.loader.progress : " + this.loader.progress); 
    }

}