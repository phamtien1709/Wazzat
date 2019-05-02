import SocketController from "../../../controller/SocketController.js";
import ItemBoxTextWithLabelOnTheLeft from "./ItemBoxTextWithLabelOnTheLeft.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class ItemSettingProfileName extends BaseGroup {
    constructor() {
        super(game);
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        if (SocketController.instance().socket.mySelf !== null) {
            this.name = SocketController.instance().dataMySeft.user_name;
        }
        this.afterInit();
    }

    afterInit() {
        this.boxName;
        this.boxLocation;
        this.addBoxName();
        this.addBoxLocation();
    }

    addBoxName() {
        this.boxName = new ItemBoxTextWithLabelOnTheLeft(255 * MainData.instance().scale, 169 * MainData.instance().scale, Language.instance().getData("300"), this.name);
        this.addChild(this.boxName);
    }

    addBoxLocation() {
        this.boxLocation = new ItemBoxTextWithLabelOnTheLeft(255 * MainData.instance().scale, 255 * MainData.instance().scale, Language.instance().getData("301"), "Việt Nam");
        this.addChild(this.boxLocation);
    }
}