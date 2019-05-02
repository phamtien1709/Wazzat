import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";
import Question from "../../data/Question.js";

import GetPlayListDetail from "../../../shop/server/getdata/GetPlayListDetail.js";
import LoadAllSource from "../../../../controller/LoadData/LoadAllSource.js";

export default class GetOnlineModeListQuestion {
    static begin(data) {
        let arrQuestion = [];
        let dataSource = [];
        let questions = data.getSFSArray(OnlineModeDataField.questions);
        for (let i = 0; i < questions.size(); i++) {
            let question = questions.getSFSObject(i);
            let item = new Question();
            item.file_path = question.getUtfString(OnlineModeDataField.file_path);
            item.question_type = question.getUtfString(OnlineModeDataField.question_type);
            item.correct_answer = question.getInt(OnlineModeDataField.correct_answer);
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer1));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer2));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer3));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer4));


            if (question.containsKey(OnlineModeDataField.user) && !question.isNull(OnlineModeDataField.user)) {
                let user = question.getSFSObject(OnlineModeDataField.user)
                if (user) {
                    item.user_choose = user.getUtfString(OnlineModeDataField.user_name);
                } else {
                    item.user_choose = "";
                }
            } else {
                item.user_choose = "";
            }


            let song = question.getSFSObject(OnlineModeDataField.song);

            item.song = GetPlayListDetail.getSongDetail(song);
            item.song.listenLink = item.file_path;
            if (question.containsKey("playlist")) {
                if (question.isNull("playlist")) {

                } else {
                    let playlist = question.getSFSObject("playlist");
                    if (playlist.containsKey("playlist_name")) {
                        item.song.playlist_name = playlist.getUtfString("playlist_name");
                    }

                    if (playlist.containsKey("playlist_id")) {
                        item.playlist_id = playlist.getInt("playlist_id");
                    }
                }
            }

            arrQuestion.push(item);

            let source = {};
            source.type = "audio";
            source.url = item.file_path;

            dataSource.push(source);

            /*
            let sourceImage = {};
            sourceImage.type = "image";
            sourceImage.url  = item.avataSinger;    
            dataSource.push(sourceImage);*/

        }


        let loadSource = new LoadAllSource();
        loadSource.beginLoad(dataSource);

        return arrQuestion;

    }


}