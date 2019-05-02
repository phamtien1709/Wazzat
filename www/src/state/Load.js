import LoadModule from '../modules/LoadModule.js';
import createDataDemo from '../createDataDemo.js';
import SocketController from '../controller/SocketController.js';


export default class Load extends Phaser.State {
    constructor() {
        super()
    }

    init(params) {
        this.loadModule = new LoadModule(this);
    }

    preload() {
        this.loadModule.preloadForLoad();
        this.loadModule.createSpritesForLoadState();
        createDataDemo();
    }

    create() {
        game.state.start('MainGame', true, false, {});
    }

    update() {

    }

    render() {

    }

    initServer() {
        // Create configuration object
        let configServer = {
            host: "103.9.77.122",
            port: 8096,
            useSSL: false,
            zone: "MusicQuiz",
            debug: false
        };
        if (this.sfsInfo) {
            configServer.host = this.sfsInfo.sfs_host;
            configServer.port = this.sfsInfo.sfs_port;
            configServer.useSSL = this.sfsInfo.sfs_ssl;
            configServer.zone = this.sfsInfo.sfs_zone;
            configServer.debug = this.sfsInfo.sfs_debug;
        }
        SocketController.instance().initListenerSfs(configServer);
        //connect
        SocketController.instance().connect();
    }

}