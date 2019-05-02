export default class SendOnlineModeCRRoomCreate {
    static begin(playlist_id, bet_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlist_id);
        params.putInt("bet_id", bet_id);

        return params;
    }
}