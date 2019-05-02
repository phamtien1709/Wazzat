import BaseLoasAsset from "./BaseLoasAsset.js";

export default class Test extends BaseLoasAsset {
    constructor() {
        super(game, null);
        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionCreateRoom.json",
                key: "positionCreateRoom"
            },
            {
                type: "atlas",
                link: "img/atlas/createroom.png",
                key: "createroom",
                linkJson: "img/atlas/createroom.json"
            },
            {
                type: "image",
                link: "img/background/bg-playlist.png",
                key: "bg-playlist"
            },
            {
                type: "spritesheet",
                link: "img/atlas/TrueAnswer.png",
                key: "trueanswer",
                width: 180,
                height: 180,
                countFrame: 19
            }
        ];

        this.loadResource();
    }

    loadFileComplete() {
        console.log("loadFileComplete test------------");

        console.log("window.performance.memory ");
        console.log(window.performance.memory.jsHeapSizeLimit / (1024 * 1024));
        console.log(window.performance.memory.totalJSHeapSize / (1024 * 1024));
        console.log(window.performance.memory.usedJSHeapSize / (1024 * 1024));
        // this.destroy();
    }

    destroy() {
        super.destroy();
    }
}