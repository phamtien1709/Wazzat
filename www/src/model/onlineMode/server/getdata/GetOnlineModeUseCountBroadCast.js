import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";

export default class GetOnlineModeUseCountBroadCast {
    static begin(dataGenres, data) {
        let genres_user_count = data.getSFSArray(OnlineModeDataField.genres_user_count);
        for (let i = 0; i < genres_user_count.size(); i++) {
            var genres = genres_user_count.getSFSObject(i);
            for (let j = 0; j < dataGenres.length; j++) {
                if (dataGenres[j].id === genres.getInt(OnlineModeDataField.genre_id)) {
                    dataGenres[j].number_player = genres.getInt(OnlineModeDataField.number_player);
                    break;
                }
            }
        }

        // LogConsole.log("GetOnlineModeUseCountBroadCast : " + JSON.stringify(dataGenres));
        return dataGenres;
    }
}