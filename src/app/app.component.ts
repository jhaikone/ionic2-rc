import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { ScoreViewPage } from '../pages/score-view/score-view-page';
import { CourseSelectPage } from '../pages/course-select/course-select-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  // rootPage = ScoreViewPage;
  // rootPage = CourseSelectPage;
  rootPage = DashboardPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
