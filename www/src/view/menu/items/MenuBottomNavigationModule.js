import Common from "../../../common/Common.js";
import MailModule from "../../../modules/menu/Navbar/NavBarFourScreen/MailModule.js";
import AddFriendModule from "../../../modules/menu/Navbar/NavBarFourScreen/AddFriendModule.js";
import AjaxServerMail from "../../../common/AjaxServerMail.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import EventGame from "../../../controller/EventGame.js";
import AjaxMessages from "../../../common/AjaxMessages.js";
import MainData from "../../../model/MainData.js";
import BaseGroup from "../../BaseGroup.js";

export default class BottomNavigationModule extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            backMenu: new Phaser.Signal(),
            changeOtherScreen: new Phaser.Signal()
        }
    }
    createButton() {

    }
    createButtonOnNavigation() {
        this.addEventExtension();
        this.shopScreen;
        this.mailScreen;
        this.addFriendScreen;
        this.typeNew;
        this.typeOld = 1;
        //
        this.layoutContent = new Phaser.Group(game);
        this.layoutTop = new Phaser.Group(game);
        this.addChild(this.layoutContent);
        this.addChild(this.layoutTop);
        this.navBG = this.addNavBG();
        this.addChild(this.navBG);
        this.addFourBtnOnNavbar();
        this.buildBtnArray();
        this.addChildBtnToNavBG();
        Common.switchButton(this.btnArray, this.activeBtnArray, this.homeBtn, this.activehomeBtn);
        if (MainData.instance().dataMessagesLocal !== null) {
            this.ajaxCountMessage();
        }
    }
    addFourBtnOnNavbar() {
        //homeBtn
        this.homeBtn = this.addHomeBtn();
        this.activehomeBtn = this.addActiveHomeBtn();
        //mailBtn
        this.mailBtn = this.addMailBtn();
        this.activeMailBtn = this.addActiveMailBtn();
        //shopBtn
        // this.shopBtn = this.addShopBtn();
        // this.activeShopBtn = this.addActiveShopBtn();
        //settingBtn
        this.addFriendBtn = this.addAddFriendBtn();
        this.activeAddFriendBtn = this.addActiveAddFriendBtn();
    }
    addChildBtnToNavBG() {
        this.navBG.addChild(this.homeBtn);
        this.navBG.addChild(this.activehomeBtn);

        this.navBG.addChild(this.activeMailBtn);
        this.navBG.addChild(this.mailBtn);

        // this.navBG.addChild(this.activeShopBtn);
        // this.navBG.addChild(this.shopBtn);

        this.navBG.addChild(this.activeAddFriendBtn);
        this.navBG.addChild(this.addFriendBtn);
    }
    buildBtnArray() {
        this.activeBtnArray = [
            this.activehomeBtn,
            this.activeMailBtn,
            this.activeAddFriendBtn
        ];
        this.btnArray = [
            this.homeBtn,
            this.mailBtn,
            this.addFriendBtn
        ];
    }
    addNavBG() {
        var navBG = new Phaser.Button(game,
            this.positionMenuConfig.menu_bg.x * window.GameConfig.RESIZE,
            game.height - 61 * window.GameConfig.RESIZE,
            this.positionMenuConfig.menu_bg.nameAtlas,
            () => { },
            this,
            null,
            this.positionMenuConfig.menu_bg.nameSprite
        );
        navBG.anchor.set(0.5);
        return navBG;
    }
    //button
    addHomeBtn() {
        let homeBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_home.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_home.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_home.nameAtlas,
            this.onClickHomeBtn,
            this,
            null,
            this.positionMenuConfig.btn_home.nameSprite);
        homeBtn.anchor.set(0.5);
        homeBtn.type = 1;
        return homeBtn;

    }
    onClickHomeBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.homeBtn, this.activehomeBtn);
        this.typeNew = 1;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 1;
    }
    addActiveHomeBtn() {
        //setting_active
        let activehomeBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_home_active.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_home_active.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_home_active.nameAtlas,
            () => { }, this, null,
            this.positionMenuConfig.btn_home_active.nameSprite);
        activehomeBtn.anchor.set(0.5);
        return activehomeBtn;
    }
    addAddFriendBtn() {
        let addFriendBtn = new Phaser.Button(game, this.positionMenuConfig.btn_setting.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_setting.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_setting.nameAtlas,
            this.onClickSettingBtn,
            this,
            null,
            this.positionMenuConfig.btn_setting.nameSprite);
        addFriendBtn.events.onInputUp.add(this.onClickFriendRequestBtn, this);
        addFriendBtn.anchor.set(0.5);
        addFriendBtn.type = 4;
        return addFriendBtn;

    }
    onClickFriendRequestBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Friend_add_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // this.shopScreen.destroy();
        Common.switchButton(this.btnArray, this.activeBtnArray, this.addFriendBtn, this.activeAddFriendBtn);
        this.typeNew = 4;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 4;
        if (this.noti) {
            this.noti.destroy();
        }

    }
    addActiveAddFriendBtn() {
        //setting_active
        let activeSettingBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_setting_active.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_setting_active.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_setting_active.nameAtlas,
            () => { },
            this,
            null, this.positionMenuConfig.btn_setting_active.nameSprite);
        activeSettingBtn.anchor.set(0.5);
        return activeSettingBtn;
    }
    addMailBtn() {
        let mailBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_mail.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_mail.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_mail.nameAtlas,
            this.onClickMailBtn, this, null,
            this.positionMenuConfig.btn_mail.nameSprite
        )
        mailBtn.anchor.set(0.5);
        mailBtn.type = 2;
        return mailBtn;
    }
    onClickMailBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Mail_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.mailBtn, this.activeMailBtn);
        this.typeNew = 2;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 2;
        if (this.notiMail) {
            this.notiMail.destroy();
        }
    }
    addActiveMailBtn() {
        let activeMailBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_mail_active.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_mail_active.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_mail_active.nameAtlas,
            () => { }, this, null,
            this.positionMenuConfig.btn_mail_active.nameSprite
        )
        activeMailBtn.anchor.set(0.5);
        return activeMailBtn;
    }
    addShopBtn() {
        let shopBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_shop.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_shop.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_shop.nameAtlas,
            this.onClickShopBtn, this, null,
            this.positionMenuConfig.btn_shop.nameSprite,
        )
        shopBtn.anchor.set(0.5);
        shopBtn.type = 3;
        return shopBtn;
    }
    onClickShopBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        ControllScreenDialog.instance().addShop(0);
    }
    addActiveShopBtn() {
        let activeShopBtn = new Phaser.Button(game,
            this.positionMenuConfig.btn_shop_active.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_shop_active.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_shop_active.nameAtlas,
            () => { }, this, null,
            this.positionMenuConfig.btn_shop_active.nameSprite,
        )
        activeShopBtn.anchor.set(0.5);
        return activeShopBtn;
    }

    changeScreen(typeNew, typeOld) {
        if (typeNew == 1) {
            this.hideScreen(typeNew, typeOld);
            // this.event.backMenu.dispatch();
            ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        } else if (typeNew == 2) {
            this.mailScreen = new MailModule(0, 0, typeOld);
            this.mailScreen.createMail();
            this.layoutContent.addChild(this.mailScreen);
            this.mailScreen.show();
            this.hideScreen(typeNew, typeOld);
            //
            this.event.changeOtherScreen.dispatch();
        } else if (typeNew == 3) {

        } else if (typeNew == 4) {
            this.addFriendScreen = new AddFriendModule(0, 0, typeOld);
            this.addFriendScreen.createAddFriendScreen();
            this.layoutContent.addChild(this.addFriendScreen);
            this.addFriendScreen.show();
            this.hideScreen(typeNew, typeOld);
            //
            this.event.changeOtherScreen.dispatch();
        }
    }

    hideScreen(typeNew, typeOld) {
        if (typeOld == 1) {
            LogConsole.log("don't do nothing");
        } else if (typeOld == 2) {
            this.mailScreen.hide(typeNew);
        } else if (typeOld == 3) {
            this.shopScreen.hide(typeNew);
        } else if (typeOld == 4) {
            this.addFriendScreen.hide(typeNew);
        }
    }

    addFriendRequest(num) {
        if (num > 0) {
            this.noti = new Phaser.Sprite(game, this.positionMenuConfig.notiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.y * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.nameAtlas, this.positionMenuConfig.notiDot.nameSprite);
            let number = new Phaser.Text(game, this.positionMenuConfig.txtNotiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.txtNotiDot.y * window.GameConfig.RESIZE, num, this.positionMenuConfig.txtNotiDot.configs);
            number.anchor.set(0.5);
            this.noti.addChild(number);
            this.addFriendBtn.addChild(this.noti);
        }
    }

    ajaxCountMessage() {
        if (MainData.instance().dataMessagesLocal !== null) {
            if (MainData.instance().systemMessagesLocal !== null) {
                this.onCountMessageCallback(AjaxMessages.instance().countMessage(MainData.instance().dataMessagesLocal.dataMessages, MainData.instance().systemMessagesLocal.dataMessages));
            }
        }
    }

    onCountMessageCallback(count) {
        this.addMailNoti(count);
    }

    addMailNoti(count) {
        if (count > 0) {
            this.notiMail = new Phaser.Sprite(game, this.positionMenuConfig.notiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.y * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.nameAtlas, this.positionMenuConfig.notiDot.nameSprite);
            let number = new Phaser.Text(game, this.positionMenuConfig.txtNotiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.txtNotiDot.y * window.GameConfig.RESIZE, count, this.positionMenuConfig.txtNotiDot.configs);
            number.anchor.set(0.5);
            this.notiMail.addChild(number);
            this.mailBtn.addChild(this.notiMail);
            // this.activeMailBtn.addChild(this.notiMail);
        }
    }

    addEventExtension() {
        EventGame.instance().event.backButton.add(this.backMenu, this);
        EventGame.instance().event.loadMessagesDone.add(this.loadMessagesDone, this);
    }

    backMenu() {
        this.event.backMenu.dispatch();
        this.removeEventExtension();
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.backMenu, this);
        EventGame.instance().event.loadMessagesDone.remove(this.loadMessagesDone, this);
    }

    loadMessagesDone() {
        this.ajaxCountMessage();
    }

    destroy() {
        // console.log('NavBar back Home');
        this.removeEventExtension();
        // game.time.removeAll();
        // game.time.events.remove(this.timeAjaxCount);
        if (this.children !== null) {
            while (this.children.length > 0) {
                let item = this.children[0];
                this.removeChild(item);
                item.destroy();
                item = null;
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
        super.destroy();
    }
}