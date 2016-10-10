import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { HoleService } from '../../components/services/hole-service/hole-service.component';
import { TrophyService } from '../../components/services/trophy-service/trophy-service.component';
import { StorageService } from '../../components/services/storage-service/storage-service.component';

import { ScoreCardPage } from '../score-card/score-card-page';

@Component({
  templateUrl: 'information-page.html'
})

export class InformationPage  {

  information: any;
  player: any;
  friends: any;

  constructor(holeService: HoleService, trophyService: TrophyService, storageService: StorageService, public modalController: ModalController) {
    this.modalController = modalController;

    this.information = holeService.getInformation();
    console.log('information', this.information);
    storageService.setTrophies(trophyService.getTrophies(this.information));
    this.friends = this.information.friends;
    this.player = this.information.player;

  }

  public showScoreCard() {
    let modal = this.modalController.create(ScoreCardPage);
    modal.present();
  }

}
