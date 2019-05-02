import txtConfig from '../../img/config/txtNewUserConfig.js';
import ChooseMainScreen from './isNewUser/chooseMain/ChooseMainScreen.js';
import ChooseUS_UKChildren from './isNewUser/chooseUS-UK/ChooseUS_UKChildren.js';
import ReceivedPlaylistScreen from './isNewUser/received/ReceivedPlaylistScreen.js';
import DataCommand from '../common/DataCommand.js';
import FaceBookCheckingTools from '../FaceBookCheckingTools.js';
import SocketController from '../controller/SocketController.js';
import ControllLoading from '../view/ControllLoading.js';
import DataUser from '../model/user/DataUser.js';
import SqlLiteController from '../SqlLiteController.js';
import ShopUserPlayListMapping from '../model/shop/data/ShopUserPlayListMapping.js';
import Language from '../model/Language.js';
import BaseGroup from '../view/BaseGroup.js';
export default class NewUserModule extends BaseGroup {
    constructor(state, positionBootConfig) {
        super(game)
        this.state = state;
        this.positionBootConfig = positionBootConfig;
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        this.countChoice = 3;
        this.listChoicedFavorites = [];
        this.arrGenres = [];
        this.arrBeGiven = [];
        this.stateParams = {
            waitingGames: [],
            doneGames: [],
            challengeGames: []
        }
        this.chooseMain;
        this.chooseUS_UK;
        this.receivedList;
        this.addEventExtension();
    }

    preload() {
        this.addBackGround(this.positionIsNewUserConfig.chooseMain);
        this.addTextChoose(this.positionIsNewUserConfig.chooseMain.txt_choose);
        this.callNewUserGenresListRequest();
    }

    //** HANDLE CODE */

    addGroupFavoriteList(arrGenres) {
        this.arrGenres = arrGenres;
        this.chooseMain = new ChooseMainScreen(this.arrGenres);
        this.chooseMain.addEvent(this.onEventChoosePlaylist, this);
        this.addChild(this.chooseMain);
    }

