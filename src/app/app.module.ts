import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { ScoreViewPage } from '../pages/score-view/score-view-page';
import { AchievementsPage } from '../pages/achievements/achievements-page';
import { InformationPage } from '../pages/information/information-page';
import { ScoreCardPage } from '../pages/score-card/score-card-page';

import { StorageService } from '../components/services/storage-service/storage-service.component';
import { HoleService } from '../components/services/hole-service/hole-service.component';
import { TrophyService } from '../components/services/trophy-service/trophy-service.component';
import { HoleComponent } from '../components/directives/hole/hole.component';
import { PanComponent } from '../components/directives/gestures/pan';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScoreViewPage,
    AchievementsPage,
    InformationPage,
    ScoreCardPage,
    HoleComponent,
    PanComponent
    // PanComponent,
    // HoleComponent,
    // StrokeInputComponent

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
    TabsPage,
    ScoreViewPage,
    AchievementsPage,
    InformationPage,
    ScoreCardPage
  ],
  providers: [
    Storage,
    StorageService,
    TrophyService,
    HoleService
    // HoleService,
    // StorageServiceComponent,
    // TrophyServiceComponent
    ]
})
export class AppModule {}
