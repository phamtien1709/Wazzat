export default class SendShopPlayListChangeActive {
    static begin(playlist_id, active) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlist_id);
        params.putInt("active", active);
        return params;
    }
}