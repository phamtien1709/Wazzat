import MainData from "../../../model/MainData.js";

export default class MenuStateScrollDownSprite extends Phaser.Sprite {
    constructor(key) {
        super(game, 0, 0, key);
        this.inputEnabled = true;
        this.scrollMaskMenu = new Phaser.Graphics(game, 0, 353 * window.GameConfig.RESIZE);
        //
        this.scrollMaskMenu.drawRect(0, 353 * window.GameConfig.RESIZE, game.width, 1090 * window.GameConfig.RESIZE);
        //
        this.scrollMaskMenu.endFill();
        this.countHeight = this.height - 440 * window.GameConfig.RESIZE;
        this.txtRefresh = this.addTxtRefresh();
        this.addChild(this.txtRefresh);
        //
        this.savedPosition = new Phaser.Point(this.x, this.y);
        this.movingSpeed = 0;
        this.friction = 0.94;
        this.speedMult = 0.7;
        //
        this.input.enableDrag();
        this.input.allowHorizontalDrag = false;
        this.events.onDragStart.add(() => {
            MainData.instance().menuDragging = true;
            this.isDraging = true;
            this.savedPosition = new Phaser.Point(this.x, this.y);
            this.movingSpeed = 0;
        }, this);
        this.events.onDragStop.add(this.onDragStop, this);
        this.events.onDragUpdate.add(this.onDragUpdate, this);
        this.mask = this.scrollMaskMenu;
        this.countHeightChild = 0;
        this.event = {
            refreshMenu: new Phaser.Signal(),
            scrollChange: new Phaser.Signal(),
            scrollDefault: new Phaser.Signal(),
            scrollList: new Phaser.Signal()
        }
        this.isScrollChange = false;
        if (MainData.instance().isScrollChange == true) {
            this.y = -235;
            this.scrollMaskMenu.countHeight = 1270;
        } else {
            this.y = 0;
            this.scrollMaskMenu.countHeight = 1090;
        }
    }

    addTxtRefresh() {
        var txtRefresh = new Phaser.Text(game, game.world.centerX, 250 * window.GameConfig.RESIZE, 'Refresh..', {
            font: `${20 * window.GameConfig.RESIZE}px GilroyMedium`,
            fill: "#ffffff"
        });
        txtRefresh.anchor.set(0.5);
        return txtRefresh;
    }

    onDragStop() {
        this.isDraging = false;
        if (this.position.y > 100 * window.GameConfig.RESIZE) {
            this.tweenInertiaComplete();
        } else {
            //
            this.tweenInertia = game.add.tween(this).to({ alpha: 1 }, 300, "Linear", true);
            this.tweenInertia.start();
            this.tweenInertia.onUpdateCallback(this.updateInertia, this);
            this.tweenInertia.onComplete.add(this.tweenInertiaComplete, this);
        }
    }

    updateInertia() {
        if (this.isDraging !== true) {
            // if the moving speed is greater than 1...
            if (this.movingSpeed > 0) {
                // adjusting map y position according to moving speed and angle using trigonometry
                if (this.y > 30 * window.GameConfig.RESIZE) {
                    this.y += (this.movingSpeed * Math.sin(this.movingangle)) * 0.1;
                } else if (this.position.y < ((game.height - 150) * window.GameConfig.RESIZE - this.countHeight)) {
                    this.y += (this.movingSpeed * Math.sin(this.movingangle)) * 0.1;
                } else {
                    this.y += (this.movingSpeed * Math.sin(this.movingangle));
                }
                // applying friction to moving speed
                this.movingSpeed = this.movingSpeed * this.friction;
                this.distanceNew = this.distanceNew * this.friction;
            }
            else {
                // if the distance is at least 0 pixels (an arbitrary value to see I am swiping)
                if (this.distanceNew > 0) {
                    // set moving speed value
                    this.movingSpeed = this.distanceNew * this.speedMult;
                    // set moving angle value
                    this.movingangle = this.angleNew;
                }
            }
        }
        // this.catchScrollList();
    }

    catchScrollChange() {
        if (this.isScrollChange === false) {
            if (this.y <= -50) {
                if (this.isScrollChange !== true) {
                    this.isScrollChange = true;
                    if (MainData.instance().isScrollChange !== true) {
                        this.event.scrollChange.dispatch();
                        this.scrollChange();
                        MainData.instance().isScrollChange = true;
                    }
                }
            } else {
                if (this.isScrollChange !== false) {
                    this.isScrollChange = false;
                    if (MainData.instance().isScrollChange !== false) {
                        MainData.instance().isScrollChange = false;
                        this.event.scrollDefault.dispatch();
                        this.scrollDefault();
                    }
                }
            }
        } else {
            if (this.y <= -30) {
                if (this.isScrollChange !== true) {
                    this.isScrollChange = true;
                    if (MainData.instance().isScrollChange !== true) {
                        this.event.scrollChange.dispatch();
                        this.scrollChange();
                        MainData.instance().isScrollChange = true;
                    }
                }
            } else {
                if (this.isScrollChange !== false) {
                    this.isScrollChange = false;
                    if (MainData.instance().isScrollChange !== false) {
                        MainData.instance().isScrollChange = false;
                        this.event.scrollDefault.dispatch();
                        this.scrollDefault();
                    }
                }
            }
        }
    }

