import {Directive, ElementRef, Renderer, OnInit, OnDestroy} from '@angular/core';

import {Gesture} from 'ionic-angular/gestures/gesture';

import { HoleService } from '../../../components/services/hole-service/hole-service.component';
import { HoleComponent } from '../hole/hole.component';

import { DirectionEnum } from '../../../environment/environment';

declare var Hammer: any

@Directive({
  selector: '[pan]'
})

export class PanComponent implements OnInit, OnDestroy {

  el: HTMLElement;
  panGesture: Gesture;

  index: number = 0;
  holes: any = [{index:1},{index:2}, {index:3}];
  hideScrollY: boolean = false;

  snapLocations: Array<number> = [100, 0, -100];
  direction: any;
  snapPosition: any;
  positionX: number = 0;
  isMoveStarted: boolean = false;
  holeService: any;
  listenFunc: any;
  lockPanHorizontal: boolean = false;

  constructor(el: ElementRef, holeService: HoleService, public renderer: Renderer) {
    this.el = el.nativeElement;
    this.holeService = holeService;
    this.holeService.holeChanged$.subscribe(event => this.onHoleChange(event));
  }

  ngOnInit() {
    this.renderer.listen(this.el, 'transitionend', (event) => {
      if (event.propertyName === 'transform') {
        event.preventDefault();
        this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementClass(this.el, 'animate-swipe', false);
        this.lockPanHorizontal = false;
      }
    });

    let options = {
      stopPropagation: true,
      preventDefault: true,
      invokeApply: false,
      direction:  Hammer.DIRECTION_HORIZONTAL
    };

    this.panGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Pan, options]
      ]
    });

    this.panGesture.listen();

    this.panGesture.on('panstart', event => {
      this.lockPanHorizontal = Math.abs(event.deltaY) > 20;
      this.direction = event.deltaX < 0 ? DirectionEnum.Next : DirectionEnum.Previous;
      this.renderer.setElementClass(this.el, 'animate-swipe', false);
    })

    this.panGesture.on('panleft panright', event => {
        if (this.lockPanHorizontal) return;

        if (this.hasNext() || this.hasPrevious()) {
          this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
          this.renderer.setElementStyle(this.el, 'transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
        } else {
          //TODO: animte out of bounds;
        }

    })

    this.panGesture.on('panend', event => {
      if (this.lockPanHorizontal) return;
      this.snapPosition = 0;

      if (this.snappable() && (Math.abs(event.deltaX) > 100 || Math.abs(event.overallVelocityX) > 0.5)) {
        this.update();
      } else {
        this.animateHoleChange();
      }

    })
  }

  ngOnDestroy() {
    this.panGesture.destroy();
  }

  private onHoleChange(event) {
    this.direction = event.direction;

    this.update();
  }

  private update() {
    this.calculateSnapPosition();
    let index = this.holeService.getIndex();

    if (this.hasPrevious()) {
      this.holeService.setIndex(index-1);
    } else  {
      this.holeService.setIndex(index+1);
    }

    this.holeService.getResult().multiplayerTab = false;
    this.animateHoleChange();
  }

  private calculateSnapPosition() {
    this.snapPosition = this.direction === DirectionEnum.Next ? this.snapLocations[2] : this.snapLocations[0];
  }

  private snappable() {
    return this.hasPrevious() || this.hasNext();
  }

  private hasPrevious() {
    return this.direction === DirectionEnum.Previous && this.holeService.getIndex() > 0;
  }

  private hasNext() {
    return this.direction === DirectionEnum.Next && this.holeService.getIndex() < this.holeService.getHoles().length-1;
  }

  private animateHoleChange() {
    this.renderer.setElementClass(this.el, 'animate-swipe', true);
    this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(' + this.snapPosition + '%, 0, 0)');
  }

}
