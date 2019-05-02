export default class ControllInvitation {
    constructor() {
        this.dataBlock = {};
    }
    static instance() {
        if (this.controllInvatation) {

        } else {
            this.controllInvatation = new ControllInvitation();
        }

        return this.controllInvatation;
    }

    getUserBlock(userId) {
        if (this.dataBlock.hasOwnProperty(userId)) {
            return true;
        } else {
            return false;
        }
    }

    addBlock(userId) {
        if (this.dataBlock.hasOwnProperty(userId)) {
            this.removeIdTime(this.dataBlock[userId].idTime);
        } else {
            this.dataBlock[userId] = {};
        }
        this.dataBlock[userId].idTime = game.time.events.add(Phaser.Timer.SECOND * 180, this.removeUserBlock, this, userId);
    }

    removeUserBlock(userId) {
        console.log("removeUserBlock : " + userId);
        if (this.dataBlock.hasOwnProperty(userId)) {
            delete this.dataBlock[userId];
        }

        console.log(this.dataBlock);
    }

    removeIdTime(idTime) {
        if (this.idTime !== null) {
            game.time.events.remove(this.idTime);
            this.idTime = null;
        }
    }
}