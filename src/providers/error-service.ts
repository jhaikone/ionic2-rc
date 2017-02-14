import { StorageKeys } from '../environment/environment';
import { Storage } from '@ionic/storage';
import { NavController, App } from 'ionic-angular';

import { Injectable } from '@angular/core';

const ERROR_TYPES = {
  INTERNAL: 500
}

@Injectable()
export class ErrorService {

  private navCtrl: NavController;
  rootPage: any;

  constructor(public app: App, private storage: Storage) {
    this.navCtrl = app.getActiveNav();
    console.log('add', app)
  }

  async catch (error) {
    if (error.status == ERROR_TYPES.INTERNAL) {
        await this.storage.remove(StorageKeys.userData);
        this.navCtrl.setRoot(this.rootPage);
    }
  }

  setRootPage(page) {
    this.rootPage = page;
  }

}
