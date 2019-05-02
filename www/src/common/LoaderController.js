export default class LoaderController {
    constructor() {
        this.signals = {
            onLoadSourceComplete: new Phaser.Signal()
            // onLoadFriendToChallengeComplete: new Phaser.Signal()
        }
    }

    loadSource(objs) {

        // LogConsole.log(game.cache);
        for (let i = 0; i < objs.length; i++) {
            if (objs[i].url == undefined) {

            } else {
                if (!game.cache.checkImageKey(objs[i].key)) {
                    game.load.image(objs[i].key, objs[i].url);
                    LogConsole.log(objs[i].url);
                }
            }
        }
        game.load.onLoadComplete.add(this.onLoadSourceComplete, this);
        game.load.start();
    }
    ////
    onLoadSourceComplete() {
        LogConsole.log('in');
        this.signals.onLoadSourceComplete.dispatch();
        // game.load.onLoadComplete.remove();
        // game.load.onLoadComplete.add(this.onLoadSourceComplete, this);
    }
    addEventLoadSource(callback, scope) {
        // callback();
        this.signals.onLoadSourceComplete.add(callback, scope);
    }
    removeEventLoadSource(callback, scope) {
        this.signals.onLoadSourceComplete.remove(callback, scope);
    }
}