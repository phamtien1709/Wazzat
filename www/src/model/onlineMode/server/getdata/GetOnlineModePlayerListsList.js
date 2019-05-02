import OnlineModeDataField from "../../dataField/OnlineModeDataField.js";
import ShopDataField from "../../../shop/datafield/ShopDatafield.js";
import GetPlayListDetail from "../../../shop/server/getdata/GetPlayListDetail.js";
import OnlineModeCRDataField from "../../../onlinemodecreatroom/datafield/OnlineModeCRDataField.js";

export default class GetOnlineModePlayerListsList {
    static begin(data) {
        let objData = {
            playlists: [],
            suggestion_playlist: {}
        }

        if (data.getUtfString(OnlineModeDataField.status) === "OK") {
            let playlists = data.getSFSArray(OnlineModeDataField.playlists);
            for (let i = 0; i < playlists.size(); i++) {
                let playlist = playlists.getSFSObject(i);
                let itemPlayList = GetPlayListDetail.getPlayList(playlist);

                if (playlist.containsKey(ShopDataField.user_playlist_mapping)) {
                    let objUser = playlist.getSFSObject(ShopDataField.user_playlist_mapping);
                    if (objUser) {
                        itemPlayList.user = GetPlayListDetail.getUserPlayList(objUser);
                    }
                }

                if (data.containsKey(OnlineModeDataField.bet_id)) {
                    itemPlayList.bet_id = data.getInt(OnlineModeDataField.bet_id);
                }
                objData.playlists.push(itemPlayList);
            }

            if (data.isNull(OnlineModeCRDataField.suggestion_playlist)) {

            } else {
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
        }

        return objData;
    }
}