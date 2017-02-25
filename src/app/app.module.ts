import { AddPlayerPage } from './../pages/add-player/add-player';
import { UserDataPage } from './../pages/user-data/user-data';
import { MenuPage } from './../pages/menu/menu';
import { SignUpConfirmationPage } from '../pages/sign-up/sign-up-confirmation/sign-up-confirmation';
import { ModalService } from '../providers/modal-service';
import { SignUpPage } from './../pages/sign-up/sign-up';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler  } from 'ionic-angular';

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
import { LoginPage } from '../pages/login/login';

import { StorageService } from '../providers/storage-service';
import { HoleService } from '../providers/hole-service';
import { TrophyService } from '../providers/trophy-service';
import { PlayerService } from '../providers/player-service';
import { ApiService } from '../providers/api-service';
import { ScoreCardService } from '../providers/score-card-service';
import { LoginService } from '../providers/login-service';
import { ToasterService } from './../providers/toaster-service';
import { ErrorService } from './../providers/error-service';


import  { Settings } from '../providers/settings';
import { Helper } from '../providers/helper';

import { HoleComponent } from '../components/directives/hole/hole.component';
import { PanComponent } from '../components/directives/gestures/pan';
import { GiantList } from '../components/directives/giant-list/giant-list';

import { FromServerTime } from '../pipes/from-server-time';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
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
    SignUpPage,
    MenuPage,
    SignUpConfirmationPage,
    UserDataPage,
    AddPlayerPage,
    HoleComponent,
    GiantList,
    PanComponent,
    FromServerTime
  ],
  imports: [
    IonicModule.forRoot(MyApp, 
    {
      backButtonText: 'Takaisin',
      platforms : {
          ios : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          },
          android : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, true]
            autoFocusAssist: 'instant'  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
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
    SignUpPage,
    SignUpConfirmationPage,
    MenuPage,
    UserDataPage,
    AddPlayerPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Storage,
    StorageService,
    TrophyService,
    HoleService,
    ApiService,
    ScoreCardService,
    PlayerService,
    LoginService,
    Settings,
    Helper,
    ToasterService,
    ModalService,
    ErrorService,
    FromServerTime
    // HoleService,
    // StorageServiceComponent,
    // TrophyServiceComponent
    ]
})
export class AppModule {}
