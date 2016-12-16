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

  setHoles (holes) {
    this.course.holes = holes;
    this.populateParList(this.course.holes);
  }

  prepareCard(course, getRoundData:boolean) {
    this.course = course;
    console.log('courseeee', course);
    
    if (getRoundData) {
      return this.apiService.getRound(course).then((data:any) => {
        console.log('data', data);
          
        //this.populateParList(data.course.holes);
        this.scoreCard[0] = data;
      })
    }

  }

  private populateParList (holes) {
    holes.forEach((hole) => {
      this.parList.push(hole.par);
    });
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
      total += value.score;
    })
    return total;
  }

}
