import SpriteBase from "../../../../../../view/component/SpriteBase.js";
import KeyBoard from "../../../../../../view/component/KeyBoard.js";
import SpriteScale9Base from "../../../../../../view/component/SpriteScale9Base.js";
import TextBase from "../../../../../../view/component/TextBase.js";
import YourChat from "../items/YourChat.js";
import TheirChat from "../items/TheirChat.js";
import AjaxServerMail from "../../../../../../common/AjaxServerMail.js";
import ButtonBase from "../../../../../../view/component/ButtonBase.js";
import ControllSoundFx from "../../../../../../controller/ControllSoundFx.js";
import SocketController from "../../../../../../controller/SocketController.js";
import ListView from "../../../../../../../libs/listview/list_view.js";
import EventGame from "../../../../../../controller/EventGame.js";
import ControllLoading from "../../../../../../view/ControllLoading.js";
import AjaxMessages from "../../../../../../common/AjaxMessages.js";
import MainData from "../../../../../../model/MainData.js";
import DataCommand from "../../../../../../common/DataCommand.js";
import ControllDialog from "../../../../../../view/ControllDialog.js";
import BaseGroup from "../../../../../../view/BaseGroup.js";

export default class ChatScreen extends BaseGroup {
    constructor(friend) {
        super(game)
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.friend = friend;
        // console.warn(this.friend);
        this.clickAvaFriend = false;
        this.countMessSend = 0;
        this.afterInit();
    }

    static get YOUR_MESS() {
        return "YOUR_MESS";
    }

    static get THEIR_MESS() {
        return "THEIR_MESS";
    }

    afterInit() {
        this.listView = null;
        this.heightDefault = 144;
        this.listMessageOld = [];
        this.isHasNewMess = false;
        this.bg;
        this.headerTab;
        this.scrollListChat;
        this.boxKeyboard;
        //
        this.addBG();
        this.addScrollListChat();
        this.ajaxGetMessages();
        this.addBoxKeyboard();
        this.addEventExtension();
        this.addHeaderTab();
    }

    ajaxGetMessages() {
        this.onGetListConversationCallback(AjaxMessages.instance().listMessage(MainData.instance().dataMessagesLocal.dataMessages, this.friend))
    }

    onGetListConversationCallback(response) {
        this.listMessageNew = [];
        ControllLoading.instance().hideLoading();
        //
        var messages = [];
        for (let i in response) {
            messages.push(response[i]);
        }
        if (messages.length > 20) {
            messages = messages.slice(messages.length - 20).reverse();
        } else {
            messages = messages.reverse();
        }
        //
        var listMess = [];
        for (let i = messages.length; i > 0; i--) {
            let message = messages[i - 1];
            if (message.from == this.friend.id) {
                message.type = ChatScreen.THEIR_MESS;
            } else {
                message.type = ChatScreen.YOUR_MESS;
            }
            listMess.push(message);
        }
        this.listMessageNew = listMess;
        // }
        if (this.listMessageOld.length > 19) {
            if (this.listMessageNew[this.listMessageNew.length - 1].message == this.listMessageOld[this.listMessageOld.length - 1].message && this.listMessageNew[this.listMessageNew.length - 1].created == this.listMessageOld[this.listMessageOld.length - 1].created) {

            } else {
                for (let i = this.listMessageNew.length; i > 0; i--) {
                    //
                    if (this.listMessageNew[i - 1].message == this.listMessageOld[this.listMessageOld.length - 1].message && this.listMessageNew[i - 1].created == this.listMessageOld[this.listMessageOld.length - 1].created) {
                        this.listMessageOld.splice(0, this.listMessageNew.length - i);
                        break;
                    }
                };
            }
        }
        this.addListMess();
    }

