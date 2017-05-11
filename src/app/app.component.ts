import { HoleService } from './../providers/hole-service';
import { Settings } from './../providers/settings';
import { UserDataPage } from './../pages/user-data/user-data';
import { ApiService } from '../providers/api-service';
import { ErrorService } from '../providers/error-service';
import { LoginPage } from './../pages/login/login';
import { StorageKeys } from './../environment/environment';
import { Storage } from '@ionic/storage';
import { InformationPage } from '../pages/information/information-page';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, ModalController, AlertController, ViewController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { ScoreViewPage } from '../pages/score-view/score-view-page';
import { CourseSelectPage } from '../pages/course-select/course-select-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';

import { Keyboard } from 'ionic-native';


@Component({
  templateUrl: 'app.html' 
})
export class MyApp {

  @ViewChild(Nav) nav: Nav; 
  @ViewChild(ViewController) viewController: ViewController; 

    //rootPage = InformationPage;
  // rootPage = ScoreViewPage;
  // rootPage = CourseSelectPage;
  rootPage = LoginPage;
  hoursLeft: any;
  // rootPage = DashboardPage;

  constructor(
    private platform: Platform, 
    private storage: Storage, 
    private errorService: ErrorService, 
    private apiService: ApiService, 
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private settings: Settings,
    private alertController: AlertController,
    private holeService: HoleService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      console.log('PLATFORM', platform)
      this.errorService.setRootPage(LoginPage);
      if (platform.is('ios') || platform.is('android')) {
        Keyboard.disableScroll(true);
      }
      this.platform.registerBackButtonAction ( () => this.doHardwareBackButtonAction() );
      this.cloudSaveEnabled();
    });
  }

  private doHardwareBackButtonAction = () => {
    if (this.settings.confirmPop) {
      this.showQuitRoundAlert();
    } else {
      this.goBack();
    }
  
  }

  private showQuitRoundAlert () {
    let alert = this.alertController.create({
        title: 'Lopeta kierros',
        subTitle: 'Kierroksen tiedot menetetään, haluatko todella lopettaa kierroksen?',
        buttons: [
          {
            text: 'En',
            role: 'cancel'
          },
          {
            text: 'Haluan',
            handler: async () => {
              await this.nav.popToRoot();
              this.holeService.clear();
              this.settings.confirmPop = false;
            }
          },
        ]
      });

      alert.present();
  }

  private showQuitAppAlert () {
    let alert = this.alertController.create({
        title: 'Sulje GolfApp',
        subTitle: 'Haluatko poistua ohjelmasta?',
        buttons: [
          {
            text: 'En',
            role: 'cancel'
          },
          {
            text: 'Haluan',
            handler: () => {
              this.platform.exitApp();
            }
          },
        ]
      });

      alert.present();
  }

  private goBack() {
     this.nav.canGoBack() ? this.nav.pop() : this.showQuitAppAlert();
  }

  clearLocalStorage () {
    this.storage.clear();
  }

  async signOut() {
    await this.storage.clear();
    this.nav.setRoot(LoginPage);
  }

  async updateHCP () {
    let modal = this.modalController.create(UserDataPage, { label: 'hcp', user: this.settings.user, value: this.settings.user.hcp.toString() })
    modal.present();
  }

  async updateClub () {
    let modal = this.modalController.create(UserDataPage, {label: 'seura', user: this.settings.user, value: this.settings.user.club})
    modal.present();
  }

  async cloudSaveEnabled () {
    let updateDate:any = await this.storage.get(StorageKeys.updatedUser);
    console.log('updatedDate', updateDate)
    if (updateDate) {
      let hours = Math.abs(Date.now() - updateDate) / 36e5;
      console.log('hours', hours);

      if (hours >= 24) return true;

      this.hoursLeft = Math.ceil(24 - hours);
      console.log('hours left', this.hoursLeft);
      return false;
    }

    return true;
  }

  async updateUserData () {
    let valid = await this.cloudSaveEnabled();
    if (valid) {
      let loader = this.loadingCtrl.create(
        { content: "Tallennetaan..." }
      );

      loader.present();
      console.log('before try');
      try {
        await this.apiService.updateUser();
        await this.storage.set(StorageKeys.updatedUser, Date.now());
        this.hoursLeft = 24;
        loader.dismiss();
      } catch (error) {
        console.log('error', error)
        loader.dismiss();
      }
    }
  }

}
