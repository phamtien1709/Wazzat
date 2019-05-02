export default class Language {
    constructor() {
        this.currentLanguage = "en";
        this.ktFirst = true
        this.dataLanguage = {};

        this.changeDataLanguage();
    }

    changeDataLanguage(language = "en") {
        if (this.currentLanguage === language.toLowerCase()) {
            if (this.ktFirst === true) {
                this.ktFirst = false;
                this.currentLanguage = language.toLowerCase();
                this.dataLanguage = JSON.parse(game.cache.getText('languageGame'))[this.currentLanguage];
            }
        } else {
            this.currentLanguage = language.toLowerCase();
            this.dataLanguage = JSON.parse(game.cache.getText('languageGame'))[this.currentLanguage];
        }
    }

    getData(key) {
        if (this.dataLanguage.hasOwnProperty(key)) {
            return this.dataLanguage[key];
        } else {
            console.log("khong ton tai key");
            return "";
        }
    }

    static instance() {
        if (this.language) {

        } else {
            this.language = new Language();
        }

        return this.language;
    }
}