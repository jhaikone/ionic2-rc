import { UserDataPage } from '../user-data/user-data';
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
    putts: null,
    score: 0,
    startedAt: null,
    tee: null,
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
    private modalController: ModalController
  ) {
  }

  private async getRounds() {
    let dash = await this.storage.get(StorageKeys.rounds);
    console.log('thiis', this)
    console.log('dash', dash)
    this.rounds = this.settings.reloadRounds ? await this.apiService.getRounds() || [] : await this.storage.get(StorageKeys.rounds) || [];
    this.recordRound = this.findRecordRound();
    if (this.settings.reloadRounds) {
      this.settings.reloadRounds = false;
    }
    await this.storage.set(StorageKeys.rounds, this.rounds);
  }

  ionViewDidEnter() {
      console.log('ion view did ENTERRR');
      this.getRounds();
  }

  openRecordRound () {
    this.scoreCardService.initRound(this.recordRound);
    this.navController.push(ScoreCardPage, {});
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

  async ionViewWillEnter() {
   this.user = await this.storage.get(StorageKeys.userData);
   console.log('user', this.user);
   this.settings.setUser(this.user);
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
