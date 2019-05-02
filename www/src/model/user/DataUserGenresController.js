import UserGenres from "./UserGenres.js";

export default class DataUserGenresController {
    constructor() {
        this.objData = {};
        this.arrLocal = [];
        this.arrInternational = [];
        this.arrAll = [];
    }

    resetData() {
        this.objData = {};
        this.arrLocal = [];
        this.arrInternational = [];
        this.arrAll = [];
    }

    setDataGenres(data) {
        let dataGenres = new UserGenres();
        dataGenres = Object.assign({}, dataGenres, data);
        this.objData[dataGenres.id] = dataGenres;

        if (dataGenres.region === "Local") {
            this.arrLocal.push(dataGenres.id);
        } else {
            this.arrInternational.push(dataGenres.id);
        }

        this.arrAll.push(dataGenres.id);
    }

    getDataGenresByLocal(local) {
        let arrGenres = [];
        if (local === "Local") {
            for (let i = 0; i < this.arrLocal.length; i++) {
                arrGenres.push(this.objData[this.arrLocal[i]]);
            }
        } else {
            for (let i = 0; i < this.arrInternational.length; i++) {
                if (this.objData[this.arrInternational[i]].code === "au_my") {

                } else {
                    arrGenres.push(this.objData[this.arrInternational[i]]);
                }
            }
        }

        return arrGenres;
    }

    getAll() {
        let arrGenres = [];
        for (let i = 0; i < this.arrAll.length; i++) {
            arrGenres.push(this.objData[this.arrAll[i]]);
        }

        return arrGenres;

    }



}