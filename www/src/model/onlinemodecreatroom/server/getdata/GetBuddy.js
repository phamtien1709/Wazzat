import SocketController from "../../../../controller/SocketController.js";
import Buddy from "../../data/Buddy.js";
import OnlineModeCRDataField from "../../datafield/OnlineModeCRDataField.js";

export default class GetBuddy {
    static begin(strSearch) {
        let arrBuddy = [];
        /*
        let myLobby = SocketController.instance().socket.getRoomByName("The Lobby 1");
        LogConsole.log(myLobby);
        let userSFList = myLobby.getUserList();
        LogConsole.log(userSFList);*/

        let buddies = SocketController.instance().socket.buddyManager.getBuddyList();

        for (let i = 0; i < buddies.length; i++) {
            let buddie = buddies[i];
            if (strSearch === "" || (GetBuddy.xoa_dau(buddie.getVariable("$" + OnlineModeCRDataField.userName).value).toUpperCase().indexOf(GetBuddy.xoa_dau(strSearch).toUpperCase()) !== -1)) {


                let buddy = new Buddy();
                LogConsole.log(buddie);
                buddy.avatar = buddie.getVariable("$" + OnlineModeCRDataField.avatar).value;
                buddy.diamond = buddie.getVariable("$" + OnlineModeCRDataField.diamond).value;
                buddy.isOnline = buddie[OnlineModeCRDataField.isOnline];
                buddy.userId = buddie.getVariable("$" + OnlineModeCRDataField.userId).value;
                buddy.userName = buddie.getVariable("$" + OnlineModeCRDataField.userName).value;

                arrBuddy.push(buddy);
            }
        }


        arrBuddy = arrBuddy.sort(GetBuddy.compareOnline);
        return arrBuddy;
    }

    static xoa_dau(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }
    static compareOnline(a) {
        if (a.isOnline == true) {
            return -1;
        } else {
            return 1;
        }
        return 0;
    }
}