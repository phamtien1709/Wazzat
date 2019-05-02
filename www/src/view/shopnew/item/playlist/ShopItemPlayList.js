import MainData from "../../../../model/MainData.js";
import ButtonBase from "../../../component/ButtonBase.js";
import AvatarAlbum from "../../../base/AvatarAlbum.js";
import TextBase from "../../../component/TextBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import LevelPlaylist from "../../../base/LevelPlaylist.js";
import SocketController from "../../../../controller/SocketController.js";
import Language from "../../../../model/Language.js";
import BaseGroup from "../../../BaseGroup.js";

export default class ShopItemPlayList extends BaseGroup {

    constructor() {
        super(game, null);

        this.event = {
            BUY: new Phaser.Signal(),
            CHOOSE: new Phaser.Signal(),
            TOVIP: new Phaser.Signal()
        }
        this.data = null;
        this.positionShop = MainData.instance().positionDefaultSource;

        this.bgButton = new ButtonBase(this.positionShop.playlist_button_buy, this.chooseItem, this);
        this.bgButton.alpha = 0;
        this.bgButton.x = 0;
        this.bgButton.y = 0;
        this.bgButton.width = 166 * MainData.instance().scale;
        this.bgButton.height = 260 * MainData.instance().scale;
        this.addChild(this.bgButton);

        this.ava = new AvatarAlbum();
        this.ava.setSize(166 * MainData.instance().scale, 166 * MainData.instance().scale);
        this.addChild(this.ava);

        this.lbName = new TextBase(this.positionShop.gennes_text_name_playlist, "");
        this.lbName.lineSpacing = 6;
        this.lbName.setTextBounds(0, 0, 166 * MainData.instance().scale, 89 * MainData.instance().scale);
        this.addChild(this.lbName)

        this.btnBuy = new ButtonWithText(this.positionShop.playlist_button_buy, "", this.chooseBuy, this);
        this.btnBuy.visible = false;
        this.addChild(this.btnBuy);

        this.btnUpToVip = new ButtonWithText(this.positionShop.playlist_button_buy_vip, Language.instance().getData("141"), this.chooseUpVip, this);
        this.addChild(this.btnUpToVip);

        this.lbWarning = new TextBase(this.positionShop.playlist_text_warning, "");
        this.lbWarning.setTextBounds(0, 0, 166 * MainData.instance().scale, 41 * MainData.instance().scale);
        this.lbWarning.text = "";
        this.addChild(this.lbWarning);


        this.labelVip = new Phaser.Sprite(game, 0, 140, 'vipSource', 'Lable_Vip');
        this.labelVip.kill();
        this.addChild(this.labelVip);

        this.addLayout = game.add.group();
        this.addLayout.x = 6 * MainData.instance().scale;
        this.addLayout.y = 250 * MainData.instance().scale;
        this.addChild(this.addLayout);
    }
    get width() {
        return this.ava.width;
    }

    get height() {
        return 326 * MainData.instance().scale;
    }

    chooseItem() {
        //LogConsole.log("ShopItemPlayList - chooseItem");
        //console.log(this.data);
        this.event.CHOOSE.dispatch(this.data);
    }

    chooseBuy() {
        //LogConsole.log("chooseBuy : " + this.parent.x + " --- " + this.parent.y + "this.data  " + this.data.id);
        this.event.BUY.dispatch(this.data);
    }

    chooseUpVip() {
        this.event.TOVIP.dispatch();
    }



    setData(data, idx) {
        // console.log('data.user');
        //console.log(data.user);
        this.data = data;
        if (data !== null) {
            this.addLayout.removeChildren();
            this.ava.beginLoad(this.data.thumb, idx);
            this.lbName.text = this.data.name;
            if (this.data.is_owner == 1) {
                this.btnBuy.visible = false;

                let start = new LevelPlaylist(data.user);
                this.addLayout.addChild(start);

            } else {
                this.btnBuy.setText(this.data.price);
                this.btnBuy.visible = true;
            }

            if (this.data.vip === true) {
                if (SocketController.instance().dataMySeft.vip === true) {
                    this.btnUpToVip.visible = false;
                } else {
                    this.btnBuy.visible = false;
                    if (this.data.is_owner == 1) {
                        this.btnUpToVip.visible = false;
                    } else {
                        this.btnUpToVip.visible = true;
                    }
                }
                this.labelVip.revive();
            } else {
                this.btnUpToVip.visible = false;
            }
        }
    }

    getData() {
        return this.data;
    }

    destroy() {
        if (this.children) {
            while (this.children.length > 0) {
                let item = this.children[0];
                this.removeChild(item);
                item.destroy();
                item = null;
            }
        }
        super.destroy();
    }
}