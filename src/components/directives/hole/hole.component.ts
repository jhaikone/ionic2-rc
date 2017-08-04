import { Settings } from '../../../providers/settings';
import { ScoreCardService } from './../../../providers/score-card-service';
import { Component } from '@angular/core';
import { HoleService } from '../../../providers/hole-service';

@Component({
  selector: 'hole',
  templateUrl: 'hole.component.html'
})

export class HoleComponent {

  course: any;

  inputs: Array<Object> = [
    {label: 'Lyönnit', key: 'strokes', cssClasses: 'width-10 no-wrap animate font primary strokes'},
    {label: 'Putit', key: 'putts', cssClasses:'width-10 no-wrap font-avarage'},
    {label: 'Hiekkalyönnit', key: 'sands', cssClasses:'width-10 no-wrap font-avarage'},
    {label: 'Rangaistukset', key: 'penalties', cssClasses:'width-10 no-wrap font-avarage'}
  ];


  constructor(
    public holeService: HoleService, 
    private scoreCardService: ScoreCardService,
    private settings: Settings
  ) {
    this.course = this.scoreCardService.getCourse();
  }

  hasMultiplayer() {
    return this.settings.multiplayer;
  }

  increase (key) {
      this.singlePlayer[key]++;

      if (key !== 'strokes') {
        this.increasePrimaryTotal();
      }
  }

  decrease (key) {
    let singlePlayer = this.singlePlayer;

    if (key === 'strokes') {

      if (singlePlayer.strokes > 1) {
        singlePlayer.strokes--;
      }

      this._decreaseSecondaryTotal();
    } else if (singlePlayer[key] > 0) {
      singlePlayer[key]--;
    }

  }

  /* increase strokes if the rest are greater*/
  increasePrimaryTotal() {
    let total: number = this.calculateTotal();

    if (total > this.singlePlayer.strokes) {
     this.singlePlayer.strokes = total;
    }
  }

  /* decrease rest if strokes is greater */
  _decreaseSecondaryTotal() {
    let total: number = this.calculateTotal();

    if (this.singlePlayer.strokes >= total) return;

    if (this.singlePlayer.penalties > 0) {
      this.singlePlayer.penalties -= 1;
    } else if (this.singlePlayer.sands > 0) {
      this.singlePlayer.sands -= 1;
    } else {
      this.singlePlayer.putts -= 1;
    }

  }

  private get singlePlayer () {
    return this.holeService.getResult().singlePlayer;
  }

  private set singlePlayer (player) {
    this.holeService.getResult().singlePlayer = player;
  }

  private calculateTotal() {
    let singlePlayer = this.singlePlayer;
    return singlePlayer.putts + singlePlayer.sands + singlePlayer.penalties + singlePlayer.drive;
  }

  isBig(key) {
    if (key !== 'strokes') return false;
    return this.singlePlayer.strokes < 9;
  }

}
