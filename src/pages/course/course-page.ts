import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { ScoreCardService } from '../../providers/score-card-service';
import { Helper } from '../../providers/helper';
import { Settings } from '../../providers/settings';
import { ApiService } from '../../providers/api-service';

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
  loader: any;

  constructor (
    private navController: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private scoreCardService: ScoreCardService,
    private helper: Helper,
    private settings: Settings,
    private apiService: ApiService,
    

  ) {
    this.course = scoreCardService.getCourse();
    this.initTeeList();
    this.friends = [ {}, {}, {} ];
    this.settings.multiplayer = false;

    this.loader = this.loadingController.create(
      { content: "Valmistellaan peliä..." }
    );
  }

  ionViewDidLoad() {

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
    if (this.course.red) {
      this.teeList.push({key: 'red', metre: this.course.red, name: TEE_NAMES.red})
    }
    if (this.course.blue) {
      this.teeList.push({key: 'blue', metre: this.course.blue, name: TEE_NAMES.blue})
    }
    if (this.course.yellow) {
      this.teeList.push({key: 'yellow', metre: this.course.yellow, name: TEE_NAMES.yellow})
    }
    if (this.course.white) {
      this.teeList.push({key: 'white', metre: this.course.white, name: TEE_NAMES.white})
    }
    if (this.course.black) {
      this.teeList.push({key: 'black', metre: this.course.black, name: TEE_NAMES.black})
    }

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
    this.loader.present();
    this.apiService.getHoles(this.course.id).then((res) => {
      this.loader.dismiss();
      this.scoreCardService.setHoles(res.data);
      this.navController.push(ScoreViewPage, {});
    })

  }

  private isInvalidHcp(hcp, newHcp, decimalPrecision) {
    return !NUMBER_PATTERN.test(newHcp) || decimalPrecision > 1 || Number(hcp) === 54 || Number(newHcp) > 54;
  }


}
