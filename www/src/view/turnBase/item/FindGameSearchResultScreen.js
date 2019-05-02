import ListView from "../../../../libs/listview/list_view.js";
import SearchedFriend from "../../../Component/SearchedFriend.js";
import SocketController from "../../../controller/SocketController.js";
import FieldStatusGame from "./Fields/FieldsStatusGame.js";
import DataCommand from "../../../common/DataCommand.js";
import UserProfileCommand from "../../../model/userprofile/datafield/UserProfileCommand.js";
import SendUserFriendRequest from "../../../model/userprofile/server/senddata/SendUserFriendRequest.js";

export default class FindGameSearchResultScreen extends Phaser.Button {
    constructor(users) {
        super(game, 0, 102, 'bg_create_room');
        this.users = users;
        this.event = {
            refreshSearch: new Phaser.Signal(),
            getUserProfile: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        var gr = new Phaser.Group(game);
        gr.x = 0;
        gr.y = 40 * window.GameConfig.RESIZE;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 640 * window.GameConfig.RESIZE, (game.height - 159) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        for (i = 0; i < this.users.length; i++) {
            let user = new SearchedFriend(this.users[i], i);
            user.addInput(this.onInputFriend, this);
            user.signalInputAva.add(this.inputAva, this);
            this.listView.add(user);
        }
        if (this.users.length == 0) {
            let txtNoFriend = new Phaser.Text(game, 320, 270, "Không có kết quả phù hợp.", {
                "font": "GilroyMedium",
                "fill": "#eeeeee",
                "fontSize": 30
            });
            txtNoFriend.anchor.set(0.5);
            this.addChild(txtNoFriend);
        }
    }

    inputAva(id) {
        this.event.getUserProfile.dispatch(id);
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }
    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.USER_FRIEND_RESPONSE) {
            // console.log(evtParams.params.getDump());
            if (evtParams.params.getUtfString('status') == "OK") {
                this.event.refreshSearch.dispatch();
            }
        }
    }

    onInputFriend(friend_status, id) {
        if (friend_status == FieldStatusGame.NO_FRIEND) {
            this.sendUserFriendRequest(id);
        }
        if (friend_status == FieldStatusGame.PENDING_YOU) {
            this.sendAcceptFriend(id);
        }
    }

    sendUserFriendRequest(id) {
        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_ADD_FRIEND, id));
    }

    sendAcceptFriend(id) {
        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_ACCEPT_ADD_REQUEST, id));
    }

    destroy() {
        this.listView.removeAll();
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
    }
}