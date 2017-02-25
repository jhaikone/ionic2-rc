import { player } from './../../providers/player-service';
import { PlayerService } from '../../providers/player-service';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the AddPlayer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-player',
  templateUrl: 'add-player.html'
})
export class AddPlayerPage {

  player: player;

  constructor(
    private navParams: NavParams, 
    private playerService: PlayerService, 
    private viewCtrl: ViewController
  ) {
    console.log('nav', this.navParams)
    this.player = this.navParams.data.player;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlayerPage');
  }

  addPlayer () {
    this.player.name = this.player.name === '' ? 'Vieras ' + this.playerIndex : this.player.name;
    this.playerService.add(this.player);
    this.close();
  }

  close () {
    this.viewCtrl.dismiss();
  }

  get playerIndex () {
    console.log('qawde', this.playerService.playerCount())
    return this.playerService.playerCount()+1;
  }

}
