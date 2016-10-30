import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import _ from 'lodash';

import { HoleService } from '../../providers/hole-service';
import { TrophyService } from '../../providers/trophy-service';
import { StorageService } from '../../providers/storage-service';
import { ScoreCardService } from '../../providers/score-card-service';
import { Helper } from '../../providers/helper';

@Component({
  templateUrl: 'score-card-page.html'
})

export class ScoreCardPage  {

  holes: Array<any>;
  frontNine: Array<any>;
  backNine: Array<any>;
  player: Object;

  constructor(
    public holeService: HoleService,
    trophyService: TrophyService,
    storageService: StorageService,
    public viewCtrl : ViewController,
    public scoreCardService: ScoreCardService,
    helper: Helper
  ) {
    let jotain = scoreCardService.getCard();
    console.log('card', jotain);
    this.holes = jotain[0];

    this.frontNine = helper.fromToArray(0, 9, this.holes);
    this.backNine = helper.fromToArray(9, 17, this.holes);
  }

  public getClassName(i) {
    return this.holeService.getResultAt(i).resultName;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getHolesBetween(start, end) {
    let copy = _.map(this.holes, _.clone);
    return copy.splice(start, end);
  }

}
