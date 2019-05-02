import ControllLoading from "../../ControllLoading.js";
import SocketController from "../../../controller/SocketController.js";
import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import UserLastWeek from "./button/UserLastWeek.js";
import UserWinLastWeek from "./button/UserWinLastWeek.js";
import FacebookAction from "../../../common/FacebookAction.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class LastWeekResultScreen extends BaseGroup {
  constructor(opponent = null) {
    super(game);
    this.opponent = opponent;
    this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
    this.bg = new Phaser.Button(game, 0, 0, 'bg_create_room')
    this.addChild(this.bg);
    this.lastWeekResult = null;
    this.afterInit();
  }

  afterInit() {
    this.addEventExtensions();
    this.addHeader();
    this.addFundaMetal();
    this.sendRequestLastWeekResult();
  }

  sendRequestLastWeekResult() {
    ControllLoading.instance().showLoading();
    let params = new SFS2X.SFSObject();
    params.putInt('opponent_id', this.opponent.id);
    SocketController.instance().sendData(DataCommand.TURNBASE_LAST_WEEK_RESULT_REQUEST, params);
  }

  addHeader() {
    this.headerTab = new Phaser.Sprite(game, this.positionWinConfig.header.tab.x, this.positionWinConfig.header.tab.y, this.positionWinConfig.header.tab.nameAtlas, this.positionWinConfig.header.tab.nameSprite);
    this.addChild(this.headerTab);
    this.btnBack = new Phaser.Button(game, this.positionWinConfig.header.back.x, this.positionWinConfig.header.back.y, this.positionWinConfig.header.back.nameAtlas, this.onBack, this, null, this.positionWinConfig.header.back.nameSprite);
    this.headerTab.addChild(this.btnBack);
    this.txtHeader = new Phaser.Text(game, this.positionWinConfig.header.txt.x, this.positionWinConfig.header.txt.y, Language.instance().getData("266"), this.positionWinConfig.header.txt.configs);
    this.txtHeader.anchor.set(0.5, 0);
    this.headerTab.addChild(this.txtHeader);
  }

  addFundaMetal() {
    this.txtScore;
    this.vsIcon;
    this.btnShare;
    this.boxScore;
    //
    this.txtScore = new Phaser.Text(game, this.positionWinConfig.last_week_screen.txt_score.x, this.positionWinConfig.last_week_screen.txt_score.y, Language.instance().getData("268"), this.positionWinConfig.last_week_screen.txt_score.configs);
    this.txtScore.anchor.set(0.5, 0);
    this.addChild(this.txtScore);
    //
    this.boxScore = new Phaser.Sprite(game, this.positionWinConfig.last_week_screen.box_score.x, this.positionWinConfig.last_week_screen.box_score.y, this.positionWinConfig.last_week_screen.box_score.nameAtlas, this.positionWinConfig.last_week_screen.box_score.nameSprite);
    this.boxScore.anchor.set(0.5);
    this.addChild(this.boxScore);
    //
    this.vsIcon = new Phaser.Sprite(game, this.positionWinConfig.last_week_screen.vs.x, this.positionWinConfig.last_week_screen.vs.y, this.positionWinConfig.last_week_screen.vs.nameAtlas, this.positionWinConfig.last_week_screen.vs.nameSprite);
    this.vsIcon.anchor.set(0.5);
    let txtVs = new Phaser.Text(game, this.positionWinConfig.last_week_screen.txt_vs.x, this.positionWinConfig.last_week_screen.txt_vs.y, this.positionWinConfig.last_week_screen.txt_vs.text, this.positionWinConfig.last_week_screen.txt_vs.configs);
    txtVs.anchor.set(0.5);
    this.vsIcon.addChild(txtVs);
    this.addChild(this.vsIcon);
    //
    this.btnShare = new Phaser.Button(game, this.positionWinConfig.last_week_screen.btn_share.x, this.positionWinConfig.last_week_screen.btn_share.y, this.positionWinConfig.last_week_screen.btn_share.nameAtlas, this.onClickShare, this, null, this.positionWinConfig.last_week_screen.btn_share.nameSprite);
    this.btnShare.anchor.set(0.5);
    let txtShare = new Phaser.Text(game, this.positionWinConfig.last_week_screen.btn_share.txt.x, this.positionWinConfig.last_week_screen.btn_share.txt.y, Language.instance().getData("263"), this.positionWinConfig.last_week_screen.btn_share.txt.configs);
    txtShare.anchor.set(0, 0.5);
    this.btnShare.addChild(txtShare);
    this.addChild(this.btnShare);
  }

  onBack() {
    ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    EventGame.instance().event.backLastWeek.dispatch();
    this.destroy();
  }

  onClickShare() {
    ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    FacebookAction.instance().share();

  }

  onExtensionResponse(evtParams) {
    if (evtParams.cmd == DataCommand.TURNBASE_LAST_WEEK_RESULT_RESPONSE) {
      if (evtParams.params.getUtfString('status') == "OK") {
        let last_week_result = evtParams.params.getSFSObject('last_week_result');
        let user_won = last_week_result.getInt('user_won');
        let opponent_won = last_week_result.getInt('opponent_won');
        var opponentInfo = {
          level: 0,
          level_title: '',
          is_online: false
        }
        if (last_week_result.containsKey('opponent_info')) {
          let opponent_info = last_week_result.getSFSObject('opponent_info');
          opponentInfo.level = opponent_info.getInt('level');
          opponentInfo.level_title = opponent_info.getUtfString('level_title');
          opponentInfo.is_online = opponent_info.getBool('is_online');
        }
        this.lastWeekResult = {
          user_won: user_won,
          opponent_won: opponent_won,
          opponent_info: opponentInfo
        }
        // this.lastWeekResult = {
        //   user_won: 8,
        //   opponent_won: 4
        // }
        this.opponent.level_title = opponentInfo.level_title;
        this.showResult();
      }
    }
  }

  showResult() {
    this.scorePoint;
    this.userSprite;
    this.opponentSprite;
    //
    this.scorePoint = new Phaser.Text(game, this.positionWinConfig.last_week_screen.score_point.x, this.positionWinConfig.last_week_screen.score_point.y, `${this.lastWeekResult.opponent_won} - ${this.lastWeekResult.user_won}`, this.positionWinConfig.last_week_screen.score_point.configs);
    this.scorePoint.anchor.set(0.5);
    this.boxScore.addChild(this.scorePoint);
    //
    this.circle = new Phaser.Sprite(game, 320, 320, 'playSprites', 'Light');
    this.circle.anchor.set(0.5);
    this.tweenCircle = game.add.tween(this.circle).to({ angle: 359 }, 2000, "Linear", true, 0, -1, false);
    this.tweenCircle.start();
    this.addChild(this.circle);
    //
    this.userSprite = new UserLastWeek(395, 734, {
      id: SocketController.instance().dataMySeft.user_id,
      userName: SocketController.instance().dataMySeft.user_name,
      avatar: SocketController.instance().dataMySeft.avatar,
      is_online: true,
      level_title: SocketController.instance().dataMySeft.level_title
    });
    this.opponentSprite = new UserLastWeek(125, 734, this.opponent);
    this.addChild(this.userSprite);
    this.addChild(this.opponentSprite);
    //
    this.addCongrat();
    //
    ControllLoading.instance().hideLoading();
  }

  addCongrat() {
    if (this.lastWeekResult.user_won > this.lastWeekResult.opponent_won) {
      this.addTxtWhoWin();
      //user win
      this.userWin = new UserWinLastWeek({
        id: SocketController.instance().dataMySeft.user_id,
        userName: SocketController.instance().dataMySeft.user_name,
        avatar: SocketController.instance().dataMySeft.avatar,
        is_online: true,
        level_title: SocketController.instance().dataMySeft.level_title
      })
      this.addChild(this.userWin)
    } else if (this.lastWeekResult.user_won == this.lastWeekResult.opponent_won) {
      //deuce
      this.addTxtDeuce();
    } else {
      this.addTxtWhoWin();
      //opponent win
      this.userWin = new UserWinLastWeek(this.opponent);
      this.addChild(this.userWin)
    }
    this.addFirework();
  }

  addTxtWhoWin() {
    this.txtWhoWin = new Phaser.Text(game, this.positionWinConfig.last_week_screen.txt_who_win.x, this.positionWinConfig.last_week_screen.txt_who_win.y, Language.instance().getData("267"), this.positionWinConfig.last_week_screen.txt_who_win.configs);
    this.txtWhoWin.anchor.set(0.5, 0);
    this.addChild(this.txtWhoWin);
  }

  addTxtDeuce() {
    if (Language.instance().currentLanguage == "en") {
      this.txtDeuce = new Phaser.Sprite(game, this.positionWinConfig.last_week_screen.deuce_en.x, this.positionWinConfig.last_week_screen.deuce_en.y, this.positionWinConfig.last_week_screen.deuce_en.nameAtlas, this.positionWinConfig.last_week_screen.deuce_en.nameSprite);
      this.txtDeuce.anchor.set(0.5);
      this.addChild(this.txtDeuce);
    } else {
      this.txtDeuce = new Phaser.Sprite(game, this.positionWinConfig.last_week_screen.deuce.x, this.positionWinConfig.last_week_screen.deuce.y, this.positionWinConfig.last_week_screen.deuce.nameAtlas, this.positionWinConfig.last_week_screen.deuce.nameSprite);
      this.txtDeuce.anchor.set(0.5);
      this.addChild(this.txtDeuce);
    }
  }

  addFirework() {
    this.fireWork = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 210 * window.GameConfig.RESIZE, 'firework');
    this.fireWork.anchor.set(0.5);
    this.fireWork.scale.set(1.3);
    this.addChild(this.fireWork);
    var runFireWork = this.fireWork.animations.add('run_firework');
    this.fireWork.animations.play('run_firework', 30, true);
  }


  addEventExtensions() {
    SocketController.instance().events.onExtensionResponse.add(this.onExtensionResponse, this);
    EventGame.instance().event.backButton.add(this.onBack, this);
  }

  removeEventExtensions() {
    SocketController.instance().events.onExtensionResponse.remove(this.onExtensionResponse, this);
    EventGame.instance().event.backButton.remove(this.onBack, this);
  }

  destroy() {
    this.removeEventExtensions();
    if (this.tweenCircle) {
      this.tweenCircle.stop();
    }
    while (this.children.length > 0) {
      let item = this.children[0];
      this.removeChild(item);
      item.destroy();
      item = null;
    }
    if (this.parent) {
      this.parent.removeChild(this);
    }
    super.destroy();
  }
}