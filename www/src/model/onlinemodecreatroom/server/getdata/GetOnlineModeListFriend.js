import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";
import Buddy from "../../data/Buddy.js";
import GetBuddy from "./GetBuddy.js";

export default class GetOnlineModeListFriend {
    static begin(data, strSearch) {
        let arrFriends = [];
        let friends = data.getSFSArray(OnlineModeCRDataField.friends);
        for (let i = 0; i < friends.size(); i++) {
            let friend = friends.getSFSObject(i);

            if (strSearch === "" || (GetBuddy.xoa_dau(friend.getUtfString(OnlineModeCRDataField.user_name)).toUpperCase().indexOf(GetBuddy.xoa_dau(strSearch).toUpperCase()) !== -1)) {

                let dataFriend = new Buddy();
                dataFriend.userId = friend.getInt(OnlineModeCRDataField.id);
                dataFriend.userName = friend.getUtfString(OnlineModeCRDataField.user_name);
                dataFriend.isOnline = friend.getBool(OnlineModeCRDataField.is_online);
                dataFriend.avatar = friend.getUtfString(OnlineModeCRDataField.avatar);
                dataFriend.vip = friend.getBool(OnlineModeCRDataField.vip);
                dataFriend.vip = true;
                arrFriends.push(dataFriend);
            }

        }

        arrFriends = arrFriends.sort(GetBuddy.compareOnline);

        return arrFriends;
    }
}