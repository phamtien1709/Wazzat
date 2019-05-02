export default class SendOnlineModeCRKick {
    static begin(kick_user_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("kick_user_id", kick_user_id);
        return params;
    }
}