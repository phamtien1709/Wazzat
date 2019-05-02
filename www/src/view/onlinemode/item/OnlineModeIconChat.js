export default class OnlineModeIconChat extends Phaser.Image {

    static get chenhao() {
        return "chenhao";
    }
    static get vuive() {
        return "vuive";
    }
    static get ngaingung() {
        return "ngaingung";
    }
    static get khoc() {
        return "khoc";
    }
    static get buon() {
        return "buon";
    }
    static get batngo() {
        return "batngo";
    }
    static get tucgian() {
        return "tucgian";
    }

    constructor(type) {
        super(game, 0, 0, "IconChatOnlineMode", "Circle_Icon");

        this.event = {
            "call_remove": new Phaser.Signal()
        }

        this.idRemove = null;

        this.iconChat = new Phaser.Sprite(game, 0, 0, "IconChatOnlineMode");
        this.iconChat.anchor.x = 0.5;
        this.iconChat.anchor.y = 0.5;
        this.iconChat.smoothed = true;
        this.addChild(this.iconChat);

        let objData = {
            prefix: "",
            start: 0,
            stop: 0,
            zeroPad: 5
        }

        if (type === OnlineModeIconChat.chenhao) {
            objData.prefix = "01_CuoiCheNhao_";
            objData.start = 0;
            objData.stop = 7;
        } else if (type === OnlineModeIconChat.vuive) {
            objData.prefix = "02_CuoiVuiVe_";
            objData.start = 0;
            objData.stop = 9;
        } else if (type === OnlineModeIconChat.ngaingung) {
            objData.prefix = "03_CuoiNgaiNgung_";
            objData.start = 0;
            objData.stop = 9;
        } else if (type === OnlineModeIconChat.khoc) {
            objData.prefix = "04_Khoc_";
            objData.start = 0;
            objData.stop = 9;
        } else if (type === OnlineModeIconChat.buon) {
            objData.prefix = "05_Buon_";
            objData.start = 0;
            objData.stop = 19;
        } else if (type === OnlineModeIconChat.batngo) {
            objData.prefix = "06_Batngo_";
            objData.start = 0;
            objData.stop = 14;
        } else if (type === OnlineModeIconChat.tucgian) {
            objData.prefix = "07_Tucgian_";
            objData.start = 0;
            objData.stop = 23;
        }

        this.action = this.iconChat.animations.add('playiconchat', Phaser.Animation.generateFrameNames(objData.prefix, objData.start, objData.stop, "", objData.zeroPad));
        this.action.play(30, true);

        this.removeIcon();
        this.idRemove = game.time.events.add(Phaser.Timer.SECOND * 2, this.callRemove, this);
    }

    removeIcon() {
        if (this.idRemove !== null) {
            game.time.events.remove(this.idRemove);
        }
    }

    callRemove() {
        this.event.call_remove.dispatch();
    }

    destroy() {
        this.removeIcon();
        super.destroy();
    }
}