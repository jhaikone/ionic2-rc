import { Component, Input, OnInit } from '@angular/core';
import { HoleService } from '../../services/hole-service/hole-service.component';

@Component({
  selector: 'stroke-input',
  templateUrl: 'stroke-input.component.html'
})

export class StrokeInputComponent implements OnInit{

  showInput: boolean = false;
  holeService: any;
  result: any;

  @Input() label: String;
  @Input() total: any;
  @Input() primary:boolean;
  @Input() index: any;
  @Input() multiplayer: boolean;

  constructor(holeService: HoleService) {
    this.holeService = holeService;
  }

  ngOnInit() {
    if(this.index < 0) return;
    if(this.multiplayer) {
      this.result = this.holeService.getMultiPlayerResultAt();
    } else {
      this.result = this.holeService.getResultAt(this.index);
    }
  }

  increase() {
    let isPrimary = this.total.key === 'strokes' || this.total.key === 'putts' ? true : false;

    if(this.showInput || !isPrimary) {
      this.total.value++;
    }
    this.showInput = true;

    if(this.multiplayer) return;

    if(this.total.key !== 'strokes') {
      this.increasePrimaryTotal();
    }

  }

  decrease() {
    let minimumValue:number = this.total.key === 'strokes' ? 1 : 0;
    if(this.total.value > minimumValue ) {
        this.total.value--;
    }

    if(this.multiplayer) return;
    if(this.total.key === 'strokes') {
      this._decreaseSecondaryTotal();
    }

  }

  /* increase strokes if the rest are greater*/
  increasePrimaryTotal() {
    let total: number = this.result.putts.value + this.result.sands.value + this.result.penalties.value + this.result.drive.value;
    if(total > this.result.strokes.value) {
      this.result.strokes.value = total;
    }
  }

  /* decrease rest if strokes is greater */
  _decreaseSecondaryTotal() {

    this._initSecondaryValue();

    let total:number = this.result.putts.value + this.result.sands.value + this.result.penalties.value + this.result.drive.value;
    if (this.result.strokes.value < total) {
      if (this.result.penalties.value > 0) {
        this.result.penalties.value = this.result.penalties.value -1;
      } else if (this.result.sands.value > 0) {
        this.result.sands.value = this.result.sands.value -1;
      } else {
        this.result.putts.value = this.result.putts.value -1;
      }
    }

  }

  _initSecondaryValue() {
    switch (this.total.key) {
      case 'putts': {
        this.result.putts.value = this.total.value;
        break;
      }
      case 'sands': {
        this.result.sands.value = this.total.value;
        break;
      }
      case 'penalties': {
        this.result.penalties.value = this.total.value;
        break;
      }
    }
  }

}
