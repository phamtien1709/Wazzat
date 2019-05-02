export default class LabelButton extends Phaser.Button {
    constructor(label, font, fontSize, color, callback, callbackContext) {

        super(game, 0, 0, null, callback, callbackContext);

        this._font = font;
        this._fontSize = fontSize;
        this._color = color;

        this.setStyleLabel();

        this.label = new Phaser.Text(game, 0, 0, label, this.style);

        this.addChild(this.label);
        this.setLabel(label);

        this.afterCreate();
    }

    setAnchor(x, y) {
        this.anchor.setTo(0.5, 0.5);
        this.label.anchor.setTo(0.5, 0.5);
    }

    setStyleLabel() {
        this.style = {
            'font': `${this._fontSize}px ${this._font}`,
            'fill': `${this._color}`
        };
        LogConsole.log(this.style);
    }

    afterCreate() {
        this.onInputOver.add(() => {
            this.label.tint = 0xcccccc;
        }, this);
        this.onInputOut.add(() => {
            this.label.tint = 0xffffff;
        }, this);
        this.onInputUp.add(() => {
            this.label.tint = 0xffffff;
        }, this);
        this.onInputDown.add(() => {
            this.label.tint = 0xcccccc;
        }, this);
    }

    set color(_color) {
        this._color = _color;
        this.setStyleLabel();
        this.setStyle(this.style);
    }
    set fontSize(_fontSize) {
        this._fontSize = _fontSize;
        this.setStyleLabel();
        this.setStyle(this.style);
    }

    set font(_font) {
        this._font = _font;
        setStyleLabel();
        this.setStyle(this.style);
    }

    setStyle(style) {
        this.style = style;
        this.label.setStyle(this.style);
    }

    setLabel(text) {
        this.label.setText(text)
    }
}