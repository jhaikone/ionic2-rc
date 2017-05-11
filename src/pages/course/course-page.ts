import { HoleService } from '../../providers/hole-service';
import { Storage } from '@ionic/storage';
import { StorageKeys } from './../../environment/environment';
import { AddPlayerPage } from '../add-player/add-player';
import { PlayerService } from './../../providers/player-service';
import { player } from './../../providers/player-service';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

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
  playOption: String = 'full';

  constructor (
    private navController: NavController,
    private alertController: AlertController,
    private scoreCardService: ScoreCardService,
    private helper: Helper,
    public settings: Settings,
    private apiService: ApiService,
    private playerService: PlayerService,
    private modalCtrl: ModalController,
    private storage: Storage,
    private holeService: HoleService

  ) {
    this.course = scoreCardService.getCourse();
    this.initTeeList();
    this.friends = [ {}, {}, {} ];
    this.settings.multiplayer = false;


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
    this.settings.setPlayers(this.playerService.getPlayers());
    this.goToScoreViewPage();
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
    if (this.course.black >= this.course.white ) {
      this.teeList.push({key: 'black', metre: this.course.black, name: TEE_NAMES.black})
    }

    this.helper.sortNumberArray(this.teeList, 'metre');
    this.settings.selectedTee = this.teeList[0].key;

  }

  private async fetchHoles () {
    return this.apiService.getHoles(this.course.id);
  }

  private async goToScoreViewPage () {
    this.settings.confirmPop = true;
    let versions = await this.storage.get(StorageKeys.versions);
    
    let response = await this.storage.get(this.getCourseId());

    if (!versions || !response || versions.holes > response.updated) {
      response = {};
      response = await this.fetchHoles();
    }
  
    console.log('res', response);

    this.scoreCardService.setHoles(response.data);
    this.holeService.initHoles(response.data);
    this.navController.push(ScoreViewPage, {});
  }

  private getCourseId () {
      return StorageKeys.course + '-' + this.course.id;
  }

  addPlayer () {
    let newPlayer: player =  {name: '', hcp: 36, id: null};
    let modal = this.modalCtrl.create(AddPlayerPage, {player: newPlayer});
    modal.present();
  }

  editPlayer (player) {
    let modal = this.modalCtrl.create(AddPlayerPage, {player: player});
    modal.present();
  }

  removePlayer (player: player) {
    this.playerService.remove(player);
  }

  getPlayers () {
    return this.playerService.getPlayers();
  }

}
