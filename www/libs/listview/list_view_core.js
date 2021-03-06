import {
  getWidthOrHeight
} from './util.js';

const defaultOptions = {
  direction: 'y',
  autocull: true,
  padding: 10
};

export default class ListViewCore {
  constructor(game, parent, bounds, options = {}) {
    this.game = game;
    this.parent = parent;
    this.bounds = bounds;
    this.idx = 0;

    this.o = this.options = Object.assign({}, defaultOptions, options);

    this.items = [];

    if (this.o.direction == 'y') {
      this.p = {
        xy: 'y',
        wh: 'height'
      };
    } else {
      this.p = {
        xy: 'x',
        wh: 'width'
      };
    }

    this.grp = this.game.add.group(parent);
    this.grp.position.set(bounds.x, bounds.y);

    this.events = {
      onAdded: new Phaser.Signal(),
      changeIndex: new Phaser.Signal()
    };

    this.position = 0;

    // [MC] - is masking the fastest option here? Cropping the texture may be faster?
    this.grp.mask = this._addMask(bounds);
  }

  /**
   * [add a child to the list
   * stacks them on top of each other by measuring their
   * height and adding custom padding. Optionally you can
   * specify nominalHeight or nominalWidth on the display object,
   * this will take preference over height and width]
   * @param {DisplayObject} child
   */
  add(child) {
    this.items.push(child);
    let xy = 0;
    if (this.grp.children.length > 0) {
      let lastChild = this.grp.getChildAt(this.grp.children.length - 1);
      xy =
        lastChild[this.p.xy] +
        getWidthOrHeight(lastChild, this.p.wh) +
        this.o.padding;
    }

    child[this.p.xy] = xy;

    this.grp.addChild(child);

    this.length = xy + getWidthOrHeight(child, this.p.wh);

    // this._setPosition(this.position)
    this.events.onAdded.dispatch(this.length - this.bounds[this.p.wh]);
    return child;
  }

  /**
   * [addMultiple children to the list]
   * @param {...[DisplayObjects]} children
   */
  addMultiple(...children) {
    children.forEach(this.add, this);
  }

  remove(child) {
    LogConsole.log("remove child-listview");
    this.grp.removeChild(child);
    const index = this.items.indexOf(child);
    if (index == -1) return;
    this.items.splice(index, 1);
    return child;
  }

  destroy() {
    LogConsole.log("destroy-listview");
    if (this.events != null) {
      this.events.onAdded.dispose();
      this.events.changeIndex.dispose();
      this.events = null;
    }
    if (this.grp !== null) {
      while (this.grp.children.length > 0) {
        let item = this.grp.children[0];
        this.remove(item);
        item.destroy();
        item = null;
      }
      this.grp.destroy();
      this.grp = null;
    }
    this.game = null;
    this.parent = null;
    this.items = null;
  }

  /**
   * [removeAll - removes all children from the group]
   * @note This does not reset the position of the ListView.
   */
  removeAll() {
    if (this.grp !== null) {
      while (this.grp.children.length > 0) {
        let item = this.grp.children[0];
        this.remove(item);
        item.destroy();
        item = null;
      }
      this.grp.removeAll();
    }

    this.items = [];
  }

  /**
   * [cull - culls the off-screen list elements]
   * mainly called internally with the autoCull property
   */
  cull() {
    let clickables = [];
    for (let i = 0; i < this.items.length; i++) {
      let child = this.items[i];
      if (
        child[this.p.xy] +
        getWidthOrHeight(child, this.p.wh) +
        this.grp[this.p.xy] <
        this.bounds[this.p.xy]
      ) {
        child.visible = false;
      } else if (
        child[this.p.xy] + this.grp[this.p.xy] >
        this.bounds[this.p.xy] + this.bounds[this.p.wh]
      ) {
        child.visible = false;
      } else {
        child.visible = true;
        this.idx = i;
        this.events.changeIndex.dispatch();
        clickables.push(child);
      }
    }
    this.scroller.registerClickables(clickables);
  }

  getIdx() {
    return this.idx;
  }

  getPositionByItemIndex(index) {
    return -this.items[index][this.p.xy];
  }

  // @deprecated
  setPosition(position) {
    this.moveToPosition(position);
  }

  moveToPosition(position) {
    this.scroller.setTo(position);
  }

  moveToItem(index) {
    this.scroller.setTo(this.getPositionByItemIndex(index));
  }

  tweenToPosition(position, duration = 1) {
    this.scroller.tweenTo(duration, position);
  }

  tweenToItem(index, duration = 1) {
    this.scroller.tweenTo(duration, this.getPositionByItemIndex(index));
  }

  /**
   * @private
   */

  _setPosition(position) {
    this.position = position;
    this.grp[this.p.xy] = this.bounds[this.p.xy] + position;
    if (this.o.autocull) this.cull();
  }

  /**
   * @private
   */
  _addMask(bounds) {
    let mask = this.game.add.graphics(0, 0, this.parent);
    mask
      .beginFill(0xff0000)
      .drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    mask.alpha = 0;
    this.bounds.height = bounds.height;
    return mask;
  }
}