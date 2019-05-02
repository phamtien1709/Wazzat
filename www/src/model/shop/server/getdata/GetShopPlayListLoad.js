import ShopDataField from "../../datafield/ShopDatafield.js";
import ShopPlayList from "../../data/ShopPlayList.js";
import ShopGenes from "../../data/ShopGenes.js";

export default class GetShopPlayListLoad {
    static begin(data) {
        let dataPlayList = {
            genres: [],
            playlists: []
        }

        if (data.getUtfString(ShopDataField.status) === "OK") {
            let arrGenres = [];
            let objRegion = {};
            let genres = data.getSFSArray(ShopDataField.genres);
            for (let i = 0; i < genres.size(); i++) {
                let genre = genres.getSFSObject(i);
                let itemGenre = new ShopGenes();
                itemGenre.code = genre.getUtfString(ShopDataField.code);
                itemGenre.genre = genre.getUtfString(ShopDataField.genre);
                itemGenre.id = genre.getInt(ShopDataField.id);
                itemGenre.region = genre.getUtfString(ShopDataField.region);
                itemGenre.parent = genre.getInt(ShopDataField.parent);
                itemGenre.priority = genre.getInt(ShopDataField.priority);

                objRegion[itemGenre.id] = itemGenre.region;

                arrGenres.push(itemGenre);
            }

            dataPlayList.genres = arrGenres;

            let arrPlayLists = [];

            let playlists = data.getSFSArray(ShopDataField.playlists);
            for (let i = 0; i < playlists.size(); i++) {
                let playlist = playlists.getSFSObject(i);
                let itemPlayList = new ShopPlayList();
                itemPlayList.is_highlight = playlist.getInt(ShopDataField.is_highlight);
                itemPlayList.used_times = playlist.getInt(ShopDataField.used_times)
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
                itemPlayList.purchased_count = playlist.getInt(ShopDataField.purchased_count);


                if (objRegion.hasOwnProperty(itemPlayList.genre_id)) {
                    itemPlayList.region = objRegion[itemPlayList.genre_id];
                }
                if (playlist.containsKey(ShopDataField.user_playlist_mapping)) {
                    let objUser = playlist.getSFSObject(ShopDataField.user_playlist_mapping);
                    if (objUser) {
                        itemPlayList.user.user_id = objUser.getInt(ShopDataField.user_id);
                        itemPlayList.user.level = objUser.getInt(ShopDataField.level);
                        itemPlayList.user.playlist_id = objUser.getInt(ShopDataField.playlist_id);
                        itemPlayList.user.exp_score = objUser.getInt(ShopDataField.exp_score);
                        itemPlayList.user.created = objUser.getLong(ShopDataField.created);
                        itemPlayList.user.active = objUser.getInt(ShopDataField.active);
                        itemPlayList.user.id = objUser.getLong(ShopDataField.id);
                        itemPlayList.user.current_level_score = objUser.getInt(ShopDataField.current_level_score);
                        itemPlayList.user.next_level_score = objUser.getInt(ShopDataField.next_level_score);
                        itemPlayList.user.updated = objUser.getLong(ShopDataField.updated);
                    }
                }
                if (itemPlayList.is_owner == 1) {

                } else {
                    arrPlayLists.push(itemPlayList);
                }
            }

            dataPlayList.playlists = arrPlayLists;
        }
        //LogConsole.log("GetShopPlayListLoad : " + JSON.stringify(dataPlayList));
        return dataPlayList;
    }
}