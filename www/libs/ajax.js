function getJSONFile(name, url, callback) {
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            var obj = data;
            window.MQ.data.push({
                "nameData": name,
                "data": obj
            });
            callback();
        }
    })
}

function getServerInfomation(id, accessToken, callback) {
    var postData = {
        "fbId": id,
        "accessToken": accessToken
    };
    $.ajax({
        url: "https://yan.gamezoka.com/ws/api/user/login",
        type: "POST",
        data: postData,
        dataType: "json",
        success: function (res) {
        	LogConsole.log(res);
            callback(res);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            LogConsole.log("Error");
            LogConsole.log(thrownError);
            LogConsole.log(xhr.status);
            LogConsole.log(xhr.responseJSON);
        }
    })
}
class Abc {
    static get EXAMPLE() {
        return 'hehe';
    }
}
