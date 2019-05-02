export default class Bubble extends Phaser.Sprite {
    constructor(nameSprite, index) {
        super(game, game.rnd.between(100, game.width - 100), game.height + 100, 'loadingNewSprites', nameSprite);
        this.arrBubble = ['Circle', 'Circle_White'];
        this.anchor.set(0.5);
        this.scale.set(game.rnd.between(5, 10) * 0.1);
        this.index = index;
        this.addBezier();
    }

    addBezier() {
        var pointBeziers = [
            {
                x: this.position.x,
                y: this.position.y
            },
            {
                x: game.rnd.between(100, game.width - 100),
                y: game.height - 1136 + 900
            },
            {
                x: game.rnd.between(100, game.width - 100),
                y: game.height - 1136 + 700
            },
            {
                x: game.rnd.between(100, game.width - 100),
                y: game.height - 1136 + 550
            }
        ];
        this.timeTweenBezier = game.time.events.add(Phaser.Timer.SECOND * (this.index * 0.45), () => {
            this.timeTweenAlpha = game.time.events.add(Phaser.Timer.SECOND * 1.9, () => {
                let tweenAlpha = game.add.tween(this).to({ alpha: 0.1 }, 1000, "Linear", false);
                tweenAlpha.start();
            })
            //
            let tween = game.add.tween(this).to({
                x: [pointBeziers[0].x, pointBeziers[1].x, pointBeziers[2].x, pointBeziers[3].x],
                y: [pointBeziers[0].y, pointBeziers[1].y, pointBeziers[2].y, pointBeziers[3].y],
            }, 3000, Phaser.Easing.Linear.In, false, 0, 0).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
            tween.start();
            tween.onComplete.add(() => {
                this.position.x = game.rnd.between(100, game.width - 100);
                this.position.y = game.height + 100;
                this.alpha = 1;
                this.scale.set(game.rnd.between(5, 10) * 0.1);
                this.loadTexture('loadingNewSprites', this.arrBubble[Math.floor(Math.random() * this.arrBubble.length)])
                this.addBezier();
            });
        })
    }

    destroy() {
        game.time.events.remove(this.timeTweenBezier);
        game.time.events.remove(this.timeTweenAlpha);
        super.destroy();
    }
}