    onEventChoosePlaylist(res) {
        if (res.cmd == "CHOOSED") {
            //
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Choose_genre_Buttons);
            //
            this.listChoicedFavorites.push(res.id);
            this.countChoice--;
            this.txtChoose.setText(`${Language.instance().getData(193)} ${this.countChoice} ${Language.instance().getData(194)}`);
            //
            if (this.listChoicedFavorites.length == 3) {
                this.chooseMain.destroy();
                this.sendUserSelectedGenres();
            }
        } else if (res.cmd == "HAS_CHILD") {
            for (let k = 0; k < res.childrenGenre.length; k++) {
                res.childrenGenre[k].choosed = false;
                for (let i = 0; i < this.listChoicedFavorites.length; i++) {
                    if (this.listChoicedFavorites[i] == res.childrenGenre[k].id) {
                        res.childrenGenre[k].choosed = true;
                        break;
                    } else {

                    }
                }
            }
            this.chooseUS_UK = new ChooseUS_UKChildren(res.childrenGenre, res.nameParent);
            this.chooseUS_UK.addEvent(this.onEventChildren, this);
            this.addChild(this.chooseUS_UK);
        } else if (res.cmd == "DISCHOOSED") {
            this.listChoicedFavorites = this.listChoicedFavorites.filter((obj) => {
                return obj !== res.id;
            });
            this.countChoice++;
            this.txtChoose.setText(`${Language.instance().getData(193)} ${this.countChoice} ${Language.instance().getData(194)}`);
        }
    }

    onEventChildren(res) {
        // LogConsole.log(res);
        if (res.type == "BACK") {
            this.chooseMain.revive();
        }
        if (res.cmd == "CHOOSED") {
            this.listChoicedFavorites.push(res.id);
            this.countChoice--;
            this.txtChoose.setText(`${Language.instance().getData(193)} ${this.countChoice} ${Language.instance().getData(194)}`);
            //
            if (this.listChoicedFavorites.length == 3) {
                this.chooseUS_UK.destroy();
                this.chooseMain.destroy();
                this.sendUserSelectedGenres();
            }
        } else if (res.cmd == "HAS_CHILD") {
            this.chooseUS_UK = new ChooseUS_UKChildren(res.childrenGenre, res.nameParent);
            this.chooseUS_UK.addEvent(this.onEventChildren, this);
            this.addChild(this.chooseUS_UK);
        } else if (res.cmd == "DISCHOOSED") {
            this.listChoicedFavorites = this.listChoicedFavorites.filter((obj) => {
                return obj !== res.id;
            });
            LogConsole.log(this.listChoicedFavorites);
            this.countChoice++;
            this.txtChoose.setText(`${Language.instance().getData(193)} ${this.countChoice} ${Language.instance().getData(194)}`);
        }
    }

    checkIfTabHasChild(tabId, callback) {
        var children = this.arrGenres.filter(ele => ele.parent == tabId);
        var isHasChild = false;
        if (children.length > 0) {
            isHasChild = true;
        } else {
            isHasChild = false;
        }
        callback(isHasChild, children);
    }

    onClickTextGenreBeFixedByDesign() {
        this.tabFavoriteChild.kill();
        this.grapFavoriteList.revive();
    }

    sendUserSelectedGenres() {
        var params = new SFS2X.SFSObject();
        var genreIds = new SFS2X.SFSArray();
        genreIds.addInt(this.listChoicedFavorites[0]);
        genreIds.addInt(this.listChoicedFavorites[1]);
        genreIds.addInt(this.listChoicedFavorites[2]);
        params.putSFSArray("genreIds", genreIds);
        //add listenerSFS
        SocketController.instance().sendData(DataCommand.NEW_USER_SELECTED_GENRES_REQUEST, params);
        //
        ControllLoading.instance().showLoading();
    }

    callNewUserGenresListRequest() {
        this.handleParamsOnNewUserGenres();
    }

    handleParamsOnSelectedPlaylist(params) {
        var playlists = params.getSFSArray('response');
        let arrInsertPlaylist = [];
        if (params.getUtfString('status') == 'OK') {
            for (let i = 0; i < playlists.size(); i++) {
                let playlist = playlists.getSFSObject(i);
                let thumb = playlist.getUtfString('thumb')
                let name = playlist.getUtfString('name');
                let isSoloMode = playlist.getInt('is_solo_mode');
                let id = playlist.getInt('id');
                this.arrBeGiven.push({
                    thumb: thumb,
                    name: name
                });
                if (isSoloMode == 0) {
                    // DataUser.instance().getNewPlaylist(id);
                    SqlLiteController.instance().insertTableUserPlaylistMappings(this.arrBeGiven)
                    let dataUser = new ShopUserPlayListMapping();
                    dataUser.playlist_id = id;
                    dataUser.user_id = SocketController.instance().dataMySeft.user_id;
                    dataUser.next_level_score = DataUser.instance().playlist_level_setting[dataUser.level + 1];
                    arrInsertPlaylist.push(dataUser);
                }
            }
            SqlLiteController.instance().insertTableUserPlaylistMappings(arrInsertPlaylist, true);
            SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.add(this.insertDataUserPlaylistMappingBuy, this);

        } else {
            console.warn(`Response NEW_USER_SELECTED_GENRES_RESPONSE error: ${params.getUtfString('message')}`);
        }
    }

    insertDataUserPlaylistMappingBuy() {
        SqlLiteController.instance().event.insert_data_user_playlist_mapping_complete.remove(this.insertDataUserPlaylistMappingBuy, this);
        this.createListPlaylistBeChoosed();
        //
        ControllLoading.instance().hideLoading();
    }

    handleParamsOnNewUserGenres() {
        this.loadPlaylistComplete();
    }

    //
    addEventExtension() {
        DataUser.instance().event.load_playlist_complete.add(this.loadPlaylistComplete, this);
    }
    removeEventExtension() {
        DataUser.instance().event.load_playlist_complete.remove(this.loadPlaylistComplete, this);
    }

    loadPlaylistComplete() {
        SqlLiteController.instance().event.get_data_genres_complete.add(this.getDataGenresComplete, this);
        SqlLiteController.instance().getGenresAll();
    }

    getDataGenresComplete(response) {
        SqlLiteController.instance().event.get_data_genres_complete.remove(this.getDataGenresComplete, this);
        this.arrGenres = response;
        this.addGroupFavoriteList(this.arrGenres);
        //
        ControllLoading.instance().hideLoading();
    }

    ifHasChild(children, tab) {
        this.addTextGenreBeFixedByDesignAfter(tab.id, tab.valueFavorite);
        this.grapFavoriteList.kill();
        this.addTabFavoriteChild(children);
    }
    //** DISPLAY CODE */
    addBackGround(configs) {
        let bg = game.add.sprite(configs.bg.x * window.GameConfig.RESIZE, configs.bg.y * window.GameConfig.RESIZE, configs.bg.nameSprite);
        let lineTop = new Phaser.Sprite(game, configs.line_top.x * window.GameConfig.RESIZE, configs.line_top.y * window.GameConfig.RESIZE, configs.line_top.nameAtlas, configs.line_top.nameSprite);
        bg.addChild(lineTop);
        this.addChild(bg);
    }

    addTextChoose(configs) {
        this.txtChoose = new Phaser.Text(game,
            configs.x * window.GameConfig.RESIZE,
            configs.y * window.GameConfig.RESIZE,
            `${configs.userChooseGenresLeft} ${this.countChoice} ${configs.userChooseGenresRight}`,
            configs.configs
        );
        this.txtChoose.anchor.set(0.5, 0);
        this.addChild(this.txtChoose);
    }

    createListPlaylistBeChoosed() {
        this.txtChoose.setText(Language.instance().getData(192));
        this.receivedList = new ReceivedPlaylistScreen(this.arrBeGiven);
        this.addChild(this.receivedList);
    }
    //
    destroy() {
        this.removeEventExtension();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}