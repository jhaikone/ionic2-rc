import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from 'ionic-native';

import { DashboardPage } from '../dashboard/dashboard-page';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: any;

  constructor(public navCtrl: NavController, public storage: Storage, public loadingController: LoadingController) {
    this.loading = this.loadingController.create({
      content: 'Please wait...'
    });

    console.log('APp', APP_ID);
  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
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