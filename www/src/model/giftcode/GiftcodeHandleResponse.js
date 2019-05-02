import GiftcodeDetail from "./GiftcodeDetail.js";

// (sfs_object) gift_code: 
// 		(int) amount: 20
// 		(int) diamond: 1000
// 		(int) ticket: 20
// 		(long) created: 1542877299000
// 		(utf_string) name: test code
// 		(long) id: 1
// 		(long) expiration_date: 1543031880000
// 		(long) updated: 1542877299000
// 		(int) heart: 20
// 		(int) support_item: 20
// 	(utf_string) status: OK

export default class GiftcodeHandleResponse {
    static begin(response) {
        let giftcode = new GiftcodeDetail();
        let gift_code = response.getSFSObject('gift_code');
        giftcode.amount = gift_code.getInt('amount');
        giftcode.created = gift_code.getLong('created');
        giftcode.diamond = gift_code.getInt('diamond');
        giftcode.expiration_date = gift_code.getLong('expiration_date');
        giftcode.heart = gift_code.getInt('heart');
        giftcode.id = gift_code.getLong('id');
        giftcode.name = gift_code.getUtfString('name');
        giftcode.support_item = gift_code.getInt('support_item');
        giftcode.ticket = gift_code.getInt('ticket');
        giftcode.updated = gift_code.getLong('updated');

        return giftcode;
    }
}