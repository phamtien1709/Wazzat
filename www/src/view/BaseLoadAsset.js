import BaseView from "./BaseView.js";

export default class BaseLoadAsset extends BaseView {
    constructor() {
        super(game, null);
        this.arrResource = [];
        /*
        itemSource = {
            type:"text",
            link:"",
            key:""
        }
        */
        /*
        itemSource = {
            type:"atlas",
            link:"",
            key:"",
            linkJson:""
        }
        */
        /*
       itemSource = {
           type:"spritesheet",
           link:"",
           key:"",
           width:0,
           height:0,
           countFrame:0
       }
       */

    }

    loadResource() {
        for (let i = 0; i < this.arrResource.length; i++) {
            // console.log(this.arrResource[i]);
            let itemSource = this.arrResource[i];
            let type = itemSource.type;
            let link = itemSource.link + `?v=${window.VersionClient}`;
            let key = itemSource.key;

            switch (type) {
                case "text":
                    game.load.text(key, link);
                    break;
                case "image":
                    game.load.image(key, link);
                    break;
                case "atlas":
                    let linkJson = itemSource.linkJson + `?v=${window.VersionClient}`;
                    game.load.atlas(key, link, linkJson, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
                    break;
                case "spritesheet":
                    let width = itemSource.width;
                    let height = itemSource.height;
                    let countFrame = itemSource.countFrame;
                    game.load.spritesheet(key, link, width, height, countFrame);
                    break;
            }
        }
        game.load.onLoadComplete.add(this.loadDataFileComplete, this);
        game.load.start();
    }

    loadDataFileComplete() {
        // console.log("loadDataFileComplete----------");
        game.load.onLoadComplete.remove(this.loadDataFileComplete, this);
        this.loadFileComplete();
    }

    loadFileComplete() {
    }

    removeResource() {
        // console.log("removeResource--------------");
        for (let i = 0; i < this.arrResource.length; i++) {
            let itemSource = this.arrResource[i];
            let type = itemSource.type;
            let key = itemSource.key;
            switch (type) {
                case "text":
                    if (game.cache.checkTextKey(key)) {
                        game.cache.removeText(key);
                    }
                    break;
                case "image":
                    if (game.cache.checkImageKey(key)) {
                        game.cache.removeImage(key);
                    }
                    break;
                case "atlas":
                    if (game.cache.checkImageKey(key)) {
                        game.cache.removeImage(key);
                    }
                    let linkJson = itemSource.linkJson + `?v=${window.VersionClient}`;

                    if (game.cache.checkJSONKey(linkJson)) {
                        game.cache.removeJSON(linkJson);
                    }
                    if (game.cache.checkXMLKey(linkJson)) {
                        game.cache.removeXML(linkJson);
                    }
                    break;
                case "spritesheet":
                    if (game.cache.checkImageKey(key)) {
                        game.cache.removeImage(key);
                    }
                    break;
            }
        }
    }

    destroy() {
        this.removeResource();
        super.destroy();
    }

}