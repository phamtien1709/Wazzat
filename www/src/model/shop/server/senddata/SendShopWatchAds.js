export default class SendShopWatchAds {
    static begin(resource_pakage_id, quantity, resource_type) {
        let params = new SFS2X.SFSObject();
        params.putInt("resource_pakage_id", resource_pakage_id);
        params.putInt("quantity", quantity);
        params.putUtfString("resource_type", resource_type);
        return params;
    }
}