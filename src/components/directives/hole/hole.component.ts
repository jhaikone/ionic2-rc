import { Component } from '@angular/core';
import { HoleService } from '../../services/hole-service/hole-service.component';

@Component({
  selector: 'hole',
  templateUrl: 'hole.component.html'
})

export class HoleComponent {

  inputs: Array<Object> = [
    {label: 'Lyönnit', color: 'primary', key: 'strokes'},
    {label: 'Putit', key: 'putts'},
    {label: 'Hiekkalyönnit', key: 'sands'},
    {label: 'Rangaistukset', key: 'penalties'}
  ];

  constructor(public holeService: HoleService) {
    this.holeService = holeService;
  }

  increase (key) {
      this.holeService.getResult().singlePlayer[key]++;

      if (key !== 'strokes') {
        this.increasePrimaryTotal();
      }
  }

  decrease (key) {
    let singlePlayer = this.holeService.getResult().singlePlayer;

    if (key === 'strokes') {

      if (singlePlayer.strokes > 1) {
        singlePlayer.strokes--;
      }

      this._decreaseSecondaryTotal();
    } else {
      singlePlayer[key]--;
    }

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
