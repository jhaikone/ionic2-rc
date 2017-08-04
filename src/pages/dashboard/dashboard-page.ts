import { UserDataPage } from '../user-data/user-data';
import { Settings } from './../../providers/settings';
import { RoundInterface } from './../../environment/round-interface';
import { UserDataInterface } from '../../environment/user-data-interface';
import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';

import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

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
    private apiService: ApiService,
    private scoreCardService: ScoreCardService,
    private storage: Storage,
    private settings: Settings,
    private modalController: ModalController
  ) {
  }

  private async getRounds() {
    this.rounds = this.settings.reloadRounds ? await this.apiService.getRounds() || [] : await this.storage.get(StorageKeys.rounds) || [];
    this.recordRound = this.findRecordRound();
    if (this.settings.reloadRounds) {
      this.settings.reloadRounds = false;
    }
    await this.storage.set(StorageKeys.rounds, this.rounds);
    this.rounds.reverse();
  }

  ionViewDidEnter() {
      this.getRounds();
  }

  openRecordRound () {
    if (this.recordRound.course_id !== null) {
      this.scoreCardService.initRound(this.recordRound);
      this.navController.push(ScoreCardPage, {});
    }

  }

  findRecordRound () {
    this.avarageScore = 0;
    let i = 0;
    let validRounds = this.rounds.filter((round) => {
      if (round.validRound) {
        i++;
        
        if (round.fullRound) {        
          this.avarageScore += round.score;
        } else {
          this.avarageScore += round.score*2;
        }
        return true
      } else {
        return false;
      }
    });

    if (validRounds.length) {
      this.avarageScore = Math.ceil(this.avarageScore / validRounds.length);
      return validRounds.reduce((prev, current) => {
        return (prev.score < current.score) ? prev : current
      })
    } else {
      this.avarageScore = 0;
      return this.recordRound;
    }
  }

  async ionViewWillEnter() {
   this.user = await this.storage.get(StorageKeys.userData);
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
