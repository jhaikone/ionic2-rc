import { Component } from '@angular/core';
import { NavController, AlertController, Keyboard } from 'ionic-angular';

import { CourseService } from '../../providers/course-service';
import { Helper } from '../../providers/helper';
import { Settings } from '../../providers/settings';

import  { ScoreViewPage } from '../score-view/score-view-page';


const NUMBER_PATTERN = new RegExp('^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)(?:[eE][+-][0-9]+)?$');

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
  isKeyboardOpen: boolean = false;

  constructor(
    public keyboard: Keyboard,
    public navController: NavController,
    public courseService: CourseService,
    public helper: Helper,
    public settings: Settings,
    public alertController: AlertController
  ) {
    this.course = courseService.getCourse();
    this.initTeeList();
    this.friends = [ {}, {}, {} ];
    this.settings.multiplayer = false;
  }

  ionViewDidLoad() {

  }

  keyboardCheck(){
    setTimeout(()  => console.log('is the keyboard open ', this.keyboard.isOpen()));
  }

  showConfirmationDialog() {
    let alert = this.alertController.create({
      title: 'Vahvistus',
      message: 'Pelataanko ilman kavereita?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // do nothing, stay at this page
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.settings.multiplayer = false;
            this.goToScoreViewPage();
          }
        }
      ]
    });

    alert.present();
  }

  startRound() {
    this.settings.setPlayers(this.helper.cleanArrayBy(this.friends, 'name'));

    if (this.settings.getPlayers().length === 0 && this.settings.multiplayer === true) {
      this.showConfirmationDialog();
    } else {
      this.goToScoreViewPage();
    }

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

  validateHcp(event, hcp) {
    let newHcp = hcp + event.key;
    let dotIndex = newHcp.indexOf('.');
    let decimalPrecision = 0;

    if (dotIndex > -1) {
      decimalPrecision = newHcp.substr(dotIndex+1).length;
    }

    if (this.isInvalidHcp(hcp, newHcp, decimalPrecision)) {
      event.preventDefault();
    }
  }

  trimHcp($event, friend) {
    friend.hcp = Number(friend.hcp);
  }

  private isNameSet(friend) {
    return this.helper.isNotEmpty(friend) && friend.name !== '';
  }

  private goToScoreViewPage () {
    this.navController.push(ScoreViewPage, {});
  }

  private isInvalidHcp(hcp, newHcp, decimalPrecision) {
    return !NUMBER_PATTERN.test(newHcp) || decimalPrecision > 1 || Number(hcp) === 54 || Number(newHcp) > 54;
  }


}
