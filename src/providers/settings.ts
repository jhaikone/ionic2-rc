import { Injectable } from '@angular/core';

import { Helper } from './helper';

@Injectable()
export class Settings {

  multiplayer: Boolean = false;
  selectedTee: 'String';
  players: Array<any> = [ {name:'', hcp: 36}, {name:'', hcp: 36}, {name:'', hcp: 36} ];

  constructor(public helper: Helper) {
    console.log('Hello Settings Provider', this.players);
  }

  prepareRound(playerList) {
    this.players = this.helper.cleanArrayBy(playerList, 'name');
  }

}
