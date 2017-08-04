import  { Injectable, EventEmitter } from '@angular/core';

import { Settings } from './settings';

@Injectable()
export class HoleService {

  public holeChanged$ = new EventEmitter(false);
  public pageLoaded$ = new EventEmitter(false);

  index: number = 0;
  model: any = {holes: []};
  holes: Array<any> = [];
  playerMode: any = 'singleplayer';

  constructor(private settings: Settings) {

  }

  clear () {
    this.holes.length = 0;
    this.index = 0;
    this.model = {holes: []};
    console.log('cleared', this);
  }

  initHoles(holes) {
    this.holes = holes;

    let option = this.settings.playOption;  

    if (option !== 'full') {
      let i = option === 'front' ? 9 : 0; 
      let endIndex = option === 'back' ? 9 : 17;
      this.holes.splice(i, endIndex);
    }
 
    console.log('this', this);

    this.holes.map((hole, index) => {
      let object = {
        singlePlayer: {
          strokes: this.getParAt(index),
          hole_id: hole.id,
          session_id: null,
          putts: 2,
          penalties: 0,
          sands: 0,
          drive: 1,
          fairway: true,
          gir: false,
          sandSave: false,
          order: hole.order,
          par: hole.par
        },
        multiplayers: []
      };

      this.settings.players.map((player) => {
        object.multiplayers.push(
          {
            name: player.name,
            hcp: player.hcp,
            strokes: this.holes[index].par
          }
        );
      });

      this.model.holes[index] = object;

    });
  }

  getParTotal(index, end) {
    let total = 0;
    for (index; index < end; index++) {
      total = total + this.holes[index].par;
    }
    return total;
  }


  getIndex() {
    return this.index;
  }

  getHoleIndex () {
    return this.settings.playOption === 'back' ? this.getIndex() + 9 : this.getIndex();
  }

  setIndex(newIndex) {
    this.index = newIndex;
  }

  getResults() {
    return this.model;
  }

  getResult() {
    return this.model.holes[this.index];
  }

  getHoles() {
    return this.holes;
  }

  getPar () {
    return this.holes[this.index].par;
  }

  getHcp () {
    return this.holes[this.index].hcp;
  }

  getDistance () {
    return this.holes[this.index][this.settings.selectedTee];
  }

  private getParAt(index) {
    return this.holes[index].par;
  }

  private createScoreObject() {
    return {amount: 0, holes: []};
  }

  createInformation() {
    let information = {
      player: {
        name: 'Juuso',
        backNine: 0,
        frontNine: 0,
        score: 0,
        putts: 0,
        penalties: 0,
        sandSaves: 0,
        scoreCard: this.getResults(),
        statistics: {
          holeInOne: this.createScoreObject(),
          albatross: this.createScoreObject(),
          eagle: this.createScoreObject(),
          birdie: this.createScoreObject(),
          par: this.createScoreObject(),
          bogey: this.createScoreObject(),
          doubleBogey: this.createScoreObject(),
          tripleBogey: this.createScoreObject(),
          rest: this.createScoreObject(),
          noResults: this.createScoreObject()
        }
      },
      friends: []
    };

    this.model.holes[0].multiplayers.map((multiplayer) => {
      information.friends.push({name: multiplayer.name, score: 0});
    });

    return information;
  }


  getInformation() {
    let information = this.createInformation();

    let holeIndex = 0;
    let statistics = information.player.statistics;

    for (let hole of this.model.holes) {
      information.player.score = information.player.score + hole.singlePlayer.strokes;

      information.player.putts = information.player.putts + hole.singlePlayer.putts;
      information.player.sandSaves = information.player.sandSaves + hole.singlePlayer.sandSave ? 1 : 0;
      information.player.penalties = information.player.penalties + hole.singlePlayer.penalties;

      this.updateStatistics(information, statistics, hole, holeIndex);

      holeIndex++;

      for (let i = 0; i < information.friends.length; i++) {
        information.friends[i].score = information.friends[i].score + hole.multiplayers[i].strokes;
      }

    }

    return information;
  }

  updateStatistics(information, statistics, hole, holeIndex) {
    if (hole.singlePlayer.noResult) {
      statistics.noResults.amount = statistics.noResults.amount+1;
      statistics.noResults.holes.push(holeIndex);
      return;
    }

    let par = this.getParAt(holeIndex)

    switch (hole.singlePlayer.strokes - par) {
      case -4: {
        statistics.holeInOne.amount = statistics.holeInOne.amount+1;
        statistics.holeInOne.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'hole-in-one';
        break;
      }
      case -3: {
        if (par === 4) {
          statistics.holeInOne.amount = statistics.holeInOne.amount+1;
          statistics.holeInOne.holes.push(holeIndex);
          hole.singlePlayer.resultName = 'hole-in-one';
        } else {
          statistics.albatross.amount = statistics.albatross.amount+1;
          statistics.albatross.holes.push(holeIndex);
          hole.singlePlayer.resultName = 'albatross';
        }
        break;
      }
      case -2: {
        if (par === 3) {
          statistics.holeInOne.amount = statistics.holeInOne.amount+1;
          statistics.holeInOne.holes.push(holeIndex);
          hole.singlePlayer.resultName = 'hole-in-one';
        } else {
          statistics.eagle.amount = statistics.eagle.amount+1;
          statistics.eagle.holes.push(holeIndex);
          hole.singlePlayer.resultName = 'eagle';
        }
        break;
      }
      case -1: {
        statistics.birdie.amount = statistics.birdie.amount+1;
        statistics.birdie.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'birdie';
        break;
      }
      case 0: {
        statistics.par.amount = statistics.par.amount+1;
        statistics.par.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'par';
        break;
      }
      case 1: {
        statistics.bogey.amount = statistics.bogey.amount+1;
        statistics.bogey.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'bogey';
        break;
      }
      case 2: {
        statistics.doubleBogey.amount = statistics.doubleBogey.amount+1;
        statistics.doubleBogey.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'double-bogey';
        break;
      }
      case 3: {
        statistics.tripleBogey.amount = statistics.tripleBogey.amount+1;
        statistics.tripleBogey.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'triple-bogey';
        break;
      }
      default: {
        statistics.rest.amount = statistics.rest.amount+1;
        statistics.rest.holes.push(holeIndex);
        hole.singlePlayer.resultName = 'quadro-bogey';
      }
    }
  }

}
