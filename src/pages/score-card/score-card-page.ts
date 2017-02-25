import { player } from './../../providers/player-service';
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
  multiplayers: Array<any>;

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
    this.multiplayers = scoreCardService.getMultiplayerCards();
    console.log('multipolaerrrrrrrrrrrr', this.multiplayers);
    this.frontNine = helper.fromToArray(0, 9, this.holes);
    this.backNine = helper.fromToArray(9, 17, this.holes);
  }

  getFrontNine (index) {
    return this.helper.fromToArray(0, 9, this.multiplayers[index]);
  }

  getBackNine (index) {
     return this.helper.fromToArray(9, 17, this.multiplayers[index]);
  }

  getMultiplayerHoles (i) {
    return this.multiplayers[i];
  }

  public getClassName(hole) {
    if (hole.score === 0) return 'no-result';
    
    let total = hole.score - hole.par;
    
    if (total === 0) return '';
    return total > 0 ? 'plus' : 'minus';
  }

  getTotal(from, holes = this.holes) {
    let array = from === 'front' ? this.helper.fromToArray(0, 9, holes) : this.helper.fromToArray(9, 17, holes);
    let total = 0;
    array.forEach((value) => {
      total += value.par;
    })
    return total;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  getTotalScore (holes = this.holes) {
    let total = 0;


    if(this.isInvalidRound(holes)) {
      return 0;
    }

    holes.forEach((hole) => {
      total += hole.score;
    });
    return total;
  }

  getScore(from) {
    if (this.isInvalidRound()) {
      return '-';
    }
    let score = this.scoreCardService.getScore(from, 0) - this.getTotal(from);
    return score > 0 ? '+' +score : score;
  }

  private isInvalidRound (holes = this.holes) {
    return holes.some((hole) => {
      return hole.score === 0;
    })
  }

  getPlayerName(player) {
    if (player.length) {
      return player[0].name + ' - hcp ' + player[0].hcp;
    }
  }

}
