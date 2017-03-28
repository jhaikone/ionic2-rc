import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, MenuController } from 'ionic-angular';

import _ from 'lodash';

@Component({
  selector: 'page-user-data',
  templateUrl: 'user-data.html'
})
export class UserDataPage {

  hcp: number;
  club: string;
  background: string;

  isKeyboardOpen:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private storage: Storage,
    private menuCtrl: MenuController
  ) {}

  ionViewDidLoad() {
    if (this.navParams.data.label === 'hcp') {
      this.hcp = this.navParams.data.value;
      this.background = 'hcp';
    } else {
      this.club = this.navParams.data.value;
      this.background = 'club';
    }
  }

  closeDialog () {
    this.viewCtrl.dismiss();
  }

  async update () {

    let req = this.navParams.data.label === 'hcp' ? { hcp: this.hcp } : { club: this.club };
    await this.storage.set(StorageKeys.userData, _.merge(this.navParams.data.user, req));
    this.closeDialog();
  }

}
