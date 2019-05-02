import Bet from "../../data/Bet.js";
import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";

export default class GetOnlineModeMoreBets {
    static begin(data) {
        let arrBets = [];

        if (data.getUtfString(OnlineModeDataField.status) === "OK") {
            let bets = data.getSFSArray(OnlineModeDataField.bets);

            for (let i = 0; i < bets.size(); i++) {
                let bet = bets.getSFSObject(i);
                let itemBet = new Bet();
                itemBet.bet_place = bet.getInt(OnlineModeDataField.bet_place);
                itemBet.bet_reward = bet.getInt(OnlineModeDataField.bet_reward);
                itemBet.user_level_required = bet.getInt(OnlineModeDataField.user_level_required);
                itemBet.id = bet.getInt(OnlineModeDataField.id);

                itemBet.genre_id = data.getInt(OnlineModeDataField.genre_id);

                arrBets.push(itemBet);
            }
        }
        //LogConsole.log("GetOnlineModeMoreBets : " + JSON.stringify(arrBets));

        return arrBets;
    }
}