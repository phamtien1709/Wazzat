export default class SendEventModeClaimReward {
    static begin(id) {
        let params = new SFS2X.SFSObject();
        params.putLong("event_top_rank_log_id", id);
        return params
    }
}