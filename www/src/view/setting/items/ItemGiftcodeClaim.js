import SocketController from "../../../controller/SocketController.js";
import AnimClaimReward from "../../../modules/menu/QuestAndAchievement/items/AnimClaimReward.js";

export default class ItemGiftcodeClaim extends Phaser.Button {
    constructor(claimValues) {
        // claimValues = {
        //     type
        // }
        super(game, 0, 0, 'screen-dim2');
        this.positionSetting = JSON.parse(game.cache.getText('positionSetting'));
        this.claimValues = claimValues;
        this.getReward();
        this.afterInit();
    }

    static get HEART() {
        return "HEART";
    }

    static get DIAMOND() {
        return "DIAMOND";
    }

    static get TICKET() {
        return "TICKET";
    }

    static get SUPPORT_ITEM() {
        return "SUPPORT_ITEM";
    }

    getReward() {
        this.rewards = [];
        if (this.claimValues.diamond > 0) {
            this.rewards.push({
                type: ItemGiftcodeClaim.DIAMOND,
                reward: this.claimValues.diamond
            })
        }
        if (this.claimValues.heart > 0) {
            this.rewards.push({
                type: ItemGiftcodeClaim.HEART,
                reward: this.claimValues.heart
            })
        }
        if (this.claimValues.ticket > 0) {
            this.rewards.push({
                type: ItemGiftcodeClaim.TICKET,
                reward: this.claimValues.ticket
            })
        }
        if (this.claimValues.support_item > 0) {
            this.rewards.push({
                type: ItemGiftcodeClaim.SUPPORT_ITEM,
                reward: this.claimValues.support_item
            })
        }
    }

    afterInit() {
        this.addHeaderTab(this.positionSetting.header);
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerTab);
        //
        this.btnBack;
        this.addButtonBack(configs.btn_back);
        this.addTxtSetting(configs.txt_giftcode);
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.headerTab.addChild(this.btnBack);
    }

    addTxtSetting(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.text, configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addGift() {
        let maxIndex = this.rewards.length;
        this.txtQuest.kill();
        for (i = 0; i < maxIndex; i++) {
            this.addClaim(this.rewards[i].type, this.rewards[i].reward, i, maxIndex);
        }
    }

    addClaim(type, reward, index, maxIndex) {
        let tabResource = this.addTabResource(this.positionSetting.header, type, reward);
        this.addChild(tabResource);
        this.timeTweenBox = game.time.events.add(Phaser.Timer.SECOND * 3 * index, () => {
            let tweenBoxResource = game.add.tween(tabResource).to({ y: this.positionSetting.header.tab_resource.y }, 200, Phaser.Easing.Back.Out, false);
            tweenBoxResource.start();
            tweenBoxResource.onComplete.add(() => {
                let animClaimReward = new AnimClaimReward(type, reward, {
                    x: 355,
                    y: 47
                })
                this.addChild(animClaimReward);
                //
                this.timeTweenTxtRs = game.time.events.add(Phaser.Timer.SECOND * 1.5, () => {
                    if (type == ItemGiftcodeClaim.DIAMOND) {
                        let tweenTxt = game.add.tween(tabResource.txtResource).to({ text: SocketController.instance().socket.mySelf.getVariable('diamond').value }, 500, Phaser.Easing.Back.Out, false);
                        tweenTxt.start();
                        tweenTxt.onUpdateCallback(() => {
                            // LogConsole.log('vao');
                            tabResource.txtResource.text = parseInt(tabResource.txtResource.text);
                        }, this);
                    } else if (type == ItemGiftcodeClaim.TICKET) {
                        let tweenTxt = game.add.tween(tabResource.txtResource).to({ text: SocketController.instance().socket.mySelf.getVariable('ticket').value }, 500, Phaser.Easing.Back.Out, false);
                        tweenTxt.start();
                        tweenTxt.onUpdateCallback(() => {
                            // LogConsole.log('vao');
                            tabResource.txtResource.text = parseInt(tabResource.txtResource.text);
                        }, this);
                    } else if (type == ItemGiftcodeClaim.HEART) {
                        let tweenTxt = game.add.tween(tabResource.txtResource).to({ text: SocketController.instance().socket.mySelf.getVariable('heart').value }, 500, Phaser.Easing.Back.Out, false);
                        tweenTxt.start();
                        tweenTxt.onUpdateCallback(() => {
                            // LogConsole.log('vao');
                            tabResource.txtResource.text = parseInt(tabResource.txtResource.text);
                        }, this);
                    } else if (type == ItemGiftcodeClaim.SUPPORT_ITEM) {
                        let tweenTxt = game.add.tween(tabResource.txtResource).to({ text: SocketController.instance().socket.mySelf.getVariable('support_item').value }, 500, Phaser.Easing.Back.Out, false);
                        tweenTxt.start();
                        tweenTxt.onUpdateCallback(() => {
                            // LogConsole.log('vao');
                            tabResource.txtResource.text = parseInt(tabResource.txtResource.text);
                        }, this);
                    }
                })
                //
                this.timeTweenBoxRs = game.time.events.add(Phaser.Timer.SECOND * 2.5, () => {
                    let tweenBoxResource = game.add.tween(tabResource).to({ y: -100 }, 200, Phaser.Easing.Back.Out, false);
                    tweenBoxResource.start();
                })
            }, this);
        });
        if (index == maxIndex - 1) {
            this.timeTweenDestroy = game.time.events.add(Phaser.Timer.SECOND * maxIndex * 3, () => {
                this.destroy();
            });
        }
    }

    addTabResource(configs, type, reward) {
        let tab = new Phaser.Sprite(game, configs.tab_resource.x * window.GameConfig.RESIZE, -100 * window.GameConfig.RESIZE, configs.tab_resource.nameAtlas, configs.tab_resource.nameSprite);
        //
        tab.iconResourse = this.addGem(this.positionSetting.header.icon_resource, type);
        tab.txtResource = this.addTxtGem(this.positionSetting.header.txt_resource, type, reward);
        //
        let sumWidth = tab.iconResourse.width + tab.txtResource.width;
        //
        tab.txtResource.x = ((tab.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        tab.iconResourse.x = ((tab.width - sumWidth) / 2) + tab.txtResource.width + 5 * window.GameConfig.RESIZE;
        tab.addChild(tab.iconResourse);
        tab.addChild(tab.txtResource);
        //
        // this.addChild(tabResource);
        return tab;
    }

    addGem(configs, type) {
        let nameSprite = "";
        if (type == ItemGiftcodeClaim.DIAMOND) {
            nameSprite = "Gem";
        } else if (type == ItemGiftcodeClaim.TICKET) {
            nameSprite = "Ticket";
        } else if (type == ItemGiftcodeClaim.HEART) {
            nameSprite = "Heart";
        } else if (type == ItemGiftcodeClaim.SUPPORT_ITEM) {
            nameSprite = "Mic";
        }
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, nameSprite);
    }

    addTxtGem(configs, type, reward) {
        if (type == ItemGiftcodeClaim.DIAMOND) {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value - reward, configs.configs);
        } else if (type == ItemGiftcodeClaim.TICKET) {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value - reward, configs.configs);
        } else if (type == ItemGiftcodeClaim.HEART) {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value - reward, configs.configs);
        } else if (type == ItemGiftcodeClaim.SUPPORT_ITEM) {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value - reward, configs.configs);
        }
    }

    destroy() {
        game.time.events.remove(this.timeTweenBox);
        game.time.events.remove(this.timeTweenTxtRs);
        game.time.events.remove(this.timeTweenBoxRs);
        game.time.events.remove(this.timeTweenDestroy);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}