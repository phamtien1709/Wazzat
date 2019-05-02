import BaseGroup from "../../view/BaseGroup.js";

export default class TetTheme extends BaseGroup {
    constructor() {
        super(game)
        this.positionBootConfig = JSON.parse(game.cache.getText('positionBootConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addFireWork();
        this.addFlower1();
        this.addFlower2();
    }

    addFireWork() {
        this.fireWork = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 180 * window.GameConfig.RESIZE, 'firework');
        this.fireWork.anchor.set(0.5);
        this.fireWork.scale.set(1.3);
        this.addChild(this.fireWork);
        var runFireWork = this.fireWork.animations.add('run_firework');
        this.fireWork.animations.play('run_firework', 30, true);
    }

    addFlower1() {
        this.flower1 = new Phaser.Sprite(game, this.positionBootConfig.tet_theme.flower1.x, this.positionBootConfig.tet_theme.flower1.y, this.positionBootConfig.tet_theme.flower1.nameAtlas, this.positionBootConfig.tet_theme.flower1.nameSprite);
        this.flower1.angle = 4;
        this.addChild(this.flower1);
        var tweenAngle = game.add.tween(this.flower1).to({ angle: 0 }, 1500, Phaser.Easing.Linear.None, true, 0, -1);
        tweenAngle.yoyo(true, 0);
    }

    addFlower2() {
        this.flower2 = new Phaser.Sprite(game, this.positionBootConfig.tet_theme.flower2.x, this.positionBootConfig.tet_theme.flower2.y, this.positionBootConfig.tet_theme.flower2.nameAtlas, this.positionBootConfig.tet_theme.flower2.nameSprite);
        this.flower2.angle = 5;
        this.addChild(this.flower2);
        //
        var tweenAngle = game.add.tween(this.flower2).to({ angle: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, -1);
        tweenAngle.yoyo(true, 0);
    }
}