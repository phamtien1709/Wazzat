import Scroller from './scroller.js';
import ListView from './list_view.js';
import ListViewCore from './list_view_core.js';
import SwipeCarousel from './swipe_carousel.js';
import WheelScroller from './wheel_scroller.js';
import DirectionalScroller from './directional_scroller.js';
import BasicSwiper from './basic_swiper.js';
import ScrollerEventDispatcher from './scroller_event_dispatcher.js';

const PhaserListView = {
  Scroller,
  ListView,
  ListViewCore,
  SwipeCarousel,
  WheelScroller,
  DirectionalScroller,
  BasicSwiper,
  ScrollerEventDispatcher
};

export {
  Scroller,
  ListView,
  ListViewCore,
  SwipeCarousel,
  WheelScroller,
  DirectionalScroller,
  BasicSwiper,
  ScrollerEventDispatcher
};

// NOTE: we should only attach to the window in a production build
window.PhaserListView = PhaserListView;

export default PhaserListView;