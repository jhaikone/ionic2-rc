import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PlayerService } from '../../providers/player-service';
import { ApiService } from '../../providers/api-service';

import { CourseSelectPage } from '../course-select/course-select-page';

@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html',
})

export class DashboardPage {

  constructor(
    public navController: NavController,
    public playerService: PlayerService,
    public apiService: ApiService
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

}
