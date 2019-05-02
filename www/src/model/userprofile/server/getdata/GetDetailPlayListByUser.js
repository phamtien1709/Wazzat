import DataUser from "../../../user/DataUser.js";
import UserPlaylist from "../../../user/UserPlaylist.js";

export default class GetDetailPlayListByUser {
    static begin(data) {
        let arrData = [];
        let playlists = data.getSFSArray("playlists");
        for (let i = 0; i < playlists.size(); i++) {
            let playlist = playlists.getSFSObject(i);

            let itemPlayList = DataUser.instance().playlist.getPlayListById(playlist.getInt("playlist_id"));
            if (itemPlayList !== null) {
                let item = new UserPlaylist();
                item.is_highlight = itemPlayList.is_highlight;
                item.used_times = itemPlayList.used_times
                item.thumb = itemPlayList.thumb
                item.created = itemPlayList.created
                item.is_owner = itemPlayList.is_owner
                item.is_default = itemPlayList.is_default
                item.genre_id = itemPlayList.genre_id
                item.purchased = itemPlayList.purchased
                item.songs = itemPlayList.songs
                item.price = itemPlayList.price
                item.is_general = itemPlayList.is_general;
                item.name = itemPlayList.name;
                item.id = itemPlayList.id;
                item.vip = itemPlayList.vip;
                item.is_solo_mode = itemPlayList.is_solo_mode;
                item.updated = itemPlayList.updated;
                item.country_id = itemPlayList.country_id;
                item.purchased_count = itemPlayList.purchased_count;
                item.active = itemPlayList.active;
                // console.log(item);
                item.user.level = playlist.getInt("level");
                item.user.exp_score = playlist.getInt("exp_score");
                item.user.current_level_score = playlist.getInt("current_level_score");
                item.user.next_level_score = playlist.getInt("next_level_score");
                item.user.updated = playlist.getLong("updated");
                item.is_owner = 1;
                arrData.push(item);
            }
        }

        return arrData;
    }
}