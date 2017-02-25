import { UserDataPage } from '../user-data/user-data';
import { FromServerTime } from './../../pipes/from-server-time';
import { Settings } from './../../providers/settings';
import { RoundInterface } from './../../environment/round-interface';
import { LoginPage } from './../login/login';
import { ToasterService } from './../../providers/toaster-service';
import { UserDataInterface } from '../../environment/user-data-interface';
import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';

import { Component } from '@angular/core';
import { AlertController, NavController, ModalController } from 'ionic-angular';

import { PlayerService } from '../../providers/player-service';
import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';
import { Helper } from '../../providers/helper';

import { CourseSelectPage } from '../course-select/course-select-page';
import { ScoreCardPage } from '../score-card/score-card-page';


@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html',
})

export class DashboardPage {

  rounds: Array<RoundInterface> = [];
  user: UserDataInterface;
  recordRound: RoundInterface = {
    course_id: null,
    id: null,
    name: null,
    putts:null,
    score:0,
    startedAt: null,
    tee:null,
    user_id: null,
    fullRound: false,
    validRound: false
  };
  avarageScore: number = 0;

  constructor (
    private navController: NavController,
    private alertController: AlertController,
    private playerService: PlayerService,
    private apiService: ApiService,
    private scoreCardService: ScoreCardService,
    private helper: Helper,
    private storage: Storage,
    private toasterService: ToasterService,
    private settings: Settings,
    private fromServerTime: FromServerTime,
    private modalController: ModalController
  ) {
      this.getRounds();
  }

  private async getRounds() {
    this.rounds = await this.apiService.getRounds();
    console.log('rounds', this.rounds);
    this.recordRound = this.findRecordRound();
    this.settings.reloadRounds = false;
    this.fromServerTime.toServerTime(this.helper.timeNow());
  }

  ionViewDidEnter() {
    if (this.settings.reloadRounds) {
      this.getRounds();
    }
  }

  findRecordRound () {
    this.avarageScore = 0;
    let i = 0;
    let validRounds = this.rounds.filter((round) => {
      if (round.fullRound && round.validRound) {
        i++;
        this.avarageScore += round.score;
        this.avarageScore = Math.ceil(this.avarageScore / i);
        return true
      } else {
        return false;
      }
     
    });

    if (validRounds.length) {
      return validRounds.reduce((prev, current) => {
        return (prev.score < current.score) ? prev : current
      })
    } else {
      return this.recordRound;
    }
    

  }

  /*
  test () {
    let a = [];

    for (let i = 0; i < 505; i++) {
      a.push(
        {
          course_id:1,
          id:3,
          name:"Helsinki City Golf - Paloheinä",
          putts:Math.random().toFixed(1),
          score:Math.random().toFixed(1),
          startedAt:"",
          tee:"red",
          user_id:2
        }
      );
    }

    return a;
  
  }
  */

  async ionViewWillEnter() {
   this.user = await this.storage.get(StorageKeys.userData);
  }

  startRound () {
    this.navController.push(CourseSelectPage, {});
  }

  showClubPrompt () {
    let modal = this.modalController.create(UserDataPage, {label: 'seura', user: this.user, value: this.user.club})
    modal.present();
  }

  showPrompt () {
    let modal = this.modalController.create(UserDataPage, {label: 'hcp', user: this.user, value: this.user.hcp.toString()})
    modal.present();
  }

}
