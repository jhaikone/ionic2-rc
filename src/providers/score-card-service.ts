import { Injectable } from '@angular/core';

import { Helper } from './helper';

@Injectable()
export class ScoreCardService {

  scoreCard: Object = {
    0: [],
    1: [],
    2: [],
    3: []
  };

  scores: Object = {
    0: [],
    1: [],
    2: [],
    3: []
  }

  constructor(public helper: Helper) {
    console.log('Hello ScoreCardService Provider');
  }

  getCard() {
    return this.scoreCard;
  }

  setCardByIndex(card, index) {
    this.scoreCard[index] = card;
  }

  setScoreToCardAt(score, index) {
    this.scoreCard[index].push(score);
  }

  getScore(from, index) {
    if (from === 'front') {
      return this.getTotal(this.helper.fromToArray(0, 9, this.scoreCard[index]))
    } else {
      return this.getTotal(this.helper.fromToArray(9, 17, this.scoreCard[index])) || 0;
    }

  }

  private getTotal(array) {
    let total = 0;
    array.forEach((value) => {
      total += value;
    })
    return total;
  }

}
