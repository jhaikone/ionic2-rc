import { ErrorService } from '../providers/error-service';
import { LoginPage } from './../pages/login/login';
import { StorageKeys } from './../environment/environment';
import { Storage } from '@ionic/storage';
import { InformationPage } from '../pages/information/information-page';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
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

    //rootPage = InformationPage;
  // rootPage = ScoreViewPage;
  // rootPage = CourseSelectPage;
  rootPage = LoginPage;
  // rootPage = DashboardPage;

  constructor(platform: Platform, private storage: Storage, private errorService: ErrorService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.errorService.setRootPage(LoginPage);
      if (platform.is('ios') || platform.is('android')) {
        Keyboard.disableScroll(false);
      }
    });
  }

  async signOut() {
    await this.storage.remove(StorageKeys.userData);
    this.nav.setRoot(LoginPage);
  }

}
