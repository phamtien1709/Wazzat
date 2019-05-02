import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import Ranking from "../Ranking.js";
import MainData from "../../../model/MainData.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";

export default class RankingItemTopDiamond extends BaseView {

    static get DIAMOND() {
        return 0;
    }

    static get LEVEL() {
        return 1;
    }

    constructor(data, idx, tabIdx, isMe = false) {
        super(game, null);
        this.data = data;
        this.positionRanking = JSON.parse(game.cache.getText('positionRanking'));
        let type = 0;
        if (tabIdx === Ranking.TOP_DIAMOND) {
            type = RankingItemTopDiamond.DIAMOND;
        } else {
            type = RankingItemTopDiamond.LEVEL;
        }
        this.tween = null;
        this.idx = idx;
        this.ava = new AvatarPlayer();
        this.ava.setSize(65 * MainData.instance().scale, 65 * MainData.instance().scale);
        this.ava.x = 149 * MainData.instance().scale;
        this.ava.y = 32 * MainData.instance().scale;

        this.btnMaskAva = new Phaser.Button(game, this.ava.x, this.ava.y, null, this.chooseAva, this)
        this.btnMaskAva.width = this.ava.width;
        this.btnMaskAva.height = this.ava.height;
        this.addChild(this.btnMaskAva);

        if (idx === 0) {
            this.bg = new SpriteBase(this.positionRanking.item_ranking_bg_top1);
            this.addChild(this.bg);
            this.addChild(this.ava);
            this.bgTopAvata = new SpriteBase(this.positionRanking.item_ranking_avatar_top1);
        } else if (idx === 1) {
            this.bg = new SpriteBase(this.positionRanking.item_ranking_bg_top2);
            this.addChild(this.bg);
            this.addChild(this.ava);
            this.bgTopAvata = new SpriteBase(this.positionRanking.item_ranking_avatar_top2);
        } else if (idx === 2) {
            this.bg = new SpriteBase(this.positionRanking.item_ranking_bg_top3);
            this.addChild(this.bg);
            this.addChild(this.ava);
            this.bgTopAvata = new SpriteBase(this.positionRanking.item_ranking_avatar_top3);
        } else {
            this.addChild(this.ava);
            this.ava.x = 137 * MainData.instance().scale;
            this.ava.y = 27 * MainData.instance().scale;
            this.bgTopAvata = new SpriteBase(this.positionRanking.item_ranking_avatar_top4);
            this.line = new SpriteBase(this.positionRanking.item_ranking_line_space);
            this.addChild(this.line);
        }
        this.addChild(this.bgTopAvata);

        if (idx < 3) {
            this.txtStt = new TextBase(this.positionRanking.item_ranking_text_top123, (idx + 1));
            this.txtStt.setTextBounds(0, 0, 28 * MainData.instance().scale, 27 * MainData.instance().scale);
            this.txtUserName = new TextBase(this.positionRanking.item_ranking_text_user_name123, this.formatName(data.user_name, 15));

        } else {
            this.txtStt = new TextBase(this.positionRanking.item_ranking_text_top4, (idx + 1));
            this.txtUserName = new TextBase(this.positionRanking.item_ranking_text_user_name4, this.formatName(data.user_name, 15));
            //
        }
        if (type === RankingItemTopDiamond.DIAMOND) {
            /*
            if (idx < 3) {
                this.btnDiamond = new ButtonWithText(this.positionRanking.item_ranking_btn_diamond_top1, data.diamond);
            } else {
                this.btnDiamond = new ButtonWithText(this.positionRanking.item_ranking_btn_diamond_top4, data.diamond);
            }*/

            if (idx < 3) {
                this.btnDiamond = new ButtonWithText(this.positionRanking.item_ranking_btn_level_top, data.playlist_number);
            } else {
                this.btnDiamond = new ButtonWithText(this.positionRanking.item_ranking_btn_level_top4, data.playlist_number);
            }

            this.addChild(this.btnDiamond);
            this.txtUserName.setTextBounds(0, 0, 219 * MainData.instance().scale, 60 * MainData.instance().scale);
        } else {

            let str = "";

            if (tabIdx === Ranking.TOP_LEVEL) {
                str = data.level;
            }
            if (tabIdx === Ranking.TOP_TURNBASE || tabIdx === Ranking.TOP_ONLINEMODE) {
                str = data.count_win;
            }

            console.log("str : " + str);

            if (idx < 3) {
                this.btnLevel = new ButtonWithText(this.positionRanking.item_ranking_btn_level_top, str);
            } else {
                this.btnLevel = new ButtonWithText(this.positionRanking.item_ranking_btn_level_top4, str);
            }
            this.addChild(this.btnLevel);
            this.txtUserName.setTextBounds(0, 0, 284 * MainData.instance().scale, 60 * MainData.instance().scale);

        }


        this.addChild(this.txtStt);
        this.addChild(this.txtUserName);

        if (isMe) {
            this.ava.setAvatar(data.avatar, 0);
        } else {
            this.ava.setAvatar(data.avatar, idx);
        }

        if (idx < 3) {
            if (this.data.vip === true) {
                let vipLbl = new Phaser.Image(game, 147, 83, 'vipSource', 'Label_VIP');
                vipLbl.anchor.set(0.5);
                this.bgTopAvata.addChild(vipLbl);
            }
        } else {
            if (this.data.vip === true) {
                let vipLbl = new Phaser.Image(game, 138, 68, 'vipSource', 'Label_VIP');
                vipLbl.anchor.set(0.5);
                this.bgTopAvata.addChild(vipLbl);
            }
        }

        if (isMe === true) {
        } else {
            if (idx < 8) {
                this.x = game.width;
                this.tween = game.add.tween(this).to({
                    x: 0
                }, 250, Phaser.Easing.Power1, true, 80 * (idx + 1));
            } else {
                this.x = 0;
            }
        }

    }

    chooseAva() {
        console.log("clickAva");
        ControllScreenDialog.instance().addUserProfile(this.data.id);
    }

    removeTween() {
        if (this.tween !== null) {
            this.tween.stop();
            game.tweens.remove(this.tween);
            this.tween = null;
        }
    }

    get width() {
        return game.width;
    }
    get height() {
        if (this.idx < 3) {
            return 145 * MainData.instance().scale;
        } else {
            return 127 * MainData.instance().scale;
        }
    }

    destroy() {
        this.removeTween();
        super.destroy();
    }
}