import PlaylistBegivenSprite from "./PlaylistBegivenSprite.js";
import ChooseMainParentSprite from "../chooseMain/ChooseMainParentSprite.js";

import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ControllScreen from "../../../view/ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ListView from "../../../../libs/listview/list_view.js";
import MainData from "../../../model/MainData.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class ReceivedPlaylistScreen extends BaseGroup {
    constructor(arrBeGiven) {
        //arrBeGiven include GenresBeGiven from server
        super(game)
        this.positionIsNewUserConfig = JSON.parse(game.cache.getText('positionIsNewUserConfig'));
        this.arrBeGiven = arrBeGiven;
        this.listView;
        this.btnReceive;
        this.afterInit();
    }

    afterInit() {
        this.addListView();
        this.addBtnReceive(this.positionIsNewUserConfig.received.btn_receive);
    }

    addListView() {
        var groupPlaylists = new ChooseMainParentSprite(0, 0);
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 0;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35 * window.GameConfig.RESIZE, 249 * window.GameConfig.RESIZE, 569 * window.GameConfig.RESIZE, (game.height - 324) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        var listBeginX = 0;
        var listBeginY = 0;
        for (let i = 0; i < this.arrBeGiven.length; i++) {
            if (i % 3 == 0 && i > 0) {
                listBeginX = 0;
                listBeginY += window.GameConfig.CONFIGS_PLAYLIST_RECEIVED.y * window.GameConfig.RESIZE;
                groupPlaylists.height += window.GameConfig.CONFIGS_PLAYLIST_RECEIVED.y * window.GameConfig.RESIZE;
                //
                let line = new Phaser.Sprite(game, 0 * window.GameConfig.RESIZE, (window.GameConfig.CONFIGS_PLAYLIST_RECEIVED.y - 40) * window.GameConfig.RESIZE, 'defaultSource', "Line");
                groupPlaylists.addChild(line);
            } else if (i == 0) {
                listBeginX = 0;
            } else {
                listBeginX += window.GameConfig.CONFIGS_PLAYLIST_RECEIVED.x * window.GameConfig.RESIZE;
            }
            let genreSprite = new PlaylistBegivenSprite(listBeginX, listBeginY, this.arrBeGiven[i], i);
            groupPlaylists.add(genreSprite);
        }
        this.listView.add(groupPlaylists);
    }

    addBtnReceive(configs) {
        this.btn_receive = new Phaser.Sprite(game, configs.btn.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + configs.btn.y) * window.GameConfig.RESIZE, configs.btn.nameAtlas, configs.btn.nameSprite);
        this.btn_receive.inputEnabled = true;
        this.btn_receive.events.onInputUp.add(this.onClickReceived, this);
        this.txt_rececive;
        this.addTxtBtn(configs);
        this.addChild(this.btn_receive);
    }

    onClickReceived() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.destroy();
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }

    addTxtBtn(configs) {
        this.txt_rececive = new Phaser.Text(game, this.btn_receive.width / 2, this.btn_receive.height / 2, configs.txt_receive.text, configs.txt_receive.configs);
        this.txt_rececive.anchor.set(0.5);
        this.btn_receive.addChild(this.txt_rececive);
    }
    //
    destroy() {
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