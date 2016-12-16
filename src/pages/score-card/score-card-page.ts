import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

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

  constructor (
    public viewCtrl : ViewController,
    public scoreCardService: ScoreCardService,
    apiService: ApiService,
    public helper: Helper
  ) {

    this.holes = scoreCardService.getCard()[0];

    this.frontNine = helper.fromToArray(0, 9, this.holes);
    this.backNine = helper.fromToArray(9, 17, this.holes);
  }

  public getClassName(hole) {
    let total = hole.score - hole.par;
    
    if (total === 0) return '';
    return total > 0 ? 'plus' : 'minus';
  }

  getTotal(from) {
    let array = from === 'front' ? this.helper.fromToArray(0, 9, this.holes) : this.helper.fromToArray(9, 17, this.holes);
    let total = 0;
    array.forEach((value) => {
      total += value.par;
    })
    return total;
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
