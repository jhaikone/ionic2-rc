import { Injectable } from '@angular/core';

import { MOCK_PLAYER } from '../mock/mock';

/*
  Generated class for the PlayerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PlayerService {

  player: any = MOCK_PLAYER;

  constructor() {
    console.log('Hello PlayerService Provider');
  }

  get name() {
    return this.player.name;
  }

  get hcp() {
    return this.player.hcp;
  }

  get club () {
    return this.player.club;
  }

  set name(name) {
    this.player.name = name;
  }

  set hcp(hcp) {
    this.player.hcp = hcp;
  }

  set club (club) {
    this.player.club = club;
  }

}
