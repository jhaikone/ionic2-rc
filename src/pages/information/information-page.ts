import { Settings } from '../../providers/settings';
import { StorageKeys } from '../../environment/environment';
import { DashboardPage } from '../dashboard/dashboard-page';
import { ApiService } from '../../providers/api-service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController,NavController } from 'ionic-angular';

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

  constructor(
    private holeService: HoleService, 
    private trophyService: TrophyService, 
    private storageService: StorageService, 
    private storage: Storage,
    private modalController: ModalController, 
    public scoreCardService: ScoreCardService, 
    private navController: NavController,
    private apiService: ApiService,
    private settings: Settings
  ) {

    this.information = holeService.getInformation();
    console.log('information', this.information);
    storageService.setTrophies(trophyService.getTrophies(this.information));
    this.friends = this.information.friends;
    this.player = this.information.player;

  }

  public showScoreCard () {
    this.navController.push(ScoreCardPage, {});
  }

  public finishRound () {
    //TODO: add loader
    this.apiService.setRounds(this.player.scoreCard.holes).then((res) => {
      console.log('LÄPI MEN', res);
      this.settings.reloadRounds = true;
      this.navController.popToRoot();
    }, (err) => {
      console.log('HANDLE ERROR', err);
      
    });

  }

}
