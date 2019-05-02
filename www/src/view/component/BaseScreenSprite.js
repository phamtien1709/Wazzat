export default class BaseScreenSprite extends Phaser.Group {
    constructor() {
        super(game)
        // this.inputEnabled = false;
        this.arrResource = [];
    }

    loadResource() {
        for (let i = 0; i < this.arrResource.length; i++) {
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

        game.load.onLoadComplete.add(this.loadFileComplete, this);
        game.load.start();
    }

    loadFileComplete() {
        game.load.onLoadComplete.remove(this.loadFileComplete, this);
        this.onLoadFileComplete();
    }

    onLoadFileComplete() {
        // console.log('GOGOGOGOGOG');
    }

    removeResource() {
        for (let i = 0; i < this.arrResource.length; i++) {
            let itemSource = this.arrResource[i];
            let type = itemSource.type;
            let link = itemSource.link + `?v=${window.VersionClient}`;
            let key = itemSource.key;
            switch (type) {
                case "text":
                    console.log("remove text : " + key);
                    if (game.cache.checkTextKey(key)) {
                        console.log("da xoa");
                        game.cache.removeText(key);
                    }
                    break;
                case "image":
                    console.log("remove image : " + key);
                    if (game.cache.checkImageKey(key)) {
                        console.log("da xoa");
                        game.cache.removeImage(key);
                    }
                    break;
                case "atlas":
                    console.log("remove atlas : " + key);
                    if (game.cache.checkImageKey(key)) {
                        console.log("da xoa image");
                        game.cache.removeImage(key);
                    }

                    let linkJson = itemSource.linkJson + `?v=${window.VersionClient}`;

                    if (game.cache.checkJSONKey(linkJson)) {
                        console.log("da xoa json");
                        game.cache.checkJSONKey(linkJson);
                    }
                    if (game.cache.checkXMLKey(linkJson)) {
                        console.log("da xoa xml");
                        game.cache.checkXMLKey(linkJson);
                    }
                    break;
                case "spritesheet":
                    console.log("remove spritesheet : " + key);
                    if (game.cache.checkImageKey(key)) {
                        console.log("da xoa image");
                        game.cache.removeImage(key);
                    }
                    break;
            }
        }
    }

    destroy() {
        this.removeResource();
        super.destroy();
        console.log(game.cache);
    }

}