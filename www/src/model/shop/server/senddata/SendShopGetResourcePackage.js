export default class SendShopGetResourcePackage {
    static begin(payment_service) {
        let params = new SFS2X.SFSObject();
        params.putUtfString("payment_service", payment_service);
        params.putBool("new_ticket", true);
        return params;
    }

    static get GOOGLE_PLAY() {
        return 'GOOGLE_PLAY';
    }
    static get APPLE() {
        return 'APPLE';
    }
    static get AMAZON_IAP() {
        return 'AMAZON_IAP';
    }
    static get GAME() {
        return 'GAME';
    }
    static get FACEBOOK() {
        return "FACEBOOK";
    }
}