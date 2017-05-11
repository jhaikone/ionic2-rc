import { UserDataInterface } from './../environment/user-data-interface';
import { Injectable } from '@angular/core';

import { Helper } from './helper';

export interface GameMode {
  name: string,
  id: string
};

const GameModes: Array<GameMode> = [
    { id: 'bogey', name: 'Pistebogey' },
    { id: 'stroke', name: 'Lyöntipeli' }
];

const PlayOptions = [
  { name: 'Täysi kierros', key: 'full' },
  { name: 'Etuysi', key: 'front' },
  { name: 'Takaysi', key: 'back' }
];

@Injectable()
export class Settings {

  multiplayer: Boolean = false;
  selectedTee: string;
  courseId: string;
  players: Array<any> = [];
  _friendsHcp: Number = 36;
  fullRound: boolean = true;
  user: UserDataInterface;
  confirmPop: boolean = false;
  playOption: any;

  controller: any;

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

  getPlayOptions () {
    return PlayOptions;
  }

  setPlayOption (optionKey) {
    this.playOption = optionKey;
    this.fullRound = this.playOption === 'full';
  }

  setUser(user: UserDataInterface) {
    this.user = user;
  }

  getUser () {
    return this.user;
  }

  getPlayers () {
    return this.players;
  }

  get friendsHcp () {
    return this._friendsHcp;
  }

  setViewController(controller: any) {
    this.controller = controller;
  }

  getViewController() {
    return this.controller || { isOverlay: false, dismiss: () => {} };
  }

  isBogeyPlay () {
    return this.activedGameMode.id === 'bogey';
  }

}
