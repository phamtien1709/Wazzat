import ControllLoadCacheUrl from "../../../component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../BaseGroup.js";

export default class UserLastWeek extends BaseGroup {
  constructor(x, y, user) {
    super(game);
    this.x = x;
    this.y = y;
    this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
    this.user = user;
    this.afterInit();
  }

  afterInit() {
    this.avatar;
    this.frame;
    this.name;
    this.levelTitle;
    //
    this.frame = new Phaser.Sprite(game, -5, -5, 'playSprites', 'Khung_Ava_Thuong');
    this.frame.width = 130;
    this.frame.height = 130;
    this.addChild(this.frame);
    //
    this.avatar = new Phaser.Sprite(game, 0, 0, 'otherSprites', 'ava-default');
    this.avatar.width = 120;
    this.avatar.height = 120;
    this.maskAva = new Phaser.Graphics(game, this.avatar.width / 2, this.avatar.width / 2);
    this.maskAva.beginFill();
    this.maskAva.drawCircle(0, 0, this.avatar.width);
    this.addChild(this.maskAva);
    this.avatar.mask = this.maskAva;
    this.addChild(this.avatar);
    //
    this.name = new Phaser.Text(game, this.positionWinConfig.last_week_screen.user_name.x, this.positionWinConfig.last_week_screen.user_name.y, this.user.userName, this.positionWinConfig.last_week_screen.user_name.configs);
    this.name.anchor.set(0.5, 0);
    this.addChild(this.name);
    //
    this.levelTitle = new Phaser.Text(game, this.positionWinConfig.last_week_screen.level_title.x, this.positionWinConfig.last_week_screen.level_title.y, this.user.level_title, this.positionWinConfig.last_week_screen.level_title.configs);
    this.levelTitle.anchor.set(0.5, 0);
    this.addChild(this.levelTitle);
    //
    if (this.user.avatar !== "") {
      this.loadAva();
    }
    //
  }

  loadAva() {
    if (game.cache.checkImageKey(this.user.avatar)) {
      this.onLoad();
    } else {
      //
      ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
      ControllLoadCacheUrl.instance().addLoader(this.user.avatar);
    }
  }

  loadStart() {

  }

  onLoad() {
    ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
    try {
      if (game.cache.checkImageKey(this.user.avatar)) {
        if (this.user.avatar !== "") {
          this.avatar.loadTexture(this.user.avatar);
        } else {
          this.avatar.loadTexture('otherSprites', 'ava-default');
        }
      }
    } catch (error) {

    }
  }

  destroy() {
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