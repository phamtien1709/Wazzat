import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";

export default class GetOnlineModeGameResult {
    static begin(data, arrPlayer) {
        let players = data.getSFSArray(OnlineModeCRDataField.players);
        for (let i = 0; i < players.size(); i++) {
            let player = players.getSFSObject(i);

            for (let j = 0; j < arrPlayer.length; j++) {
                let dataPlayer = arrPlayer[j].getData();
                if (dataPlayer != null) {
                    if (dataPlayer.user_id == player.getInt(OnlineModeCRDataField.user_id)) {
                        dataPlayer.score = player.getInt(OnlineModeCRDataField.score);
                        dataPlayer.diamond_change = player.getInt(OnlineModeCRDataField.diamond_change);
                        dataPlayer.exp_score = player.getInt(OnlineModeCRDataField.exp_score);
                        arrPlayer[j].setCurrentData(dataPlayer);
                        break;
                    }
                }
            }
        }
    }
}