export default class ControllDataMessages {
  constructor() {
    this.checkLoadMessages = false;
  }

  static instance() {
    if (this.controllMessages) {

    } else {
      this.controllMessages = new ControllDataMessages();
    }
    return this.controllMessages;
  }

  static begin(params) {
    let userMessages = [];
    if (params.containsKey('user_messages')) {
      let user_messages = params.getSFSArray('user_messages');
      for (let i = 0; i < user_messages.size(); i++) {
        let user_message = user_messages.getSFSObject(i);
        let is_read = user_message.getInt('is_read');
        let created = user_message.getLong('created');
        let from = user_message.getInt('from');
        let id = user_message.getLong('id');
        let to = user_message.getInt('to');
        let state = user_message.getUtfString('state');
        let message = user_message.getUtfString('message');
        let updated = user_message.getLong('updated');
        userMessages.push({
          is_read,
          created,
          from,
          id,
          to,
          state,
          message,
          updated
        })
      }
      //
      userMessages.sort((a, b) => a.id - b.id)
    }
    return userMessages;
  }

  static getUsers(params) {
    let users_arr = [];
    if (params.containsKey('users')) {
      let users = params.getSFSArray('users');
      for (let i = 0; i < users.size(); i++) {
        let user = users.getSFSObject(i);
        let level = user.getInt('level');
        let user_name = user.getUtfString('user_name');
        let id = user.getInt('id');
        let avatar = user.getUtfString('avatar');
        let vip = user.getBool('vip');
        let is_online = user.getBool('is_online');
        users_arr.push({
          level,
          user_name,
          id,
          avatar,
          vip,
          is_online
        })
      }
    }
    return users_arr;
  }

  static getSystemMessages(params) {
    let SystemMessages = [];
    if (params.containsKey('system_messages')) {
      let system_messages = params.getSFSArray('system_messages');
      for (let i = 0; i < system_messages.size(); i++) {
        let system_message = system_messages.getSFSObject(i);
        let is_read = system_message.getInt('is_read');
        let created = system_message.getLong('created');
        let message_content_id = system_message.getLong('message_content_id');
        let control = system_message.getUtfString('control');
        let title = system_message.getUtfString('title');
        let message = system_message.getUtfString('message')
        SystemMessages.push({
          is_read,
          created,
          message_content_id,
          control,
          title,
          message
        })
      }
    }
    SystemMessages.sort((a, b) => {
      return a.message_content_id - b.message_content_id
    });
    return SystemMessages;
  }
}