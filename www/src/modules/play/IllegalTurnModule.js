import IllegalTurnPopup from "./IllegalTurn/IllegalTurnPopup.js";

export default class IllegalTurnModule {
    constructor(state, positionPlayConfig) {
        this.state = state;
        this.positionPlayConfig = positionPlayConfig;
    }

    makeNewGameBeChallenged(res, callback) {
        this.userGameLog = res.game_log_id;
        this.requestId = res.request_id
        callback();
        // this.state.params.listGame.push(this.nextGame);
    }

    addPopupIllegalTurn() {
        this.popup = new IllegalTurnPopup();
        this.popup.setAvaUrl(this.state.params.opponent.ava);
        this.popup.setTxtNameOpp(this.state.params.opponent.name);
        this.popup.addPopup();
        this.popup.signalInput.add(this.onPopupCallback, this);
        this.state.add.existing(this.popup);
    }

    onPopupCallback(type) {
        if (type == "OK") {
            this.makeGame(() => {
                game.state.start('NextGame', true, false, this.state.params);
            })
        } else {
            this.state.params.isChallenged = null;
            this.state.params.isSoloMode = true;
            game.state.start('Win', true, false, this.state.params);
        }
    }

    makeGame(callback) {
        for (let i = 0; i < this.state.params.listGame.length; i++) {
            if (this.state.params.listGame[i].opponentEntity.id == this.state.params.opponent.id) {
                // LogConsole.log(this.state.params.listGame[i]); 
                this.state.params.listGame[i] = {
                    id: this.requestId,
                    mode: "challengeGame",
                    opponentEntity: {
                        avatar: this.state.params.listGame[i].opponentEntity.avatar,
                        id: this.state.params.listGame[i].opponentEntity.id,
                        userName: this.state.params.listGame[i].opponentEntity.userName
                    },
                    turnCount: this.state.params.listGame[i].turnCount,
                    userGameLog: this.userGameLog,
                    weeklyResult: {
                        userWon: this.state.params.listGame[i].weeklyResult.userWon,
                        opponentWon: this.state.params.listGame[i].weeklyResult.opponentWon
                    }
                }
                this.state.params.isChallenged = false;
                this.state.params.nextGame = this.state.params.listGame[i];
                callback();
            }
        }
    }
}