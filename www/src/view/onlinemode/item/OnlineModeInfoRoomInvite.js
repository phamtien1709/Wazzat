import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeInfoRoomInvite extends BaseView {
    constructor(idRoom, count) {
        super(game, null);

        this.positionOnlineMode = MainData.instance().positionCreateRoom;

        this.bg = new SpriteBase(this.positionOnlineMode.friend_detail_room_bg);
        this.addChild(this.bg);

        this.idPhong = new TextBase(this.positionOnlineMode.friend_detail_room_id, Language.instance().getData("48") + ": " + idRoom);
        this.idPhong.addColor("#ffa33a", Language.instance().getData("48").length + 1);
        this.addChild(this.idPhong);

        this.iconCount = new SpriteBase(this.positionOnlineMode.friend_detail_room_icon_count);
        this.addChild(this.iconCount);

        this.countPlayer = new TextBase(this.positionOnlineMode.friend_detail_room_count_player, "3/4");
        this.updateCountPlayer(count);
        this.addChild(this.countPlayer);
    }

    updateCountPlayer(count) {
        this.countPlayer.text = count + "/4";
    }
}