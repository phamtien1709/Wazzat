window.smartFoxSignal = null;
window.loaderController = null;
window.isTest = false; // if true => loginFb and ajax to get Server Information; if false => fix user id and login sfs
// Define our 'global' variable
window.MQ = {};
window.GameConfig = {};
window.GameConfig.GAME_WIDTH = 640;
window.GameConfig.GAME_HEIGHT = 1136;
window.GameConfig.SCALE_AVA_FINDGAME = 68 / 200;
window.GameConfig.SCALE_AVA_USER = 151 / 200;
window.GameConfig.SCALE_AVA_FAMOUS_USER = 108 / 200;
window.GameConfig.SCALE_AVA_FRIEND = 70 / 200;
window.GameConfig.SCALE_AVA_OPPO_INTHELEFT = 40 / 200;
window.GameConfig.SCALE_PLAYLIST_PRACTICE = 165 / 165;
window.GameConfig.SCALE_PLAYLIST_POPUP_SHORT_PROFILE = 100 / 165;
window.GameConfig.SCALE_MEDAL = 89 / 331;
window.GameConfig.RESIZE = 1;
window.GameConfig.SCALE_AVA_CHAT = 70 / 200;
window.GameConfig.SOUND_FX = true;
window.GameConfig.SIZE_AVA_UPLOAD = 2097152;
window.GameConfig.IS_TUTORIAL = false;
window.GameConfig.IS_BOT_TUTORIAL = false;
window.GameConfig.STEP_TUTORIAL = {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false
}
window.VersionClient = "1.0.8";
//
window.linkResource = "https://yan.gamezoka.com/ws/api/resource";
// window.linkResource = "https://ws.gamezoka.com/api/resource";
// window.linkResource = "https://yan.gamezoka.com/ws-global/api/resource";
//
window.RESOURCE = {
    admin_domain: "https://music.gamezoka.com/",
    fb_app: "2153534928214555",
    version: 1,
    login_url: "https://yan.gamezoka.com/ws/api/user/login",
    login_deviceId: "https://yan.gamezoka.com/ws/api/user/device_login",
    in_app_apple_validator: "https://yan.gamezoka.com/ws/api/validator/apple",
    in_app_google_validator: "https://yan.gamezoka.com/ws/api/validator/google",
    fb_sync_api: "https://yan.gamezoka.com/ws/api/user/fb_sync",
    in_app_facebook_validator: "https://yan.gamezoka.com/ws/api/FBPayment/verify",
    fb_products: {},
    login_yan: "https://yan.gamezoka.com/ws/api/user/yan_login"

}
window.GameConfig.CONFIGS_GENRE = {
    x: 293,
    y: 174
}
window.GameConfig.CONFIGS_POPUP_PRACTICE = {
    x: 200,
    y: 380
}
window.GameConfig.CONFIGS_PLAYLIST_RECEIVED = {
    x: 197,
    y: 350
}
window.GameConfig.CONFIGS_DAILY_REWARD = {
    x: 117,
    y: 165
}
var game = null;
Array.prototype.sortOn = function () {
    var dup = this.slice();
    if (!arguments.length) return dup.sort();
    var args = Array.prototype.slice.call(arguments);
    return dup.sort(function (a, b) {
        var props = args.slice();
        var prop = props.shift();
        while (a[prop] == b[prop] && props.length) prop = props.shift();
        return a[prop] == b[prop] ? 0 : a[prop] > b[prop] ? -1 : 1;
    });
};

LogConsole = {
    log(data) {
        console.log(data);
    }
}