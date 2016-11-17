import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CourseService } from '../../providers/course-service';
import { Helper } from '../../providers/helper';
import { Settings } from '../../providers/settings';

import  { ScoreViewPage } from '../score-view/score-view-page';


const pattern = new RegExp('^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$');

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
  friends: Array<any>;

  constructor(
    public navController: NavController,
    public courseService: CourseService,
    public helper: Helper,
    public settings: Settings,
  ) {
    this.course = courseService.getCourse();
    this.initTeeList();
    this.friends = [ {}, {}, {} ];
    this.settings.multiplayer = false;
  }

  ionViewDidLoad() {

  }

  startRound() {
    this.settings.setPlayers(this.helper.cleanArrayBy(this.friends, 'name'));
    this.navController.push(ScoreViewPage, {});
  }

  initTeeList() {
    this.course.tees.forEach((tee) => {
      this.teeList.push({key: tee.name, metre: tee.metre, name: TEE_NAMES[tee.name]});
    });

    this.helper.sortNumberArray(this.teeList, 'metre');
    this.settings.selectedTee = this.teeList[0].key;

  }

  initHCP (friend) {
    if (this.isNameSet(friend)) {
        friend.hcp = this.settings.friendsHcp;
    }
  }

  private isNameSet(friend) {
    return this.helper.isNotEmpty(friend) && friend.name !== '';
  }

  validateHcp(event, hcp) {
    let newHcp = hcp + event.key;
    let dotIndex = newHcp.indexOf('.');
    let decimalPrecision = 0;

    if (dotIndex > -1) {
      decimalPrecision = newHcp.substr(dotIndex+1).length;
    }

    if (!pattern.test(newHcp) || decimalPrecision > 1 || Number(hcp) === 54 || Number(newHcp) > 54) {
      event.preventDefault();
    }
  }

  trimHcp($event, friend) {
    friend.hcp = Number(friend.hcp);
  }


}
