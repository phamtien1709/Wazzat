import ListView from "../../../libs/listview/list_view.js";
import Friend from "./items/Friend.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import BaseGroup from "../BaseGroup.js";

export default class FriendlistScroll extends BaseGroup {
    constructor(friendlist) {
        //FIXED
        super(game);
        this.friendlist = friendlist;
        this.event = {
            getUserProfile: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.listView;
        // this.listView.removeAll();
        // this.listView.reset();
        this.ktBuild = false;
        this.idx = 0;
        this.countItem = 0;
        //
        var gr = new Phaser.Group(game);
        gr.x = 0;
        gr.y = 205 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 321) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        this.listView.events.changeIndex.add(this.changeIndex, this);
        this.buildItemPage();
    }

    changeIndex() {
        let idx = this.listView.getIdx();
        this.buildChangeIndex(idx);
    }

    buildChangeIndex(idx) {
        if (this.countItem === (idx + 1) && this.ktBuild === false) {
            this.buildItemPage();
        }
    }

    buildItemPage() {
        let arr = this.friendlist;
        this.ktBuild = true;
        for (let i = this.idx; i < arr.length; i++) {
            let request = new Friend(this.friendlist[i], i);
            request.event.clickAva.add(this.requestClickAva, this);
            request.event.chat.add(this.requestChat, this);
            this.listView.add(request);
            //
            this.idx++;
            this.countItem++;
            if (this.countItem % 8 === 0 && this.idx < arr.length) {
                this.ktBuild = false;
                break;
            }
            if (this.idx === arr.length) {
                this.ktBuild = false;
            }
        }
    }

    requestChat(friend) {
        ControllScreenDialog.instance().addChatScreen(friend);
    }

    requestClickAva(user_id) {
        this.event.getUserProfile.dispatch(user_id);
    }

    destroy() {
        this.listView.destroy();
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