import ControllScreen from "../view/ControllScreen.js";
import ControllScreenDialog from "../view/ControllScreenDialog.js";
import ControllLoading from "../view/ControllLoading.js";
import ControllDialog from "../view/ControllDialog.js";
import ConfigScreenName from "../config/ConfigScreenName.js";
import Language from "../model/Language.js";
export default class MainGame extends Phaser.State {
    constructor() {
        super()
    }

    init(params) {

    }

    preload() {
        game.scale.pageAlignHorizontally = true;
        game.time.advancedTiming = true;
        game.stage.disableVisibilityChange = true;
    }

    create() {
        game.input.maxPointers = 1;

        Language.instance();
        //
        let controllScreen = ControllScreen.instance();
        this.add.existing(controllScreen);
        let controllScreenDialog = ControllScreenDialog.instance();
        this.add.existing(controllScreenDialog);
        let controllLoading = ControllLoading.instance();
        this.add.existing(controllLoading);
        let controllDialog = ControllDialog.instance();
        this.add.existing(controllDialog);

        // game.plugins.add(new Phaser.Plugin.SaveCPU(game, this));
        ControllScreen.instance().changeScreen(ConfigScreenName.LOGIN);
    }

    update() {

    }

    render() {

    }
}