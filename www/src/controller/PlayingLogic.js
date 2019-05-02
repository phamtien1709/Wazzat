import SocketController from "./SocketController.js";

export default class PlayingLogic {
    constructor() {

    }
    static instance() {
        if (this.playingLogic) {

        } else {
            this.playingLogic = new PlayingLogic();
        }

        return this.playingLogic;
    }

    randomNumber(start, end) {
        return Math.floor((Math.random() * (end + 1)) + start);
    }

    convertVersionToInt(version) {
        let arr = version.split(".");
        let intVersion = 0;
        for (let i = 0; i < arr.length; i++) {
            if (i == 0) {
                intVersion += parseInt(arr[i]) * 100;
            }
            else if (i == 1) {
                intVersion += parseInt(arr[i]) * 10;
            } else {
                intVersion += parseInt(arr[i]);
            }
        }
        return intVersion;
    }

    genUrlSound(url) {
        let ping = SocketController.instance().dataMySeft.lag_value;
        LogConsole.log("ping------------- : " + ping);
        let quantity = 320;

        if (ping > 2048) {
            quantity = 320
        } else if (ping > 1024) {
            quantity = 192;
        } else if (ping > 512) {
            quantity = 128;
        } else {
            quantity = 64;
        }

        /*
        if (ping < 50) {
            quantity = 320;
        } else if (ping > 49 && ping < 100) {
            quantity = 192;
        } else if (ping > 99 && ping < 200) {
            quantity = 128;
        } else {
            quantity = 64;
        }*/

        // quantity = 32;
        /*
        if (ping > 299 && ping < 400) {
            quantity = 64;
        } else {
            quantity = 32;
        }*/
        //https: //cdn.gamezoka.com/storage/mp3/324/5721/13839_{quantity}.mp3
        url = url.replace("QUANTITY", quantity);
        url = url.replace("quantity", quantity);
        LogConsole.log("url------------- : " + url);
        return url;
    }

    format(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

    shortenLargeNumber(num, digits) {
        let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
            decimal;

        for (var i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);

            if (num <= -decimal || num >= decimal) {
                return +(num / decimal).toFixed(digits) + units[i];
            }
        }

        return num;
    }

    getChangeHeight() {

        console.log("innerHeight " + window.innerHeight);
        console.log("documentElement  " + document.documentElement.clientHeight);
        console.log("body  " + document.body.clientHeight);
        console.log("screen  " + screen.height);
        console.log("game.height " + game.height);
        /*
        thuong
        innerHeight : 465
        documentElement  : 736
        body : 736
        screen : 736
        */

        /*
       XSMAX
       innerHeight : 812
       documentElement  : 1103
       body : 1103
       screen : 812
       */

        console.log("game.scale.scaleFactorInversed.y : " + game.scale.scaleFactorInversed.y);

        let heightNav = screen.height - window.innerHeight;
        if (heightNav > 0) {
            heightNav = (heightNav + 15) / (1 - game.scale.scaleFactorInversed.y);
        }
        return heightNav;
    }
}