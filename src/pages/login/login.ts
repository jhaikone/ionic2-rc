import { InformationPage } from '../information/information-page';
import { StorageKeys } from '../../environment/environment';

import { ApiService } from '../../providers/api-service';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from 'ionic-native';

import { DashboardPage } from '../dashboard/dashboard-page';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: any;

  constructor(private navCtrl: NavController, private storage: Storage, private loadingController: LoadingController, private apiService: ApiService) {
    this.loading = this.loadingController.create({
      content: 'Please wait...'
    });
  }

  ionViewDidLoad() {
    this.storage.remove(StorageKeys.userData);
    this.storage.get(StorageKeys.userData).then((data) => {
      if (data) {
        this.navCtrl.setRoot(DashboardPage);
      } else {
        this.signIn();
      }
    });
  }

  private signIn () {
    this.apiService.signIn(TEST_USER_EMAIL, TEST_USER_PASSWORD).then((data) => {
      this.storage.set(StorageKeys.userData, data);
      this.navCtrl.setRoot(DashboardPage);
    });
  }

  login (provider) {
    console.log('login :', provider);

    this.loading.present();

    GooglePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': APP_ID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
    .then( (user) => {
      console.log('userdata', user)
      this.loading.dismiss();
      this.navCtrl.push(DashboardPage);
    }, (error) => {
      this.loading.dismiss();
    });

  }

}
