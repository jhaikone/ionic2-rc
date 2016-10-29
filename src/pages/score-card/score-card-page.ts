import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { HoleService } from '../../providers/hole-service';
import { TrophyService } from '../../providers/trophy-service';
import { StorageService } from '../../providers/storage-service';

@Component({
  templateUrl: 'score-card-page.html'
})

export class ScoreCardPage  {

  holes: Array<any>;
  frontNine: Array<any>;
  backNine: Array<any>;
  holeService: HoleService;
  player: Object;

  constructor(holeService: HoleService, trophyService: TrophyService, storageService: StorageService, public viewCtrl : ViewController) {
    this.holeService = holeService;

    this.holes = holeService.getHoles();
    this.player = holeService.getInformation().player;
    console.log('results', holeService.getResults());
    this.frontNine = this.holeService.getHolesBetween(0, 9);
    this.backNine = this.holeService.getHolesBetween(9, 17);
  }

  public getClassName(i) {
    return this.holeService.getResultAt(i).resultName;
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
