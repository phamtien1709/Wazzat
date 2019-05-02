import PopupClaimSoloModeChild from "./item/PopupClaimSoloModeChild.js";
import SocketController from "../../controller/SocketController.js";
import BaseGroup from "../BaseGroup.js";

export default class PopupClaimSoloMode extends BaseGroup {
    constructor(playlist, reward) {
        super(game);
        this.positionPopup = JSON.parse(game.cache.getText('positionPopup'));
        this.dailyRewardConfig = JSON.parse(game.cache.getText('dailyRewardConfig'));
        this.playlist = playlist;
        this.reward = reward;
        this.afterInit();
    }

    afterInit() {
        this.bg;
        this.popup;
        this.headerResource;
        this.addBG();
        this.addHeaderResource();
        this.addPopup();
    }

    addBG() {
        this.bg = new Phaser.Button(game, 0, 0, "screen-dim");
        this.addChild(this.bg)
    }

    addHeaderResource() {
        this.headerResource = new Phaser.Sprite(game, 0, 0, null);
        this.addChild(this.headerResource);
        this.txtGem;
        this.txtTicket;
        this.txtMic;
        this.tabGemHeader;
        this.tabTicketHeader;
        this.tabMicHeader;
        this.addTabGemHeader(this.dailyRewardConfig.header);
        this.addTabTicketHeader(this.dailyRewardConfig.header);
        this.addTabMicHeader(this.dailyRewardConfig.header);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x * window.GameConfig.RESIZE, configs.tabGem.y * window.GameConfig.RESIZE, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.dailyRewardConfig.header.gem);
        this.txtGem = this.addTxtGem(this.dailyRewardConfig.header.txtResource);
        let sumWidth = gem.width + this.txtGem.width;
        this.txtGem.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGemHeader.width - sumWidth) / 2) + this.txtGem.width + 10 * window.GameConfig.RESIZE;
        this.tabGemHeader.addChild(gem);
        this.tabGemHeader.addChild(this.txtGem);
        //
        this.headerResource.addChild(this.tabGemHeader);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtGem(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
    }

    addTabTicketHeader(configs) {
        this.tabTicketHeader = new Phaser.Sprite(game, configs.tabTicket.x * window.GameConfig.RESIZE, configs.tabTicket.y * window.GameConfig.RESIZE, configs.tabTicket.nameAtlas, configs.tabTicket.nameSprite);
        //
        let ticket = this.addTicket(this.dailyRewardConfig.header.ticket);
        this.txtTicket = this.addTxtTicket(this.dailyRewardConfig.header.txtResource);
        let sumWidth = ticket.width + this.txtTicket.width;
        this.txtTicket.x = ((this.tabTicketHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        ticket.x = ((this.tabTicketHeader.width - sumWidth) / 2) + this.txtTicket.width + 10 * window.GameConfig.RESIZE;
        this.tabTicketHeader.addChild(ticket);
        this.tabTicketHeader.addChild(this.txtTicket);
        //
        this.headerResource.addChild(this.tabTicketHeader);
    }
    addTicket(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtTicket(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value, configs.configs);
    }

    addTabMicHeader(configs) {
        this.tabMicHeader = new Phaser.Sprite(game, configs.tabMic.x * window.GameConfig.RESIZE, configs.tabMic.y * window.GameConfig.RESIZE, configs.tabMic.nameAtlas, configs.tabMic.nameSprite);
        //
        let mic = this.addMic(this.dailyRewardConfig.header.micro);
        this.txtMic = this.addTxtMic(this.dailyRewardConfig.header.txtResource);
        let sumWidth = mic.width + this.txtMic.width;
        this.txtMic.x = ((this.tabMicHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        mic.x = ((this.tabMicHeader.width - sumWidth) / 2) + this.txtMic.width + 10 * window.GameConfig.RESIZE;
        this.tabMicHeader.addChild(mic);
        this.tabMicHeader.addChild(this.txtMic);
        //
        this.headerResource.addChild(this.tabMicHeader);
    }
    addMic(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtMic(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value, configs.configs);
    }

    addPopup() {
        this.popup = new PopupClaimSoloModeChild(this.playlist, this.reward);
        this.addChild(this.popup);
    }
}