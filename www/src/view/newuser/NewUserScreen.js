import SocketController from "../../controller/SocketController.js";
import NewUserModule from "../../modules/NewUserModule.js";
import DataCommand from "../../common/DataCommand.js";
import BaseGroup from "../BaseGroup.js";

export default class NewUserScreen extends BaseGroup {
    constructor() {
        super(game);
        this.positionBootConfig = JSON.parse(game.cache.getText('positionBootConfig'));;
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        this.NewUserModule = new NewUserModule(this, this.positionBootConfig);
        this.NewUserModule.preload();
        this.addChild(this.NewUserModule);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.NEW_USER_SELECTED_GENRES_RESPONSE) {
            this.NewUserModule.handleParamsOnSelectedPlaylist(evtParams.params);
        }
    }

    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }
    //
    destroy() {
        this.removeEventExtension();
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