export default class ButtonTickDelete extends Phaser.Sprite {
    constructor(x, y, nameAtlas, nameSprite) {
        super(game, x, y, nameAtlas, nameSprite);
        this.anchor.set(0.5);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.inputEnabled = true;
        this.event = {
            tick: new Phaser.Signal()
        };
        this.addTick();
        this.events.onInputUp.add(() => {
            this.event.tick.dispatch();
        }, this);
    }

    addTick() {
        this.btn_tick = new Phaser.Sprite(game, this.positionMenuConfig.delete_game.tick_of_btn_delete.x, this.positionMenuConfig.delete_game.tick_of_btn_delete.y, this.positionMenuConfig.delete_game.tick_of_btn_delete.nameAtlas, this.positionMenuConfig.delete_game.tick_of_btn_delete.nameSprite);
        this.btn_tick.anchor.set(0.5);
        this.btn_tick.kill();
        this.addChild(this.btn_tick);
    }

    showTick() {
        if (this.btn_tick !== undefined) {
            this.btn_tick.revive();
        }
    }

    hideTick() {
        if (this.btn_tick !== undefined) {
            this.btn_tick.kill();
        }
    }
}