export default class SendEventModeGetLogChat {
    static begin(event_id, time) {
        let params = new SFS2X.SFSObject();
        params.putLong("event_id", event_id);
        params.putLong("time", time);
        return params
    }
}