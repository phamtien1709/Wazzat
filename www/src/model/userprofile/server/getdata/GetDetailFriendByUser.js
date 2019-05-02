import UserProfileDataField from "../../datafield/UserProfileDataField.js";
import Buddy from "../../../onlinemodecreatroom/data/Buddy.js";

export default class GetDetailFriendByUser {
    static begin(data) {
        let arrData = [];
        let friends = data.getSFSArray(UserProfileDataField.friends);
        for (let i = 0; i < friends.size(); i++) {
            let friend = friends.getSFSObject(i);
            let itemFriend = new Buddy();
            itemFriend.avatar = friend.getUtfString(UserProfileDataField.avatar);
            itemFriend.is_online = friend.getBool(UserProfileDataField.is_online);
            itemFriend.id = friend.getInt(UserProfileDataField.id);
            itemFriend.user_name = friend.getUtfString(UserProfileDataField.user_name);
            itemFriend.vip = friend.getBool(UserProfileDataField.vip);
            // itemFriend.vip = true;
            arrData.push(itemFriend);
        }

        return arrData;
    }
}