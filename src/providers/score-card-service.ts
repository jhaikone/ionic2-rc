import { Injectable } from '@angular/core';

import { ApiService } from './api-service';
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

  course:any = {};
  parList = [];

  constructor(public apiService: ApiService, public helper: Helper) {
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

  prepareCard(course, getRoundData:boolean) {
    this.course = this.;
    if (getRoundData) {
      return this.apiService.getRoundData(course).then((data:any) => {
        data.course.holes.forEach((hole) => {
          this.parList.push(hole.par);
        });
        this.scoreCard[0] = data.score;
      })
    }

  }

  getCourse() {
    return this.course;
  }

  getParList() {
    return this.parList;
  }

  private getTotal(array) {
    let total = 0;
    array.forEach((value) => {
      total += value;
    })
    return total;
  }

}
