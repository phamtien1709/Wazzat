import BaseView from "../../../BaseView.js";

export default class OnlineModeQuickChatItem extends BaseView {
    constructor(label = "", icon = "") {
        super(game, null);
        this.event = {
            choose_item: new Phaser.Signal()
        }
        this.label = label;
        this.icon = icon;
        this.textChat = game.add.text(0, 0, label, {
            fill: "#333333",
            font: "Gilroy",
            fontSize: 23
        }, this);
        this.addChild(this.textChat);

        this.iconChat = this.create(0, 0, "createroom", this.icon);
        this.textChat.x = (320 - (this.textChat.width + 10 + this.iconChat.width)) / 2;
        this.textChat.y = 30;
        this.iconChat.x = this.textChat.x + this.textChat.width + 10;
        this.iconChat.y = 15;


        this.btnChoose = game.make.button(0, 0, "", this.chooseItem, this);
        this.btnChoose.width = 320;
        this.btnChoose.height = 85;
        this.addChild(this.btnChoose);
    }
    chooseItem() {
        this.event.choose_item.dispatch(this.label, this.icon);
    }

}