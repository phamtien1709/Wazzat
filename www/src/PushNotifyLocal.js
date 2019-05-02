export default class PushNotifyLocal {
    constructor() {
        this.ktPush = false;
        if (cordova.plugins) {
            if (cordova.plugins.notification) {
                if (cordova.plugins.notification.local) {
                    this.ktPush = true;

                    cordova.plugins.notification.local.on("add", this.addCallback, this);
                    cordova.plugins.notification.local.on("trigger", this.triggerCallback, this);
                    cordova.plugins.notification.local.on("click", this.clickCallback, this);
                    cordova.plugins.notification.local.on("clear", this.clearCallback, this);
                    cordova.plugins.notification.local.on("cancel", this.cancelCallback, this);
                    cordova.plugins.notification.local.on("update", this.updateCallback, this);
                    cordova.plugins.notification.local.on("clearall", this.clearallCallback, this);
                    cordova.plugins.notification.local.on("cancelall", this.cancelallCallback, this);
                }
            }
        }
    }

    addCallback(evt) {
        console.log("addCallback-----------------------------");
        console.log(evt);
    }
    triggerCallback(evt) {
        console.log("triggerCallback-----------------------------");
        console.log(evt);
    }
    clickCallback(evt) {
        console.log("clickCallback-----------------------------");
        console.log(evt);
    }
    clearCallback(evt) {
        console.log("clearCallback-----------------------------");
        console.log(evt);
    }
    cancelCallback(evt) {
        console.log("cancelCallback-----------------------------");
        console.log(evt);
    }
    updateCallback(evt) {
        console.log("updateCallback-----------------------------");
        console.log(evt);
    }
    clearallCallback(evt) {
        console.log("clearallCallback-----------------------------");
        console.log(evt);
    }
    cancelallCallback(evt) {
        console.log("cancelallCallback-----------------------------");
        console.log(evt);
    }

    static instance() {
        if (this.pushLocal) {

        } else {
            this.pushLocal = new PushNotifyLocal();
        }

        return this.pushLocal;
    }

    setLocalPush(data) {
        if (this.ktPush) {
            cordova.plugins.notification.local.schedule(data);
        }
        /*
        {
            title: 'test',
            text: 'test',
            trigger: {
                //at: this.add_minutes(new Date(), 1)
            }
        }*/
        /*
        cordova.plugins.notification.local.schedule({
            title: 'The Big Meeting',
            text: '4:15 - 5:15 PM\nBig Conference Room',
            smallIcon: 'res://calendar',
            icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfXKe6Yfjr6rCtR6cMPJB8CqMAYWECDtDqH-eMnerHHuXv9egrw'
        });*/
    }

    clearPush(data) {
        if (this.ktPush) {
            cordova.plugins.notification.local.clear(data);
        }
    }

    add_minutes(dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }
}