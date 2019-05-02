export default class SendEventModeRanking {
    static begin(event_id, from_idx, to_idx) {
        let params = new SFS2X.SFSObject();
        params.putLong("event_id", event_id);
        params.putInt("from_idx", from_idx);
        params.putInt("to_idx", to_idx);
        return params
    }
}