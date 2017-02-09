import { Injectable } from '@angular/core';

import { Helper } from './helper';

@Injectable()
export class Settings {

  multiplayer: Boolean = false;
  selectedTee: string;
  courseId: string;
  players: Array<any> = [];
  _friendsHcp: Number = 36;


  constructor(public helper: Helper) {
    console.log('Hello Settings Provider', this.players);
  }

  setPlayers (players) {
    this.players = players;
  }

  getPlayers () {
    return this.players;
  }

  get friendsHcp () {
    return this._friendsHcp;
  }

}
