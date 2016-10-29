import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PlayerService } from '../../providers/player-service';
import { CourseSelectPage } from '../course-select/course-select-page';

/*
  Generated class for the DashboardPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard-page',
  templateUrl: 'dashboard-page.html'
})
export class DashboardPage {

  constructor(public navController: NavController, public playerService: PlayerService) {}

  ionViewDidLoad() {
    console.log('Hello DashboardPage Page');
  }

  startRound () {
    this.navController.push(CourseSelectPage, {});
  }

}
