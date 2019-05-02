import Common from '../../../../common/Common.js';
import ShopPlayListView from '../../../../view/shop/ShopPlayListView.js';
import KeyBoard from '../../../../view/component/KeyBoard.js';
import ShopPlaylist from './Shop/ShopPlaylist.js';
import ShopDiamond from './Shop/ShopDiamond.js';
import ShopGift from './Shop/ShopGift.js';
import ShopVip from './Shop/ShopVip.js';
import ControllSoundFx from '../../../../controller/ControllSoundFx.js';
export default class ShopModule extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 3;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.afterInit();
    }

    afterInit() {
        this.typeNew;
        this.typeOld;
        this.shopPlaylist;
        this.shopDiamod;
        this.shopGift;
        this.shopVip;
        // this.createShop();
    }

    createShop() {
        this.layoutContent = new Phaser.Group(game, 0, 0)
        this.addChild(this.layoutContent);
        /*
        addNavbar of Shop
        */
        // this.addScreenType(1);
        this.addButtonOnNavbarShop();
    }

    addButtonOnNavbarShop() {
        //playlistBtn
        this.addPlaylistBtn();
        this.addActivePlaylistBtn();
        //diamond
        this.addDiamondBtn();
        this.addActiveDiamondBtn();
        //gift
        this.addGiftBtn();
        this.addActiveGiftBtn();
        //vip
        this.addVipBtn();
        this.addActiveVipBtn();
        //
        this.buildBtnArray();
        Common.switchButton(this.btnArray, this.activeBtnArray, this.playlistBtn, this.activePlaylistBtn);
    }

    buildBtnArray() {
        this.activeBtnArray = [
            this.activePlaylistBtn,
            this.activeDiamondBtn,
            this.activeGiftBtn,
            this.activeVipBtn
        ];
        this.btnArray = [
            this.playlistBtn,
            this.diamondBtn,
            this.giftBtn,
            this.vipBtn
        ];
    }

    //playlistBtn
    addPlaylistBtn() {
        this.playlistBtn = new Phaser.Sprite(game, 0, 0, 'playlist-playlist-shop');
        this.playlistBtn.inputEnabled = true;
        this.playlistBtn.events.onInputUp.add(this.onClickPlaylistBtn, this);
        this.addChild(this.playlistBtn);
    }

    onClickPlaylistBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.playlistBtn, this.activePlaylistBtn);
        this.typeNew = 1;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 1;
    }

    addActivePlaylistBtn() {
        this.activePlaylistBtn = new Phaser.Sprite(game, 0, 0, 'playlist-active-playlist-shop');
        this.addChild(this.activePlaylistBtn);
    }

    //diamondBtn
    addDiamondBtn() {
        this.diamondBtn = new Phaser.Sprite(game, 270, 0, 'diamond-playlist-shop');
        this.diamondBtn.inputEnabled = true;
        this.diamondBtn.events.onInputUp.add(this.onClickDiamondBtn, this);
        this.addChild(this.diamondBtn);
    }

    onClickDiamondBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.diamondBtn, this.activeDiamondBtn);
        this.typeNew = 2;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 2;
    }

    addActiveDiamondBtn() {
        this.activeDiamondBtn = new Phaser.Sprite(game, 270, 0, 'diamond-active-playlist-shop');
        this.addChild(this.activeDiamondBtn);
    }

    //addGiftBtn
    addGiftBtn() {
        this.giftBtn = new Phaser.Sprite(game, 540, 0, 'gif-playlist-shop');
        this.giftBtn.inputEnabled = true;
        this.giftBtn.events.onInputUp.add(this.onClickGiftBtn, this);
        this.addChild(this.giftBtn);
    }

    onClickGiftBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.giftBtn, this.activeGiftBtn);
        this.typeNew = 3;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 3;
    }

    addActiveGiftBtn() {
        this.activeGiftBtn = new Phaser.Sprite(game, 540, 0, 'gif-active-playlist-shop');
        this.addChild(this.activeGiftBtn);
    }

    //addVipBtn
    addVipBtn() {
        this.vipBtn = new Phaser.Sprite(game, 810, 0, 'vip-playlist-shop');
        this.vipBtn.inputEnabled = true;
        this.vipBtn.events.onInputUp.add(this.onClickVipBtn, this);
        this.addChild(this.vipBtn);
    }

    onClickVipBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.vipBtn, this.activeVipBtn);
        this.typeNew = 4;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 4;
    }

    addActiveVipBtn() {
        this.activeVipBtn = new Phaser.Sprite(game, 810, 0, 'vip-active-playlist-shop');
        this.addChild(this.activeVipBtn);
    }

    destroy() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }

    changeScreen(typeNew, typeOld) {
        if (typeNew == 1) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.playlistBtn, this.activePlaylistBtn);
            this.shopPlaylist = new ShopPlaylist(0, 0, typeOld);
            this.layoutContent.addChild(this.shopPlaylist);
            this.shopPlaylist.show();
            this.hideScreen(typeNew, typeOld);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        } else if (typeNew == 2) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.diamondBtn, this.activeDiamondBtn);
            this.shopDiamod = new ShopDiamond(0, 0, typeOld);
            this.layoutContent.addChild(this.shopDiamod);
            this.shopDiamod.show();
            this.hideScreen(typeNew, typeOld);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        } else if (typeNew == 3) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.giftBtn, this.activeGiftBtn);
            this.shopGift = new ShopGift(0, 0, typeOld);
            this.layoutContent.addChild(this.shopGift);
            this.shopGift.show();
            this.hideScreen(typeNew, typeOld);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        } else if (typeNew == 4) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.vipBtn, this.activeVipBtn);
            this.shopVip = new ShopVip(0, 0, typeOld);
            this.layoutContent.addChild(this.shopVip);
            this.shopVip.show();
            this.hideScreen(typeNew, typeOld);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        }
    }

    hideScreen(typeNew, typeOld) {
        if (typeOld == 1) {
            this.shopPlaylist.hide(typeNew);
        } else if (typeOld == 2) {
            this.shopDiamod.hide(typeNew);
        } else if (typeOld == 3) {
            this.shopGift.hide(typeNew);
        } else if (typeOld == 4) {
            this.shopVip.hide(typeNew);
        }
    }

    show() {
        game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }
}