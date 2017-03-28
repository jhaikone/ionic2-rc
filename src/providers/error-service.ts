import { ToasterService } from './toaster-service';
import { StorageKeys } from '../environment/environment';
import { Storage } from '@ionic/storage';
import { NavController, App } from 'ionic-angular';

import { Injectable } from '@angular/core';

const ERROR_TYPES = {
  INTERNAL: 500,
  NOT_ALLOWED: 405,
  NOT_FOUND: 404
}

@Injectable()
export class ErrorService {

  private navCtrl: NavController;
  rootPage: any;

  constructor(public app: App, private storage: Storage, private toasterService: ToasterService) {
    this.navCtrl = app.getActiveNav();
  }

  async catch (error) {
    switch (error.status) {
      case 500: {
        this.expiredToken();
        break;
      }
      case 404: {
        this.notFound();
        break;
      }
      case 405: {
        this.notAllowed();
        break;
      }
      default: {
        console.log('default', error);
        this.toasterService.invalid(error);
      }
    }
    if (error.status == ERROR_TYPES.INTERNAL) {
       
    }
  }

  async expiredToken() {
    await this.storage.remove(StorageKeys.userData);
    this.navCtrl.setRoot(this.rootPage);
  }

  notFound () {
    this.toasterService.invalid('Divotti sentään, asiaa ei löytynyt')
  }

  notAllowed () {
    this.toasterService.invalid('Nyt duffasi, tarivttava oikeus puuttuu')
  }

  setRootPage(page) {
    this.rootPage = page;
  }

}
