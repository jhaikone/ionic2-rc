import { SignUpPage } from '../sign-up/sign-up';
import { ToasterService } from '../../providers/toaster-service';
import { InformationPage } from '../information/information-page';
import { StorageKeys } from '../../environment/environment';

import { ApiService } from '../../providers/api-service';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from 'ionic-native';

import { DashboardPage } from '../dashboard/dashboard-page';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  loading: any;

  public loginForm:any = this.formBuilder.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  constructor(
    private navCtrl: NavController, 
    private storage: Storage, 
    private loadingController: LoadingController, 
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService
    ) {
  }

  ionViewDidLoad() {
    /*
    this.storage.remove(StorageKeys.userData);
    this.storage.get(StorageKeys.userData).then((data) => {
      if (data) {
        //this.navCtrl.setRoot(DashboardPage);
      } else {
        this.signIn();
      }
    });
    */
  }

  private async signIn ($event) {
    if (!this.loginForm.valid) {
      this.pushInvalidToasts();
      return;
    }

    this.loading = this.loadingController.create({
      content: 'Kirjaudutaan sisään...'
    });

    this.loading.present();

    try {
      let data = await this.apiService.signIn(this.loginForm.value.email, this.loginForm.value.password);
      this.loading.dismiss();
      await this.storage.set(StorageKeys.userData, data);
      this.navCtrl.setRoot(DashboardPage);
    } catch (error) {
      this.loading.dismiss();
      this.toasterService.error(error);
    
    }
    
  }

  signUp() {
    this.navCtrl.push(SignUpPage);
  }

  private pushInvalidToasts() {
    let messages = [];
    if (this.loginForm.controls.email.invalid) {
      this.toasterService.invalid('Email kenttä ei voi olla tyhjä');
    }
    if (this.loginForm.controls.password.invalid) {
      this.toasterService.invalid('Salasana kenttä ei voi olla tyhjä');
    }
  }

  private facebookLogin () {
    //TODO: implement facebook login here
  }

  private googleLogin () {
    this.loading = this.loadingController.create({
      content: 'Kirjaudutaan sisään...'
    });

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
      console.log('erro', error);
      this.loading.dismiss();
      this.toasterService.invalid(error);
    });
  }

}
