import BaseView from "../../BaseView.js";
import OnlineModeButtonMenuGenres from "./OnlineModeButtonMenuGenres.js";
import DataConst from "../../../model/DataConst.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeMenuGenres extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {

        this.event = {
            choose: new Phaser.Signal()
        }

        this.type = MainData.instance().typeMenuGenes;

        this.btnVN = new OnlineModeButtonMenuGenres(DataConst.getNameRegion(DataConst.Local), this.clickVN, this);
        this.addChild(this.btnVN);

        this.btnQuocTe = new OnlineModeButtonMenuGenres(DataConst.getNameRegion(DataConst.International), this.clickQuocTe, this);
        this.btnQuocTe.x = this.btnVN.width;
        this.addChild(this.btnQuocTe);

        if (this.type == DataConst.Local) {
            this.btnVN.setActive();
            this.btnQuocTe.setDefault();
        } else {
            this.btnVN.setDefault();
            this.btnQuocTe.setActive();
        }
    }

    clickVN(evt) {
        if (this.type == DataConst.International) {
            this.type = DataConst.Local;
            this.btnQuocTe.setDefault();
            this.btnVN.setActive();
            this.event.choose.dispatch(this.type);
        }
    }
    clickQuocTe(evt) {
        if (this.type == DataConst.Local) {
            this.type = DataConst.International;
            this.btnVN.setDefault();
            this.btnQuocTe.setActive();
            this.event.choose.dispatch(this.type);
        }
    }
}