    addBG() {
        this.bg = new Phaser.Button(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
    }

    addHeaderTab() {
        this.headerTab = new Phaser.Group(game, 0, 0)
        this.tab = new SpriteBase(this.positionMenuConfig.chat_screen.header.tab);
        this.headerTab.addChild(this.tab);
        this.btnBack = new ButtonBase(this.positionMenuConfig.chat_screen.header.back, this.onBack, this);
        this.btnBack.anchor.set(0.5);
        this.headerTab.addChild(this.btnBack);
        this.nameFriend = new TextBase(this.positionMenuConfig.chat_screen.header.name, this.friend.user_name);
        this.nameFriend.anchor.set(0.5);
        this.headerTab.addChild(this.nameFriend);
        this.addChild(this.headerTab);
    }

    onBack() {
        if (this.clickAvaFriend == false) {
            this.destroy();
        } else {
            this.clickAvaFriend = false;
        }
        // EventGame.instance().event.backChat.dispatch();
    }

    addScrollListChat() {
        this.removeScrollListChat();
        //
        this.group = new Phaser.Group(game);
        this.addChild(this.group);
        const bounds = new Phaser.Rectangle(0, 0 * window.GameConfig.RESIZE, game.width, (game.height - this.heightDefault - 30) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        };
        this.group.y = 66;
        this.listView = new ListView(game, this.group, bounds, options);
    }

    removeScrollListChat() {
        if (this.listView !== null) {
            this.removeChild(this.group);
            this.group.remove(this.listView);
            this.listView.removeAll();
            this.listView.destroy();
            this.listView = null;
            this.group = null;
        }
    }

    addListMess() {
        for (let i = this.listMessageOld.length; i < this.listMessageNew.length; i++) {
            this.isHasNewMess = true;
            let isLastMess = false;
            if (i == this.listMessageNew.length - 1) {
                isLastMess = true;
            }
            if (this.listMessageNew[i].type == ChatScreen.YOUR_MESS) {
                if (i > 0 && i === this.listMessageOld.length) {
                    if (this.listMessageNew[i - 1].type == ChatScreen.THEIR_MESS) {
                        this.listView.grp.children[this.listView.grp.children.length - 1].height = this.listView.grp.children[this.listView.grp.children.length - 1].bg.height + 40;
                    }
                }

                let message = new YourChat(this.listMessageNew[i].message, this.listMessageNew[i].created, isLastMess);
                message.event.showTime.add(this.onClickShowTime, this);
                message.event.hideTime.add(this.onHideTimeItem, this);
                message.setPosMess(this.listMessageNew[i + 1]);
                this.listView.add(message);
                message.index = this.listView.grp.children.length - 1;
            } else {
                // LogConsole.log(this.listMessageNew[i]);
                if (i > 0) {
                    if (this.listMessageNew[i - 1].type == ChatScreen.THEIR_MESS) {
                        this.listView.grp.children[this.listView.grp.children.length - 1].height = this.listView.grp.children[this.listView.grp.children.length - 1].bg.height + 3;
                    }
                    let message = new TheirChat(this.friend, this.listMessageNew[i].message, this.listMessageNew[i - 1].type, this.listMessageNew[i].created, isLastMess);
                    message.event.clickAva.add(this.onClickAvaFr, this);
                    message.event.showTime.add(this.onClickShowTime, this);
                    message.event.hideTime.add(this.onHideTimeItem, this);
                    message.setPosMess(this.listMessageNew[i + 1]);
                    this.listView.add(message);
                    message.index = this.listView.grp.children.length - 1;
                } else {
                    let message = new TheirChat(this.friend, this.listMessageNew[i].message, ChatScreen.YOUR_MESS, this.listMessageNew[i].created, isLastMess);
                    message.event.clickAva.add(this.onClickAvaFr, this);
                    message.event.showTime.add(this.onClickShowTime, this);
                    message.event.hideTime.add(this.onHideTimeItem, this);
                    message.setPosMess(this.listMessageNew[i + 1]);
                    this.listView.add(message);
                    message.index = this.listView.grp.children.length - 1;
                }
            }
            this.listMessageOld.push(this.listMessageNew[i]);
        };
        // console.log("GRPPP");
        // console.log(this.listView.grp.height);
        if (this.isHasNewMess == true) {
            this.isHasNewMess = false;
            if (this.listView.grp.children.length > 0) {
                // this.listView.reset();
                this.listView.tweenToItem(this.listView.grp.children.length - 1);
            }
        }
        // console.log(this.listMessageOld);
        if (this.listMessageOld[this.listMessageOld.length - 1]) {
            if (this.listMessageOld[this.listMessageOld.length - 1].is_read == 0) {
                if (this.listMessageOld[this.listMessageOld.length - 1].to === SocketController.instance().dataMySeft.user_id) {
                    AjaxMessages.instance().sendMarkAsRead(this.friend.id);
                    AjaxMessages.instance().markAsRead(this.friend, { ...MainData.instance().dataMessagesLocal.dataMessages });
                }
            }
        }
    }

    onClickShowTime(index) {
        for (i = index; i < this.listView.grp.children.length - 1; i++) {
            let tweenHeight = game.add.tween(this.listView.grp.children[i + 1]).to({ y: this.listView.grp.children[i + 1].y + 30 }, 100, "Linear", true);
            tweenHeight.start();
        }
    }

    onHideTimeItem(index) {
        // console.log('HIDE TIME' + index);
        for (i = index; i < this.listView.grp.children.length - 1; i++) {
            let tweenHeight = game.add.tween(this.listView.grp.children[i + 1]).to({ y: this.listView.grp.children[i + 1].y - 30 }, 100, "Linear", true);
            tweenHeight.start();
        }
    }

    onClickAvaFr() {
        this.clickAvaFriend = true;
        this.destroy();
    }

    addBoxKeyboard() {
        this.boxKeyboard = new SpriteBase(this.positionMenuConfig.chat_screen.keyboard.bg);
        this.boxKeyboard.y = game.height - 107;
        this.addChild(this.boxKeyboard);
        this.whiteSpace = new SpriteScale9Base(this.positionMenuConfig.chat_screen.white_space);
        this.boxKeyboard.addChild(this.whiteSpace);
        let txtWhiteSpace = new TextBase(this.positionMenuConfig.chat_screen.txt_white_space, this.positionMenuConfig.chat_screen.txt_white_space.text);
        this.whiteSpace.addChild(txtWhiteSpace);
        this.btnSend = new ButtonBase(this.positionMenuConfig.chat_screen.btn_send, this.onClickSend, this);
        this.boxKeyboard.addChild(this.btnSend);
        this.boxKeyboard.inputEnabled = true;
        this.boxKeyboard.events.onInputUp.add(this.inputKeyboard, this);
    }

    onClickSend() {
        this.keyboardDone();
    }

    inputKeyboard() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // this.boxKeyboard.kill();
        if (MainData.instance().platform === "web") {
            let options = {
                maxLength: '',
                showTransparent: true,
                placeholder: "Nhắn tin",
                isSearch: false,
                typeInputText: "input", // chat, search, input
                configText: {
                    width: this.whiteSpace.width,
                    height: this.whiteSpace.height,
                    x: this.boxKeyboard.x + 36,
                    y: this.boxKeyboard.y + 21
                }
            };
            KeyBoard.instance().show(options);
        } else {
            //
            let typeInputText = "";
            typeInputText = "chat";
            let options = {
                maxLength: '',
                showTransparent: true,
                placeholder: "Nhắn tin",
                isSearch: false,
                typeInputText: typeInputText, // chat, search, input
                configText: {
                    width: this.whiteSpace.width,
                    height: this.whiteSpace.height,
                    x: this.boxKeyboard.x + 35,
                    y: this.boxKeyboard.y + 17
                }
            }
            KeyBoard.instance().show(options);
        }
    }

