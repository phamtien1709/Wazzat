export default class SendOnlineModeCRQuickJoin {
    static begin(room_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("room_id", room_id);
        return params;
    }
}