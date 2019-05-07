import ImageLoaderFindGame from "../../../Component/ImageLoaderFindGame.js";
import SpriteBase from "../../component/SpriteBase.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";
import BaseGroup from "../../BaseGroup.js";

export default class FindGameSuggestionFriend extends BaseGroup {
    constructor() {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.findOpponentConfig = JSON.parse(game.cache.getText('findOpponentConfig'));
        this.event = {
            challengeGame: new Phaser.Signal()
        }
    }

    addGroupSuggestionFriend() {
        if (this.group == null || this.group == undefined) {
            this.group = new Phaser.Group(game);
            this.addChild(this.group);
        }
    }

    addSuggestionFriend(friendList, callback) {
        this.addTabScreenSuggestionFriend();
        if (friendList) {
            this.shuffleFriendList(friendList, (friendList) => {
                for (let i = 0; i < friendList.length; i++) {
                    this.createSuggestionFriend(i, friendList[i]);
                }
                callback();
            });
        }
    }

    addTabScreenSuggestionFriend() {
        this.tabHeaderSuggestFriend;
        this.addTabHeaderSuggestFriend();
    }

    addTabHeaderSuggestFriend() {
        this.tabHeaderSuggestFriend = new Phaser.Sprite(game, this.findOpponentConfig.tab_header.x * window.GameConfig.RESIZE, this.findOpponentConfig.tab_header.y * window.GameConfig.RESIZE, this.findOpponentConfig.tab_header.nameAtlas, this.findOpponentConfig.tab_header.nameSprite);
        this.group.add(this.tabHeaderSuggestFriend);
        this.addTxtAndLineGradient(this.findOpponentConfig.txt_famous_user, this.findOpponentConfig.line_famous_user);
        this.addBgSuggestFriend();
    }

    addTxtAndLineGradient(txtConfigs, lineConfigs) {
        let text_add = new Phaser.Text(game,
            txtConfigs.x * window.GameConfig.RESIZE,
            txtConfigs.y * window.GameConfig.RESIZE,
            Language.instance().getData("243"),
            txtConfigs.configs);
        text_add.anchor.set(0.5);
        let lineGradient = new Phaser.Sprite(game,
            lineConfigs.x * window.GameConfig.RESIZE,
            lineConfigs.y * window.GameConfig.RESIZE,
            lineConfigs.nameAtlas,
            lineConfigs.nameSprite
        );
        this.tabHeaderSuggestFriend.addChild(text_add);
        this.tabHeaderSuggestFriend.addChild(lineGradient);
    }

    addBgSuggestFriend() {
        let bgSuggestFriend = new Phaser.Sprite(game, this.findOpponentConfig.bg_suggest_friend.x * window.GameConfig.RESIZE, this.findOpponentConfig.bg_suggest_friend.y * window.GameConfig.RESIZE, this.findOpponentConfig.bg_suggest_friend.nameAtlas, this.findOpponentConfig.bg_suggest_friend.nameSprite);
        this.tabHeaderSuggestFriend.addChild(bgSuggestFriend);
    }

    createSuggestionFriend(index, friend) {
        let theirTurns = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "THEIR_TURN");
        let turnFriend = theirTurns.filter(ele => ele.opponentEntity.id === friend.id);
        // console.log(turnFriend);
        if (turnFriend.length > 0) {
            let ava = new ImageLoaderFindGame(0, index);
            ava.x = (140 + (index * 181)) * window.GameConfig.RESIZE;
            ava.y = 298 * window.GameConfig.RESIZE;
            ava.beginLoad(friend.avatar);
            ava.width = 164 * window.GameConfig.RESIZE;
            ava.addMaskAva(108);
            ava.setScale(window.GameConfig.SCALE_AVA_FAMOUS_USER * window.GameConfig.RESIZE);
            ava.addNameAva(this.findOpponentConfig.txt_suggest_friend, Language.instance().getData("311"));
            ava.setValue(friend);
            ava.addInput(this.onInputSuggestionFriend, this);
            ava.setChallenged();
            this.group.add(ava);
            this.addFrameAva(index, friend.vip, true);
            this.addDotOnline(friend, index, true);
        } else {
            let ava = new ImageLoaderFindGame(0, index);
            ava.x = (140 + (index * 181)) * window.GameConfig.RESIZE;
            ava.y = 298 * window.GameConfig.RESIZE;
            ava.beginLoad(friend.avatar);
            ava.width = 164 * window.GameConfig.RESIZE;
            ava.addMaskAva(108);
            ava.setScale(window.GameConfig.SCALE_AVA_FAMOUS_USER * window.GameConfig.RESIZE);
            ava.addNameAva(this.findOpponentConfig.txt_suggest_friend, friend.user_name);
            ava.setValue(friend);
            ava.addInput(this.onInputSuggestionFriend, this);
            this.group.add(ava);
            this.addFrameAva(index, friend.vip, false);
            this.addDotOnline(friend, index, false);
        }
    }

    addFrameAva(index, vip, isChallenged = false) {
        if (vip === true) {
            this.frameAva = new Phaser.Sprite(game, (140 + (index * 181)) * window.GameConfig.RESIZE, 301 * window.GameConfig.RESIZE, 'vipSource', 'Ava_Opponents');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(210 / 200);
            this.group.add(this.frameAva);
            if (isChallenged === true) {
                this.frameAva.alpha = 0.7;
            }
        } else {
            this.frameAva = new Phaser.Sprite(game, (140 + (index * 181)) * window.GameConfig.RESIZE, 298 * window.GameConfig.RESIZE, 'playSprites', 'Khung_Ava_Thuong');
            this.frameAva.anchor.set(0.5);
            this.frameAva.scale.set(280 / 200);
            this.group.add(this.frameAva);
            if (isChallenged === false) {
                this.frameAva.alpha = 0.7;
            }
        }
    }

    addDotOnline(friend, index, isChallenged = false) {
        var posX = (185 + (index * 181));
        var posY = 295;
        if (friend.isOnline == true) {
            this.dotOnline = new SpriteBase({
                x: posX,
                y: posY,
                nameAtlas: 'findOpponentSprites',
                nameSprite: 'Online'
            });
            this.group.add(this.dotOnline);
            if (isChallenged === true) {
                this.dotOnline.alpha = 0.7;
            }
        } else {
            this.dotOnline = new SpriteBase({
                x: posX,
                y: posY,
                nameAtlas: 'findOpponentSprites',
                nameSprite: 'Offline'
            });
            this.group.add(this.dotOnline);
            if (isChallenged === true) {
                this.dotOnline.alpha = 0.7;
            }
        }
    }

    shuffleFriendList(friendList, callback) {
        var shuffleList = friendList.sort(() => Math.random() - 0.5);
        callback(shuffleList);
    }

    removeGroup() {
        this.group.destroy();
        this.group = null;
    }

    onInputSuggestionFriend(value) {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_Suggestion_Opponent_profile);
        //
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_Suggestion_Opponent_profile_button);
        //
        ControllScreenDialog.instance().addUserProfile(value.id);
    }
}