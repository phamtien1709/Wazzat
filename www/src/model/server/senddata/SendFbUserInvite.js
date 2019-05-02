export default class SendFbUserInvite {
    static begin(invite_id, fb_ids) {
        LogConsole.log("SendFbUserInvite : ");
        let sfsInvite = new SFS2X.SFSArray();
        for (let i = 0; i < fb_ids.length; i++) {
            LogConsole.log(fb_ids[i]);
            sfsInvite.addUtfString(fb_ids[i]);
        }
        let params = new SFS2X.SFSObject();
        params.putUtfString("invite_id", invite_id);
        params.putSFSArray("fb_ids", sfsInvite);
        return params;
    }
}