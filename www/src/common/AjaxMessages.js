import SocketController from "../controller/SocketController.js";
import DataCommand from "./DataCommand.js";
import ControllLocalStorage from "../controller/ControllLocalStorage.js";
import MainData from "../model/MainData.js";
import SqlLiteController from "../SqlLiteController.js";

export default class AjaxMessages {

  static instance() {
    if (this.ajaxMessages) {

    } else {
      this.ajaxMessages = new AjaxMessages();
    }

    return this.ajaxMessages;
  }

  countMessage(dataMessages, systemMessages) {
    let count = 0;
    for (let i = 0; i < dataMessages.length; i++) {
      if (dataMessages[i].to == SocketController.instance().dataMySeft.user_id) {
        if (dataMessages[i].is_read == 0) {
          count++;
        }
      }
    }
    for (let i = 0; i < systemMessages.length; i++) {
      if (systemMessages[i].is_read == 0) {
        count++;
      }
    }
    return count;
  }

  countNewMessages(dataMessages) {
    if (dataMessages) {
      let count = 0;
      for (let i = 0; i < dataMessages.length; i++) {
        if (dataMessages[i].to == SocketController.instance().dataMySeft.user_id) {
          if (dataMessages[i].is_read == 0) {
            count++;
          }
        }
      }
      return count;
    }
  }

  countSystemMessages(systemMessages) {
    if (systemMessages) {
      let count = 0;
      for (let i = 0; i < systemMessages.length; i++) {
        if (systemMessages[i].is_read == 0) {
          count++;
        }
      }
      return count;
    }
  }

  listConversation(data) {
    let conversations = [];
    let arrIdFr = [];
    for (let i = 0; i < data.dataMessages.length; i++) {
      if (data.dataMessages[i].from !== SocketController.instance().dataMySeft.user_id) {
        let confirmPush = false;
        for (let j = 0; j < arrIdFr.length; j++) {
          if (data.dataMessages[i].from === arrIdFr[j]) {
            // break;
            confirmPush = true;
          }
        }
        if (confirmPush == false) {
          arrIdFr.push(data.dataMessages[i].from);
        }
      }
    }
    for (let i = 0; i < data.dataMessages.length; i++) {
      if (data.dataMessages[i].to !== SocketController.instance().dataMySeft.user_id) {
        let confirmPush = false;
        for (let j = 0; j < arrIdFr.length; j++) {
          if (data.dataMessages[i].to === arrIdFr[j]) {
            // break;
            confirmPush = true;
          }
        }
        if (confirmPush == false) {
          arrIdFr.push(data.dataMessages[i].to);
        }
      }
    }
    // console.log(arrIdFr);
    for (let j = 0; j < arrIdFr.length; j++) {
      let conversation = this.getLastestConversation(arrIdFr[j], data.dataMessages);
      conversations.push(conversation);
    }
    for (let i = 0; i < conversations.length; i++) {
      if (conversations[i].from == SocketController.instance().dataMySeft.user_id) {
        // conversations[i].
        let user = data.users.find(ele => ele.id == conversations[i].to);
        conversations[i].user = user;
      }
      if (conversations[i].to == SocketController.instance().dataMySeft.user_id) {
        let user = data.users.find(ele => ele.id == conversations[i].from);
        conversations[i].user = user;
      }
    }

    conversations.sort((a, b) => {
      if (a.updated > b.updated) {
        return -1;
      }
    });
    return conversations;
  }

  getLastestConversation(id, data) {
    let conversation = {
      created: 0,
      from: 0,
      id: 0,
      is_read: 0,
      message: "",
      state: "",
      to: 0,
      updated: 0
    };
    for (let i = data.length - 1; i >= 0; i--) {
      if (id === data[i].from || id === data[i].to) {
        let conversationNew = data[i];
        if (conversation.updated < conversationNew.updated) {
          conversation = conversationNew;
        }
      }
    }
    return conversation;
  }

  listMessage(messages, user) {
    let listMessages = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].from == user.id || messages[i].to == user.id) {
        listMessages.push(messages[i])
      }
    }
    listMessages.sort((a, b) => {
      if (a.updated < b.updated) {
        return 1;
      }
    })
    return { ...listMessages }
  }

  sendMessage(to, message) {
    let params = new SFS2X.SFSObject();
    params.putInt('to', to);
    params.putUtfString('message', message);
    SocketController.instance().sendData(DataCommand.USER_MESSAGE_SEND_REQUEST, params);
  }

  sendMarkAsRead(id) {
    let params = new SFS2X.SFSObject();
    params.putInt('user_id', id);
    SocketController.instance().sendData(DataCommand.USER_MESSAGE_MARK_AS_READ_REQUEST, params);
  }

  markAsRead(friend, dataMessages) {
    var arrMess = [];
    for (let i in dataMessages) {
      if (dataMessages[i].from == friend.id || dataMessages[i].to == friend.id) {
        dataMessages[i].is_read = 1;
      }
      arrMess.push(dataMessages[i]);
    }
    //
    MainData.instance().dataMessagesLocal.dataMessages = arrMess;
    SqlLiteController.instance().markAsReadMessage(SocketController.instance().dataMySeft.user_id, friend.id);
  }

  getNotiSystem(dataMessages) {
    let data = { ...dataMessages }
    let arr = Object.keys(data).map((k) => data[k])
    return arr.reverse();
  }

  seeNoticeSystem(id, dataMessages) {
    let message = null;
    for (let i = 0; i < dataMessages.length; i++) {
      if (dataMessages[i].message_content_id == id) {
        message = dataMessages[i]
        break;
      }
    }
    return message;
  }

  sendSystemMarkAsRead(id) {
    let params = new SFS2X.SFSObject();
    params.putLong('message_content_id', id);
    SocketController.instance().sendData(DataCommand.SYSTEM_MESSAGE_MARK_AS_READ_REQUEST, params);
  }

  systemMarkAsRead(id, dataMessages) {
    var arrSysMess = [];
    for (let i = 0; i < dataMessages.length; i++) {
      if (dataMessages[i].message_content_id == id) {
        dataMessages[i].is_read = 1;
      }
      arrSysMess.push(dataMessages[i]);
    }
    SqlLiteController.instance().markAsReadSystemMessage(id, SocketController.instance().dataMySeft.user_id);
  }
}