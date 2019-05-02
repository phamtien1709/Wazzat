export default class SendShopBuySupportItem {
    static begin(resource_package_id) {
        let params = new SFS2X.SFSObject();
        params.putInt("resource_package_id", resource_package_id);
        return params;
    }
}