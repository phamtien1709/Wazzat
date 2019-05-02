import ControllSoundFx from "../controller/ControllSoundFx.js";
import ControllLoadCacheUrl from "../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../view/BaseGroup.js";

// import LoaderController from "../common/window.loaderController.js";

export default class ImageLoader extends BaseGroup {
    constructor(defaultSize, index) {
        super(game);
        this.index = index;
        this.afterCreate(defaultSize);
    }

    afterCreate(defaultSize) {
        this._width = defaultSize;
        this._height = 272 * window.GameConfig.RESIZE;
        this.key = '';
        this.ava = new Phaser.Sprite(game, 0, 0, 'songDetailSprites', 'ava-default');
        this.ava.anchor.set(0.5);
        this.signalInput = new Phaser.Signal();
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.addChild(this.ava);
    }

    addInput(callback, scope) {
        this.removeEventInput(callback, scope);
        this.addEventInput(callback, scope);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.onClickSprite, this);
    }

    addEventInput(callback, scope) {
        // callback();
        this.signalInput.add(callback, scope);
    }
    removeEventInput(callback, scope) {
        this.signalInput.remove(callback, scope);
    }

    onClickSprite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalInput.dispatch(this.value);
        // this.removeEventInput();
        // LogConsole.log('hehehe');
    }

    addNameAva(configs, name) {
        this.txtName = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, name, configs.configs);
        this.txtName.anchor.set(0.5, 0);
        this.addChild(this.txtName);
    }

    addMaskAva(size) {
        this.maskAva.beginFill();
        this.maskAva.drawCircle(this.ava.x, this.ava.y, size);
        this.maskAva.endFill();
        this.ava.mask = this.maskAva;
        this.addChild(this.maskAva);
    }

    setChallenged() {
        this.ava.alpha = 0.7;
        this.txtName.alpha = 0.7;
    }
    //set width and get width
    set width(_width) {
        this._width = _width;
    }

    get width() {
        return this._width;
    }
    set height(_height) {
        this._height = _height;
    }

    get height() {
        return this._height;
    }
    //
    setValue(value) {
        this.value = value;
    }

    setScale(scale) {
        // this.ava.scale.set(scale);
        this.ava.width = 108;
        this.ava.height = 108;
    }

    beginLoad(url) {
        this.key = url;
        if (game.cache.checkImageKey(url)) {
            this.onLoad();
        } else {
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(url);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        setTimeout(() => {
            try {
                if (game.cache.checkImageKey(this.key)) {
                    if (this) {
                        if (this.key !== "") {
                            this.ava.loadTexture(`${this.key}`);
                            this.ava.width = 108;
                            this.ava.height = 108;
                        } else {
                            this.ava.loadTexture('songDetailSprites', 'ava-default');
                        }
                    }
                } else {

                }
            } catch (error) {

            }
        }, this.index * 150);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }
}