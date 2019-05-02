export default class SendOnlineModeCRInviteFriend {
    static begin(envitee_id) {
        let params = new SFS2X.SFSObject();
        params.putUtfString("envitee_id", envitee_id + "");
        return params;
    }
}