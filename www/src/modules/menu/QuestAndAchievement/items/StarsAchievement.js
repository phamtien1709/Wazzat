import BaseGroup from "../../../../view/BaseGroup.js";

export default class StarsAchievement extends BaseGroup {
  constructor(x, y, level, scaleSet) {
    super(game);
    this.x = x;
    this.y = y;
    // this.x = x;
    // this.y = y;
    this.level = level;
    this.scaleSet = scaleSet;
    this.addLevel();
  }

  addLevel() {
    if (this.level == 1) {
      let star1 = new Phaser.Sprite(game, 0 * this.scaleSet, 0 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star1.anchor.set(0.5);
      star1.scale.set(this.scaleSet);
      this.addChild(star1);
    } else if (this.level == 2) {
      let star1 = new Phaser.Sprite(game, -16 * this.scaleSet, 0, 'questAndAchieveSprites', 'Stars');
      star1.anchor.set(0.5);
      star1.scale.set(this.scaleSet * 0.8);
      this.addChild(star1);
      //
      let star2 = new Phaser.Sprite(game, 16 * this.scaleSet, 0, 'questAndAchieveSprites', 'Stars');
      star2.anchor.set(0.5);
      star2.scale.set(this.scaleSet * 0.8);
      this.addChild(star2);
    } else if (this.level == 3) {
      let star1 = new Phaser.Sprite(game, -40 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star1.anchor.set(0.5);
      star1.scale.set(this.scaleSet * 0.8);
      this.addChild(star1);
      //
      let star2 = new Phaser.Sprite(game, 40 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star2.anchor.set(0.5);
      star2.scale.set(this.scaleSet * 0.8);
      this.addChild(star2);
      //
      let star3 = new Phaser.Sprite(game, 0, 0, 'questAndAchieveSprites', 'Stars');
      star3.anchor.set(0.5);
      star3.scale.set(this.scaleSet);
      this.addChild(star3);
    } else if (this.level == 4) {
      let star1 = new Phaser.Sprite(game, -16 * this.scaleSet, 0, 'questAndAchieveSprites', 'Stars');
      star1.anchor.set(0.5);
      star1.scale.set(this.scaleSet * 0.8);
      this.addChild(star1);
      //
      let star2 = new Phaser.Sprite(game, 16 * this.scaleSet, 0, 'questAndAchieveSprites', 'Stars');
      star2.anchor.set(0.5);
      star2.scale.set(this.scaleSet * 0.8);
      this.addChild(star2);
      //
      let star3 = new Phaser.Sprite(game, -40 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star3.anchor.set(0.5);
      star3.scale.set(this.scaleSet * 0.6);
      this.addChild(star3);
      //
      let star4 = new Phaser.Sprite(game, 40 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star4.anchor.set(0.5);
      star4.scale.set(this.scaleSet * 0.6);
      this.addChild(star4);
    } else {
      let star1 = new Phaser.Sprite(game, 0, 0, 'questAndAchieveSprites', 'Stars');
      star1.anchor.set(0.5);
      star1.scale.set(this.scaleSet);
      this.addChild(star1);
      //
      let star2 = new Phaser.Sprite(game, 32 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star2.anchor.set(0.5);
      star2.scale.set(this.scaleSet * 0.8);
      this.addChild(star2);
      //
      let star3 = new Phaser.Sprite(game, -32 * this.scaleSet, 10 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star3.anchor.set(0.5);
      star3.scale.set(this.scaleSet * 0.8);
      this.addChild(star3);
      //
      let star4 = new Phaser.Sprite(game, -60 * this.scaleSet, 30 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star4.anchor.set(0.5);
      star4.scale.set(this.scaleSet * 0.6);
      this.addChild(star4);
      //
      let star5 = new Phaser.Sprite(game, 60 * this.scaleSet, 30 * this.scaleSet, 'questAndAchieveSprites', 'Stars');
      star5.anchor.set(0.5);
      star5.scale.set(this.scaleSet * 0.6);
      this.addChild(star5);
    }
  }
}