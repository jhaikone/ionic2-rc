import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Settings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Settings {

  multiplayer: Boolean = false;
  selected: 'String';
  players: Array<any> = [ {name:''}, {name:''}, {name:''} ];

  constructor(public http: Http) {
    console.log('Hello Settings Provider', this.players);
  }

}
