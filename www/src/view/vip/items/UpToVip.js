import SocketController from "../../../controller/SocketController.js";
import ControllLoading from "../../ControllLoading.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class UpToVip extends BaseGroup {
  constructor() {
    super(game)
    this.positionConfig = JSON.parse(game.cache.getText('positionChatScreenConfig'));
    this.afterInit();
  }

  afterInit() {
    this.bg = new Phaser.Button(game, 0, 0, 'BG_Opacity_100');
    this.addChild(this.bg);
    this.bg.events.onInputUp.add(this.closePopup, this);
    // this.bg.inputEnabled = false;
    this.checkInputTrue = false;
    this.addCircleRotation();
    //
    this.addAnimAva();
    this.addAva();
  }

  closePopup() {
    if (this.checkInputTrue === true) {
      this.destroy();
    }
  }

  addCircleRotation() {
    this.circle = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'defaultSource', 'Light_Rotation');
    this.circle.anchor.set(0.5);
    this.circle.alpha = 0;
    this.tweenCircle = game.add.tween(this.circle).to({ angle: 359 }, 2000, "Linear", true, 0, -1, false);
    this.addChild(this.circle);
  }

  addAva() {
    this.ava = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'songDetailSprites', 'ava-default');
    this.ava.anchor.set(0.5);
    this.ava.width = 200;
    this.ava.height = 200;
    this.ava.scale.set(0);
    this.addChild(this.ava);
    this.maskAva = new Phaser.Graphics(game, 0, 0);
    this.maskAva.beginFill();
    this.maskAva.drawCircle(0, 0, 200);
    this.maskAva.endFill();
    this.ava.mask = this.maskAva;
    this.ava.addChild(this.maskAva);
    //
    this.loadAva();
  }

  loadAva() {
    ControllLoading.instance().showLoading();
    this.timeout = setTimeout(() => {
      // this.onLoad();
      // //
      if (SocketController.instance().dataMySeft !== null) {
        if (game.cache.checkImageKey('ava_fb')) {
          this.onLoad();
        } else {
          let loader = new Phaser.Loader(game);
          loader.crossOrigin = 'anonymous';
          loader.onLoadComplete.add(this.onLoad, this);
          loader.image('ava_fb', SocketController.instance().dataMySeft.avatar);
          loader.start();
        }
      }
    }, 500);
  }

  onLoad() {
    if (game.cache.checkImageKey('ava_fb')) {
      this.ava.loadTexture('ava_fb');
      //
      ControllLoading.instance().hideLoading();
      let tweenAva = game.add.tween(this.ava.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Elastic.Out, false);
      tweenAva.start();
      this.animAva.alpha = 1;
      this.animAva.animations.play('run_anim_ava', 30, false);
      this.addLabel();
      this.addStar();
      this.addText();
      this.addFireWork();
      this.tweenCircle.start();
      this.circle.alpha = 1;
      this.timeOutInput = setTimeout(() => {
        this.checkInputTrue = true;
      }, 4000);
    } else {
      ControllLoading.instance().hideLoading();
      let tweenAva = game.add.tween(this.ava.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Elastic.Out, false);
      tweenAva.start();
      this.animAva.alpha = 1;
      this.animAva.animations.play('run_anim_ava', 30, false);
      this.addLabel();
      this.addStar();
      this.addText();
      this.addFireWork();
      this.tweenCircle.start();
      this.circle.alpha = 1;
      this.timeOutInput = setTimeout(() => {
        this.checkInputTrue = true;
      }, 4000);
    }
  }

  addAnimAva() {
    this.animAva = new Phaser.Sprite(game, game.width / 2, (game.height / 2) - 16, 'VipAva');
    this.animAva.anchor.set(0.5);
    this.animAva.scale.set(2);
    this.animAva.alpha = 0;
    let runAnimAva = this.animAva.animations.add('run_anim_ava');
    this.animAva.anchor.set(0.5);
    this.addChild(this.animAva);
  }

  addLabel() {
    this.frameVip = new Phaser.Sprite(game, 0, 0, 'vipSource', 'Ava_Stroke');
    // this.frameVip.scale.set(2.31)
    this.frameVip.anchor.set(0.5);
    this.ava.addChild(this.frameVip)
    this.label = new Phaser.Sprite(game, this.ava.x, this.ava.y + 90, 'VipLabel');
    this.label.anchor.set(0.5);
    let runAnimLabel = this.label.animations.add('run_anim_label');
    this.addChild(this.label);
    this.timeoutLabel = setTimeout(() => {
      this.label.animations.play('run_anim_label', 30, false);
    }, 500);
  }

  addStar() {
    this.star = new Phaser.Sprite(game, this.ava.x, this.ava.y, 'VipStar');
    this.star.anchor.set(0.5);
    this.star.scale.set(2);
    let runAnimStar = this.star.animations.add('run_anim_star');
    this.star.animations.play('run_anim_star', 30, true);
    this.addChild(this.star);
  }

  addText() {
    this.txt1 = new Phaser.Text(game, this.positionConfig.txt_vip_1.x, this.animAva.y + 180, Language.instance().getData("274"), this.positionConfig.txt_vip_1.configs);
    this.txt1.anchor.set(0.5);
    this.txt1.alpha = 0;
    this.addChild(this.txt1)
    //
    this.txt2 = new Phaser.Text(game, this.positionConfig.txt_vip_2.x, this.animAva.y + 220, Language.instance().getData("275"), this.positionConfig.txt_vip_2.configs);
    this.txt2.anchor.set(0.5);
    this.txt2.alpha = 0;
    this.addChild(this.txt2)
    //
    let tweenTxt1 = game.add.tween(this.txt1).to({ alpha: 1 }, 1000, "Linear", false);
    let tweenTxt2 = game.add.tween(this.txt2).to({ alpha: 1 }, 1000, "Linear", false);
    tweenTxt1.start();
    tweenTxt2.start();
  }

  addFireWork() {
    this.fireWork = new Phaser.Sprite(game, this.ava.x, this.ava.y, 'firework');
    this.fireWork.anchor.set(0.5);
    this.fireWork.scale.set(1.3);
    this.addChild(this.fireWork);
    var runFireWork = this.fireWork.animations.add('run_firework');
    this.fireWork.animations.play('run_firework', 30, true);
  }

  destroy() {
    clearTimeout(this.timeout);
    clearTimeout(this.timeoutLabel);
    clearTimeout(this.timeOutInput);
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