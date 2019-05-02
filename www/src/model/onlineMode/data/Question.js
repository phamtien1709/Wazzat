import ShopSong from "../../shop/data/ShopSong.js";

export default class Question {
    constructor() {
        this.file_path = "";
        this.question_type = "";
        this.arrAnser = [];
        this.correct_answer = 0;
        this.playerChoose = {
            idx: 0,
            correct_answer: false,
            time: 0
        };
        this.song = new ShopSong();
        this.user_choose = "";
        this.playlist_id = 0;
    }
}