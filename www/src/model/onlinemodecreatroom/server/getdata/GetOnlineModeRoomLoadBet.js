import BetDataRoom from "../../data/BetDataRoom.js";
import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";
import MainData from "../../../MainData.js";

export default class GetOnlineModeRoomLoadBet {
    static begin(data) {
        let arrBet = [];
        if (data.getUtfString(OnlineModeCRDataField.status) === "OK") {
            let bets = data.getSFSArray(OnlineModeCRDataField.bets);
            for (let i = 0; i < bets.size(); i++) {
                let bet = bets.getSFSObject(i);
                let dataBet = new BetDataRoom();
                dataBet.id = bet.getInt(OnlineModeCRDataField.id);
                dataBet.bet_place = bet.getInt(OnlineModeCRDataField.bet_place);
                dataBet.percent_of_fee = bet.getInt(OnlineModeCRDataField.percent_of_fee);

                arrBet.push(dataBet);
            }
        }

        if (arrBet.length > 0) {
            MainData.instance().dataServer.dataBetCreateRoom = arrBet;
        }

        return arrBet;
    }
}