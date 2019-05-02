import ImageLoader from "../../../Component/ImageLoader.js";
import SocketController from "../../../controller/SocketController.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";
import AjaxServerMail from "../../../common/AjaxServerMail.js";
import ItemSettingProfileName from "./ItemSettingProfileName.js";
import ItemDescription from "./ItemDescription.js";
import ControllLoading from "../../ControllLoading.js";
import BaseGroup from "../../BaseGroup.js";

export default class SettingProfileAvatar extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.event = {
            reloadScreen: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.ava;
        this.frameAva;
        this.btnCamera;
        this.name;
        this.description;
        //
        this.addAva();
        this.addFrameAva();
        this.addName();
        this.addDescription();
        this.addBtnCamera();
        this.addEventExtension();
    }
    //
    addEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
    }
    removeEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
    }

    onUpdateUserVars() {
        if (this.urlAvatar !== SocketController.instance().dataMySeft.avatar) {
            this.event.reloadScreen.dispatch();
        }
    }

    addAva() {
        this.urlAvatar = SocketController.instance().dataMySeft.avatar;
        this.ava = new ImageLoader(this.positionSetting.setting_profile.ava.x * window.GameConfig.RESIZE, this.positionSetting.setting_profile.ava.y * window.GameConfig.RESIZE, 'ava-default', SocketController.instance().dataMySeft.avatar, 1);
        this.ava.sprite.scale.set(170 / 200 * window.GameConfig.RESIZE);
        this.ava.sprite.anchor.set(0.5);
        this.addChild(this.ava.sprite);
        var maskAva = new Phaser.Graphics(game, 0, 0);
        // mask.beginFill(0xffffff);
        maskAva.drawCircle(128 * window.GameConfig.RESIZE, 238 * window.GameConfig.RESIZE, 170 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.ava.sprite.mask = maskAva;
    }

    addName() {
        this.name = new ItemSettingProfileName();
        this.addChild(this.name);
    }

    addDescription() {
        this.description = new ItemDescription();
        this.description.event.changeDes.add(this.changeDes, this);
        this.addChild(this.description);
    }

    changeDes() {
        this.event.reloadScreen.dispatch();
    }

    addFrameAva() {
        this.frameAva = new SpriteBase(this.positionSetting.setting_profile.frame_ava);
        this.frameAva.anchor.set(0.5);
        this.addChild(this.frameAva);
    }

    addBtnCamera() {
        this.btnCamera = new ButtonBase(this.positionSetting.setting_profile.btn_camera, this.onClickBtnCam, this);
        this.btnCamera.anchor.set(0.5);
        this.addChild(this.btnCamera);
    }

    onClickBtnCam() {
        this.appendDOMFile();
    }

    setStylesAvaField() {
        let scaleW = game.canvas.getBoundingClientRect().width / game.width;
        let scaleH = game.canvas.getBoundingClientRect().height / game.height;

        let left = (window.innerWidth - game.canvas.getBoundingClientRect().width) / 2;
        //avatarField
        let styles1 = {
            top: game.canvas.getBoundingClientRect().top + 150 * MainData.instance().scale * scaleH + 'px',
            left: left + 250 * MainData.instance().scale * scaleW + 'px',
            width: 300 * MainData.instance().scale * scaleW + 'px',
            height: 85 * MainData.instance().scale * scaleH + 'px',
            position: "absolute",
            "z-index": 1
        }
        styles1["padding-left"] = 10 * MainData.instance().scale * scaleW + "px";
        styles1["padding-right"] = 10 * MainData.instance().scale * scaleW + "px";
        this.setStyleOnElement($('#avatarField'), styles1);
        //preview
        let styles2 = {
            top: game.canvas.getBoundingClientRect().top + 140 * MainData.instance().scale * scaleH + 'px',
            left: game.canvas.getBoundingClientRect().left + 50 * MainData.instance().scale * scaleW + 'px',
            width: 130 * MainData.instance().scale * scaleW + 'px',
            height: 130 * MainData.instance().scale * scaleH + 'px',
            position: "absolute"
        }
        // styles2["padding-left"] = 10 * MainData.instance().scale * scaleW + "px";
        // styles2["padding-right"] = 10 * MainData.instance().scale * scaleW + "px";
        this.setStyleOnElement($('#preview'), styles2);
    }

    setStyleOnElement(element, styles) {
        element.css(styles);
    }

    addFundametal() {
        let objBg = {
            x: 36,
            y: 120,
            nameAtlas: "settingSprites",
            nameSprite: "Hoso_Box_Mota"
        }
        let objSubmit = {
            x: 470,
            y: 110,
            nameAtlas: "defaultSource",
            nameSprite: "Send_Icon",
        }
        let objCancel = {
            x: 570,
            y: -30,
            nameAtlas: "defaultSource",
            nameSprite: "Exit",
        }
        this.bg = new ButtonBase(objBg, () => { }, this);
        this.addChild(this.bg);
        this.btnSubmit = new ButtonBase(objSubmit, this.onSubmit, this);
        this.bg.addChild(this.btnSubmit);
        this.btnCancle = new ButtonBase(objCancel, this.cancleBg, this);
        this.bg.addChild(this.btnCancle);
        this.addTick();
    }

    addTick() {
        this.tick = new SpriteBase(this.positionSetting.setting_account.tick_ava);
        this.tick.kill();
        this.bg.addChild(this.tick);
    }

    cancleBg() {
        this.closeDOM();
        this.btnCancle.destroy();
        this.btnSubmit.destroy();
        this.bg.destroy();
    }

    onSubmit() {
        this.avaRender = $('#getImageDataUrl').attr('src');
        if (this.avaRender !== undefined) {
            // console.log($('#getImageDataUrl').attr('src'));
            //
            ControllLoading.instance().showLoading();
            AjaxServerMail.instance().settingAccount(
                SocketController.instance().socket.mySelf.getVariable('user_id').value,
                SocketController.instance().dataMySeft.user_name,
                SocketController.instance().socket.mySelf.getVariable('gender').value,
                this.avaRender
            );
            AjaxServerMail.instance().sendData(this.onSendAvaDone.bind(this));
        }
    }

    onSendAvaDone(response) {
        console.log('CUONGCUONG')
        console.log(response);
        if (response.code == "ok") {
            this.tick.revive();
            var userVars = [];
            userVars.push(new SFS2X.SFSUserVariable("avatar", response.data.avatar));
            SocketController.instance().socket.send(new SFS2X.SetUserVariablesRequest(userVars));
            ControllLoading.instance().hideLoading();
            SocketController.instance().dataMySeft.setAvatar(response.data.avatar);
        }
        // console.log('SendAvaDone');
    }

    closeDOM() {
        $('#avatarField').remove();
        $('#preview').remove();
    }

    appendDOMFile() {
        this.addFundametal();
        $('#game').append('<input type="file" id="avatarField">');
        $('#game').append('<div id="preview"></div>');
        this.setStylesAvaField();
        // console.log('game.canvas.getBoundingClientRect().width');
        // console.log(game.canvas.getBoundingClientRect().width);
        $('#avatarField').change(function () {
            // console.log("photo file has been chosen");
            //grab the first image in the fileList
            //in this example we are only loading one file.
            // console.log(this.files[0].size);
            if (this.files[0].size > MainData.instance().SIZE_AVA_UPLOAD) {
                alert("photo file has too big size!! Pls choose another.");
            } else {
                renderImage(this.files[0], (fileRender) => {
                    let style = 'width:100px;height:100px';
                    // console.log('appendDOMFile');
                    // console.log(fileRender);
                    // this.avaRender = fileRender;
                    $('#preview').html("<img id='getImageDataUrl' style=" + style + " src='" + fileRender + "' />")
                });
            }
        });
    }

    destroy() {
        this.closeDOM();
        this.removeEventExtension();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}