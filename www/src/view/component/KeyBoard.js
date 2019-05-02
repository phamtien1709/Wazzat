import MainData from "../../model/MainData.js";
import ButtonScale9WithText from "./ButtonScale9WithText.js";
import ButtonBase from "./ButtonBase.js";
import BaseView from "../BaseView.js";
import TurnBaseFindGame from "../turnBase/screen/TurnBaseFindGame.js";
import PlayingLogic from "../../controller/PlayingLogic.js";
import Language from "../../model/Language.js";

export default class KeyBoard extends BaseView {
    static instance() {
        if (this.keyBoard) {

        } else {
            this.keyBoard = new KeyBoard();
        }
        return this.keyBoard;
    }
    constructor() {
        super(game, null);
        this.event = {
            enter: new Phaser.Signal(),
            change: new Phaser.Signal(),
            submit: new Phaser.Signal(),
            cancle: new Phaser.Signal(),
            changeHeight: new Phaser.Signal(),
            hideKeyboard: new Phaser.Signal(),
            changeTypeSearch: new Phaser.Signal()
        }

        this.opened = false;
        this.transparentObj = null;
        this.container = null;
        this.layoutChat = null;
        this.keyboardHeight = game.height;

        this.varTimeout = null;
        this.varTimeoutChange = null;

        window.addEventListener('resize', () => {
            this.varTimeout = setTimeout(() => {
                this.setStyleInput();
            }, 50);
        })

        window.addEventListener('keyboardDidShow', (event) => {
            //console.log("keyboardDidShow");
            console.log(event);
            if (MainData.instance().platform === "ios") {
                this.keyboardHeight = (game.height - ((screen.height - event.keyboardHeight) / game.scale.scaleFactorInversed.y) + 120);
            } else {
                this.keyboardHeight = ((event.keyboardHeight / game.scale.scaleFactorInversed.y) + PlayingLogic.instance().getChangeHeight() + 120);
            }

            //console.log("this.keyboardHeight : " + this.keyboardHeight);

            if (MainData.instance().platform === "ios" || MainData.instance().platform === "and") {
                this.event.changeHeight.dispatch(this.keyboardHeight);
                this.changeHeightText();
            }
        });

        window.addEventListener('keyboardDidHide', (event) => {
            //console.log("keyboardDidHide");
            console.log(event);
            this.event.hideKeyboard.dispatch();
        });
        /*
        window.addEventListener('keyboardWillShow', (event) => {
            //console.log("keyboardWillShow");
            console.log(event);

        });
        window.addEventListener('keyboardWillHide', (event) => {
            //console.log("keyboardWillHide");
            console.log(event);

        });*/
        window.addEventListener('keyboardHeightWillChange', (event) => {
            //console.log("keyboardHeightWillChange");
            console.log(event.keyboardHeight);
            let checkChange = 0;
            if (MainData.instance().platform === "ios") {
                checkChange = (game.height - ((screen.height - event.keyboardHeight) / game.scale.scaleFactorInversed.y) + 120);
            } else {
                checkChange = ((event.keyboardHeight / game.scale.scaleFactorInversed.y) + PlayingLogic.instance().getChangeHeight() + 120);
            }

            if (this.keyboardHeight !== checkChange) {
                this.keyboardHeight = checkChange;

                if (MainData.instance().platform === "ios" || MainData.instance().platform === "and") {
                    this.event.changeHeight.dispatch(this.keyboardHeight);
                    this.changeHeightText();
                }
            }
        });
    }

    changeHeightText() {
        //console.log("this.keyboardHeight : " + this.keyboardHeight);

        if (this.layoutChat !== null) {
            this.layoutChat.y = game.height - this.keyboardHeight;
            if (this.layoutChat.y < 0) {
                this.layoutChat.y = 0;
            }
            this.setStyleInput();
        }

        game.world.add(this);
    }

