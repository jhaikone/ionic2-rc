import { Settings } from './settings';
import { Injectable } from '@angular/core';


export interface player {
  name: string,
  hcp: number,
  id: number
};


@Injectable()
export class PlayerService {

  players: Array<player> = [];

  constructor(private settings: Settings) {}

  add (player: player) {
    console.log('player', player);
    if (player.id === null || player.id === undefined) {
      player.id = this.players.length;
      this.players.push(player);
      this.settings.multiplayer = true;

    } else {
      console.log('start finding');
      let found = this.findPlayer(player);
      console.log('found', found);
      found = player;
    }
  }

   findPlayer(player: player) {
    return this.players.find((p) => {
      return p.id === player.id;
    });
  }

  remove (player: player) {
    let index = this.players.indexOf(this.findPlayer(player));
    if (index > -1) {
      this.players.splice(index, 1);
    }
    this.settings.multiplayer = this.hasPlayers();
  }

  getPlayers () {
    return this.players;
  }

  hasPlayers () {
    return this.players.length > 0;
  }

  playerCount () {
    return Number(this.players.length);
  }

}
