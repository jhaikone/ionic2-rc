import { Injectable } from '@angular/core';

import { Helper } from './helper';

export interface GameMode {
  name: string,
  id: string
};

const GameModes: Array<GameMode> = [
    { id: 'bogey', name: 'Pistebogey' },
    { id: 'stroke', name: 'Lyöntipeli' }
]

@Injectable()
export class Settings {

  multiplayer: Boolean = false;
  selectedTee: string;
  courseId: string;
  players: Array<any> = [];
  _friendsHcp: Number = 36;
  fullRound: boolean = true;

  activedGameMode: GameMode = GameModes.find(mode => mode.id === 'bogey');

  reloadRounds: boolean = false;

  gameModes: Array<GameMode> = [

  ];

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

  isBogeyPlay () {
    return this.activedGameMode.id === 'bogey';
  }

}
