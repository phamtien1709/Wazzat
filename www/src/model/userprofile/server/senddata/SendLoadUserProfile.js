export default class SendLoadUserProfile {
    static begin(user_id) {
        var params = new SFS2X.SFSObject();
        params.putInt("user_id", user_id);
        return params;
    }
}