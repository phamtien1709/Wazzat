export default class SendEventModeNextQuestion {
    static begin(question_index) {
        let params = new SFS2X.SFSObject();
        LogConsole.log("question_index------------ : " + question_index);
        params.putInt("question_index", question_index);
        return params;
    }
}