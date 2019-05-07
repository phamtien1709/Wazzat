import UserProfileHeader from "../../userprofile/item/UserProfileHeader.js";
import ImageLoaderFindGameFriendList from "../../../Component/ImageLoaderFindGameFriendList.js";
import ListView from "../../../../libs/listview/list_view.js";
import EventGame from "../../../controller/EventGame.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class AllFriendShowListFriend extends BaseGroup {
    constructor() {
        super(game);
        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.event = {
            back: new Phaser.Signal(),
            challengeGame: new Phaser.Signal()
        }
        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.header = new UserProfileHeader();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setBg(false);
        this.header.setTitle(Language.instance().getData("163"));
        this.addChild(this.header);
    }

    afterInit() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
        if (this.group == null || this.group == undefined) {
            this.group = new Phaser.Group(game);
            const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 125 * window.GameConfig.RESIZE, game.width - 35, 980 * window.GameConfig.RESIZE);
            const options = {
                direction: 'y',
                overflow: 100,
                padding: 0,
                searchForClicks: true
            }
            this.listView = new ListView(game, this.group, bounds, options);
            this.addChild(this.group);
        };
        this.addListFriend(this.friendsList);
    }
    addListFriend(friendLists) {
        for (let i = 0; i < friendLists.length; i++) {
            this.createTabFriennd(i, friendLists[i]);
        };
    }

    setData(friendsList) {
        let friends = [];
        for (let friend in friendsList) {
            friends.push(friendsList[friend]);
        }
        this.friendsList = friends;
        this.afterInit();
    }
    chooseBack() {
        this.event.back.dispatch();
    }

    /**
     *  will be defined went catch who are displayed friend FB or Friend Ingame 
     * @param {*} i index of list friend
     */
    createTabFriennd(index, friend) {
        let ava = new ImageLoaderFindGameFriendList(friend, index);
        ava.beginLoad(friend.avatar);
        ava.setValue(friend);
        ava.setScale(window.GameConfig.SCALE_AVA_FRIEND * window.GameConfig.RESIZE);
        ava.addMaskAva(70);
        ava.addNameAva(this.findOpponentConfig.txt_friend_list, friend.user_name);
        ava.setStateFriend();
        ava.addInput(this.onInputFriend, this);
        ava.addBtnPlay(this.findOpponentConfig.btn_play_findGame);
        ava.signalInputAva.add(() => {
            ControllScreenDialog.instance().addUserProfile(friend.id);
            this.chooseBack();
            this.destroy();
        }, this)
        this.listView.add(ava);
    }

    onInputFriend(value) {
        this.event.challengeGame.dispatch(value);
        this.destroy();
    }

    destroy() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        if (this.listView !== null) {
            this.listView.removeAll();
            this.listView.destroy();
        }
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