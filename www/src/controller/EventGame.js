export default class EventGame {
    constructor() {
        this.callMessageFromChatScreen = true;
        this.event = {
            updateGemPlayer: new Phaser.Signal(),
            tweenAllClaimDailyQuestDone: new Phaser.Signal(),
            onConnectServer: new Phaser.Signal(),
            chooseExitBadConnection: new Phaser.Signal(),
            bad_connection: new Phaser.Signal(),
            updateDescription: new Phaser.Signal(),
            clickOKDialog: new Phaser.Signal(),
            searchFriendBackUserProfile: new Phaser.Signal(),
            backButton: new Phaser.Signal(),
            chooseNoPopupConfirm: new Phaser.Signal(),
            turnBaseUpdate: new Phaser.Signal(),
            backChat: new Phaser.Signal(),
            backSystemChat: new Phaser.Signal(),
            backLastWeek: new Phaser.Signal(),
            newMessage: new Phaser.Signal(),
            loadMessagesDone: new Phaser.Signal(),
            loadSystemMessagesDone: new Phaser.Signal()
        }
    }

    static instance() {
        if (this.eventgame) {

        } else {
            this.eventgame = new EventGame();
        }

        return this.eventgame;
    }
}