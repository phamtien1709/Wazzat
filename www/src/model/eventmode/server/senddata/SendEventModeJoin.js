export default class SendEventModeJoin {
    static begin(event_id) {
        let params = new SFS2X.SFSObject();
        params.putLong("event_id", event_id);

        return params
    }
}