import  { Injectable, EventEmitter } from '@angular/core';

import _ from 'lodash';

let players = [
  {
    id: 33442,
    hcp: 20,
    name:"Jesse"
  },
  {
    id: 43442,
    hcp: 23,
    name:"Jaska"
  },
  {
    id: 53442,
    hcp: 10,
    name:"Pekka"
  }
];


/**
* Paloheinä
* 1 (par 4) - A 284 m, B 229 m, C 194 m
* 2 (par 3) - A 154 m, B 131 m, C 119 m
* 3 (par 5) - A 477 m, B 381 m, C 332 m
* 4 (par 5) - A 447 m, B 384 m, C 311 m
* 5 (par 3) - A 110 m, B 102 m, C 78 m
* 6 (par 5) - A 448 m, B 362 m, C 362 m
* 7 (par 4) - A 339 m, B 282 m, C 237 m
* 8 (par 3) - A 141 m, B 105 m, C 95 m
* 9 (par 4) - A 345 m, B 300 m, C 267 m
**/

const COURSES = [
  {
    id: 25664,
    name: "Paloheinä",
    tees: [
      {name:"a", metre: 2745},
      {name:"b", metre: 2276},
      {name:"c", metre: 1995}
    ],
    par: 36,
    holes: [
      {
        hole: 1,
        par: 4,
        distances: {
          a: 284,
          b: 229,
          c: 194
        }
      },
      {
        hole: 2,
        par: 3,
        distances: {
          a: 154,
          b: 131,
          c: 119
        }
      },
      {
        hole: 3,
        par: 5,
        distances: {
          a: 477,
          b: 381,
          c: 332
        }
      },
      {
        hole: 4,
        par: 5,
        distances: {
          a: 447,
          b: 384,
          c: 311
        }
      },
      {
        hole: 5,
        par: 3,
        distances: {
          a: 110,
          b: 102,
          c: 78
        }
      },
      {
        hole: 6,
        par: 5,
        distances: {
          a: 448,
          b: 362,
          c: 362
        }
      },
      {
        hole: 7,
        par: 4,
        distances: {
          a: 339,
          b: 282,
          c: 237
        }
      },
      {
        hole: 8,
        par: 3,
        distances: {
          a: 141,
          b: 105,
          c: 95
        }
      },
      {
        hole: 9,
        par: 4,
        distances: {
          a: 345,
          b: 300,
          c: 267
        }
      }
      // {
      //   hole: 10,
      //   par: 4,
      //   distances: {
      //     a: 284,
      //     b: 229,
      //     c: 194
      //   }
      // },
      // {
      //   hole: 11,
      //   par: 3,
      //   distances: {
      //     a: 154,
      //     b: 131,
      //     c: 119
      //   }
      // },
      // {
      //   hole: 12,
      //   par: 5,
      //   distances: {
      //     a: 477,
      //     b: 381,
      //     c: 332
      //   }
      // },
      // {
      //   hole: 13,
      //   par: 5,
      //   distances: {
      //     a: 447,
      //     b: 384,
      //     c: 311
      //   }
      // },
      // {
      //   hole: 14,
      //   par: 3,
      //   distances: {
      //     a: 110,
      //     b: 102,
      //     c: 78
      //   }
      // },
      // {
      //   hole: 15,
      //   par: 5,
      //   distances: {
      //     a: 448,
      //     b: 362,
      //     c: 362
      //   }
      // },
      // {
      //   hole: 16,
      //   par: 4,
      //   distances: {
      //     a: 339,
      //     b: 282,
      //     c: 237
      //   }
      // },
      // {
      //   hole: 17,
      //   par: 3,
      //   distances: {
      //     a: 141,
      //     b: 105,
      //     c: 95
      //   }
      // },
      // {
      //   hole: 18,
      //   par: 4,
      //   distances: {
      //     a: 345,
      //     b: 300,
      //     c: 267
      //   }
      // }
    ]
  },
  {
    id: 24664,
    name: "Kytäjä",
    tees: ["a","b","c"],
    holes: [
      {
        hole: 1,
        par: 4,
        distances: {
          a: 284,
          b: 229,
          c: 194
        }
      },
      {
        hole: 2,
        par: 3,
        distances: {
          a: 154,
          b: 131,
          c: 119
        }
      },
      {
        hole: 3,
        par: 5,
        distances: {
          a: 477,
          b: 381,
          c: 332
        }
      },
      {
        hole: 4,
        par: 5,
        distances: {
          a: 447,
          b: 384,
          c: 311
        }
      },
      {
        hole: 5,
        par: 3,
        distances: {
          a: 110,
          b: 102,
          c: 78
        }
      },
      {
        hole: 6,
        par: 5,
        distances: {
          a: 448,
          b: 362,
          c: 362
        }
      },
      {
        hole: 7,
        par: 4,
        distances: {
          a: 339,
          b: 282,
          c: 237
        }
      },
      {
        hole: 8,
        par: 3,
        distances: {
          a: 141,
          b: 105,
          c: 95
        }
      },
      {
        hole: 9,
        par: 4,
        distances: {
          a: 345,
          b: 300,
          c: 267
        }
      }
    ]
  }
];

@Injectable()
export class HoleService {

  public holeChanged$ = new EventEmitter(false);

  index: number;
  model: any = {holes: []};
  holes: Array<any> = [];

  constructor() {
    this.index = 0;
    this.holes = COURSES[0].holes;

    this.holes.map((mock, index) => {
    let random = Math.floor(Math.random() * 6) + 2;
    console.log('randomn', random);
      // strokes: {value:this.holes[index].par, key: 'strokes'},
      let object = {
        singlePlayer: {
          strokes: random,
          putts: 2,
          sands: 0
          penalties: 0
          drive: 1
          fairway: true,
          gir: false,
          sandSave: false,
        },
        multiplayers: []
      };

      players.map((player) => {
        object.multiplayers.push(
          {
            id: player.id,
            name: player.name,
            strokes: this.holes[index].par
          }
        );
      })

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

  getFrontNinePar() {
    return this.getParTotal(0, 9);
  }

  getBackNinePar() {
    return this.getParTotal(9, 17);
  }

  getHolesBetween(start, end) {
    let copy = _.map(this.holes, _.clone);
    return copy.splice(start, end);
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

    if (holeIndex < 9) {
      information.player.frontNine = information.player.frontNine + hole.singlePlayer.strokes;
    } else {
      information.player.backNine = information.player.backNine + hole.singlePlayer.strokes;
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
   let totalPlayers = players;

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
