import FieldStatusGame from "../view/turnBase/item/Fields/FieldsStatusGame.js";
import ControllSoundFx from "../controller/ControllSoundFx.js";
import Language from "../model/Language.js";
import ControllLoadCacheUrl from "../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../view/BaseGroup.js";

// import LoaderController from "../common/window.loaderController.js";

export default class SearchedFriend extends BaseGroup {
    constructor(configsValue, index) {
        super(game);
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.index = index;
        this.configsValue = configsValue;
        this.signalInputAva = new Phaser.Signal();
        this.signalInput = new Phaser.Signal();
        this.afterCreate();
    }

    afterCreate() {
        // this._width = defaultSize;
        this.key = '';
        this.ava = new Phaser.Sprite(game, 75 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 'songDetailSprites', 'ava-default');
        this.ava.anchor.set(0.5);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.clickAva, this);
        this.setScale(window.GameConfig.SCALE_AVA_FRIEND * window.GameConfig.RESIZE);
        this.addMaskAva(200);
        //
        this.addChild(this.ava);
        this.addFrameAva();
        this.addNameAva(this.findOpponentConfig.txt_friend_list, this.configsValue.user_name);
        this.setStateFriend();
        this.addBtnPlay(this.findOpponentConfig.btn_play_findGame);
        this.addLineUnder();
        this.beginLoad(this.configsValue.avatar);
    }

    clickAva() {
        this.signalInputAva.dispatch(this.configsValue.id);
    }

    addBtnPlay(configs) {
        // LogConsole.log(this.value);
        if (this.configsValue.friend_status == FieldStatusGame.PENDING_YOU) {
            this.btnInput = new Phaser.Sprite(game, (configs.x + 45) * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
            this.btnInput.inputEnabled = true;
            this.btnInput.anchor.set(0.5);
            this.btnInput.events.onInputUp.add(this.onClickSprite, this);
            let txtBtn = new Phaser.Text(game, this.findOpponentConfig.txt_btn_play_findGame.x * window.GameConfig.RESIZE, (this.findOpponentConfig.txt_btn_play_findGame.y + 2) * window.GameConfig.RESIZE, Language.instance().getData('313'), {
                "font": "GilroyBold",
                "fill": "#ffffff",
                "fontSize": 18
            });
            txtBtn.anchor.set(0.5);
            this.btnInput.addChild(txtBtn);
            this.addChild(this.btnInput);
        } else if (this.configsValue.friend_status == FieldStatusGame.FRIEND) {
            let txt_friended = new Phaser.Text(game, 605 * window.GameConfig.RESIZE, 58 * window.GameConfig.RESIZE, Language.instance().getData("315"), {
                "font": "Gilroy",
                "fill": "#93909d",
                "fontSize": 21
            });
            txt_friended.anchor.set(1, 0.5);
            this.addChild(txt_friended);
        } else if (this.configsValue.friend_status == FieldStatusGame.PENDING_THEM) {
            let txt_their_turn = new Phaser.Text(game, 605 * window.GameConfig.RESIZE, 58 * window.GameConfig.RESIZE, Language.instance().getData("316"), {
                "font": "Gilroy",
                "fill": "#93909d",
                "fontSize": 21
            });
            txt_their_turn.anchor.set(1, 0.5);
            this.addChild(txt_their_turn);
        } else if (this.configsValue.friend_status == FieldStatusGame.NO_FRIEND) {
            this.btnInput = new Phaser.Sprite(game, (configs.x + 45) * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
            this.btnInput.inputEnabled = true;
            this.btnInput.anchor.set(0.5);
            this.btnInput.events.onInputUp.add(this.onClickSprite, this);
            let txtBtn = new Phaser.Text(game, this.findOpponentConfig.txt_btn_play_findGame.x * window.GameConfig.RESIZE, (this.findOpponentConfig.txt_btn_play_findGame.y + 2) * window.GameConfig.RESIZE, Language.instance().getData("317"), {
                "font": "GilroyBold",
                "fill": "#ffffff",
                "fontSize": 18
            });
            txtBtn.anchor.set(0.5);
            this.btnInput.addChild(txtBtn);
            this.addChild(this.btnInput);
        }
    }

    addFrameAva() {
        if (this.configsValue.vip === true) {
            this.frameAva = new Phaser.Sprite(game, 75 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 'vipSource', 'Ava_Opponents_Nho');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(213 / 200);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, 75 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 'playSprites', 'Khung_Ava_Thuong');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(180 / 200);
            this.addChild(this.frameAva);
        }
    }

    addLineUnder() {
        let lineUnder = new Phaser.Sprite(game, (this.findOpponentConfig.line_friend_list.x + 35) * window.GameConfig.RESIZE, this.findOpponentConfig.line_friend_list.y * window.GameConfig.RESIZE, this.findOpponentConfig.line_friend_list.nameAtlas, this.findOpponentConfig.line_friend_list.nameSprite);
        this.addChild(lineUnder);
    }

    addInput(callback, scope) {
        this.removeEventInput(callback, scope);
        this.addEventInput(callback, scope);
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
        this.signalInput.dispatch(this.configsValue.friend_status, this.configsValue.id);
        // this.removeEventInput();
        // LogConsole.log('hehehe');
    }

    addNameAva(configs, name) {
        this.txtName = new Phaser.Text(game, (configs.x + 35) * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, name, configs.configs);
        // this.txtName.anchor.set(0.5, 0);
        this.addChild(this.txtName);
    }

    addMaskAva(size) {
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill();
        this.maskAva.drawCircle(0, 0, size);
        this.maskAva.endFill();
        this.maskAva.anchor.set(0.5);
        this.ava.mask = this.maskAva;
        this.ava.addChild(this.maskAva);
    }

    setStateFriend() {
        if (this.configsValue.is_online == true) {
            this.setStateOnline();
        } else {
            this.setStateOffline();
        }
    }

    setStateOnline() {
        let stateSprite = new Phaser.Sprite(game, 100 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, 'findOpponentSprites', 'Online');
        this.addChild(stateSprite);
    }

    setStateOffline() {
        let stateSprite = new Phaser.Sprite(game, 100 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, 'findOpponentSprites', 'Offline');
        this.addChild(stateSprite);
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
        return 106;
    }
    //
    setValue(value) {
        this.value = value;
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        }, this);
    }

    setScale(scale) {
        this.ava.scale.set(scale);
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
                        } else {
                            this.ava.loadTexture('songDetailSprites', 'ava-default');
                        }
                    }
                } else {

                }
            } catch (error) {

            }
        }, this.index * 100);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }
}