export default class BaseGroup extends Phaser.Group {
  constructor() {
    super(game);
  }


  destroy() {
    this.removeAllItem();
    super.destroy();

    let typeData = "";
    for (let str in this) {
      if (this[str] !== null && this[str] !== undefined) {
        typeData = this[str].constructor.name;
        if (typeData === "Array" || typeData === "Object"
        ) {
          game.tweens.removeFrom(this[str]);
          if (typeData === "Array") {
            this[str].length = 0;
          } else {
            this[str] = null;
          }
        }
      }
    }
    typeData = null;
  }

  removeAllItem() {
    if (this.children !== null) {
      while (this.children.length > 0) {
        let item = this.children[0];
        if (item !== null) {
          this.removeChild(item);
          item.destroy();
          item = {};
          item = null;
        }
      }
    }
  }
}