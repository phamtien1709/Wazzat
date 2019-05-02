import Genres from "../../data/Genres.js";
import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";
import MainData from "../../../MainData.js";

export default class GetOnlineModeGenres {
    static begin(data) {
        let arrGenres = [];
        if (data.getUtfString(OnlineModeDataField.status) === "OK") {
            let genres = data.getSFSArray(OnlineModeDataField.genres);
            for (let i = 0; i < genres.size(); i++) {
                let genre = genres.getSFSObject(i);
                let itemGenre = new Genres();
                itemGenre.code = genre.getUtfString(OnlineModeDataField.code);
                itemGenre.genre = genre.getUtfString(OnlineModeDataField.genre);
                itemGenre.id = genre.getInt(OnlineModeDataField.id);
                itemGenre.number_player = genre.getInt(OnlineModeDataField.number_player);
                itemGenre.parent = genre.getInt(OnlineModeDataField.parent);
                itemGenre.priority = genre.getInt(OnlineModeDataField.priority);
                itemGenre.region = genre.getUtfString(OnlineModeDataField.region);

                arrGenres.push(itemGenre);
            }
        }
        // LogConsole.log("GetOnlineModeGenres : " + JSON.stringify(arrGenres));

        MainData.instance().dataServer.dataGenresQuickPlay = arrGenres;

        return arrGenres;
    }
}