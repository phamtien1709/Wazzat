import Test from "../view/Test.js";

export default class TestState extends Phaser.State {
    constructor() {
        super();
    }
    init() {
        var test = new Test();
        this.add.existing(test);
    }
}