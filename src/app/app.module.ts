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

import { StorageService } from '../components/services/storage-service/storage-service.component';
import { HoleService } from '../components/services/hole-service/hole-service.component';
import { ApiService } from '../components/services/api-service/api-service.component';
import { TrophyService } from '../components/services/trophy-service/trophy-service.component';

import { HoleComponent } from '../components/directives/hole/hole.component';
import { PanComponent } from '../components/directives/gestures/pan';


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
    HoleComponent,
    PanComponent,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    CoursePage
  ],
  providers: [
    Storage,
    StorageService,
    TrophyService,
    HoleService,
    ApiService
    // HoleService,
    // StorageServiceComponent,
    // TrophyServiceComponent
    ]
})
export class AppModule {}
