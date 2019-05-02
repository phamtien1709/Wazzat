export default class LoadImageSource {
    constructor() {
        this.loadDataComplete = new Phaser.Signal();
    }
    beginLoadImage(imageSource) {

    }

    loadStart() {
    }

    loadComplete() {
        this.loadDataComplete.dispatch();
    }

    addEventLoadComplete(callback, scope) {
        this.loadDataComplete.add(callback, scope);
    }


    removeEventLoadComplete(callback, scope) {
        this.loadDataComplete.remove(callback, scope);
    }

}