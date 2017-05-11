import { StorageKeys } from '../environment/environment';
import { ScoreCardPage } from './../pages/score-card/score-card-page';
import { NavController } from 'ionic-angular';
import { Settings } from './settings';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

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

  constructor(
    private apiService: ApiService, 
    private helper: Helper, 
    private settings: Settings,
    private storage: Storage,
  ) {
    console.log('Hello ScoreCardService Provider');
  }

  getCard() {
    return this.scoreCard;
  }

  setCardByIndex(holes) {
    console.log('holllllllllllllll', holes);
    let card = [];
 
    for (let i = 0; i < holes.length; i++) {
      card.push({
        order: holes[i].singlePlayer.order,
        par: holes[i].singlePlayer.par,
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
    for (let holeIndex = 0; holeIndex < holes.length; holeIndex++) {
      for (let i = 0; i < holes[holeIndex].multiplayers.length; i++) {

        this.scoreCard[i+1].push({
          order: holes[holeIndex].singlePlayer.order,
          par: holes[holeIndex].singlePlayer.par,
          score: holes[holeIndex].multiplayers[i].strokes,
          hcp: holes[holeIndex].multiplayers[i].hcp,
          name: holes[holeIndex].multiplayers[i].name
        });
      }
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

  setSinglePlayerScoreCard (data) {
    this.scoreCard[0] = data;
  }

  setCourse(course) {
    this.course = course;
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

  async initRound (selected) {
    let round = await this.storage.get(this.getRoundId(selected)) || await this.apiService.getRound(selected);
    if (round) {
        console.log('round', round);
        await this.storage.set(this.getRoundId(selected), round);
        this.setSinglePlayerScoreCard(round);
        this.setCourse(selected);
    }
  }

  private getRoundId (selected) {
    return StorageKeys.round + '-' + selected.id;
  }

}
