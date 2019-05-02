import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";
import DataFriend from "../../../user/DataFriend.js";

export default class GetOnlineModListUserOnline {
    static begin(data) {
        LogConsole.log(data.getDump());
        let arrPlayer = [];
        let users = data.getSFSArray(OnlineModeCRDataField.users);

        if (users !== null) {
            for (let i = 0; i < users.size(); i++) {
                let user = users.getSFSObject(i);
                let buddy = new DataFriend();
                buddy.avatar = user.getUtfString(OnlineModeCRDataField.avatar);
                buddy.is_online = true;
                buddy.id = user.getInt(OnlineModeCRDataField.id);
                buddy.user_name = user.getUtfString(OnlineModeCRDataField.user_name);
                buddy.vip = user.getBool(OnlineModeCRDataField.vip);
                arrPlayer.push(buddy);
            }
        }

        return arrPlayer;
    }
}