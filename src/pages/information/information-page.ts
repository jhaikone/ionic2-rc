import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { HoleService } from '../../providers/hole-service';
import { TrophyService } from '../../providers/trophy-service';
import { StorageService } from '../../providers/storage-service';
import { ScoreCardService } from '../../providers/score-card-service';

import { ScoreCardPage } from '../score-card/score-card-page';

@Component({
  templateUrl: 'information-page.html'
})

export class InformationPage  {

  information: any;
  player: any;
  friends: any;

  constructor(holeService: HoleService, trophyService: TrophyService, storageService: StorageService, public modalController: ModalController, public scoreCardService: ScoreCardService) {
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
