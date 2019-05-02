export default class SendOnlineModeBets {
    static begin(genre_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("genre_id", genre_id);

        return params;
    }
}