import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { ScoreViewPage } from '../pages/score-view/score-view-page';
import { AchievementsPage } from '../pages/achievements/achievements-page';
import { InformationPage } from '../pages/information/information-page';
import { ScoreCardPage } from '../pages/score-card/score-card-page';
import { CourseSelectPage } from '../pages/course-select/course-select-page';
import { CoursePage } from '../pages/course/course-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';

import { StorageService } from '../providers/storage-service';
import { HoleService } from '../providers/hole-service';
import { TrophyService } from '../providers/trophy-service';
import { CourseService } from '../providers/course-service';
import { PlayerService } from '../providers/player-service';
import { ApiService } from '../providers/api-service';
import { ScoreCardService } from '../providers/score-card-service';

import  { Settings } from '../providers/settings';
import { Helper } from '../providers/helper';

import { HoleComponent } from '../components/directives/hole/hole.component';
import { PanComponent } from '../components/directives/gestures/pan';

import { FromServerTime } from '../pipes/from-server-time';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ScoreViewPage,
    AchievementsPage,
    InformationPage,
    ScoreCardPage,
    CourseSelectPage,
    CoursePage,
    DashboardPage,
    HoleComponent,
    PanComponent,
    FromServerTime
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Takaisin',
      searchBarInput: 'fgefef'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ScoreViewPage,
    AchievementsPage,
    InformationPage,
    ScoreCardPage,
    CourseSelectPage,
    CoursePage,
    DashboardPage
  ],
  providers: [
    Storage,
    StorageService,
    TrophyService,
    HoleService,
    ApiService,
    ScoreCardService,
    CourseService,
    PlayerService,
    Settings,
    Helper
    // HoleService,
    // StorageServiceComponent,
    // TrophyServiceComponent
    ]
})
export class AppModule {}
