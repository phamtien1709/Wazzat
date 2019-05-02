import FacebookMobile from "./FacebookMobile.js";
import MainData from "./model/MainData.js";

export default class FaceBookCheckingTools {
    constructor() {

    }

    static instance() {
        if (this.fbChecking) {

        } else {
            this.fbChecking = new FaceBookCheckingTools();
        }

        return this.fbChecking;
    }

    logEvent(event, valueToSum = 1) {
        if (window.isTest === true) {
            if (window.cordova && typeof device !== 'undefined') {
                FacebookMobile.instance().logEvent(event, valueToSum);
            } else {
                FB.AppEvents.logEvent(MainData.instance().platform + "_" + event, valueToSum);
            }
        }
    }

    static get Login_buttons() {
        return "Button_Login";
    }
    static get Choose_genre_Buttons() {
        return "Button_Choose_genre";
    }
    static get Find_Game_turnbase_mode_button() {
        return "Button_turnbase_mode";
    }
    static get Find_Game_turbase_random_opponent_button() {
        return "Button_turbase_random_opponent";
    }
    static get Find_Game_Suggestion_Opponent_profile_button() {
        return "Button_Suggestion_Opponent_profile";
    }
    static get Party_online_mode_button() {
        return "Button_Party_online_mode";
    }
    static get Party_online_mode_quickplay_button() {
        return "Button_quickplay";
    }
    static get Party_online_mode_Creatroom_button() {
        return "Button_Creatroom";
    }
    static get Solo_mode_button() {
        return "Button_Solo_mode";
    }
    static get Solo_mode_quiz_play_button() {
        return "Button_Solo_mode_quiz_play";
    }
    static get Solo_mode_ranking_button() {
        return "Button_Solo_mode_ranking";
    }
    static get Event_mode_button() {
        return "Button_Event_mode";
    }
    static get Event_mode_join_room_button() {
        return "Button_Event_mode_join_room";
    }
    static get Event_mode_play_button() {
        return "Button_Event_mode_play";
    }
    static get Ranking_level_button() {
        return "Button_Ranking_level";
    }
    static get Ranking_diamond_button() {
        return "Button_Ranking_diamond";
    }
    static get Ranking_turnbase_button() {
        return "Button_Ranking_turnbase";
    }
    static get Ranking_online_button() {
        return "Button_Ranking_online";
    }
    static get Quest_main_button() {
        return "Button_Quest_main";
    }
    static get Quest_Achievement_button() {
        return "Button_Quest_Achievement";
    }

    static get Quest_Daily_button() {
        return "Button_Quest_Daily";
    }
    static get Mail_button() {
        return "Button_Mail";
    }
    static get Shop_playlist_button() {
        return "Button_Shop_playlist";
    }
    static get Shop_resource_button() {
        return "Button_Shop_resource";
    }
    static get Shop_items_support_butotn() {
        return "Button_Shop_items_support_butotn";
    }
    static get Shop_Vip_button() {
        return "Button_Shop_Vip";
    }
    static get Friend_add_button() {
        return "Button_Friend_add";
    }

