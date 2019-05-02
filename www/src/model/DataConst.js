import Language from "./Language.js";

export default class DataConst {
    static get Local() {
        return "Local";
    }
    static get International() {
        return "International";
    }

    static getNameRegion(type) {
        if (type === DataConst.Local) {
            return Language.instance().getData("319");
        } else if (type === DataConst.International) {
            return Language.instance().getData("320");
        }
    }
}