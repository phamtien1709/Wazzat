import ButtonWithText from "../../component/ButtonWithText.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";
import BaseGroup from "../../BaseGroup.js";

export default class SettingChooseGender extends BaseGroup {
    constructor() {
        super(game);
        this.event = {
            choose_gender: new Phaser.Signal()
        }
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));

        this.bgGenres = new ButtonBase(this.positionSetting.sort_play_list_bg_search_menu);
        this.bgGenres.height = 120 * MainData.instance().scale;
        this.bgGenres.width = 161 * MainData.instance().scale;
        this.addChild(this.bgGenres);

        this.arrSort = ["MALE", "FEMALE"];
        let beginY = 10;
        for (let i = 0; i < this.arrSort.length; i++) {
            let item = new ButtonWithText(this.positionSetting.bg_tab_menu_select_item, this.arrSort[i], this.chooseItem, this);
            item.name = i;
            item.y = beginY;
            item.x = 10
            beginY += 45;
            this.addChild(item);
        }
    }

    chooseItem(evt) {
        LogConsole.log("chooseItem : " + evt.name);
        this.event.choose_gender.dispatch(evt.name, this.arrSort[parseInt(evt.name)]);
    }
}