    //
    static get Loading() {
        return "Sreen_Loading";
    }
    static get LoginScreen() {
        return "Sreen_LoginScreen";
    }
    static get Mainmenu() {
        return "Sreen_Mainmenu";
    }
    static get Choose_genre() {
        return "Sreen_Choose_genre";
    }
    static get Main_menu() {
        return "Sreen_Main_menu";
    }
    static get Daily_reward() {
        return "Sreen_Daily_reward";
    }
    static get Find_Game_turnbase_mode() {
        return "Sreen_Find_Game_turnbase_mode";
    }
    static get Find_Game_turbase_random_opponent() {
        return "Sreen_turbase_random_opponent";
    }
    static get Find_Game_Suggestion_Opponent_profile() {
        return "Sreen_Suggestion_Opponent_profile";
    }
    static get Party_online_mode() {
        return "Sreen_Party_online_mode";
    }
    static get Party_online_mode_quickplay() {
        return "Sreen_Party_online_mode_quickplay";
    }
    static get Party_online_mode_Creatroom() {
        return "Sreen_Party_online_mode_Creatroom";
    }
    static get Solo_mode() {
        return "Sreen_Solo_mode";
    }
    static get Solo_mode_quiz_play() {
        return "Sreen_Solo_mode_quiz_play";
    }
    static get Solo_mode_ranking() {
        return "Sreen_Solo_mode_ranking";
    }
    static get Event_mode() {
        return "Sreen_Event_mode";
    }
    static get Event_mode_join_room() {
        return "Sreen_Event_mode_join_room";
    }
    static get Event_mode_play() {
        return "Sreen_Event_mode_play";
    }
    static get Ranking_level() {
        return "Sreen_Ranking_level";
    }
    static get Ranking_diamond() {
        return "Sreen_Ranking_diamond";
    }
    static get Ranking_turnbase() {
        return "Sreen_Ranking_turnbase";
    }
    static get Ranking_online() {
        return "Sreen_Ranking_online";
    }
    static get Quest_main() {
        return "Sreen_Quest_main";
    }
    static get Quest_Achievement() {
        return "Sreen_Quest_Achievement";
    }
    static get Quest_Daily() {
        return "Sreen_Quest_Daily";
    }
    static get Mail() {
        return "Sreen_Mail";
    }
    static get Shop_playlist() {
        return "Sreen_Shop_playlist";
    }
    static get Shop_resource() {
        return "Sreen_Shop_resource";
    }
    static get Shop_items_support() {
        return "Sreen_Shop_items_support";
    }
    static get Shop_Vip() {
        return "Sreen_Shop_Vip";
    }
    static get Friend_add() {
        return "Sreen_Friend_add";
    }
    static get Popup_Quest() {
        return "Sreen_Popup_Quest";
    }
    static get Popup_Achievement() {
        return "Sreen_Popup_Achievement";
    }
    static get Popup_invite_online_room() {
        return "Sreen_Popup_invite_online_room";
    }


    static get Screen_Play_Script() {
        return "screen_play_script";
    }
    static get Screen_Play_Script_Skip() {
        return "screen_play_script_skip";
    }


    static get total_time() {
        return "total_time"; //Tổng thời gian trải qua trong game (Total Time in App lifetime)
    }
    static get play_time() {
        return "play_time"; //Thời gian khi user trả lời các câu hỏi
    }
    static get pro_bad_imp() {
        return "pro_bad_imp"; //Tổng impression của Banner Ads của User tính đến lúc bắn event
    }
    static get pro_bad_click() {
        return "pro_bad_click";
    }
    static get pro_fad_imp() {
        return "pro_fad_imp";
    }
    static get pro_fad_click() {
        return "pro_fad_click";
    }
    static get pro_rad_imp() {
        return "pro_rad_imp";
    }
    static get pro_quiz_start_createroom() {
        return "pro_quiz_start_createroom"; //Tổng số lần user vào phần trả lời quiz
    }
    static get pro_quiz_end_createroom() {
        return "pro_quiz_end_createroom"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }
    static get pro_quiz_start_quickplay() {
        return "pro_quiz_start_quickplay"; //Tổng số lần user vào phần trả lời quiz
    }
    static get pro_quiz_end_quickplay() {
        return "pro_quiz_end_quickplay"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }
    static get pro_quiz_start_turnbase() {
        return "pro_quiz_start_turnbase"; //Tổng số lần user vào phần trả lời quiz
    }
    static get pro_quiz_end_turnbase() {
        return "pro_quiz_end_turnbase"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }
    static get pro_quiz_start_solomode() {
        return "pro_quiz_start_solomode"; //Tổng số lần user vào phần trả lời quiz
    }
    static get pro_quiz_end_solomode() {
        return "pro_quiz_end_solomode"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }
    static get pro_quiz_start_eventmode() {
        return "pro_quiz_start_eventmode"; //Tổng số lần user vào phần trả lời quiz
    }
    static get pro_quiz_end_eventmode() {
        return "pro_quiz_end_eventmode"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }
    static get pro_quiz_end_eventmode() {
        return "pro_quiz_end_eventmode"; // Tổng số lần User chơi hết 1 quiz tính đến lúc  bắn event
    }


