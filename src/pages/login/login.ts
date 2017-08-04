import { Helper } from './../../providers/helper';
import { Settings } from './../../providers/settings';
import { SignUpPage } from '../sign-up/sign-up';
import { ToasterService } from '../../providers/toaster-service';
import { StorageKeys } from '../../environment/environment';

import { ApiService } from '../../providers/api-service';
import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

import { DashboardPage } from '../dashboard/dashboard-page';

import { FormBuilder, Validators } from '@angular/forms';

import _ from 'lodash';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  loading: any;
  height: number = 320;
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
    private toasterService: ToasterService,
    private settings: Settings,
    private helper: Helper,
    private platform: Platform,
    private googlePlus: GooglePlus
    ) {
    }

  ionViewDidLoad () {
      setTimeout(() => {
        this.height = this.platform.height();
        if (this.height === 0) {
          this.height = 320;
        }
        console.log('platfrom', this.platform);
        console.log('height', this.height);
      }, 10);
  }

  async ionViewCanEnter() {
    let data = await this.storage.get(StorageKeys.userData);
    await this.storage.set(StorageKeys.versions, {courses: 1.01, holes: 1.01});
    if (data) {
      let update = await this.doUpdates();
      if (update) {
        console.log('doing updates')
        //await this.apiService.checkUpdates();
      }
      let versions = await this.storage.get(StorageKeys.versions);
      console.log('update versions::::', versions);
      this.navCtrl.setRoot(DashboardPage)
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.settings.reloadRounds = true;
    }

  }

  async doUpdates() {
    let updated = await this.storage.get(StorageKeys.updated);
    if (updated) {
      console.log('updated', this.helper.isWithinWeek(updated));
      return !this.helper.isWithinWeek(updated);
    } else {
      await this.storage.set(StorageKeys.updated, new Date());
      console.log('returning true', updated)
      return true;
    }
  }
  

  async ionViewDidEnter() {
    this.lineWidth = 100;
    this.marginLeft = 0;
  }

  async signIn ($event) {
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
    } 
    catch (error) {
      console.log('err', error)
      this.loading.dismiss();
      this.toasterService.error(error);
    
    }
    
  }

  signUp() {
    this.navCtrl.push(SignUpPage);
  }

  private pushInvalidToasts() {
    if (this.loginForm.controls.email.invalid) {
      this.toasterService.invalid('Email kenttä ei voi olla tyhjä');
    }
    if (this.loginForm.controls.password.invalid) {
      this.toasterService.invalid('Salasana kenttä ei voi olla tyhjä');
    }
  }

  async googleLogin () {
    this.loading = this.loadingController.create({
      content: 'Kirjaudutaan sisään...'
    });

    this.loading.present();

    try {
      let googleData = await this.googlePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': APP_ID, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      });

      console.log('googleData', googleData);

      let user = await this.apiService.registerGoogleUser(googleData);

      console.log('user', user);

      user.fullName = googleData.displayName;
      //user.access_token = googleData.serverAuthCode;
      user.access_token = googleData.idToken;
      user.userId = user.id.toString();

      console.log('upodaaa', user);

      await this.storage.set(StorageKeys.userData, user);

      this.loading.dismiss();
      this.navCtrl.setRoot(DashboardPage);
    } catch (error) {
      console.log('erro', error);
      this.loading.dismiss();
      this.toasterService.invalid(error);
    }

  }

}
