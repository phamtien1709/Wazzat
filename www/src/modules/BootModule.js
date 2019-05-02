import ScreenLoading from "./loading/ScreenLoading.js";

// import createSoundDefault from '../handle/handleSound.js';
export default class BootModule {
    constructor(state) {
        this.state = state;
    }
    preload() {

        //game.load.crossOrigin = "anonymous";
        game.load.atlas('loadingSprites', 'img/atlas/loadingScreen.png' + `?v=${window.VersionClient}`, 'img/atlas/loadingScreen.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //loadingnew
        game.load.atlas('loadingNewSprites', 'img/atlas/loadingNewScreen.png' + `?v=${window.VersionClient}`, 'img/atlas/loadingNewScreen.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //createroom
        game.load.image('bg_create_room', 'img/background/BG.png' + `?v=${window.VersionClient}`);
        //load json file
        game.load.text('languageGame', 'img/language/language.json' + `?v=${window.VersionClient}`);
        game.load.text('positionBootConfig', './img/config/positionBootConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionLoadConfig', './img/config/positionLoadConfig.json' + `?v=${window.VersionClient}`);
        game.load.spritesheet('loadingPlay', 'img/animations/Loading/sprites.png' + `?v=${window.VersionClient}`, 134, 137, 32);
        game.load.text('positionPlayConfig', 'img/config/positionPlayConfig.json' + `?v=${window.VersionClient}`);
        //
        game.load.spritesheet('loadBlackGirl', 'img/animations/NewLoading/BlackGirl.png' + `?v=${window.VersionClient}`, 193, 330, 18);
        game.load.spritesheet('loadWhiteGirl', 'img/animations/NewLoading/WhiteGirl.png' + `?v=${window.VersionClient}`, 125, 380, 14);
        game.load.spritesheet('loadRedGirl', 'img/animations/NewLoading/RedGirl.png' + `?v=${window.VersionClient}`, 160, 330, 22);
        game.load.spritesheet('loadStar', 'img/animations/NewLoading/Star.png' + `?v=${window.VersionClient}`, 29, 30, 11);
        //popup reward
        game.load.image('screen-dim', 'img/assetss/Practice/reward/screen-dim.png' + `?v=${window.VersionClient}`);
        game.load.image('screen-dim1', 'img/assetss/Practice/reward/screen-dim1.png' + `?v=${window.VersionClient}`);
        game.load.image('screen-dim2', 'img/assetss/Practice/reward/screen-dim2.png' + `?v=${window.VersionClient}`);
        game.load.spritesheet('firework', 'img/atlas/firework.png' + `?v=${window.VersionClient}`, 400, 212, 40);
        game.load.spritesheet('fireworktet', 'img/atlas/fireworktet.png' + `?v=${window.VersionClient}`, 435, 231, 32);
    }
    /**
     * Add all sprites for boot state.
     */
    createSprites() {
        this.positionBootConfig = this.getpositionBootConfig();
        this.addBackgroundSprite();
        this.addLogoSprite();
        this.addDance();
        this.addTermText();


    }
    getpositionBootConfig() {
        return JSON.parse(this.state.cache.getText('positionBootConfig'));
    }

    addDance() {
        let dance = new ScreenLoading();
        this.state.add.existing(dance);
    }

    addBackgroundSprite() {
        game.stage.background = game.add.sprite(
            this.positionBootConfig.bg_load.x * window.GameConfig.RESIZE,
            this.positionBootConfig.bg_load.y * window.GameConfig.RESIZE,
            'bg_create_room');
    }

    addLogoSprite() {
        let logo = game.add.sprite(
            this.positionBootConfig.logo.x * window.GameConfig.RESIZE,
            this.positionBootConfig.logo.y * window.GameConfig.RESIZE,
            `${this.positionBootConfig.logo.nameAtlas}`,
            `${this.positionBootConfig.logo.nameSprite}`
        );
        logo.anchor.set(0.5);
        return logo;
    }

    addTermText() {
        //term_txt
        let termText = game.add.text(
            this.positionBootConfig.txt_term.x * window.GameConfig.RESIZE,
            (game.height - 26) * window.GameConfig.RESIZE,
            this.positionBootConfig.txt_term.text,
            this.positionBootConfig.txt_term.configs
        );
        termText.anchor.set(0.5);
        termText.addColor("#ffa33a", 37);
        return termText;
    }
}