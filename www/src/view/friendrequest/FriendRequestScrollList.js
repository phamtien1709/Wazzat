import Request from "./items/Request.js";
import ListView from "../../../libs/listview/list_view.js";
import BaseGroup from "../BaseGroup.js";

export default class FriendRequestScrollList extends BaseGroup {
    constructor(friendRequestList) {
        super(game);
        this.friendRequestList = friendRequestList;
        this.event = {
            accept: new Phaser.Signal(),
            decline: new Phaser.Signal(),
            getUserProfile: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.listView;
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
        // LogConsole.log(this.friendRequestList);
        for (let i = 0; i < this.friendRequestList.length; i++) {
            // for (let i = 0; i < 10; i++) {
            let request = new Request(this.friendRequestList[i], i);
            request.event.accept.add(this.acceptRequestFriend, this);
            request.event.decline.add(this.declineRequestFriend, this);
            request.event.clickAva.add(this.requestClickAva, this);
            this.listView.add(request);
        }
    }

    acceptRequestFriend(request) {
        this.event.accept.dispatch(request);
    }

    declineRequestFriend(request) {
        this.event.decline.dispatch(request);
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