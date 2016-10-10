import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

// import { HoleComponent } from '../../components/directives/hole/hole.component';
// import { PanDirective } from '../../components/directives/gestures/pan';
import { HoleService } from '../../components/services/hole-service/hole-service.component';
import { InformationPage } from '../information/information-page';
import { AchievementsPage } from '../achievements/achievements-page';


@Component({
  selector: 'page-score-view',
  templateUrl: 'score-view-page.html'
})

export class ScoreViewPage {

  isLastHole: boolean = false;
  isFirstHole: boolean = true;
  multiPlayerSelected: boolean;

  holeIndex:number;
  style: string;

  model: any;
  result: any;
  holes: any;

  constructor(public holeService: HoleService, public nav: NavController, public modalController: ModalController) {
    this.holes = this.holeService.getHoles();
    this.model = this.holeService.getResults();
    this.holeIndex = this.holeService.getIndex();
  }

  showAchievements() {
    let modal = this.modalController.create(AchievementsPage);
    modal.present();
  }

  next() {
    console.log('next');
    //this.holeService.setIndex(this.holeService.getIndex()+1);
    this.holeService.holeChanged$.emit({
      direction: 'next'
    });
  }

  previous() {
    //this.holeService.setIndex(this.holeService.getIndex()-1);
    this.holeService.holeChanged$.emit({
      direction: 'previous'
    });
  }

  getHole() {
    return this.holeService.getIndex()+1;
  }

  getPar() {
    return this.holeService.getPar();
  }

  endRound() {
    console.log('results', this.holeService.getResults());
    this.nav.push(InformationPage, {});
  }

}
