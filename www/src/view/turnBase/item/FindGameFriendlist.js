import ImageLoaderFindGameFriendList from '../../../Component/ImageLoaderFindGameFriendList.js';
import ListView from '../../../../libs/listview/list_view.js';
import ControllScreenDialog from '../../ControllScreenDialog.js';
import BaseGroup from '../../BaseGroup.js';

export default class FindGameFriendlist extends BaseGroup {
    constructor(state, mainModule) {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.event = {
            challengeGame: new Phaser.Signal()
        }
    }

    afterInit() {
        if (this.group == null || this.group == undefined) {
            this.group = game.add.group();
            const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 534 * window.GameConfig.RESIZE, game.width - 35 * window.GameConfig.RESIZE, (game.height - 646) * window.GameConfig.RESIZE);
            const options = {
                direction: 'y',
                overflow: 100,
                padding: 0,
                searchForClicks: true
            }
            this.listView = new ListView(game, this.group, bounds, options);
            this.addChild(this.group);
        };
    }

    addListFriend(friendLists) {
        // LogConsole.log(friendLists);
        for (let i = 0; i < friendLists.length; i++) {
            this.createTabFriennd(i, friendLists[i]);
        };
    }

    removeGroup() {
        this.group.destroy();
        this.group = null;
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
        }, this)
        this.listView.add(ava);
    }

    onInputFriend(value) {
        console.log('GNJDNF')
        console.log(value);
        this.event.challengeGame.dispatch(value);
    }
}