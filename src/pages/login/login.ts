import { SignUpPage } from '../sign-up/sign-up';
import { ToasterService } from '../../providers/toaster-service';
import { InformationPage } from '../information/information-page';
import { StorageKeys } from '../../environment/environment';

import { ApiService } from '../../providers/api-service';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from 'ionic-native';

import { DashboardPage } from '../dashboard/dashboard-page';

import { FormBuilder, Validators } from '@angular/forms';

import _ from 'lodash';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit {

  loading: any;
  height: number = 0;
  lineWidth:number = 0;
  marginLeft: number = 100;
  page: any = DashboardPage;
  isLoggedIn: boolean;

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
      console.log('bodyu', document.body.clientHeight)
  }

  ngOnInit() {
    this.height = document.body.clientHeight;
  }

  async ionViewCanEnter() {
    
    let data = await this.storage.get(StorageKeys.userData);
    if (data) {
      this.navCtrl.setRoot(DashboardPage)
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  async ionViewDidEnter() {
    this.lineWidth = 100;
    this.marginLeft = 0;
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
      let user = await this.apiService.getUser(data);
      await this.storage.set(StorageKeys.userData, _.merge(data, user));
      this.navCtrl.setRoot(DashboardPage);
    } catch (error) {
      console.log('err', error)
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

  facebookLogin () {
    //TODO: implement facebook login here
  }

  async googleLogin () {
    this.loading = this.loadingController.create({
      content: 'Kirjaudutaan sisään...'
    });

    this.loading.present();

    try {
      let googleData = await GooglePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': APP_ID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      });

      let userData = {
        access_token: googleData.serverAuthCode,
        imageUrl: googleData.imageUrl,
        userId: googleData.userId,
        email: googleData.email,
        fullName: googleData.displayName,
        lastName: googleData.familyName,
        firstName: googleData.givenName,
        hcp: 36
      }
      console.log('cropped from google', userData);
      await this.storage.set(StorageKeys.userData, userData);
      this.loading.dismiss();
      this.navCtrl.setRoot(DashboardPage);
    } catch (error) {
      console.log('erro', error);
      this.loading.dismiss();
      this.toasterService.invalid(error);
    }

  }

}
