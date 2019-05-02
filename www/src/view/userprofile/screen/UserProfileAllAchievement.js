import BaseView from "../../BaseView.js";
import ScrollView from "../../component/listview/ScrollView.js";
import UserProfileHeader from "../item/UserProfileHeader.js";
import UserProfileAchievementItem from "../item/UserProfileAchievementItem.js";
import ControllLoading from "../../ControllLoading.js";
import SocketController from "../../../controller/SocketController.js";
import UserProfileCommand from "../../../model/userprofile/datafield/UserProfileCommand.js";
import SendLoadUserProfile from "../../../model/userprofile/server/senddata/SendLoadUserProfile.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class UserProfileAllAchievement extends BaseView {
    constructor(user_id) {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal()
        }

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        let obj = {
            column: 4,
            width: game.width,
            height: game.height - 160 * window.GameConfig.RESIZE,
            rowHeight: 178 * window.GameConfig.RESIZE,
            leftDistance: 35 * window.GameConfig.RESIZE,
            direction: "y",
            distanceBetweenColumns: 32 * window.GameConfig.RESIZE,
            distanceBetweenRows: 32 * window.GameConfig.RESIZE
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 148 * window.GameConfig.RESIZE;
        this.addChild(this.scroll);


        this.header = new UserProfileHeader();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setBg(false);
        this.header.setTitle(Language.instance().getData("162"));
        this.addChild(this.header);

        SocketController.instance().sendData(UserProfileCommand.USER_DETAIL_ACHIEVEMENT_LOAD_REQUEST, SendLoadUserProfile.begin(user_id));

    }
    chooseBack() {
        this.event.back.dispatch();
    }

    setAchievement(achievements) {
        let list = [];
        LogConsole.log("playlists -----------");
        for (let i = 0; i < achievements.length; i++) {
            let item = new UserProfileAchievementItem();
            item.setData(achievements[i], i);
            list.push(item);
        }
        this.scroll.viewList = list;


    }
    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        this.scroll.destroy();
        super.destroy();
    }
}