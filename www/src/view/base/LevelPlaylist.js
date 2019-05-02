import BaseView from "../BaseView.js";
import ShopUserPlayListMapping from "../../model/shop/data/ShopUserPlayListMapping.js";
import CurrenLevelPlaylist from "./CurrenLevelPlaylist.js";
import MainData from "../../model/MainData.js";
import SpriteBase from "../component/SpriteBase.js";

export default class LevelPlaylist extends BaseView {
    constructor(user = {}, tint = true) {
        super(game, null);

        this.user = new ShopUserPlayListMapping();

        this.setData(user, tint);

    }

    setData(user, tint = true) {

        this.user = Object.assign({}, this.user, user);
        this.removeAllItem();
        //user.level = 5;
        if (this.user.level < 5) {
            let beginX = 0;
            for (let i = 0; i < 5; i++) {
                let item = null;
                if (i == user.level) {
                    item = new CurrenLevelPlaylist(tint);
                    item.setMaxLoading(((this.user.exp_score - this.user.current_level_score) * 100) / (this.user.next_level_score - this.user.current_level_score));
                } else {
                    let obj = {
                        x: 0,
                        y: 10,
                        nameAtlas: "defaultSource",
                        nameSprite: "LevelActive"
                    }
                    if (tint) {
                        if (i < this.user.level) {
                            obj.nameSprite = "LevelActive1";
                        } else {
                            obj.nameSprite = "LevelDeactive1";
                        }
                    } else {
                        if (i < this.user.level) {
                            obj.nameSprite = "LevelActive";
                        } else {
                            obj.nameSprite = "LevelDeactive";
                        }
                    }
                    item = new SpriteBase(obj);
                }
                item.x = beginX;

                this.addChild(item);

                if (i < 4) {
                    beginX += item.width + 7 * MainData.instance().scale;
                } else {
                    beginX += item.width;
                }
            }


            LogConsole.log(this.children.length);
            this._width = beginX;
        } else {
            let obj = {
                x: 4,
                y: 7,
                nameAtlas: "defaultSource",
                nameSprite: "Master_Icon"
            }

            let item = new SpriteBase(obj);
            this.addChild(item);
            this._width = item.width + 5;
        }

    }

    get width() {
        return this._width;
    }
}