    keyboardClose() {
        KeyBoard.instance().hide();
        this.boxKeyboard.revive();
        //
        this.heightDefault = 144;
        this.listMessageOld = [];
        this.addScrollListChat();
        this.addListMess();
    }

    keyboardDone() {
        this.message = KeyBoard.instance().getValue();
        if (this.message.length > 0) {
            if (this.message.length < 255) {
                this.addNewMessage();
                KeyBoard.instance().setValue('');
            } else {
                ControllDialog.instance().addDialog('Số ký tự quá dài :(.')
            }
        }
    }

    hideKeyboard() {
        this.keyboardClose();
    }

    addNewMessage() {
        //
        ControllLoading.instance().showLoading();
        AjaxMessages.instance().sendMessage(this.friend.id, this.message);
    }

    handleNewTime() {
        let now = new Date();
        let timeNow = now.toISOString().split('T');
        timeNow[1] = timeNow[1].split('.000Z');
        timeNow[1] = timeNow[1][0];
        let timeResult = "" + timeNow[0] + " " + timeNow[1] + "";
        // LogConsole.log(timeNow);
        return timeResult;
    }

    onSendSuccess(response) {
        if (this.listView.grp.children.length > 0) {
            this.listView.grp.children[this.listView.grp.children.length - 1].height = this.listView.grp.children[this.listView.grp.children.length - 1].bg.height + 3;
        }
    }

    addEventExtension() {
        EventGame.instance().event.backButton.add(this.onBack, this);
        KeyBoard.instance().event.changeHeight.add(this.onChangeHeightKeyboard, this);
        KeyBoard.instance().event.cancle.add(this.keyboardClose, this);
        KeyBoard.instance().event.enter.add(this.keyboardDone, this);
        KeyBoard.instance().event.submit.add(this.keyboardDone, this);
        KeyBoard.instance().event.hideKeyboard.add(this.hideKeyboard, this);
        SocketController.instance().events.onExtensionResponse.add(this.onExtensionResponse, this);
        EventGame.instance().event.newMessage.add(this.newMessage, this);
    }

    removeEventExtension() {
        EventGame.instance().event.backButton.remove(this.onBack, this);
        KeyBoard.instance().event.changeHeight.remove(this.onChangeHeightKeyboard, this);
        KeyBoard.instance().event.cancle.remove(this.keyboardClose, this);
        KeyBoard.instance().event.enter.remove(this.keyboardDone, this);
        KeyBoard.instance().event.submit.remove(this.keyboardDone, this);
        KeyBoard.instance().event.hideKeyboard.remove(this.hideKeyboard, this);
        SocketController.instance().events.onExtensionResponse.remove(this.onExtensionResponse, this);
        EventGame.instance().event.newMessage.remove(this.newMessage, this);
    }

    newMessage() {
        this.ajaxGetMessages();
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.USER_MESSAGE_SEND_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.onSendSuccess();
                EventGame.instance().callMessageFromChatScreen = true;
                SocketController.instance().sendRequestDataMessages();
            } else {

            }
        }
        if (evtParams.cmd == DataCommand.USER_MESSAGE_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {

            }
        }
    }

    onChangeHeightKeyboard(keyboardHeight) {
        //
        this.listMessageOld = [];
        this.heightDefault = keyboardHeight + 35;
        this.addScrollListChat();
        this.addListMess();
    }

    destroy() {
        this.removeEventExtension();
        this.keyboardClose();
        EventGame.instance().event.backChat.dispatch();
        if (this.listView !== null) {
            this.listView.removeAll();
            this.listView.destroy();
            this.listView = null;
        }
        game.time.events.remove(this.timeCounting);
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