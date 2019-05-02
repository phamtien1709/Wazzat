export default class SendOnlineModeFindGame {
    static begin(playlist_id, genre_id, bet_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("playlist_id", playlist_id);
        params.putInt("genre_id", genre_id);
        params.putInt("bet_id", bet_id);
        return params;
    }
}