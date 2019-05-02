import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";

export default class GetOnlineModeGameResult {
    static begin(data, arrPlayer) {
        let players = data.getSFSArray(OnlineModeDataField.players);
        let arrResult = [];
        for (let i = 0; i < players.size(); i++) {
            let player = players.getSFSObject(i);

            for (let j = 0; j < arrPlayer.length; j++) {
                let dataPlayer = arrPlayer[j].getData();
                if (dataPlayer != null) {
                    if (dataPlayer.id == player.getInt(OnlineModeDataField.user_id)) {
                        dataPlayer.score = player.getInt(OnlineModeDataField.score);
                        dataPlayer.diamond_change = player.getInt(OnlineModeDataField.diamond_change);
                        dataPlayer.exp_score = player.getInt(OnlineModeDataField.exp_score);
                        arrResult.push(dataPlayer);
                        break;
                    }
                }
            }
        }

        return arrResult;
    }
}