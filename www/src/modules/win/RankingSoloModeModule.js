// import RankingTop3Group from "./Ranking/RankingTop3Group.js";
// import RankingTopOtherGroup from "./Ranking/RankingTopOtherGroup.js";
// import RankingButtonOption from "./Ranking/RankingButtonOption.js";

export default class RankingSoloModeModule {

}
//     constructor(state, positionWinConfig) {
//         this.state = state;
//         this.positionWinConfig = positionWinConfig;
//     }
//     createPopupRanking() {
//         this.rankTop3ThisWeek = [];
//         this.rank4to10ThisWeek = [];
//         this.rankTop3LastWeek = [];
//         this.rank4to10LastWeek = [];
//         this.top3LastWeekGroup = new RankingTop3Group();
//         this.topOtherLastWeekGroup = new RankingTopOtherGroup();
//         this.top3ThisWeekGroup = new RankingTop3Group();
//         this.topOtherThisWeekGroup = new RankingTopOtherGroup();
//         //
//         this.popupRanking = game.add.group();
//         this.addBG();
//         //275
//         this.addGrapRankAndScrollMask();
//         this.addButtonSwitch();
//         this.addHeaderRank();
//     }

//     addBG() {
//         var bg = game.add.sprite(0, 0, 'bg-rank');
//         this.popupRanking.add(bg);
//     }

//     addButtonSwitch() {
//         this.btnRankingLastWeek = new RankingButtonOption(this.positionWinConfig.button_ranking_last_week);
//         this.btnRankingLastWeek.addTextLastWeek();
//         this.btnRankingLastWeek.addInput();
//         this.btnRankingLastWeek.addEventInput(this.onClickLastWeek, this);
//         this.btnRankingLastWeek.setWidth();
//         this.popupRanking.add(this.btnRankingLastWeek);
//         this.btnRankingThisWeek = new RankingButtonOption(this.positionWinConfig.button_ranking_this_week);
//         this.btnRankingThisWeek.addTextThisWeek();
//         this.btnRankingThisWeek.addInput();
//         this.btnRankingThisWeek.addEventInput(this.onClickThisWeek, this);
//         this.btnRankingThisWeek.setWidth();
//         this.popupRanking.add(this.btnRankingThisWeek);
//     }

//     onClickThisWeek() {
//         this.btnRankingThisWeek.changeEffectShow();
//         this.btnRankingLastWeek.changeEffectHide();
//         // this.RankingSoloModeModule.hideRankingLastWeek();
//         this.top3LastWeekGroup.kill();
//         this.topOtherLastWeekGroup.kill();
//         this.top3ThisWeekGroup.revive();
//         this.topOtherThisWeekGroup.revive();
//     }

//     onClickLastWeek() {
//         this.btnRankingLastWeek.changeEffectShow();
//         this.btnRankingThisWeek.changeEffectHide();
//         //
//         this.top3LastWeekGroup.revive();
//         this.topOtherLastWeekGroup.revive();
//         this.top3ThisWeekGroup.kill();
//         this.topOtherThisWeekGroup.kill();
//     }

//     addGrapRankAndScrollMask() {
//         var scrollMaskRank = game.add.graphics(0, 180);
//         scrollMaskRank.beginFill();
//         scrollMaskRank.drawRect(0, 0, game.width, 2645);
//         scrollMaskRank.endFill();
//         this.popupRanking.add(scrollMaskRank);
//         var grapRank = game.add.graphics(0, 180);
//         grapRank.drawRect(0, 0, game.width, 2645);
//         grapRank.inputEnabled = true;
//         grapRank.input.enableDrag();
//         grapRank.input.allowHorizontalDrag = false;
//         grapRank.mask = scrollMaskRank;
//         grapRank.events.onDragUpdate.add(() => {
//             if (grapRank.position.y > 180) {
//                 grapRank.input.disableDrag();
//                 grapRank.position.y = 180;
//                 grapRank.input.enableDrag();
//             }
//             if (grapRank.position.y < -(grapRank.height - 1920)) {
//                 grapRank.input.disableDrag();
//                 grapRank.position.y = -(grapRank.height - 1920);
//                 grapRank.input.enableDrag();
//             }
//         })
//         this.popupRanking.add(grapRank);
//         var bg_grapRank = game.add.sprite(0, 0, 'bg-rank');
//         grapRank.addChild(bg_grapRank);
//         var txt_reward_rank = game.add.text(game.world.centerX, 110, 'Phần thưởng', {
//             font: `40px Roboto`,
//             fill: "#93909c",
//             boundsAlignH: "center",
//             boundsAlignV: "middle",
//             fontWeight: 400
//         });
//         txt_reward_rank.anchor.set(0.5);
//         grapRank.addChild(txt_reward_rank);
//         var iphoneRank = game.add.sprite(60, 150, 'iphonex-rank');
//         grapRank.addChild(iphoneRank);
//         var ipodeRank = game.add.sprite(390, 150, 'ipod-rank');
//         grapRank.addChild(ipodeRank);
//         var sonyRank = game.add.sprite(720, 150, 'sony-rank');
//         grapRank.addChild(sonyRank);
//         // var tab_top3 = game.add.sprite(0, 616, 'tab-top3-rank');
//         // grapRank.addChild(tab_top3);
//         //1344 - 180
//         var rank4to10 = game.add.sprite(0, 1164, 'rank4to10-rank');
//         var ve_reward = game.add.button(1020, 90, 've-ranking');
//         ve_reward.anchor.set(1, 0.5);
//         rank4to10.addChild(ve_reward);
//         //
//         this.top3LastWeekGroup.kill();
//         this.topOtherLastWeekGroup.kill();
//         grapRank.addChild(rank4to10);
//         grapRank.addChild(this.top3LastWeekGroup);
//         grapRank.addChild(this.top3ThisWeekGroup);
//         grapRank.addChild(this.topOtherLastWeekGroup);
//         grapRank.addChild(this.topOtherThisWeekGroup);
//     }

