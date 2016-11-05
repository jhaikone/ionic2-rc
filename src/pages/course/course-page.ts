import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CourseService } from '../../providers/course-service';
import { Helper } from '../../providers/helper';
import { Settings } from '../../providers/settings';

import  { ScoreViewPage } from '../score-view/score-view-page';

const TEE_NAMES = {
  red: 'Punainen',
  blue: 'Sininen',
  yellow: 'Keltainen',
  white: 'Valkoinen',
  black: 'Musta'
};

@Component({
  templateUrl: 'course-page.html',
})
export class CoursePage {

  course: any = {};
  teeList: Array<any> = [];
  selected: String;
  players: Array<Object>;

  constructor(public navController: NavController,  public courseService: CourseService, public helper: Helper, public settings: Settings) {
    this.course = courseService.getCourse();
    this.initTeeList();
    this.players = this.initPlayers();
    this.settings.multiplayer = false;
  }

  ionViewDidLoad() {

  }

  startRound() {
    this.navController.push(ScoreViewPage, {});
  }

  initTeeList() {
    this.course.tees.forEach((tee) => {
      this.teeList.push({key: tee.name, metre: tee.metre, name: TEE_NAMES[tee.name]});
    });

    this.helper.sortNumberArray(this.teeList, 'metre');
    this.settings.selected = this.teeList[0].key;

  }

  getValue(tee) {
    return tee.key;
  }

  private initPlayers() {
    return [
      {},
      {},
      {}
    ]
  }

}
