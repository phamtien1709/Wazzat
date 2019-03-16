import ListViewCore from './list_view_core.js';
import DirectionalScroller from './directional_scroller.js';
import {
  parseBounds
} from './util.js';

const defaultOptions = {
  direction: 'y',
  autocull: true,
  momentum: true,
  bouncing: true,
  snapping: false,
  overflow: 100,
  padding: 10,
  searchForClicks: false // if you just click on the list view it will search the list view items for onInputDown and onInputUp events.
};

export default class ListView extends ListViewCore {
  constructor(game, parent, bounds, options = {}) {
    super(
      game,
      parent,
      parseBounds(bounds),
      Object.assign({}, defaultOptions, options)
    );

    // we have to use a new mask instance for the click object or webgl ignores the mask
    this.scroller = new DirectionalScroller(
      this.game,
      this._addMask(bounds),
      Object.assign({
        from: 0,
        to: 0
      },
        this.options
      )
    );
    this.scroller.events.onUpdate.add(o => {
      this._setPosition(o.total);
    });
    this.events.onAdded.add(limit => {
      const _to = Math.min(-limit, 0);
      this.scroller.setFromTo(0, _to);
      if (this.options.searchForClicks) {
        this.scroller.registerClickables(this.items);
      }
    });
  }

  destroy() {
    if (this.scroller !== null) {
      this.scroller.destroy();
      this.scroller = null;
    }
    super.destroy();
  }

  reset() {
    this._setPosition(0);
    this.scroller.reset();
  }
}