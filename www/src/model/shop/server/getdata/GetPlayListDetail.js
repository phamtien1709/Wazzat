import ShopPlayList from "../../data/ShopPlayList.js";
import ShopDataField from "../../datafield/ShopDatafield.js";
import ShopSong from "../../data/ShopSong.js";
import ShopUserPlayListMapping from "../../data/ShopUserPlayListMapping.js";
import OnlineModeDataField from "../../../onlineMode/dataField/OnlineModeDataField.js";

export default class GetPlayListDetail {
    static begin(data, playlist_id) {
        let itemPlayList = new ShopPlayList();
        /*  let playlist = DataUser.instance().playlist.getPlayListById(playlist_id);            
         itemPlayList.is_highlight = playlist.is_highlight;
         itemPlayList.used_times = playlist.used_times;
         itemPlayList.thumb = playlist.thumb;
         itemPlayList.created = playlist.created;
         itemPlayList.is_owner = playlist.is_owner;
         itemPlayList.description = playlist.description;
         itemPlayList.active = playlist.active;
         itemPlayList.is_default = playlist.is_default;
         itemPlayList.genre_id = playlist.genre_id;
         itemPlayList.price = playlist.price;
         itemPlayList.is_general = playlist.is_general;
         itemPlayList.name = playlist.name;
         itemPlayList.purchased_count = playlist.purchased_count;
         itemPlayList.id = playlist.id;
         itemPlayList.vip = playlist.vip;
         itemPlayList.is_solo_mode = playlist.is_solo_mode;
         itemPlayList.updated = playlist.updated;
         itemPlayList.country_id = playlist.country_id;
         itemPlayList.region = playlist.region;
         itemPlayList.user = playlist.user;
         */

        let songs = data.getSFSArray(ShopDataField.songs);

        for (let i = 0; i < songs.size(); i++) {
            let song = songs.getSFSObject(i);
            let songDetail = this.getSongDetail(song);
            // songDetail.playlist_name = playlist.name;
            itemPlayList.arrSong.push(songDetail);

        }
        return itemPlayList;
    }

    static getPlayList(playlist) {
        let itemPlayList = new ShopPlayList();
        itemPlayList.is_highlight = playlist.getInt(ShopDataField.is_highlight);
        itemPlayList.thumb = playlist.getUtfString(ShopDataField.thumb);
        itemPlayList.created = playlist.getLong(ShopDataField.created);
        itemPlayList.is_owner = playlist.getInt(ShopDataField.is_owner);
        itemPlayList.is_default = playlist.getInt(ShopDataField.is_default);
        itemPlayList.genre_id = playlist.getInt(ShopDataField.genre_id);
        itemPlayList.purchased = playlist.getInt(ShopDataField.purchased);
        itemPlayList.songs = playlist.getUtfString(ShopDataField.songs);
        itemPlayList.price = playlist.getInt(ShopDataField.price);
        itemPlayList.is_general = playlist.getInt(ShopDataField.is_general);
        itemPlayList.name = playlist.getUtfString(ShopDataField.name);
        itemPlayList.id = playlist.getInt(ShopDataField.id);
        itemPlayList.vip = playlist.getInt(ShopDataField.vip);
        itemPlayList.is_solo_mode = playlist.getInt(ShopDataField.is_solo_mode);
        itemPlayList.updated = playlist.getLong(ShopDataField.updated);
        itemPlayList.country_id = playlist.getInt(ShopDataField.country_id);
        if (playlist.containsKey(ShopDataField.description)) {
            itemPlayList.description = playlist.getUtfString(ShopDataField.description);
        }

        if (playlist.containsKey(OnlineModeDataField.questions)) {
            itemPlayList.questions = playlist.getUtfString(OnlineModeDataField.questions);
        }

        return itemPlayList;
    }

    static getUserPlayList(objUser) {
        let user = new ShopUserPlayListMapping();
        user.user_id = objUser.getInt(ShopDataField.user_id);
        user.level = objUser.getInt(ShopDataField.level);
        user.playlist_id = objUser.getInt(ShopDataField.playlist_id);
        user.exp_score = objUser.getInt(ShopDataField.exp_score);
        user.created = objUser.getLong(ShopDataField.created);
        user.active = objUser.getInt(ShopDataField.active);
        user.id = objUser.getLong(ShopDataField.id);
        user.current_level_score = objUser.getInt(ShopDataField.current_level_score);
        user.next_level_score = objUser.getInt(ShopDataField.next_level_score);
        user.updated = objUser.getLong(ShopDataField.updated);

        return user;
    }

    static getSongDetail(song) {
        let songItem = new ShopSong();
        songItem.id = song.getLong(ShopDataField.id);
        //songItem.author = song.getUtfString(ShopDataField.author);
        songItem.title = song.getUtfString(ShopDataField.title);
        //  songItem.fileName = song.getUtfString(ShopDataField.title);
        //songItem.listenLink = song.getUtfString(ShopDataField.file_path);
        if (song.getSFSObject(ShopDataField.singer).containsKey(ShopDataField.avatar)) {
            songItem.thumb = song.getSFSObject(ShopDataField.singer).getUtfString(ShopDataField.avatar);
        }
        songItem.singer = song.getSFSObject(ShopDataField.singer).getUtfString(ShopDataField.name);
        if (song.containsKey(ShopDataField.title)) {
            songItem.song = song.getUtfString(ShopDataField.title);
        }

        if (song.containsKey(ShopDataField.song_links)) {
            for (let i = 0; i < song.getSFSArray(ShopDataField.song_links).size(); i++) {
                let obj = {};
                let song_links = song.getSFSArray(ShopDataField.song_links).getSFSObject(i);
                obj.link_type = song_links.getUtfString(ShopDataField.link_type);
                // obj.song_id = song_links.getLong(ShopDataField.song_id);
                //obj.is_movie = song_links.getInt(ShopDataField.is_movie);
                obj.link = song_links.getUtfString(ShopDataField.link);
                // obj.id = song_links.getLong(ShopDataField.id);
                songItem.song_links.push(obj);
            }
        }
        return songItem;
    }
}