    // quang cao
    static get InterstitialTurnBase() {
        return "InterstitialTurnBase";
    }
    static get InterstitialQuickPlay() {
        return "InterstitialQuickPlay";
    }
    static get InterstitialCreateRoom() {
        return "InterstitialCreateRoom";
    }
    static get InterstitialSoloModeWin() {
        return "InterstitialSoloModeWin";
    }
    static get InterstitialSoloModeGameOver() {
        return "InterstitialSoloModeGameOver";
    }
    static get InterstitialQuest() {
        return "InterstitialQuest";
    }
    static get InterstitialAchievement() {
        return "InterstitialAchievement";
    }
    static get InterstitialDoneSoloMode() {
        return "InterstitialDoneSoloMode";
    }

    static get InterstitialEventMode() {
        return "InterstitialEventMode";
    }

    static get InterstitialEventMode() {
        return "InterstitialEventMode";
    }

    static get RewardVideoInappDiamond() {
        return "RewardVideoInappDiamond";
    }
    static get RewardVideoInappTicket() {
        return "RewardVideoInappTicket";
    }
    static get RewardVideoInappHeart() {
        return "RewardVideoInappHeart";
    }
    static get RewardVideoInappSupportItem() {
        return "RewardVideoInappSupportItem";
    }
    static get RewardVideoX2DailyReward() {
        return "RewardVideoX2DailyReward";
    }
    static get RewardVideoGetHeartInSoloMode() {
        return "RewardVideoGetHeartInSoloMode";
    }
    static get RewardVideoX2DiamondButtonSoloMode() {
        return "RewardVideoX2DiamondButtonSoloMode";
    }
    static get RewardVideoLuckyWheel() {
        return "RewardVideoLuckyWheel";
    }

    static get BannerQuest() {
        return "BannerQuest";
    }
    static get BannerEventRoom() {
        return "BannerEventRoom";
    }
    static get BannerUserProfile() {
        return "BannerUserProfile";
    }
    static get BannerViewAllFriend() {
        return "BannerViewAllFriend";
    }
    static get BannerInfoSong() {
        return "BannerInfoSong";
    }
    static get BannerPartyMode() {
        return "BannerPartyMode";
    }
    static get BannerQuickPlayModeRoom() {
        return "BannerQuickPlayModeRoom";
    }
    static get BannerChooseBettingQuickPlay() {
        return "BannerChooseBettingQuickPlay";
    }
    static get BannerWaitingRoomQuickPlayScreen() {
        return "BannerWaitingRoomQuickPlayScreen";
    }

    static get BannerChoosePlayListQuickPlay() {
        return "BannerChoosePlayListQuickPlay";
    }
    static get BannerChooseBettingCreateRoom() {
        return "BannerChooseBettingCreateRoom";
    }
    static get BannerInviteOtherFriend() {
        return "BannerInviteOtherFriend";
    }
    static get SuggetRatingShow() {
        return "SuggetRatingShow";
    }
    static get SuggetRatingShow() {
        return "SuggetRatingShow";
    }
    static get SuggetRatingShow() {
        return "SuggetRatingShow";
    }
    static get SuggetRatingVoteSau() {
        return "SuggetRatingVoteSau";
    }
    static get SuggetRatingVoteNgay() {
        return "SuggetRatingVoteNgay";
    }
    static get SuggetRatingClose() {
        return "SuggetRatingClose";
    }

}