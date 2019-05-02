import GenreSprite from "./GenreSprite.js";

import ChooseMainParentSprite from "./ChooseMainParentSprite.js";
import ListView from "../../../../libs/listview/list_view.js";
// import ChooseUS_UKChildren from "../chooseUS-UK/ChooseUS_UKChildren.js";

export default class ChooseMainScreen extends Phaser.Sprite {
    constructor(arrGenres) {
        super(game, 0, 249 * window.GameConfig.RESIZE, null);
        this.arrGenres = arrGenres;
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        // this.listViewMain;
        this.afterInit();
        this.signalEvent = new Phaser.Signal();
        // LogConsole.log(this.arrGenres);
    }

    afterInit() {
        this.listViewMain;
        this.chooseChildrenGenre;
        this.fatherParentGenres = this.arrGenres.filter(ele => ele.parent == 0);
        this.addParentGenres();
    }

    addParentGenres() {
        // this.fatherParentGenres.splice(6, 1);
        // LogConsole.log(this.positionIsNewUserConfig.chooseMain.genres);
        var groupGenres = new ChooseMainParentSprite(0, 0);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 0;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 0, 570 * window.GameConfig.RESIZE, (game.height - 141) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listViewMain = new ListView(game, gr, bounds, options);
        var listGenreBeginX = 0;
        var listGenreBeginY = 0;
        // LogConsole.log(this.fatherParentGenres);
        for (let index = 0; index < this.fatherParentGenres.length; index++) {
            if (index % 2 == 0 && index > 0) {
                listGenreBeginX = 0;
                listGenreBeginY += window.GameConfig.CONFIGS_GENRE.y * window.GameConfig.RESIZE;
                groupGenres.height += window.GameConfig.CONFIGS_GENRE.y * window.GameConfig.RESIZE;
            } else if (index == 0) {
                listGenreBeginX = 0;
            } else {
                listGenreBeginX += window.GameConfig.CONFIGS_GENRE.x * window.GameConfig.RESIZE;
            }
            let children = this.arrGenres.filter(ele => ele.parent == this.fatherParentGenres[index].id);
            let genreSprite = new GenreSprite(
                listGenreBeginX,
                listGenreBeginY,
                this.positionIsNewUserConfig.chooseMain.genres[this.fatherParentGenres[index].code],
                this.fatherParentGenres[index],
                children,
                index);
            genreSprite.addEventInput(this.onClickGenreSprite, this);
            groupGenres.add(genreSprite);
        }
        this.listViewMain.add(groupGenres);
    }

    onClickGenreSprite(res) {
        // console.log('HOHOHOH');
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

    set height(_height) {
        this._height = _height;
    }

    get height() {
        return this._height;
    }

    addEvent(callback, scope) {
        // callback();
        this.signalEvent.add(callback, scope);
    }
    removeEvent(callback, scope) {
        this.signalEvent.remove(callback, scope);
    }
}