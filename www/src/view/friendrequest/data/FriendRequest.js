export default class FriendRequest {
    constructor() {
        this.user_1 = 0;
        this.user_2 = 0;
        this.created = 0;
        this.friend = {
            user_id: 0,
            user_name: "",
            avatar: "",
            is_online: false
        };
        this.state = "";
        this.is_aware = 0;
        this.updated = 0
        this.vip = false;
    }
}