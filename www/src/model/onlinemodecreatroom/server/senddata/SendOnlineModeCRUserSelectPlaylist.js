export default class SendOnlineModeCRUserSelectPlaylist {
    static begin(playlist_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlist_id);

        LogConsole.log(params.getDump());
        return params;
    }
}