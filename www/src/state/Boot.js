import BootModule from '../modules/BootModule.js';
import createDataDemo from '../createDataDemo.js';
import MainData from '../model/MainData.js';
/**
 * Descriptions
 * 
 * @author Tien Pham
 * @since 09/10/2018
 */
export default class Boot extends Phaser.State {
  constructor() {
    super();
  }

  init() {

    game.stage.backgroundColor = "#1e0e46";

    let ratio = 0;

    if (MainData.instance().platform === "ios") {

      ratio = screen.width / screen.height;
    } else {
      ratio = window.innerWidth / window.innerHeight;
    }
    //ratio = window.innerWidth / window.innerHeight;

    let standardRatio = window.GameConfig.GAME_WIDTH / window.GameConfig.GAME_HEIGHT;

    if (ratio > standardRatio) {

    } else if (ratio < standardRatio) {

      let newH = Math.ceil(window.GameConfig.GAME_WIDTH / ratio);
      game.scale.setGameSize(window.GameConfig.GAME_WIDTH, newH);

      window.distanceHeight = newH - window.GameConfig.GAME_HEIGHT;
      window.GameConfig.GAME_HEIGHT = newH;
    } else {

    }

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.time.advancedTiming = true;
    game.stage.disableVisibilityChange = true;
    game.sound.context.resume();

    this.bootModule = new BootModule(this);


  }

  preload() {
    this.bootModule.preload();
  }

  create() {
    createDataDemo();
    game.state.start('Load', true, false, {});

    $('#dangtai').remove();
    $('#lds-heart').remove();
  }

  update() {

  }

  render() {

  }
}