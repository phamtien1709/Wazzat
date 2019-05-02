/**
 * Check fb login status.
 * 
 * @return: accessToken, fbId Or false if it could not connect fb. 
 */
function checkLoginState(callback) {
    FB.getLoginStatus(function (response) {
        console.log(response);
        var fbId = null;
        var accessToken = null;
        var isConnectedFB = false;
        if (response.status === 'connected') {
            fbId = response.authResponse.userID;
            accessToken = response.authResponse.accessToken;
            isConnectedFB = true;
        }
        callback(isConnectedFB, fbId, accessToken);
    });
}


window.fbAsyncInit = function () {
    // FB.init({
    //     appId: '2153534928214555',
    //     cookie: true,
    //     xfbml: true,
    //     version: 'v2.8'
    // });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "./libs/FaceBookSDK.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//
function testAPI() {
    var fbId, nameFB, emailUser, installedFriend;
    FB.api(
        '/me', { locale: 'vi_VN', fields: 'name, email' }, function (response) {
            // console.log(response.id, response.name);
            fbId = response.id;
            // window.MQ.game.state.start('load');
        });
    FB.api(
        '/me/invitable_friends', function (response) {

        });
    FB.api(
        '/me/friends', function (response) {
            installedFriend = response.data;
            // console.log(response.data);
        });
    return fbId, installedFriend;
}
