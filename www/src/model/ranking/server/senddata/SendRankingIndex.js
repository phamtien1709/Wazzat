export default class SendRankingIndex {
    static begin(from_idx, to_idx) {
        let params = new SFS2X.SFSObject();
        params.putInt("from_idx", from_idx);
        params.putInt("to_idx", to_idx);
        return params;
    }
}