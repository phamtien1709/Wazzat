import AllFriendShowListFriend from "./AllFriendShowListFriend.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FacebookAction from "../../../common/FacebookAction.js";
import EventGame from "../../../controller/EventGame.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class FindGameHeaderAndTextInField extends BaseGroup {
    constructor() {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.event = {
            onBack: new Phaser.Signal(),
            challengeGame: new Phaser.Signal(),
            onSearch: new Phaser.Signal()
        }
        this.onClickShowAll = false;
        this.showAllFriend = null;
    }

    addHeader(countFriends, friends) {
        this.friends = friends;
        this.addTxtAndLineGradient(this.findOpponentConfig.txt_friend, this.findOpponentConfig.line_friend, countFriends);
        //
        var tab_chonplaylist = new Phaser.Sprite(game, this.positionMainConfig.tab_chonplaylist.x * window.GameConfig.RESIZE, this.positionMainConfig.tab_chonplaylist.y * window.GameConfig.RESIZE, this.positionMainConfig.tab_chonplaylist.nameAtlas, this.positionMainConfig.tab_chonplaylist.nameSprite);
        tab_chonplaylist.anchor.set(0.5, 0);
        var txt_findGame = new Phaser.Text(game, this.findOpponentConfig.txt_findGame.x * window.GameConfig.RESIZE,
            this.findOpponentConfig.txt_findGame.y * window.GameConfig.RESIZE,
            Language.instance().getData("242"),
            this.findOpponentConfig.txt_findGame.configs);
        txt_findGame.anchor.set(0.5);
        tab_chonplaylist.addChild(txt_findGame);
        //
        this.addEventExtension();
        this.addChild(tab_chonplaylist);
        this.addSearchButton(tab_chonplaylist);
        this.addArrowBackMenu(tab_chonplaylist);
    }

    addSearchButton(tab_chonplaylist) {
        var btnSearch = new Phaser.Button(game,
            this.findOpponentConfig.Search_Icon.x * window.GameConfig.RESIZE,
            this.findOpponentConfig.Search_Icon.y * window.GameConfig.RESIZE,
            this.findOpponentConfig.Search_Icon.nameAtlas,
            this.onClickSearchBtn,
            this,
            null,
            this.findOpponentConfig.Search_Icon.nameSprite
        );
        btnSearch.anchor.set(1, 0.5);
        tab_chonplaylist.addChild(btnSearch);
    }

    onClickSearchBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // LogConsole.log('Search');
        this.event.onSearch.dispatch();
    }

    addArrowBackMenu(tab_chonplaylist) {
        let arrow_chonplaylist = new Phaser.Button(game, this.positionMainConfig.arrow_chonplaylist.x * window.GameConfig.RESIZE, this.positionMainConfig.arrow_chonplaylist.y * window.GameConfig.RESIZE, this.positionMainConfig.arrow_chonplaylist.nameAtlas, () => { }, this, null, this.positionMainConfig.arrow_chonplaylist.nameSprite);
        arrow_chonplaylist.anchor.set(0.5);
        tab_chonplaylist.addChild(arrow_chonplaylist);
        arrow_chonplaylist.events.onInputUp.add(this.onBack, this);;
    }

    onBack() {
        //console.log('HERE HERE HERE');
        if (this.onClickShowAll == false) {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.event.onBack.dispatch();
        }
    }

    addShowAllText(txtConfigs, lineConfigs) {
        let txtShowAll = new Phaser.Text(game,
            txtConfigs.x * window.GameConfig.RESIZE,
            txtConfigs.y * window.GameConfig.RESIZE,
            Language.instance().getData("1"),
            txtConfigs.configs
        );
        txtShowAll.anchor.set(1, 0);
        txtShowAll.inputEnabled = true;
        txtShowAll.events.onInputUp.add(() => {
            this.onClickShowAll = true;
            //
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.addShowAllFriend();
        })
        this.addChild(txtShowAll);
        let lineGradient = new Phaser.Sprite(game,
            lineConfigs.x * window.GameConfig.RESIZE,
            lineConfigs.y * window.GameConfig.RESIZE,
            lineConfigs.nameAtlas,
            lineConfigs.nameSprite
        );
        this.addChild(lineGradient);
    }

    addShowAllFriend() {
        this.removeShowAllFriend();
        this.showAllFriend = new AllFriendShowListFriend();
        this.showAllFriend.setData(this.friends);
        this.showAllFriend.event.challengeGame.add((value) => {
            // console.log('FHDFHDSF')
            this.onClickShowAll = false;
            this.event.challengeGame.dispatch(value);
            this.showAllFriend.destroy();
        }, this);
        this.showAllFriend.event.back.add(() => {
            this.onClickShowAll = false;
            this.showAllFriend.destroy();
        });
        ControllScreenDialog.instance().addChild(this.showAllFriend);
    }

    removeShowAllFriend() {
        if (this.showAllFriend !== null) {
            ControllScreenDialog.instance().removeChild(this.showAllFriend);
            this.showAllFriend.destroy();
            this.showAllFriend = null;
        }
    }

    addTxtAndLineGradient(txtConfigs, lineConfigs, countFriends) {
        let text_add = new Phaser.Text(game,
            txtConfigs.x * window.GameConfig.RESIZE,
            txtConfigs.y * window.GameConfig.RESIZE,
            `${Language.instance().getData("244")} ( ${countFriends} )`,
            txtConfigs.configs);
        let lineGradient = new Phaser.Sprite(game,
            lineConfigs.x * window.GameConfig.RESIZE,
            lineConfigs.y * window.GameConfig.RESIZE,
            lineConfigs.nameAtlas,
            lineConfigs.nameSprite
        );
        // text_add.anchor.set(0.5);
        this.addChild(text_add);
        this.addChild(lineGradient);
        this.addShowAllText(this.findOpponentConfig.txt_show_all, this.findOpponentConfig.line_under_showall);
    }

    addBtnInviteFriend() {
        //btn-invite
        this.btn_invite = new Phaser.Button(game,
            this.positionMainConfig.btn_invite.x * window.GameConfig.RESIZE,
            this.positionMainConfig.btn_invite.y * window.GameConfig.RESIZE,
            this.positionMainConfig.btn_invite.nameAtlas,
            this.onClickBtnInvite, this, null,
            this.positionMainConfig.btn_invite.nameSprite
        );
        this.btn_invite.anchor.set(1, 0.5);
        this.addChild(this.btn_invite);
    }

    onClickBtnInvite() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        FacebookAction.instance().inviteFriend();
    }

    addEventExtension() {
        // LogConsole.log('QuestAndAchievementScreen');
        EventGame.instance().event.backButton.add(this.onBack, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onBack, this);
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