    setStyleInput(ktFirst = false) {
        LogConsole.log("setStyleInput");
        LogConsole.log(game.canvas.getBoundingClientRect());

        if ($('#chatInput').length) {

            let scaleW = game.canvas.getBoundingClientRect().width / game.width;
            let scaleH = game.canvas.getBoundingClientRect().height / game.height;
            //console.log("scaleW : " + scaleW);
            //console.log("scaleH : " + scaleH);
            // console.log(game.scale);
            let scaleGame = Math.min(scaleW, scaleH);

            console.log(this.options.configText);

            let left = (window.innerWidth - game.canvas.getBoundingClientRect().width) / 2;
            let styles = {};
            if (this.options.typeInputText === "input") {
                styles = {
                    top: (game.canvas.getBoundingClientRect().top + this.options.configText.y * scaleGame) + 'px',
                    left: (left + this.options.configText.x * scaleGame) + 'px',
                    width: ((this.options.configText.width - 24) * scaleGame) + 'px',
                    height: ((this.options.configText.height - 5) * scaleGame) + 'px',
                    position: "absolute"
                };
                // width: ((this.options.configText.width - 24)  * scaleGame) + 'px',
                //height: ((this.options.configText.height - 5)  * scaleGame) + 'px',
            } else if (this.options.typeInputText === "chat") {
                if (ktFirst === true) {
                    styles = {
                        top: '10px',
                        left: (left + 20 * scaleGame) + 'px',
                        width: (480 * scaleGame) + 'px',
                        height: (85 * scaleGame) + 'px',
                        position: "absolute"
                    };
                } else {
                    styles = {
                        top: ((game.canvas.getBoundingClientRect().top + (this.layoutChat.y + 10)) * scaleGame) + 'px',
                        left: (left + 20 * scaleGame) + 'px',
                        width: (480 * scaleGame) + 'px',
                        height: (85 * scaleGame) + 'px',
                        position: "absolute"
                    };
                }

            } else {
                styles = {
                    top: game.canvas.getBoundingClientRect().top + 105 * scaleGame + 'px',
                    left: left + 37 * scaleGame + 'px',
                    width: 460 * scaleGame + 'px',
                    height: 85 * scaleGame + 'px',
                    position: "absolute"
                };
            }
            //console.log("styles ------------");
            console.log(styles);

            styles["font-size"] = 30 * scaleGame + "px";
            styles["padding-left"] = 10 * scaleGame + "px";
            styles["padding-right"] = 10 * scaleGame + "px";

            this.setStyleOnElement($('#chatInput'), styles);

            setTimeout(() => {
                $('#chatInput').focus();
            }, 500);

        }
    }
    show(options = {}) {

        setTimeout(() => {
            let optionsDefault = {
                maxLength: '',
                showTransparent: true,
                placeholder: "Nhập id phòng",
                isSearch: false,
                isSearchFriend: false,
                typeSearch: "NAME",
                typeInputText: "search", // chat, search, input
                configText: {
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0
                }
            }

            this.options = Object.assign({}, optionsDefault, options);

            if (this.container === null) {
                this.container = game.add.group();
                this.addChild(this.container);
            } else {

                if (this.layoutChat != null) {
                    this.container.removeChild(this.layoutChat);
                    this.layoutChat.destroy(true);
                    this.layoutChat = null;
                }

                while (this.container.children.length > 0) {
                    let item = this.container.children[0];
                    this.container.removeChild(item);
                    item.destroy();
                    item = null;
                }

            }

            if (options.typeInputText === "input") {

            } else if (options.typeInputText === "chat") {
                this.addChat();
            } else {
                this.addSearch();
            }

            //console.log("this.opened : " + this.opened);

            if (this.opened === false) {
                this.opened = true;
                this.open(options.maxLength, options.placeholder || '');
            } else {
                this.setStyleInput(true);
            }

            if (options.defaultText) {
                this.setValue(options.defaultText);
            }


            /*
            console.log(Keyboard);
    
           
            */
            game.world.add(this);
        }, 100);
    }

    onUpBg() {
        //console.log("onUpBg");
        this.hide();
    }


    addSearch() {

        if (this.layoutChat != null) {
            this.container.removeChild(this.layoutChat);
            this.layoutChat.destroy(true);
            this.layoutChat = null;
        }

        let objBg = {
            x: 0,
            y: 0,
            nameAtlas: "defaultSource",
            nameSprite: "BG",
            left: 4,
            right: 4,
            top: 4,
            bot: 4,
            width: game.width,
            height: 222,
            name: "chatBgkeyboard",
            configText: {
                x: 0,
                y: 0,
                style: {
                    fontSize: 25,
                    font: "GilroyMedium",
                    align: "left",
                    boundsAlignH: "left",
                    boundsAlignV: "middle"
                }
            }
        }
        let bgSearch = new ButtonScale9WithText(objBg, "");
        bgSearch.input.useHandCursor = false;
        this.container.addChild(bgSearch);

        if (this.options.hasOwnProperty("isSearchFriend") && this.options.isSearchFriend === true) {
            this.isSearchFriend = true;
            this.textName = new Phaser.Text(game, 40, 45, Language.instance().getData("250"), {
                fontSize: 25,
                font: "GilroyMedium",
                align: "left",
                fill: "#ffffff"
            });
            bgSearch.addChild(this.textName);

            this.textName.inputEnabled = true;
            if (this.options.hasOwnProperty("typeSearch") && this.options.typeSearch !== "ID") {
                this.textName.activeTxt = true;
            } else {
                this.textName.activeTxt = false;
                this.textName.addColor('#8a8a8a', 0);
            }
            //
            this.textName.events.onInputUp.add(() => {
                if (this.textName.activeTxt == true) {

                } else {
                    this.textName.addColor('#ffffff', 0);
                    this.textName.activeTxt = true;
                }
                this.event.changeTypeSearch.dispatch(TurnBaseFindGame.NAME);
            }, this);

            bgSearch.addChild(this.addDoc(160, 48));
        }

        let objSubmit = {
            x: 530,
            y: 108,
            nameAtlas: "defaultSource",
            nameSprite: "Send_Icon",
        }
        if (this.options.hasOwnProperty("isSearch") && this.options.isSearch === true) {
            objSubmit.nameSprite = "Btn_Search_Icon";
        } else {
            objSubmit.nameSprite = "Send_Icon";
        }

        let submitButton = new ButtonBase(objSubmit, this.onSubmit, this);

        let objCancel = {
            x: 582,
            y: 38,
            nameAtlas: "defaultSource",
            nameSprite: "Exit",
        }
        let cancelButton = new ButtonBase(objCancel, this.onCancel, this);

        bgSearch.addChild(submitButton);
        bgSearch.addChild(cancelButton);
    }



