import { Settings } from './../../providers/settings';
import { RoundInterface } from './../../environment/round-interface';
import { LoginPage } from './../login/login';
import { ToasterService } from './../../providers/toaster-service';
import { UserDataInterface } from '../../environment/user-data-interface';
import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';

import { Component } from '@angular/core';
import { AlertController, NavController, LoadingController } from 'ionic-angular';

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
    fullRound: false
  };
  avarageScore: number = 0;

  constructor (
    private navController: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private playerService: PlayerService,
    private apiService: ApiService,
    private scoreCardService: ScoreCardService,
    private helper: Helper,
    private storage: Storage,
    private toasterService: ToasterService,
    private settings: Settings
  ) {
      this.getRounds();
  }

  private async getRounds() {
    this.rounds = await this.apiService.getRounds();
    console.log('rounds', this.rounds);
    this.recordRound = this.findRecordRound();
    this.settings.reloadRounds = false;
  }

  ionViewDidEnter() {
    if (this.settings.reloadRounds) {
      this.getRounds();
    }
  }

  findRecordRound () {
    this.avarageScore = 0;
    let i = 0;
    return this.rounds.filter((round) => {
      if (round.fullRound) {
        i++;
        this.avarageScore += round.score;
        this.avarageScore = Math.ceil(this.avarageScore / i);
        return true
      } else {
        return false;
      }
     
    }).reduce(function(prev, current) {
      return (prev.score < current.score) ? prev : current
    })
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
    let prompt = this.alertController.create({
      title: 'Aseta jäsenseura',
      inputs: [
        {
          type: 'text',
          placeholder: 'Seura',
          name: 'club',
          value: this.user.club
        },
      ],
      buttons: [
        {
          text: 'Peruuta',
          handler: data => {
            console.log('Cancel clicked', data);
          }
        },
        {
          text: 'Tallenna',
          handler:async data => {
            await this.apiService.updateUser({club: data.club}, this.user); 
          }
        }
      ]
    });

    prompt.present();
  }

  showPrompt () {
  let prompt = this.alertController.create({
    title: 'Aseta pelitasoitus',
    message: 'Pelitasoitus ei voi olla suurempi kuin 54.',
    inputs: [
      {
        type: 'number',
        placeholder: 'Pelitasoitus',
        name: 'hcp',
        value: this.user.hcp.toString()
      },
    ],
    buttons: [
      {
        text: 'Peruuta',
        handler: data => {
          console.log('Cancel clicked', data);
        }
      },
      {
        text: 'Tallenna',
        handler:async data => {
          let hcp = this.helper.round(data.hcp, 1);
          if (Number(hcp) > 54) {
            return false;
          }
          await this.apiService.updateUser({hcp: Number(hcp)}, this.user);   
        }
      }
    ]
  });

  prompt.present();
}

}
