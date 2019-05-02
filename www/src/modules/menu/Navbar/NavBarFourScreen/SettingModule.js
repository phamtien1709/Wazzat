export default class SettingModule extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 4;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.afterInit();
    }

    afterInit() {
        // this.createSetting();
    }

    createSetting() {
        // this.settingGroup = game.add.group();
        // this.settingGroup.position.x = game.width;

        //addBGSetting, button to disactive other button behind BGSetting
        var bgSetting = game.add.button(0, 0, 'bg-playlist');
        this.addChild(bgSetting);

        this.scrollMaskSetting = this.addScrollMaskSetting();
        this.grapSetting = this.addGrapSetting();
        this.addGrapAndScrollMaskToGroup();

        var bgDisplaySetting = new Phaser.Sprite(game, 0, 0, 'bg-playlist');
        this.grapSetting.addChild(bgDisplaySetting);

        this.onGrapSettingDragStop();
        this.createListOptionSetting();
        this.addLogoutBtn();
        this.addHeaderSetting();
    }
    addScrollMaskSetting() {
        var scrollMaskSetting = new Phaser.Graphics(game, 0, 173);
        scrollMaskSetting.beginFill();
        scrollMaskSetting.drawRect(0, 0, game.width, 1535);
        scrollMaskSetting.endFill();

        return scrollMaskSetting;
    }
    addGrapSetting() {
        var grapSetting = new Phaser.Graphics(game, 0, 173);
        grapSetting.drawRect(0, 0, game.width, 1535);
        grapSetting.inputEnabled = true;
        grapSetting.input.enableDrag();
        grapSetting.input.allowHorizontalDrag = false;
        grapSetting.mask = this.scrollMaskSetting;
        return grapSetting;
    }
    addGrapAndScrollMaskToGroup() {
        this.addChild(this.scrollMaskSetting);
        this.addChild(this.grapSetting);
    }
    onGrapSettingDragStop() {
        this.grapSetting.events.onDragStop.add(() => {
            if (this.grapSetting.position.y > 173) {
                game.add.tween(this.grapSetting).to({ y: 173 }, 250, "Linear", true);
            }
            if (this.grapSetting.position.y < -210) {
                game.add.tween(this.grapSetting).to({ y: -210 }, 250, "Linear", true);
            }
        });
    }
    createListOptionSetting() {
        for (let i = 0; i < window.MQ.listSetting.length; i++) {
            let txt_selection = game.add.text(60, 66 + i * 177, `${window.MQ.listSetting[i].text}`, {
                font: `45px Roboto`,
                fill: "#ffffff",
                boundsAlignH: "center",
                boundsAlignV: "middle",
                fontWeight: 400
            });
            this.grapSetting.addChild(txt_selection);
            let btn_selection = game.add.button(1020, i * 177, `${window.MQ.listSetting[i].btn}`);
            btn_selection.anchor.set(1, 0);
            this.grapSetting.addChild(btn_selection);
            let line = new Phaser.Sprite(game, 60, 170 + i * 177, 'line_setting');
            this.grapSetting.addChild(line);
        }
    }
    addLogoutBtn() {
        var logoutBtn = game.add.button(game.world.centerX, 1547, 'btn_logout_setting');
        logoutBtn.anchor.set(0.5);
        this.grapSetting.addChild(logoutBtn);
    }
    addHeaderSetting() {
        var headerSetting = new Phaser.Sprite(game, 0, 0, 'tab_header_setting');
        this.addChild(headerSetting);
    }

    show() {
        game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }
}