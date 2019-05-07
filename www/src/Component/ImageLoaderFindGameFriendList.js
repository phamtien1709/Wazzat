import FieldStatusGame from "../view/turnBase/item/Fields/FieldsStatusGame.js";
import ControllSoundFx from "../controller/ControllSoundFx.js";
import ControllScreenDialog from "../view/ControllScreenDialog.js";
import Language from "../model/Language.js";
import ControllLoadCacheUrl from "../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../view/BaseGroup.js";

export default class ImageLoaderFindGameFriendList extends BaseGroup {
    constructor(oppEnt, index) {
        super(game);
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.oppEnt = oppEnt;
        // console.log('HHEHEHE')
        // console.log(this.oppEnt, index);
        this.index = index;
        this.afterCreate();
    }

    afterCreate() {
        this.signalInputAva = new Phaser.Signal();
        this._height = 106 * window.GameConfig.RESIZE;
        this.key = '';
        this.ava = new Phaser.Sprite(game, 40 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 'songDetailSprites', 'ava-default');
        this.ava.anchor.set(0.5);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.clickAva, this);
        this.signalInput = new Phaser.Signal();
        //
        this.addChild(this.ava);
        this.addFrameAva();
        this.addLineUnder();
    }

    clickAva() {
        this.signalInputAva.dispatch();
        // ControllScreenDialog.instance().addUserProfile(this.oppEnt.id);
    }

    addBtnPlay(configs) {
        if (this.value.status == FieldStatusGame.NO_GAME) {
            this.btnPlay = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
            this.btnPlay.inputEnabled = true;
            this.btnPlay.anchor.set(0.5);
            this.btnPlay.events.onInputUp.add(this.onClickSprite, this);
            let txtBtn = new Phaser.Text(game, this.findOpponentConfig.txt_btn_play_findGame.x * window.GameConfig.RESIZE, this.findOpponentConfig.txt_btn_play_findGame.y * window.GameConfig.RESIZE, Language.instance().getData("24"), this.findOpponentConfig.txt_btn_play_findGame.configs);
            txtBtn.anchor.set(0.5);
            this.btnPlay.addChild(txtBtn);
            this.addChild(this.btnPlay);
        } else if (this.value.status == FieldStatusGame.YOUR_TURN) {
            let txt_your_turn = new Phaser.Text(game, 570 * window.GameConfig.RESIZE, 58 * window.GameConfig.RESIZE, Language.instance().getData("249"), {
                "font": "Gilroy",
                "fill": "#93909d",
                "fontSize": 21
            });
            txt_your_turn.anchor.set(1, 0.5);
            this.addChild(txt_your_turn);
        } else if (this.value.status == FieldStatusGame.THEIR_TURN) {
            let txt_their_turn = new Phaser.Text(game, 570 * window.GameConfig.RESIZE, 58 * window.GameConfig.RESIZE, Language.instance().getData("247"), {
                "font": "Gilroy",
                "fill": "#93909d",
                "fontSize": 21
            });
            txt_their_turn.anchor.set(1, 0.5);
            this.addChild(txt_their_turn);
        } else {

        }
    }

    addFrameAva() {
        if (this.oppEnt.vip === true) {
            this.frameAva = new Phaser.Sprite(game, 40 * window.GameConfig.RESIZE, 57 * window.GameConfig.RESIZE, 'vipSource', 'Ava_Opponents_Nho');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(215 / 200);
            this.addChild(this.frameAva);
        } else {
            this.frameAva = new Phaser.Sprite(game, 40 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, 'playSprites', 'Khung_Ava_Thuong');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(180 / 200);
            this.addChild(this.frameAva);
        }
    }

    addLineUnder() {
        let lineUnder = new Phaser.Sprite(game, this.findOpponentConfig.line_friend_list.x * window.GameConfig.RESIZE, this.findOpponentConfig.line_friend_list.y * window.GameConfig.RESIZE, this.findOpponentConfig.line_friend_list.nameAtlas, this.findOpponentConfig.line_friend_list.nameSprite);
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
        this.signalInput.dispatch({
            id: this.value.id,
            userName: this.value.user_name,
            is_online: this.value.is_online,
            vip: this.value.vip,
            avatar: this.value.avatar
        });
    }

    addNameAva(configs, name) {
        this.txtName = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, name, configs.configs);
        // this.txtName.anchor.set(0.5, 0);
        this.addChild(this.txtName);
    }

    addMaskAva(size) {
        this.maskAva = new Phaser.Graphics(game, 0, 0);
        this.maskAva.beginFill();
        this.maskAva.drawCircle(this.ava.x, this.ava.y, size);
        this.maskAva.endFill();
        this.maskAva.anchor.set(0.5);
        this.ava.mask = this.maskAva;
        this.addChild(this.maskAva);
    }

    setStateFriend() {
        if (this.value.is_online == true) {
            this.setStateOnline();
        } else {
            this.setStateOffline();
        }
    }

    setStateOnline() {
        let stateSprite = new Phaser.Sprite(game, 66 * window.GameConfig.RESIZE, 51 * window.GameConfig.RESIZE, 'findOpponentSprites', 'Online');
        this.addChild(stateSprite);
    }

    setStateOffline() {
        let stateSprite = new Phaser.Sprite(game, 66 * window.GameConfig.RESIZE, 51 * window.GameConfig.RESIZE, 'findOpponentSprites', 'Offline');
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
        return this._height;
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
        this.ava.width = 70;
        this.ava.height = 70;
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
                        this.ava.width = 70;
                        this.ava.height = 70;
                    }
                }
            } catch (error) {

            }
        }, this.index * 100);
    }

    loadStart() {
        LogConsole.log("loadStart");
    }
}