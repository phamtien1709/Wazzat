import SpriteBase from "../component/SpriteBase.js";
import TextBase from "../component/TextBase.js";
import DataCommand from "../../common/DataCommand.js";
import FriendRequestField from "./data/fields/FriendRequestField.js";
import FriendRequest from "./data/FriendRequest.js";
import FriendRequestScrollList from "./FriendRequestScrollList.js";
import SendUserFriendRequest from "../../model/userprofile/server/senddata/SendUserFriendRequest.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import SocketController from "../../controller/SocketController.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import ControllLoading from "../ControllLoading.js";
import FriendRequestScreenTab from "./items/FriendRequestScreenTab.js";
import FriendlistScroll from "./FriendlistScroll.js";
import DataUser from "../../model/user/DataUser.js";
import DataFriendController from "../../model/user/DataFriendController.js";
import DataFriend from "../../model/user/DataFriend.js";
import Language from "../../model/Language.js";
import BaseGroup from "../BaseGroup.js";

export default class FriendRequestScreen extends BaseGroup {
    constructor() {
        super(game)
        this.positionFriendRequestConfig = JSON.parse(game.cache.getText('positionFriendRequestConfig'));
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            back: new Phaser.Signal()
        };
        this.friendRequestList = [];
        this.friendLists = [];
        this.isFriendTab = true;
        this.afterInit();
        this.addEventExtension();
    }

    afterInit() {
        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        this.addChild(this.bg);
        this.layoutBot = new Phaser.Group(game)
        this.layoutTop = new Phaser.Group(game)
        this.addChild(this.layoutBot);
        this.addChild(this.layoutTop);
        //
        this.loadDoneRequest = false;
        this.header;
        this.frameScreen;
        this.scrollListRequest = null;
        this.scrollListFriend = null;
        this.dotCountFriend = null;
        //
        this.addHeader();
        this.addFrameScreen();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Friend_add);
        //
    }

    afterTweenDone() {
        this.sendFriendRequestLoadRequest();
        this.sendFriendListLoadRequest();
    }

    addHeader() {
        this.header = new SpriteBase(this.positionFriendRequestConfig.header.tab);
        this.txtHeader = new TextBase(this.positionFriendRequestConfig.header.txt_header, Language.instance().getData("223"));
        this.txtHeader.anchor.set(0.5, 0);
        this.header.addChild(this.txtHeader);
        this.addChild(this.header);
    }

    addFrameScreen() {
        this.txtRequestAddFriend;
        this.lineUnderTxtRequestAddFriend;
        this.dotCountFriend;
        this.lineGradientUnderTxtRequestAddFriend;
        this.addFriendTab();
        this.addRequestTab();
    }

    addTxtRequestAddFriend() {
        this.txtRequestAddFriend = new TextBase(this.positionFriendRequestConfig.txt_request_add_friend, this.positionFriendRequestConfig.txt_request_add_friend.text);
        this.addChild(this.txtRequestAddFriend);
    }

    addFriendTab() {
        this.friendTab = new FriendRequestScreenTab(160 * window.GameConfig.RESIZE, 153 * window.GameConfig.RESIZE, Language.instance().getData("224"));
        this.friendTab.event.clickTab.add(this.onClickTabFriend, this);
        this.layoutTop.addChild(this.friendTab);
    }

    addRequestTab() {
        this.requestTab = new FriendRequestScreenTab(480 * window.GameConfig.RESIZE, 153 * window.GameConfig.RESIZE, Language.instance().getData("225"));
        this.requestTab.event.clickTab.add(this.onClickTabRequest, this);
        this.requestTab.setDisActive();
        this.layoutTop.addChild(this.requestTab);
    }

    onClickTabFriend() {
        this.isFriendTab = true;
        this.friendTab.setActive();
        this.requestTab.setDisActive();
        this.removeScollListRequest();
        //
        this.sendFriendListLoadRequest();
    }

    onClickTabRequest() {
        this.isFriendTab = false;
        this.friendTab.setDisActive();
        this.requestTab.setActive();
        this.removeScrollFriendList();
        //
        // if(this.friendRequestList)
        this.sendFriendRequestLoadRequest();
    }

    addLineUnderTxtRequestAddFriend() {
        this.lineUnderTxtRequestAddFriend = new SpriteBase(this.positionFriendRequestConfig.line_under_txt_request_add_friend);
        this.addChild(this.lineUnderTxtRequestAddFriend);
    }

    addDotCountFriend() {
        this.removeDotCount();
        this.dotCountFriend = new SpriteBase(this.positionFriendRequestConfig.dot_count_friend);
        this.dotCountFriend.anchor.set(0.5);
        this.addChild(this.dotCountFriend);
    }
    removeDotCount() {
        if (this.dotCountFriend !== null) {
            this.removeChild(this.dotCountFriend);
            this.dotCountFriend.destroy();
            this.dotCountFriend = null;
        }
    }

    addNumberInDotCount(num) {
        if (num > 0) {
            this.addDotCountFriend();
            let number = new Phaser.Text(game, 0, 2, num, this.positionMenuConfig.txtNotiDot.configs);
            number.anchor.set(0.5);
            this.dotCountFriend.addChild(number);
        }
    }

    addLineGradientUnderTxtRequestAddFriend() {
        this.lineGradientUnderTxtRequestAddFriend = new SpriteBase(this.positionFriendRequestConfig.line_gradient_under_txt_request_add_friend);
        this.lineGradientUnderTxtRequestAddFriend.anchor.set(0, 0.5);
        this.addChild(this.lineGradientUnderTxtRequestAddFriend);
    }

    addScrollListRequest() {
        if (this.friendRequestList.length > 0) {
            this.removeScollListRequest();
            this.scrollListRequest = new FriendRequestScrollList(this.friendRequestList);
            this.scrollListRequest.event.accept.add(this.acceptRequestFriend, this);
            this.scrollListRequest.event.decline.add(this.declineRequestFriend, this);
            this.scrollListRequest.event.getUserProfile.add(this.getUserProfile, this);
            this.layoutBot.addChild(this.scrollListRequest);
            if (this.isFriendTab == true) {
                this.scrollListRequest.visible = false;
            } else {
                this.scrollListRequest.visible = true;
            }
        }
    }

    removeScollListRequest() {
        if (this.scrollListRequest !== null) {
            this.removeChild(this.scrollListRequest);
            this.scrollListRequest.destroy();
            this.scrollListRequest = null;
        }
    }

    addScrollFriendList() {
        if (this.friendLists.length > 0) {
            this.removeScrollFriendList();
            this.scrollListFriend = new FriendlistScroll(this.friendLists);
            this.scrollListFriend.event.getUserProfile.add(this.getUserProfile, this);
            this.layoutBot.addChild(this.scrollListFriend);
            if (this.isFriendTab == true) {
                this.scrollListFriend.visible = true;
            } else {
                this.scrollListFriend.visible = false;
            }
        }
    }

    removeScrollFriendList() {
        if (this.scrollListFriend !== null) {
            this.removeChild(this.scrollListFriend);
            this.scrollListFriend.destroy();
            this.scrollListFriend = null;
        }
    }

    acceptRequestFriend(request) {
        this.sendUserFriendRequest(SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_ACCEPT_ADD_REQUEST, request.friend.user_id));
        let friendObj = new DataFriend();
        friendObj.level = 0;
        friendObj.user_name = request.friend.user_name;
        friendObj.id = request.friend.user_id;
        friendObj.avatar = request.friend.avatar;
        friendObj.is_online = request.friend.is_online;
        friendObj.vip = request.vip;
        DataUser.instance().listFriend.setFriend(friendObj.id, friendObj)
    }

    declineRequestFriend(request) {
        this.sendUserFriendRequest(SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_REFUSE_ADD_REQUEST, request.friend.user_id));
    }

    getUserProfile(user_id) {
        ControllScreenDialog.instance().addUserProfile(user_id);
    }

    sendUserFriendRequest(params) {
        SocketController.instance().sendData(DataCommand.USER_FRIEND_REQUEST, params);
    }

    onBack() {
        this.destroy();
        this.event.back.dispatch();
    }

    sendFriendRequestLoadRequest() {
        if (this.loadDoneRequest == false) {
            SocketController.instance().sendData(DataCommand.FRIEND_REQUEST_LOAD_REQUEST, null);
            ControllLoading.instance().showLoading();
        } else {
            this.addScrollListRequest();
            this.addNumberInDotCount(this.friendRequestList.length);
        }
    }

    sendFriendListLoadRequest() {
        if (DataUser.instance().ktLoadFriend === true) {
            this.loadListFriendComplete();
        } else {
            DataUser.instance().sendGetFriendsList();
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        DataUser.instance().event.load_list_friend_complete.add(this.loadListFriendComplete, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        DataUser.instance().event.load_list_friend_complete.remove(this.loadListFriendComplete, this);
    }

    onExtensionResponse(evtParams) {
        ControllLoading.instance().hideLoading();
        if (evtParams.cmd == DataCommand.FRIEND_REQUEST_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.loadDoneRequest = true;
                this.handleFriendRequestLoadResponse(evtParams.params, () => {
                    this.addScrollListRequest();
                    this.addNumberInDotCount(this.friendRequestList.length);
                });
            }
        }
        if (evtParams.cmd == DataCommand.USER_FRIEND_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.loadDoneRequest = false;
                this.removeScollListRequest();
                this.dotCountFriend.destroy();
                this.sendFriendRequestLoadRequest();
            }
        }
    }

    loadListFriendComplete() {
        this.handleParamsFriendsResponse(null, () => {
            this.friendTab.addCountFriend(this.friendLists.length);
            this.addScrollFriendList();
        });
    }

    handleParamsFriendsResponse(params, callback) {
        this.friendLists = [];
        this.friendLists = DataUser.instance().listFriend.getFriends();
        callback();
    }

    handleFriendRequestLoadResponse(response, callback) {
        var friendRequestList = [];
        let friend_requests = response.getSFSArray(FriendRequestField.friend_requests);
        for (let i = 0; i < friend_requests.size(); i++) {
            let friendRequest = new FriendRequest();
            let friend_request = friend_requests.getSFSObject(i);
            friendRequest.user_1 = friend_request.getInt(FriendRequestField.user_1);
            friendRequest.user_2 = friend_request.getInt(FriendRequestField.user_2);
            friendRequest.created = friend_request.getLong(FriendRequestField.created);
            let friend = friend_request.getSFSObject(FriendRequestField.friend);
            friendRequest.friend.user_id = friend.getInt(FriendRequestField.user_id);
            friendRequest.friend.user_name = friend.getUtfString(FriendRequestField.user_name);
            friendRequest.friend.avatar = friend.getUtfString(FriendRequestField.avatar);
            friendRequest.friend.is_online = friend.getBool(FriendRequestField.is_onlines);
            friendRequest.state = friend_request.getUtfString(FriendRequestField.state);
            friendRequest.is_aware = friend_request.getInt(FriendRequestField.is_aware);
            friendRequest.updated = friend_request.getLong(FriendRequestField.updated);
            friendRequest.vip = friend.getBool(FriendRequestField.vip);
            // friendRequest.vip = true;
            friendRequestList.push(friendRequest);
        }
        this.friendRequestList = friendRequestList;
        this.loadDoneRequest = true;
        callback();
    }

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