// Initialise Phaser
import Boot from './state/Boot.js';
import Load from './state/Load.js';
import MainGame from './state/MainGame.js';
import MainData from './model/MainData.js';
import IronSource from './IronSource.js';
import EventGame from './controller/EventGame.js';
import IPAIOS from './IPAIOS.js';
import IPA from './IPA.js';
import OneSignalPush from './OneSignalPush.js';
import PushNotifyLocal from './PushNotifyLocal.js';
import SqlLiteController from './SqlLiteController.js';

window.onload = function () {

    window.onhashchange = function () {
        // //console.log("aaaaaaaaaaaa");
    }

    Howler.mobileAutoEnable = false;
    Howler.autoSuspend = false;



    PushNotifyLocal.instance();

    // //console.log("device : " + typeof device);
    if (window.cordova && typeof device !== 'undefined') {
        if (typeof StatusBar != 'undefined') {
            StatusBar.hide();
        }

        if (window.navigationbar) {
            // //console.log(window.navigationbar);
            window.navigationbar.setUp(false);
            window.navigationbar.hideNavigationBar();
        }

        if (device.hasOwnProperty("platform") && device.platform !== null) {
            if (device.platform.toLowerCase() === "android" || device.platform.toLowerCase() === "amazon-fireos") {
                MainData.instance().platform = "and";
                MainData.instance().udid = udid.getUdid();
                MainData.instance().referrer = udid.getReferrer();
                setTimeout(function () {
                    screen.orientation.lock('portrait');
                }, 2000);

            } else if (device.platform.toLowerCase() === "ios") {
                MainData.instance().platform = "ios";
                MainData.instance().udid = device.uuid;
            }
        }

        if (MainData.instance().platform === "ios") {
            IPAIOS.instance();
        } else if (MainData.instance().platform === "and") {
            IPA.instance();
        }

        if (window.plugins) {
            // prevent sleeping
            if (window.plugins.insomnia)
                window.plugins.insomnia.keepAwake();
            // disable power saving
            if (window.powerManagement)
                window.powerManagement.acquire();
            // get unique ios device id
            if (window.plugins.uniqueDeviceID) {
                window.plugins.uniqueDeviceID.get(function success(uuid) {
                    MainData.instance().udid = uuid;
                    MainData.instance().platform = "ios";
                });
            }
        }
        if (cordova.plugins) {
            if (cordova.plugins.VolumeControl) {
                let VolumeControl = cordova.plugins.VolumeControl;
                VolumeControl.setVolume(0.7); //Float between 0.0 and 1.0
            }
        }
    } else {
        MainData.instance().platform = "web";
    }

    SqlLiteController.instance();

    game = new Phaser.Game(
        window.GameConfig.GAME_WIDTH,
        window.GameConfig.GAME_HEIGHT,
        Phaser.CANVAS,
        'game',
        null,
        false,
        true);
    // Add all the states
    game.state.add('Boot', Boot);
    game.state.add('Load', Load);
    game.state.add('MainGame', MainGame);
    game.state.start('Boot');


    document.body.addEventListener('touchend', () => {
        if ('ctx' in Howler && Howler.ctx !== null) {
            if (Howler.ctx.state === 'suspended' || Howler.ctx.state === 'interrupted') {
                Howler.ctx.resume();
                Howler._autoResume();
            }
        }
    });

    document.addEventListener("backbutton", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        if (MainData.instance().isShowLoading === false) {
            EventGame.instance().event.backButton.dispatch();
        }
    }, false);

    document.addEventListener('deviceready', function () {
        //console.log("deviceready-------------------------");
        OneSignalPush.instance();
        IronSource.instance();
    }, false);

    document.addEventListener("pause", () => {
        //console.log("pause------------------------");
        if (game !== null) {
            game.paused = true;
            //console.log("game.paused : " + game.paused)
        }
    }, false);

    document.ontouchmove = (e) => {
        e.preventDefault();
    }

    document.addEventListener("resume", () => {
        //console.log("resume------------------------");
        if (game !== null) {
            game.paused = false;
            //console.log("game.paused : " + game.paused)
        }
    }, false);


    /*
    var script = document.createElement('script');
    script.src = 'https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';
    document.head.appendChild(script);*/
}

// preparations before game starts
var preload = function () {
    Howler._autoResume();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.time.advancedTiming = true;
    game.stage.disableVisibilityChange = true;
}