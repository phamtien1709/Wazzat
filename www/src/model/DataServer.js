export default class DataServer {
    constructor() {
        this._dataBetCreateRoom = null;
        this.idbetCreateRoom = null;

        this._dataPlaylistCreateRoom = null;
        this.idPlaylistCreateRoom = null;

        this._dataGenresQuickPlay = null;
        this.idGenresQuickPlay = null;

        this._dataListRoomEventMode = null;
        this.idListRoomEventMode = null;

        this._dataRankingEventmode = null;
        this.idRankingEventMode = null;

        this._dataRankingDiamond = null;
        this.idRankingDiamond = null;

        this._dataRankingLevel = null;
        this.idRankingLevel = null;

        this._dataRankingOnlineMode = null;
        this.idRankingOnlineMode = null;

        this._dataRankingTurnBase = null;
        this.idRankingTurnBase = null;
    }

    //dataBetCreateRoom

    get dataBetCreateRoom() {
        return this._dataBetCreateRoom;
    }
    set dataBetCreateRoom(_dataBetCreateRoom) {
        this._dataBetCreateRoom = _dataBetCreateRoom;
        //this.callResetDataBetCreateRoom();
    }

    removeIdBetCreateRoom() {
        if (this.idbetCreateRoom !== null) {
            game.time.events.remove(this.idbetCreateRoom);
            this.idbetCreateRoom = null;
        }
    }
    callResetDataBetCreateRoom() {
        this.removeIdBetCreateRoom();
        this.idbetCreateRoom = game.time.events.add(Phaser.Timer.SECOND * 30, this.resetDataBetCreateRoom, this);
    }

    resetDataBetCreateRoom() {
        this._dataBetCreateRoom = null;
    }


    /// dataPlaylistCreateRoom
    get dataPlaylistCreateRoom() {
        return this._dataPlaylistCreateRoom;
    }

    set dataPlaylistCreateRoom(_dataPlaylistCreateRoom) {
        this._dataPlaylistCreateRoom = _dataPlaylistCreateRoom;
        this.callResetDataPlaylistCreateRoom();
    }

    removeIdPlaylistCreateRoom() {
        if (this.idPlaylistCreateRoom !== null) {
            game.time.events.remove(this.idPlaylistCreateRoom);
            this.idPlaylistCreateRoom = null;
        }
    }
    callResetDataPlaylistCreateRoom() {
        this.removeIdPlaylistCreateRoom();
        this.idPlaylistCreateRoom = game.time.events.add(Phaser.Timer.SECOND * 30, this.resetDataPlaylistCreateRoom, this);
    }

    resetDataPlaylistCreateRoom() {
        this._dataPlaylistCreateRoom = null;
    }

    //dataGenresQuickPlay
    get dataGenresQuickPlay() {
        return this._dataGenresQuickPlay;
    }
    set dataGenresQuickPlay(_dataGenresQuickPlay) {
        this._dataGenresQuickPlay = _dataGenresQuickPlay;
        //this.callResetDataGenresQuickPlay();
    }

    removeIdGenresQuickPlay() {
        if (this.idGenresQuickPlay !== null) {
            game.time.events.remove(this.idGenresQuickPlay);
            this.idGenresQuickPlay = null;
        }
    }
    callResetDataGenresQuickPlay() {
        this.removeIdGenresQuickPlay();
        this.idGenresQuickPlay = game.time.events.add(Phaser.Timer.SECOND * 30, this.resetDataGenresQuickPlay, this);
    }

    resetDataGenresQuickPlay() {
        this._dataGenresQuickPlay = null;
    }

    //  this._dataListRoomEventMode = null; this.idListRoomEventMode = null;
    get dataListRoomEventMode() {
        return this._dataListRoomEventMode;
    }
    set dataListRoomEventMode(_dataListRoomEventMode) {
        this._dataListRoomEventMode = _dataListRoomEventMode;
        this.callResetListRoomEventMode();
    }
    removeIdListRoomEventMode() {
        if (this.idListRoomEventMode !== null) {
            game.time.events.remove(this.idListRoomEventMode);
            this.idListRoomEventMode = null;
        }
    }
    callResetListRoomEventMode() {
        this.removeIdListRoomEventMode();
        this.idListRoomEventMode = game.time.events.add(Phaser.Timer.SECOND * 30, this.resetDataListRoomEventMode, this);
    }
    resetDataListRoomEventMode() {
        this._dataListRoomEventMode = null;
    }

    // this._dataRankingEventmode = null; this.idRankingEventMode = null;
    get dataRankingEventmode() {
        return this._dataRankingEventmode;
    }
    set dataRankingEventmode(_dataRankingEventmode) {
        this._dataRankingEventmode = _dataRankingEventmode;
        this.callResetRankingEventmode();
    }

    removeIdRankingEventmode() {
        if (this.idRankingEventMode !== null) {
            game.time.events.remove(this.idRankingEventMode);
            this.idRankingEventMode = null;
        }
    }
    callResetRankingEventmode() {
        this.removeIdRankingEventmode();
        this.idRankingEventMode = game.time.events.add(Phaser.Timer.SECOND * 5, this.resetDataRankingEventmode, this);
    }
    resetDataRankingEventmode() {
        this._dataRankingEventmode = null;
    }

    //this.dataRankingDiamond = null;  this.idRankingDiamond = null;
    get dataRankingDiamond() {
        return this._dataRankingDiamond;
    }
    set dataRankingDiamond(_dataRankingDiamond) {
        this._dataRankingDiamond = _dataRankingDiamond;
        this.callResetRankingDiamond();
    }
    removeIdRankingDiamond() {
        if (this.idRankingDiamond !== null) {
            game.time.events.remove(this.idRankingDiamond);
            this.idRankingDiamond = null;
        }
    }
    callResetRankingDiamond() {
        this.removeIdRankingDiamond();
        this.idRankingDiamond = game.time.events.add(Phaser.Timer.SECOND * 60, this.resetDataRankingDiamond, this);
    }
    resetDataRankingDiamond() {
        this._dataRankingDiamond = null;
    }
    //this.dataRankingLevel = null; this.idRankingLevel = null;
    get dataRankingLevel() {
        return this._dataRankingLevel;
    }
    set dataRankingLevel(_dataRankingLevel) {
        this._dataRankingLevel = _dataRankingLevel;
        this.callResetRankingLevel();
    }
    removeIdRankingLevel() {
        if (this.idRankingLevel !== null) {
            game.time.events.remove(this.idRankingLevel);
            this.idRankingLevel = null;
        }
    }
    callResetRankingLevel() {
        this.removeIdRankingLevel();
        this.idRankingLevel = game.time.events.add(Phaser.Timer.SECOND * 60, this.resetDataRankingLevel, this);
    }
    resetDataRankingLevel() {
        this._dataRankingLevel = null;
    }

    //this.dataRankingOnlineMode = null;  this.idRankingOnlineMode = null;
    get dataRankingOnlineMode() {
        return this._dataRankingOnlineMode;
    }
    set dataRankingOnlineMode(_dataRankingOnlineMode) {
        this._dataRankingOnlineMode = _dataRankingOnlineMode;
        this.callResetRankingOnlineMode();
    }
    removeIdRankingOnlineMode() {
        if (this.idRankingOnlineMode !== null) {
            game.time.events.remove(this.idRankingOnlineMode);
            this.idRankingOnlineMode = null;
        }
    }
    callResetRankingOnlineMode() {
        this.removeIdRankingOnlineMode();
        this.idRankingOnlineMode = game.time.events.add(Phaser.Timer.SECOND * 60, this.resetDataRankingOnlineMode, this);
    }
    resetDataRankingOnlineMode() {
        this._dataRankingOnlineMode = null;
    }

    //this.dataRankingTurnBase = null; this.idRankingTurnBase = null;
    get dataRankingTurnBase() {
        return this._dataRankingTurnBase;
    }
    set dataRankingTurnBase(_dataRankingTurnBase) {
        this._dataRankingTurnBase = _dataRankingTurnBase;
        this.callResetRankingTurnBase();
    }
    removeIdRankingTurnBase() {
        if (this.idRankingTurnBase !== null) {
            game.time.events.remove(this.idRankingTurnBase);
            this.idRankingTurnBase = null;
        }
    }
    callResetRankingTurnBase() {
        this.removeIdRankingTurnBase();
        this.idRankingTurnBase = game.time.events.add(Phaser.Timer.SECOND * 60, this.resetDataRankingTurnBase, this);
    }
    resetDataRankingTurnBase() {
        this._dataRankingTurnBase = null;
    }

    //resetDataServer
    resetDataServer() {
        this.removeIdBetCreateRoom();
        this._dataBetCreateRoom = null;

        this.removeIdPlaylistCreateRoom();
        this._dataPlaylistCreateRoom = null;

        this.removeIdGenresQuickPlay();
        this._dataGenresQuickPlay = null;

        this.removeIdListRoomEventMode();
        this._dataListRoomEventMode = null;

        this.removeIdRankingEventmode();
        this._dataRankingEventmode = null;

        this.removeIdRankingDiamond();
        this._dataRankingDiamond = null;

        this.removeIdRankingLevel();
        this._dataRankingLevel = null;

        this.removeIdRankingOnlineMode();
        this._dataRankingOnlineMode = null;

        this.removeIdRankingTurnBase();
        this._dataRankingTurnBase = null;

    }
}