    tweenInertiaComplete() {
        //
        this.catchScrollChange();
        if (this.position.y >= 0) {
            var tweenGrapMenu = game.add.tween(this).to({ y: 0 }, 200, "Linear");
            tweenGrapMenu.start();
        }
        if (this.position.y > 100 * window.GameConfig.RESIZE) {
            this.sendRequestMenuChallenges();
        }
        if (((game.height - 130) * window.GameConfig.RESIZE - this.countHeight) < 0) {
            if (this.position.y < ((game.height - 130) * window.GameConfig.RESIZE - this.countHeight)) {
                if (MainData.instance().isScrollChange == true) {
                    if (this.countHeight < this.scrollMaskMenu.countHeight) {
                        var tweenGrapMenu = game.add.tween(this).to({ y: -245 }, 200, "Linear");
                        tweenGrapMenu.start();
                    } else {
                        var tweenGrapMenu = game.add.tween(this).to({ y: ((game.height - 130) * window.GameConfig.RESIZE - this.countHeight) }, 200, "Linear");
                        tweenGrapMenu.start();
                    }
                } else {
                    var tweenGrapMenu = game.add.tween(this).to({ y: ((game.height - 130) * window.GameConfig.RESIZE - this.countHeight) }, 200, "Linear");
                    tweenGrapMenu.start();
                }
            }
        } else {
            if (MainData.instance().isScrollChange == true) {
                var tweenGrapMenu = game.add.tween(this).to({ y: -235 }, 200, "Linear");
                tweenGrapMenu.start();
            } else {
                var tweenGrapMenu = game.add.tween(this).to({ y: 0 }, 200, "Linear");
                tweenGrapMenu.start();
            }
        }
        MainData.instance().menuDragging = false;
    }

    onDragUpdate() {
        this.distanceNew = Math.abs(this.y - this.savedPosition.y);
        this.angleNew = 0;
        if (this.y - this.savedPosition.y > 0) {
            this.angleNew = 90;
        } else {
            this.angleNew = -90;
        }
        this.savedPosition = new Phaser.Point(this.x, this.y);
    }

    catchScrollList() {
        if ((this.y < -(105 * 4)) && (this.y > -(105 * 8))) {
            this.event.scrollList.dispatch(4);
        } else if ((this.y < -(105 * 8)) && (this.y > -(105 * 12))) {
            this.event.scrollList.dispatch(8);
        } else if ((this.y < -(105 * 12)) && (this.y > -(105 * 16))) {
            this.event.scrollList.dispatch(12);
        } else if ((this.y < -(105 * 16)) && (this.y > -(105 * 20))) {
            this.event.scrollList.dispatch(16);
        } else if ((this.y < -(105 * 20)) && (this.y > -(105 * 24))) {
            this.event.scrollList.dispatch(20);
        } else if ((this.y < -(105 * 24)) && (this.y > -(105 * 28))) {
            this.event.scrollList.dispatch(24);
        } else if ((this.y < -(105 * 28)) && (this.y > -(105 * 32))) {
            this.event.scrollList.dispatch(28);
        } else if ((this.y < -(105 * 28)) && (this.y > -(105 * 32))) {
            this.event.scrollList.dispatch(28);
        } else if ((this.y < -(105 * 32)) && (this.y > -(105 * 36))) {
            this.event.scrollList.dispatch(32);
        } else if ((this.y < -(105 * 36)) && (this.y > -(105 * 40))) {
            this.event.scrollList.dispatch(36);
        }
    }

    sendRequestMenuChallenges() {
        this.checkRequestSocketMainMenuCheck();
        if (MainData.instance().isRefreshMenu.checking == false) {
            this.countHeightChild = 0;
            this.countHeight = this.height - 440 * window.GameConfig.RESIZE;
            this.event.refreshMenu.dispatch();
        } else {
            // var tweenGrapMenu = game.add.tween(this).to({ y: 0 }, 50, "Linear");
            // tweenGrapMenu.start();
            // this.y = 0;
        }
    }

    checkRequestSocketMainMenuCheck() {
        if (MainData.instance().isRefreshMenu.checking == true) {
            let now = Date.now();
            if ((now - MainData.instance().isRefreshMenu.updated) < 6000) {
                MainData.instance().isRefreshMenu.checking = true;
            } else {
                MainData.instance().isRefreshMenu.checking = false;
            }
        } else {
            MainData.instance().isRefreshMenu.checking = false;
        }
    }

    scrollChange() {
        this.scrollMaskMenu.clear();
        this.scrollMaskMenu.drawRect(0, (353 - 20) * window.GameConfig.RESIZE, game.width, (1090 + 20) * window.GameConfig.RESIZE);
        this.scrollMaskMenu.countHeight = 1270;
    }

    scrollDefault() {
        this.scrollMaskMenu.clear();
        this.scrollMaskMenu.drawRect(0, 353 * window.GameConfig.RESIZE, game.width, 1090 * window.GameConfig.RESIZE);
        this.scrollMaskMenu.countHeight = 1090;
    }

    addChildren(child) {
        this.countHeightChild += child.height;
        this.countHeight += child.height;
        this.addChild(child);
    }
}