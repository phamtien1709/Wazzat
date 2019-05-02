import ChooseMainParentSprite from "../chooseMain/ChooseMainParentSprite.js";
import GenreSprite from "../chooseMain/GenreSprite.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ListView from "../../../../libs/listview/list_view.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class ChooseUS_UKChildren extends BaseGroup {
    constructor(arrGenres, genreParent) {
        super(game)
        this.arrGenres = arrGenres;
        this.genreParent = genreParent;
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        // this.listView;
        this.afterInit();
        this.signalEvent = new Phaser.Signal();
        // LogConsole.log(this.arrGenres);
    }

    afterInit() {
        this.listView;
        this.btnBack;
        this.txtParentGenre;
        this.addBtnBack(this.positionIsNewUserConfig.chooseUS_UK.btn_back);
        this.addTxtParentGenre(this.positionIsNewUserConfig.chooseUS_UK.txt_parent);
        this.addGenres();
    }

    addBtnBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.addChild(this.btnBack);
    }

    onBack() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalEvent.dispatch({
            type: "BACK"
        });
        this.destroy();
    }

    addTxtParentGenre(configs) {
        this.txtParentGenre = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.genreParent, configs.configs);
        this.txtParentGenre.anchor.set(0.5, 0);
        this.addChild(this.txtParentGenre);
    }

    addGenres() {
        var groupGenres = new ChooseMainParentSprite(0, 0);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 0;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 248 * window.GameConfig.RESIZE, 570 * window.GameConfig.RESIZE, (game.height - 141) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        var listGenreBeginX = 0;
        var listGenreBeginY = 0;
        for (let index = 0; index < this.arrGenres.length; index++) {
            if (index % 2 == 0 && index > 0) {
                listGenreBeginX = 0;
                listGenreBeginY += window.GameConfig.CONFIGS_GENRE.y * window.GameConfig.RESIZE;
                groupGenres.height += window.GameConfig.CONFIGS_GENRE.y * window.GameConfig.RESIZE;
            } else if (index == 0) {
                listGenreBeginX = 0;
            } else {
                listGenreBeginX += window.GameConfig.CONFIGS_GENRE.x * window.GameConfig.RESIZE;
            }
            let children = this.arrGenres.filter(ele => ele.parent == this.arrGenres[index].id);
            let genreSprite = new GenreSprite(listGenreBeginX, listGenreBeginY, this.positionIsNewUserConfig.chooseUS_UK.genres[this.arrGenres[index].code], this.arrGenres[index], children, index);
            genreSprite.addEventInput(this.onClickGenreSprite, this);
            groupGenres.add(genreSprite);
        }
        this.listView.add(groupGenres);
    }

    onClickGenreSprite(res) {
        if (res.cmd == "CHOOSED") {
            this.signalEvent.dispatch({
                cmd: "CHOOSED",
                id: res.id
            });
        } else if (res.cmd == "HAS_CHILD") {
            this.kill();
            // this.chooseChildrenGenre = new ChooseUS_UKChildren(res.childrenGenre);
            this.signalEvent.dispatch({
                cmd: "HAS_CHILD",
                childrenGenre: res.childrenGenre,
                nameParent: res.nameParent
            })
        } else if (res.cmd == "DISCHOOSED") {
            this.signalEvent.dispatch({
                cmd: "DISCHOOSED",
                id: res.id
            });
        }
    }

    addEvent(callback, scope) {
        this.signalEvent.add(callback, scope);
    }
    removeEvent(callback, scope) {
        this.signalEvent.remove(callback, scope);
    }
}