
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

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

  constructor(
    public navController: NavController,
    public alertController: AlertController,
    public playerService: PlayerService,
    public apiService: ApiService,
    public scoreCardService: ScoreCardService,
    public helper: Helper
  ) {

  }

  ionViewDidLoad() {
    console.log('Hello DashboardPage Pag');
  }

  startRound () {
    this.navController.push(CourseSelectPage, {});
  }

  getRounds() {
    return this.apiService.getRounds();
  }

  getRound(selected) {
    this.scoreCardService.prepareCard(selected, true).then(() => {
      this.navController.push(ScoreCardPage, {});
    });

  }

  showClubPrompt() {
    let prompt = this.alertController.create({
      title: 'Aseta jäsenseura',
      inputs: [
        {
          type: 'text',
          placeholder: 'Seura',
          name: 'club',
          value: this.playerService.club
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
          handler: data => {
            if (data.club === "") {
              this.playerService.club = false;
            }
            this.playerService.club = data.club;
          }
        }
      ]
    });

    prompt.present();
  }

  showPrompt() {
  let prompt = this.alertController.create({
    title: 'Aseta pelitasoitus',
    message: 'Pelitasoitus ei voi olla suurempi kuin 54.',
    inputs: [
      {
        type: 'number',
        placeholder: 'Pelitasoitus',
        name: 'hcp',
        value: this.playerService.hcp
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
        handler: data => {
          let hcp = this.helper.round(data.hcp, 1);
          if (Number(hcp) > 54) {
            return false;
          }
          this.playerService.hcp = hcp;
        }
      }
    ]
  });

  prompt.present();
}

}
