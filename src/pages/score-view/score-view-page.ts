import { ScoreCardService } from '../../providers/score-card-service';

import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { HoleService } from '../../providers/hole-service';
import { InformationPage } from '../information/information-page';
import { AchievementsPage } from '../achievements/achievements-page';
import { Helper } from '../../providers/helper';

import { Settings } from '../../providers/settings';

import { DirectionEnum } from '../../environment/environment';


@Component({
  selector: 'page-score-view',
  templateUrl: 'score-view-page.html'
})

export class ScoreViewPage {

  isLastHole: boolean = false;
  isFirstHole: boolean = true;
  multiPlayerSelected: boolean;

  style: string;

  model: any;
  result: any;
  holes: any;

  constructor (
    public holeService: HoleService, 
    private nav: NavController, 
    private modalController: ModalController,
    private scoreCardService: ScoreCardService, 
    public settings: Settings,
    private helper: Helper
  ) {
    console.log('settings', settings);
    this.holes = this.holeService.getHoles();
    this.model = this.holeService.getResults();
    this.setTimeStamp('startedAt');
  }

  showAchievements() {
    let modal = this.modalController.create(AchievementsPage);
    modal.present();
  }

  next() {
    this.holeService.holeChanged$.emit({
      direction: DirectionEnum.Next
    });
  }

  previous() {
    this.holeService.holeChanged$.emit({
      direction: DirectionEnum.Previous
    });
  }

  hasMultiplayers () {
    return this.settings.multiplayer;
  }

  endRound() {
    this.setTimeStamp('finishedAt');
    if (this.settings.isBogeyPlay()) {
      this.clearResults();
    }
    console.log('results', this.holeService.getResults());
    this.scoreCardService.setCardByIndex(this.holeService.getResults().holes);
    this.nav.push(InformationPage, {});
  }

  private setTimeStamp (key) {
    let model = this.holeService.getResult().singlePlayer;
    if (model[key]) return;

    model[key] = this.helper.timeNow();
  }

  private clearResults () {
    console.log('awdawdawd', this.holeService.getResults());
    this.holeService.getResults().holes.forEach((hole) => {
      if (hole.singlePlayer.noResult) {
        hole.singlePlayer.fairway = false;
        hole.singlePlayer.strokes = 0;
        hole.singlePlayer.putts = 0;
        hole.singlePlayer.sands = 0;
        hole.singlePlayer.penalties = 0;
        hole.singlePlayer.gir = false;
        hole.singlePlayer.sandSave = false;
      }
    });
  }


}
