import DataFieldListGame from "../common/DataFieldListGame.js";
import Common from "../common/Common.js";

export default class ControllTurnbaseRequestUpdate {
    constructor() {
        this.request = null;
    }

    static instance() {
        if (this.controllTurnbaseRequestUpdate) {

        } else {
            this.controllTurnbaseRequestUpdate = new ControllTurnbaseRequestUpdate();
        }

        return this.controllTurnbaseRequestUpdate;
    }

    getUpdate(params) {
        let user_id = params.getInt(DataFieldListGame.user_id);
        let user_name = params.getUtfString(DataFieldListGame.user_name);
        let avatar = params.getUtfString(DataFieldListGame.avatar);
        let weekly_result = params.getSFSObject(DataFieldListGame.weekly_result);
        let user_won = weekly_result.getInt(DataFieldListGame.user_won);
        let opponent_won = weekly_result.getInt(DataFieldListGame.opponent_won);
        let status = params.getUtfString(DataFieldListGame.status);
        let updated = params.getLong(DataFieldListGame.updated);
        let updatedConverted = Common.formatChallengeGameUpdated(updated);
        let challenge_msg = params.getUtfString(DataFieldListGame.challenge_msg);
        //
        let can_be_poked = null;
        let poked = 0;
        let poked_at = 0;
        if (status == "THEIR_TURN") {
            if (params.containsKey(DataFieldListGame.can_be_poked)) {
                can_be_poked = params.getInt(DataFieldListGame.can_be_poked);
            }
        } else if (status == "YOUR_TURN") {
            if (params.containsKey(DataFieldListGame.poked)) {
                poked = params.getInt(DataFieldListGame.poked);
                poked_at = params.getLong(DataFieldListGame.poked_at);
            }
        }
        let turn_count = params.getInt(DataFieldListGame.turn_count);
        let is_online = params.getBool(DataFieldListGame.is_online);
        let vip = params.getBool(DataFieldListGame.vip);
        //
        let challenge_request_id = params.getLong(DataFieldListGame.challenge_request_id);
        return {
            opponentEntity: {
                id: user_id,
                userName: user_name,
                avatar: avatar,
                is_online: is_online,
                vip: vip
            },
            weeklyResult: {
                userWon: user_won,
                opponentWon: opponent_won
            },
            turnCount: turn_count,
            status: status,
            can_be_poked: can_be_poked,
            poked: poked,
            poked_at: poked_at,
            updated: updatedConverted,
            base_updated: updated,
            challenge_request_id: challenge_request_id,
            challenge_msg: challenge_msg
        }
    }
}