export default class SendEventModeUserSelectAnswer {
    static begin(answer_index, correct_answer, question_index, is_loaded_next_question, answer_time, is_correct_answer) {
        console.log("answer_time : " + answer_time);
        let params = new SFS2X.SFSObject();
        params.putInt("answer_index", answer_index);
        params.putInt("correct_answer", correct_answer);
        params.putInt("question_index", question_index);
        params.putBool("is_loaded_next_question", is_loaded_next_question)
        params.putFloat("answer_time", answer_time);
        params.putBool("is_correct_answer", is_correct_answer);
        return params;
    }
}