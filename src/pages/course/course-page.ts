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

  onChange(event) {
    //const pattern = /[0-9]+\,\./;
    const pattern = /[0-9\+\.+\,+\ ]+\[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    console.log('inputChar', event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }


}
