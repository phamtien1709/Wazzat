import IllegalTurnPopup from "../../../modules/play/IllegalTurn/IllegalTurnPopup.js";
import BaseGroup from "../../BaseGroup.js";

export default class IllegalTurn extends BaseGroup {
    constructor() {
        super(game);
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.event = {
            playIllegalTurn: new Phaser.Signal(),
            illegalTurnCancle: new Phaser.Signal()
        }
    }

    makeNewGameBeChallenged(res, callback) {
        this.game_log_id = res.game_log_id;
        this.request_id = res.request_id;
        callback();
        // this.state.params.listGame.push(this.nextGame);
    }

    setData(opponent) {
        this.opponent = opponent;
    }

    addPopupIllegalTurn() {
        this.popup = new IllegalTurnPopup();
        this.popup.setAvaUrl(this.opponent.avatar, this.opponent.vip);
        this.popup.setTxtNameOpp(this.opponent.userName);
        this.popup.addPopup();
        this.popup.signalInput.add(this.onPopupCallback, this);
        this.addChild(this.popup);
    }

    onPopupCallback(type) {
        if (type == "OK") {
            this.event.playIllegalTurn.dispatch({
                game_log_id: this.game_log_id,
                request_id: this.request_id
            });
        } else {
            this.event.illegalTurnCancle.dispatch();
        }
    }
}