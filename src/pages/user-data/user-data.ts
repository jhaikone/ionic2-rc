import { StorageKeys } from './../../environment/environment';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import _ from 'lodash';

@Component({
  selector: 'page-user-data',
  templateUrl: 'user-data.html'
})
export class UserDataPage {

  hcp: number;
  club: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    if (this.navParams.data.label === 'hcp') {
      this.hcp = this.navParams.data.value;
    } else {
      this.club = this.navParams.data.value;
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