    addChat() {

        //console.log("addChat------------");

        if (this.layoutChat === null) {
            this.layoutChat = game.add.group();

            let objBg = {
                x: 0,
                y: 0,
                nameAtlas: "defaultSource",
                nameSprite: "BG",
                left: 4,
                right: 4,
                top: 4,
                bot: 4,
                width: game.width,
                height: 120,
                name: "chatBgkeyboard",
                configText: {
                    x: 0,
                    y: 0,
                    style: {
                        fontSize: 25,
                        font: "GilroyMedium",
                        align: "left",
                        boundsAlignH: "left",
                        boundsAlignV: "middle"
                    }
                }
            }
            let bgSearch = new ButtonScale9WithText(objBg, "");
            bgSearch.input.useHandCursor = false;
            this.layoutChat.addChild(bgSearch);

            let objSubmit = {
                x: 545,
                y: 23,
                nameAtlas: "defaultSource",
                nameSprite: "Close_Icon",
            }

            let submitButton = new ButtonBase(objSubmit, this.onCancel, this);
            this.layoutChat.addChild(submitButton);

            this.layoutChat.y = game.height - this.keyboardHeight;

            if (this.layoutChat.y < 0) {
                this.layoutChat.y = 0;
            }
        }
        this.container.addChild(this.layoutChat);
    }

    onSubmit() {
        this.event.submit.dispatch();
    }
    onCancel() {
        this.event.cancle.dispatch();
        this.hide();
    }

    hide() {
        //console.log("hide------------");

        this.opened = false;
        this.keyboardHeight = game.height;

        if (window.navigationbar) {
            window.navigationbar.hideNavigationBar();
        }
        if (typeof StatusBar != 'undefined') {
            StatusBar.hide();
        }

        if (this.layoutChat != null) {
            this.container.removeChild(this.layoutChat);
            this.layoutChat.destroy(true);
            this.layoutChat = null;
        }

        if (this.container != null) {
            this.removeChild(this.container);
            this.container.destroy(true);
            this.container = null;
        }

        if (this.transparentObj != null) {
            this.transparentObj.destroy(true);
            this.transparentObj = null;
        }
        if (this.parent) {
            game.world.remove(this);
        }

        if (this.varTimeout !== null) {
            clearTimeout(this.varTimeout);
            this.varTimeout = null;
        }
        if (this.varTimeoutChange != null) {
            clearTimeout(this.varTimeoutChange);
            this.varTimeoutChange = null;
        }
        this.close();
    }

    open(maxlength, placeholder) {
        this.appendDOM(maxlength, placeholder);
    }

    close() {
        if ($('#chatInput').length) {
            $('#game').remove('#chatInput');
            $('#chatInput').remove();
        }
    }

    setValue(value) {
        if ($('#chatInput').length) {
            $('#chatInput').val(value);
        }
    }

    getValue() {
        return $('#chatInput').length ? $('#chatInput').val() : '';
    }

    appendDOM(maxlength, placeholder) {

        this.close();

        $('#game').append('<input id="chatInput" type="text" placeholder="' + placeholder + '" value="" maxlength="' + maxlength + '" autofocus>');


        $('#chatInput').keypress((event) => {
            LogConsole.log("event.key : " + event.which);
            if (this.varTimeoutChange != null) {
                clearTimeout(this.varTimeoutChange);
            }

            if (event.which === 13) {
                LogConsole.log("enter");
                this.event.enter.dispatch();
                //this.onSubmit();
            } else {
                this.varTimeoutChange = setTimeout(() => {
                    this.event.change.dispatch();
                }, 300);
            }

        });

        this.setStyleInput(true);
    }

    addDoc(x, y) {
        let doc = new Phaser.Image(game, x, y, "defaultSource", "LineDoc");
        return doc
    }

    setStyleOnElement(element, styles) {
        element.css(styles);
    }
}