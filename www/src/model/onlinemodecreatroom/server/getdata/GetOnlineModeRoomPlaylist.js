import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";
import GetPlayListDetail from "../../../shop/server/getdata/GetPlayListDetail.js";
import ShopDataField from "../../../shop/datafield/ShopDatafield.js";
import MainData from "../../../MainData.js";

export default class GetOnlineModeRoomPlaylist {
    static begin(data) {
        //let arrPlayLists = [];
        let objData = {
            playlists: [],
            suggestion_playlist: {}
        }
        if (data.getUtfString(OnlineModeCRDataField.status) === "OK") {

            let playlists = data.getSFSArray(OnlineModeCRDataField.playlists);
            for (let i = 0; i < playlists.size(); i++) {
                let playlist = playlists.getSFSObject(i);
                let itemPlayList = GetPlayListDetail.getPlayList(playlist);

                if (playlist.containsKey(ShopDataField.user_playlist_mapping)) {
                    let objUser = playlist.getSFSObject(ShopDataField.user_playlist_mapping);
                    if (objUser) {
                        itemPlayList.user = GetPlayListDetail.getUserPlayList(objUser);
                    }
                }
                objData.playlists.push(itemPlayList);
            }

            let suggestion_playlist = data.getSFSObject(OnlineModeCRDataField.suggestion_playlist);
            if (suggestion_playlist) {
                let itemPlayList = GetPlayListDetail.getPlayList(suggestion_playlist);
                if (suggestion_playlist.containsKey(ShopDataField.user_playlist_mapping)) {
                    let objUser = suggestion_playlist.getSFSObject(ShopDataField.user_playlist_mapping);
                    if (objUser) {
                        itemPlayList.user = GetPlayListDetail.getUserPlayList(objUser);
                    }
                }
                objData.suggestion_playlist = itemPlayList;
            }
        }


        MainData.instance().dataServer.dataPlaylistCreateRoom = objData;


        return objData;
    }
}