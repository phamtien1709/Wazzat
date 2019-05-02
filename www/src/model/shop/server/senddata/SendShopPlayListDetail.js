export default class SendShopPlayListDetail {
    static begin(playlist_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlist_id);
        return params;
    }
}