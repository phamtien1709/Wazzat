import BootModule from './BootModule.js';
import LoadingBoot from '../view/component/LoadingBoot.js';
import ControllSoundFx from '../controller/ControllSoundFx.js';
import MainData from '../model/MainData.js';
import TetTheme from './loading/TetTheme.js';
import Language from '../model/Language.js';
export default class LoadModule extends BootModule {
    constructor(state) {
        super(state);
        this.isLoadAfterComplete = false;
    }
    preloadForLoad() {
        ControllSoundFx.instance().beginLoad();
        game.load.text('positionDefaultSource', 'img/config/positionDefaultSource.json' + `?v=${window.VersionClient}`);
        game.load.text('positionIsNewUserConfig', 'img/config/positionIsNewUserConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionPopup', 'img/config/positionPopup.json' + `?v=${window.VersionClient}`);
        game.load.text('playScript', 'img/config/playScript.json' + `?v=${window.VersionClient}`);
        this.loadXML();
        game.load.text('positionMenuConfig', 'img/config/positionMenuConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('dailyRewardConfig', 'img/config/dailyRewardConfig.json' + `?v=${window.VersionClient}`);
        // game.load.text('languageGame', 'img/config/languageGame.json' + `?v=${window.VersionClient}`);
        game.load.text('positionSetting', 'img/config/positionSetting.json' + `?v=${window.VersionClient}`);
        game.load.text('songDetailScreenConfig', 'img/config/songDetailScreenConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionDisconnectConfig', 'img/config/positionDisconnectConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionIsNewUserConfig', 'img/config/positionIsNewUserConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionChatScreenConfig', 'img/config/positionChatScreenConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('positionFriendRequestConfig', 'img/config/positionFriendRequestConfig.json' + `?v=${window.VersionClient}`);
        game.load.text('silentchat', 'img/config/silentchat.txt' + `?v=${window.VersionClient}`);
        game.load.text('positionUserProfile', 'img/config/positionUserProfile.json' + `?v=${window.VersionClient}`);
        game.load.text('positionQAndAConfig', 'img/config/questAndAchieveConfig.json' + `?v=${window.VersionClient}`);
        //load XML
        //spritesheet
        game.load.spritesheet('disconnect', 'img/animations/Disconnect/sprites.png' + `?v=${window.VersionClient}`, 210, 200.5, 9);
        game.load.spritesheet('btnRankAnim', 'img/animations/Fireworks_Squence/buttonRankAnim.png' + `?v=${window.VersionClient}`, 64, 62, 26);
        game.load.spritesheet('CircleScale', 'img/animations/CircleScale/sprites.png' + `?v=${window.VersionClient}`, 215.25, 215.25, 30);
        game.load.spritesheet('ButtonEvent', 'img/animations/EventBtn/sprites.png' + `?v=${window.VersionClient}`, 89, 89, 10);
        game.load.spritesheet('ButtonGift', 'img/animations/GiftBtn/sprites.png' + `?v=${window.VersionClient}`, 89, 89, 12);
        game.load.spritesheet('ButtonQuest', 'img/animations/QuestBtn/sprites.png' + `?v=${window.VersionClient}`, 89, 89, 12);
        game.load.spritesheet('ButtonRank', 'img/animations/RankBtn/sprites.png' + `?v=${window.VersionClient}`, 89, 89, 18);
        game.load.spritesheet('FindGameButton', 'img/animations/FindGameBtn/sprites.png' + `?v=${window.VersionClient}`, 177, 115, 18);
        game.load.spritesheet('PracticeButton', 'img/animations/PracticeBtn/sprites.png' + `?v=${window.VersionClient}`, 177, 115, 14);
        game.load.spritesheet('PartyButton', 'img/animations/PartyBtn/sprites.png' + `?v=${window.VersionClient}`, 177, 115, 18);
        game.load.spritesheet('56Questions', 'img/animations/56Questions/sprites.png' + `?v=${window.VersionClient}`, 125, 125, 30);
        game.load.spritesheet('ButtonShop', 'img/animations/ShopBtn/shopBtn.png' + `?v=${window.VersionClient}`, 90, 90, 12);
        game.load.spritesheet('VipAva', 'img/animations/UpToVip/ava.png' + `?v=${window.VersionClient}`, 219, 227, 58);
        game.load.spritesheet('VipLabel', 'img/animations/UpToVip/label.png' + `?v=${window.VersionClient}`, 90, 41, 40);
        game.load.spritesheet('VipStar', 'img/animations/UpToVip/star.png' + `?v=${window.VersionClient}`, 126, 83, 32);
        //play state
        //
        game.load.image('bg-playlist', 'img/background/bg-playlist.png' + `?v=${window.VersionClient}`);
        game.load.image('bg_scrollMenu', 'img/assetss/playlist/bg_scrollMenu.png' + `?v=${window.VersionClient}`);
        game.load.image('BG_Opacity', 'img/background/BG_Opacity.png' + `?v=${window.VersionClient}`);
        game.load.image('BG_Opacity_100', 'img/background/BG_Opacity_100.png' + `?v=${window.VersionClient}`);
        game.load.onFileComplete.add(this.fileComplete, this);
    }

    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        let percent = progress;
        this.loadingTxt.setText(`${Language.instance().getData(184)} ${percent} %`);
        if (progress == 100) {
            game.load.onFileComplete.removeAll();
            game.load.onLoadComplete.add(this.onLoadAfterComplete);
            game.load.start();
        }
    }
    onLoadAfterComplete() {
        LogConsole.log('on load complete');
    }

    loadXML() {
        //menu       
        game.load.atlas('defaultSource', 'img/atlas/defaultSource.png' + `?v=${window.VersionClient}`, 'img/atlas/defaultSource.json' + `?v=${window.VersionClient}`,
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('vipSource', 'img/atlas/vip.png' + `?v=${window.VersionClient}`, 'img/atlas/vip.json' + `?v=${window.VersionClient}`,
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('popup', 'img/atlas/popup.png' + `?v=${window.VersionClient}`, 'img/atlas/popup.json' + `?v=${window.VersionClient}`,
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.spritesheet('trueanswer', 'img/atlas/TrueAnswer.png' + `?v=${window.VersionClient}`, 180, 180, 19);
        game.load.spritesheet('failanswer', 'img/atlas/FailAnswer.png' + `?v=${window.VersionClient}`, 180, 180, 19);
        game.load.atlas('limitTurn', 'img/atlas/limitTurn.png' + `?v=${window.VersionClient}`, 'img/atlas/limitTurn.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //playlist
        game.load.atlas('playlistSprites', 'img/atlas/choosePlaylist.png' + `?v=${window.VersionClient}`, 'img/atlas/choosePlaylist.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //play
        game.load.atlas('otherSprites', 'img/atlas/OtherSprites.png' + `?v=${window.VersionClient}`, 'img/atlas/OtherSprites.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //
        game.load.spritesheet('actionphaseanswer1', 'img/atlas/ActionPhaseAnswer1.png' + `?v=${window.VersionClient}`, 350, 350, 24);
        game.load.spritesheet('actionphaseanswer2', 'img/atlas/ActionPhaseAnswer2.png' + `?v=${window.VersionClient}`, 336, 317, 24);
        game.load.spritesheet('actionphaseanswer3', 'img/atlas/ActionPhaseAnswer3.png' + `?v=${window.VersionClient}`, 382, 320, 23);
        game.load.atlas('dailyRewardSprites', 'img/atlas/dailyReward.png' + `?v=${window.VersionClient}`, 'img/atlas/dailyReward.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('mainMenuSprites', 'img/atlas/mainMenu.png' + `?v=${window.VersionClient}`, 'img/atlas/mainMenu.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('songDetailSprites', 'img/atlas/songDetail.png' + `?v=${window.VersionClient}`, 'img/atlas/songDetail.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.spritesheet('EffectAchiment', 'img/atlas/EffectAchiment.png' + `?v=${window.VersionClient}`, 112 * MainData.instance().scale, 114 * MainData.instance().scale, 20);
        game.load.spritesheet('SoloModeStar', 'img/animations/SoloModeStar/SoloModeStar.png' + `?v=${window.VersionClient}`, 125 * MainData.instance().scale, 125 * MainData.instance().scale, 26);
        game.load.atlas('questAndAchieveSprites', 'img/atlas/questAchievement.png' + `?v=${window.VersionClient}`, 'img/atlas/questAchievement.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //TODO HERE
        game.load.spritesheet('LevelUp', 'img/atlas/LevelUp.png' + `?v=${window.VersionClient}`, 240, 146, 61);

        game.load.atlas('IconChatOnlineMode', 'img/atlas/IconChatGame.png' + `?v=${window.VersionClient}`, 'img/atlas/IconChatGame.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('disconnectSprites', 'img/atlas/disconnect.png' + `?v=${window.VersionClient}`, 'img/atlas/disconnect.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('isNewUserSprites', 'img/atlas/newUser.png' + `?v=${window.VersionClient}`, 'img/atlas/newUser.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('practicePopupSprites', 'img/assetss/Practice/Ingame/sprites.png' + `?v=${window.VersionClient}`, 'img/assetss/Practice/Ingame/sprites.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('mailSprites', 'img/atlas/mail.png' + `?v=${window.VersionClient}`, 'img/atlas/mail.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('friendRequestSprites', 'img/atlas/friendRequest.png' + `?v=${window.VersionClient}`, 'img/atlas/friendRequest.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        game.load.atlas('settingSprites', 'img/atlas/setting.png' + `?v=${window.VersionClient}`, 'img/atlas/setting.json' + `?v=${window.VersionClient}`, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //audio
        game.load.audio('beep_audio', 'img/assetss/sound/PipCountDown.mp3' + `?v=${window.VersionClient}`);
        game.load.image('ava_bot', 'img/ava_bot.jpg');
    }

    createSpritesForLoadState() {
        this.positionBootConfig = this.getpositionBootConfig();
        this.addBackgroundSprite();
        this.addLogoSprite();
        this.addAnimLoading();
        this.addLoadingProgressTxt();
        this.addTermText();
        this.addDance();
        // sprite for LUNAR NEW YEAR
        // this.addThemeTET();
    }

    addLoadingProgressTxt() {
        this.loadingTxt = game.add.text(
            this.positionBootConfig.txt_loading.x * window.GameConfig.RESIZE,
            this.positionBootConfig.txt_loading.y * window.GameConfig.RESIZE,
            Language.instance().getData(184),
            this.positionBootConfig.txt_loading.configs);
        this.loadingTxt.anchor.set(0.5);
    }

    addAnimLoading() {
        var loadingAnim = new LoadingBoot();
        this.state.add.existing(loadingAnim);
        loadingAnim.deleteTxtLoading();
    }

    addThemeTET() {
        var themeTET = new TetTheme();
        this.state.add.existing(themeTET);
    }

}