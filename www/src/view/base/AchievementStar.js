import BaseView from "../BaseView.js";

export default class AchievementStar extends BaseView {
    constructor(level = 0) {
        super(game, null);
        if (level > 0) {
            this.setLevel(level);
        }
    }

    setLevel(level = 0, dataScale = 1) {
        let arrData = [];
        if (level === 1) {
            arrData.push({
                x: 47,
                y: 6,
                scale: 1
            });
        } else if (level === 2) {
            arrData.push({
                x: 40,
                y: 22,
                scale: 0.75
            });
            arrData.push({
                x: 73,
                y: 22,
                scale: 0.75
            });
        } else if (level === 3) {
            arrData.push({
                x: 21,
                y: 21,
                scale: 0.75
            });
            arrData.push({
                x: 47,
                y: 6,
                scale: 1
            });
            arrData.push({
                x: 91,
                y: 21,
                scale: 0.75
            });
        } else if (level === 4) {
            arrData.push({
                x: 18,
                y: 35,
                scale: 0.6
            });
            arrData.push({
                x: 40,
                y: 17,
                scale: 0.75
            });
            arrData.push({
                x: 73,
                y: 17,
                scale: 0.75
            });
            arrData.push({
                x: 104,
                y: 35,
                scale: 0.6
            });
        } else if (level === 5) {
            arrData.push({
                x: -1,
                y: 40,
                scale: 0.6
            });
            arrData.push({
                x: 21,
                y: 21,
                scale: 0.75
            });
            arrData.push({
                x: 47,
                y: 6,
                scale: 1
            });
            arrData.push({
                x: 91,
                y: 21,
                scale: 0.75
            });
            arrData.push({
                x: 120,
                y: 40,
                scale: 0.6
            });
        }
        console.log(arrData);
        for (let i = 0; i < arrData.length; i++) {
            let item = new Phaser.Sprite(game, arrData[i].x * dataScale, arrData[i].y * dataScale, "defaultSource", "Stars");
            item.scale.setTo(arrData[i].scale * dataScale, arrData[i].scale * dataScale);
            this.addChild(item);
        }
    }
}   