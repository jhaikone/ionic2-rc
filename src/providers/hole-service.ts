import  { Injectable, EventEmitter } from '@angular/core';

import  { ApiService } from './api-service';
import  { ScoreCardService } from './score-card-service';
import { Settings } from './settings';

@Injectable()
export class HoleService {

  public holeChanged$ = new EventEmitter(false);
  public pageLoaded$ = new EventEmitter(false);

  index: number = 0;
  model: any = {holes: []};
  holes: Array<any> = [];
  playerMode: any = 'singleplayer';

  constructor(public apiService: ApiService, public scoreCardService: ScoreCardService, public settings: Settings) {
    this.holes = scoreCardService.getCourse().holes;
    this.holes.map((mock, index) => {
    // let random = Math.floor(Math.random() * 6) + 2;
      let object = {
        singlePlayer: {
          strokes: this.getParAt(index),
          putts: 2,
          sands: 0,
          penalties: 0,
          drive: 1,
          fairway: true,
          gir: false,
          sandSave: false,
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

  setHoles(holes) {
    this.holes = holes;
  }

  getFrontNinePar() {
    return this.getParTotal(0, 9);
  }

  getBackNinePar() {
    return this.getParTotal(9, 17);
  }

  getIndex() {
    return this.index;
  }

  setIndex(newIndex) {
    this.index = newIndex;
  }

  getModel() {
    return this.model[this.index];
  }

  getResultAt(index) {
    if(index === -1 || index > this.model.holes.length-1) return {};
    return this.model.holes[index].singlePlayer;
  }

  getMultiPlayerResultAt(index) {
    return this.model.holes[this.index].multiplayers;
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

  getPar() {
    return this.holes[this.index].par;
  }

  getParAt(index) {
    return this.holes[index].par;
  }

  createScoreObject() {
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
        sands: 0,
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
      information.player.sands = information.player.sands + hole.singlePlayer.sands;
      information.player.penalties = information.player.penalties + hole.singlePlayer.penalties;

      this.scoreCardService.setScoreToCardAt(hole.singlePlayer.strokes, 0);

      this.updateStatistics(information, statistics, hole, holeIndex);

      holeIndex++;

      for (let i = 0; i < information.friends.length; i++) {
        information.friends[i].score = information.friends[i].score + hole.multiplayers[i].strokes;
        this.scoreCardService.setScoreToCardAt(hole.multiplayers[i].strokes, i+1);
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

  createPlayerModel(index) {
   let objectPlayers = [];
   let totalPlayers = this.settings.players;

   let strokes = this.holes[index].par;
   let putts = 2;
   let sands = 0;
   let penalties = 0;
   let drive = 1;

   totalPlayers.forEach( (player) => {
     objectPlayers.push({name: player.name, id: player.id, strokes, putts, sands, penalties, drive, noResult: false});
   })

   return {
     players: objectPlayers
   };

  }

}
