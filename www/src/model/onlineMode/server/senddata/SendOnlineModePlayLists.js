export default class SendOnlineModePlayLists {
    static begin(genre_id, bet_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("genre_id", genre_id);
        params.putInt("bet_id", bet_id);
        return params;
    }
}