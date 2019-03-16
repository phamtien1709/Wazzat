/**
 * Check fb login status.
 * 
 * @return: accessToken, fbId Or false if it could not connect fb. 
 */
function checkLoginState(callback) {
    FB.getLoginStatus(function (response) {
        let fbId = null;
        let accessToken = null;
        let isConnectedFB = false;
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
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/vi_VN/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//
function testAPI() {
    let fbId, nameFB, emailUser, installedFriend;
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

function postImageToFacebook(authToken, filename, mimeType, imageData, message) {
    // this is the multipart/form-data boundary we'll use
    let boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the let
    let formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for (let i = 0; i < imageData.length; ++i) {
        formData += String.fromCharCode(imageData[i] & 0xff);
    }
    formData += '\r\n';
    formData += '--' + boundary + '\r\n';
    formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
    formData += message + '\r\n'
    formData += '--' + boundary + '--\r\n';

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
    xhr.onload = xhr.onerror = function () {
        console.log(xhr.responseText);
    };
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    xhr.sendAsBinary(formData);
};

function share() {
    let data = canvas.toDataURL("image/png");
    let encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    let decodedPng = Base64Binary.decode(encodedPng);
    FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
            postImageToFacebook(response.authResponse.accessToken, "wazzat", "image/png", decodedPng, "https://wazzat.vn/game/");
        } else if (response.status === "not_authorized") {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "wazzat", "image/png", decodedPng, "https://wazzat.vn/game/");
            }, { scope: "publish_actions" });
        } else {
            FB.login(function (response) {
                postImageToFacebook(response.authResponse.accessToken, "wazzat", "image/png", decodedPng, "https://wazzat.vn/game/");
            }, { scope: "publish_actions" });
        }
    });

};
