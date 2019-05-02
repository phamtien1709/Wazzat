export default class SendUserFriendRequest {
    static begin(action, friend_id) {
        LogConsole.log("action " + action);
        LogConsole.log("friend_id " + friend_id);
        var params = new SFS2X.SFSObject();
        params.putUtfString("action", action);
        params.putInt("friend_id", friend_id);
        return params;
    }

    static get ACTION_ADD_FRIEND() {
        return "ADD_FRIEND"
    }

    static get ACTION_ACCEPT_ADD_REQUEST() {
        return "ACCEPT_ADD_REQUEST";
    }

    static get ACTION_REFUSE_ADD_REQUEST() {
        return "REFUSE_ADD_REQUEST";
    }
    static get ACTION_REMOVE_FRIEND() {
        return "REMOVE_FRIEND";
    }
}