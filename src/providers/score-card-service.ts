import { Settings } from './settings';
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

  constructor(public apiService: ApiService, public helper: Helper, private settings: Settings) {
    console.log('Hello ScoreCardService Provider');
  }

  getCard() {
    return this.scoreCard;
  }

  setCardByIndex(holes) {
    let card = [];
 
    for (let i = 0; i < holes.length; i++) {
      card.push({
        order: i+1,
        par: this.parList[i],
        score: holes[i].singlePlayer.strokes,
        startedAt: holes[i].singlePlayer.startedAt
      });
    }

    this.scoreCard[0] = card;

    if (holes[0].multiplayers.length) {
      this.setMultiplayerCards(holes);
    }
  }

  private setMultiplayerCards (holes) {
    let holeIndex = 0;
    for (let hole of holes) {
      for (let i = 0; i < hole.multiplayers.length; i++) {

        this.scoreCard[i+1].push({
          order: holeIndex+1,
          par: this.parList[i],
          score: hole.multiplayers[i].strokes,
          hcp: hole.multiplayers[i].hcp,
          name: hole.multiplayers[i].name
        });
      }
      holeIndex++;
    }
    console.log('now', this.scoreCard);
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

  getMultiplayerCards () {
    if (!this.hasMultiplayers()) return [];
    return [this.scoreCard[1], this.scoreCard[2], this.scoreCard[3]];
  }

  hasMultiplayers() {
    return this.scoreCard[1].length || this.scoreCard[2].length || this.scoreCard[3].length;
  }

}
