import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { TrophyService } from '../../providers/trophy-service';
import { StorageService } from '../../providers/storage-service';
import { ScoreCardService } from '../../providers/score-card-service';
import { Helper } from '../../providers/helper';
import { ApiService } from '../../providers/api-service';

@Component({
  selector: 'score-card-view',
  templateUrl: 'score-card-page.html'
})

export class ScoreCardPage  {

  holes: Array<any>;
  frontNine: Array<any>;
  backNine: Array<any>;
  player: Object;
  parList: Array<any>;

  constructor(
    trophyService: TrophyService,
    storageService: StorageService,
    public viewCtrl : ViewController,
    public scoreCardService: ScoreCardService,
    apiService: ApiService,
    public helper: Helper
  ) {

    this.holes = scoreCardService.getCard()[0];
    this.parList = scoreCardService.getParList();
    console.log('holes', this.holes);
    console.log('pars', this.parList);
    this.frontNine = helper.fromToArray(0, 9, this.holes);
    this.backNine = helper.fromToArray(9, 17, this.holes);
  }

  public getClassName(i) {
    let total = this.holes[i] - this.parList[i].par;
    if (total === 0) return '';
    return total > 0 ? 'plus' : 'minus';
  }

  getTotal(from) {
    let array = from === 'front' ? this.helper.fromToArray(0, 9, this.parList) : this.helper.fromToArray(9, 17, this.parList);
    return array.reduce((a,b) => a + b, 0);
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
