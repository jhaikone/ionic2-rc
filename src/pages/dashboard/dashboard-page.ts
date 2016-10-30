import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PlayerService } from '../../providers/player-service';
import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

import { CourseSelectPage } from '../course-select/course-select-page';
import { ScoreCardPage } from '../score-card/score-card-page';

@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html',
})

export class DashboardPage {

  constructor(
    public navController: NavController,
    public playerService: PlayerService,
    public apiService: ApiService,
    public scoreCardService: ScoreCardService
  ) {

  }

  ionViewDidLoad() {
    console.log('Hello DashboardPage Page');
  }

  startRound () {
    this.navController.push(CourseSelectPage, {});
  }

  getRounds() {
    return this.apiService.getRounds();
  }

  getRound(round) {
    this.scoreCardService.setCardByIndex(this.apiService.getRound(round), 0);
    this.navController.push(ScoreCardPage, {});
  }

}
