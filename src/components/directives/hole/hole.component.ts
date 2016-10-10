import { Component } from '@angular/core';
import { HoleService } from '../../services/hole-service/hole-service.component';

@Component({
  selector: 'hole',
  templateUrl: 'hole.component.html'
})

export class HoleComponent {

  constructor(public holeService: HoleService) {
    this.holeService = holeService;
  }

  increaseStrokes() {
      this.holeService.getResult().singlePlayer.strokes++;
  }

  increase(key) {
      this.holeService.getResult().singlePlayer[key]++;
      this.increasePrimaryTotal();
  }

  decreaseStrokes() {
    if(this.holeService.getResult().singlePlayer.strokes > 1) {
      this.holeService.getResult().singlePlayer.strokes--;
    }
    this._decreaseSecondaryTotal();
  }

  decrease(key) {
    this.holeService.getResult().singlePlayer[key]--;
  }

  /* increase strokes if the rest are greater*/
  increasePrimaryTotal() {
    let result = this.holeService.getResult().singlePlayer;

    let total: number = result.putts + result.sands + result.penalties + result.drive;
    if (total > result.strokes) {
     result.strokes = total;
    }
  }

  /* decrease rest if strokes is greater */
  _decreaseSecondaryTotal() {

    let result = this.holeService.getResult().singlePlayer;

    let total:number = result.putts + result.sands + result.penalties + result.drive;
    if (result.strokes < total) {
      if (result.penalties > 0) {
        result.penalties = result.penalties -1;
      } else if (result.sands > 0) {
        result.sands = result.sands -1;
      } else {
        result.putts = result.putts -1;
      }
    }

  }

}
