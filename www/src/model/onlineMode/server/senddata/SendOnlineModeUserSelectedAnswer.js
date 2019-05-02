export default class SendOnlineModeUserSelectedAnswer {
    static begin(question_index, answer_index, correct_answer, answer_time) {
        let params = new SFS2X.SFSObject();
        params.putInt("answer_index", answer_index);
        params.putInt("correct_answer", correct_answer);
        params.putFloat("answer_time", answer_time);
        params.putInt("question_index", question_index);
        return params;
    }
}