//     addHeaderRank() {
//         var header_rank = game.add.sprite(0, 0, 'tab-header-rank');
//         var arrow = game.add.button(0, 0, 'arrow-rank');
//         header_rank.addChild(arrow);
//         arrow.events.onInputDown.add(() => {
//             this.sendRequestMenuChallenges();
//             // this.popupRanking.position.x = game.width;
//         });
//         var icon_rank_header = game.add.button(1020, 43, 'icon-rank-header-rank');
//         icon_rank_header.anchor.set(1, 0);
//         header_rank.addChild(icon_rank_header);
//         var scoreText = game.add.text(922, 55, `${this.state.params.archived.achieved}`, {
//             font: `42px Roboto`,
//             fill: "#ffffff",
//             boundsAlignH: "center",
//             boundsAlignV: "middle",
//             fontWeight: 400
//         });
//         scoreText.anchor.set(1, 0);
//         var txt_header_rank = game.add.text(540, 87, this.state.params.playlist.name, {
//             font: `55px Roboto`,
//             fill: "#ffffff",
//             align: "center",
//             fontWeight: 500,
//             wordWrap: true,
//             wordWrapWidth: 800
//         });
//         txt_header_rank.anchor.set(0.5);
//         header_rank.addChild(txt_header_rank);
//         header_rank.addChild(scoreText);
//         this.popupRanking.add(header_rank);
//     }

//     sendRequestMenuChallenges() {
//         SocketController.instance().sendData(DataCommand.MAIN_MENU_LOAD_REQUEST, null);
//     }

//     setRankingThisWeek(arr) {
//         this.filterArrToTwoArr(arr, (top3, topOther) => {
//             this.top3ThisWeekGroup.configsEntity = top3;
//             this.topOtherThisWeekGroup.configsEntity = topOther;
//             this.top3ThisWeekGroup.addTop3();
//             this.topOtherThisWeekGroup.addTopOther();
//         });
//     }

//     setRankingLastWeek(arr) {
//         LogConsole.log(arr);
//         this.filterArrToTwoArr(arr, (top3, topOther) => {
//             this.top3LastWeekGroup.configsEntity = top3;
//             this.topOtherLastWeekGroup.configsEntity = topOther;
//             this.top3LastWeekGroup.addTop3();
//             this.topOtherLastWeekGroup.addTopOther();
//         });
//     }

//     filterArrToTwoArr(arr, callback) {
//         var top3 = [];
//         var topOther = [];
//         if (arr.length > 0) {
//             for (let i = 0; i < 3; i++) {
//                 if (arr[i]) {
//                     top3.push(arr[i]);
//                 }
//             }
//             if (arr.length > 3) {
//                 for (let i = 3; i < 10; i++) {
//                     if (arr[i]) {
//                         topOther.push(arr[i]);
//                     }
//                 }
//             }
//         }
//         callback(top3, topOther);
//     }

//     destroyAll() {

//     }

//     hideGroup(groupToKill) {
//         groupToKill.destroyGroup();
//     }

//     showGroup(group) {
//         group.reviveGroup();
//     }
// }