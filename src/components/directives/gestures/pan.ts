import {Directive, ElementRef, Renderer, OnInit, OnDestroy} from '@angular/core';

import {Gesture} from 'ionic-angular/gestures/gesture';

import { HoleService } from '../../../components/services/hole-service/hole-service.component';

declare var Hammer: any

enum Direction {
  Next,
  Previous
}

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
  panStarted: boolean = false;

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
      }
    });

    let options = {
      stopPropagation: true,
      preventDefault: true,
      invokeApply: false,
      directions:"DIRECTION_HORIZONTAL"
    }

    this.panGesture = new Gesture(this.el, {
      recognizers: [
        [Hammer.Pan, options]
      ]
    });

    this.panGesture.listen();

    this.panGesture.on('panstart', event => {
      console.log(event);
      console.log('event', Math.abs(event.angle));
      let angle = Math.abs(event.angle);
      if(angle < 30 || angle > 160) {
        this.panStarted = true;
        this.renderer.setElementClass(this.el, 'animate-swipe', false);
        this.direction = event.deltaX < 0 ? Direction.Next : Direction.Previous;
      } else {
          this.panStarted = false;
      }
    })

    this.panGesture.on('pan', event => {

        if(!this.panStarted) return;
        if(!this.isMoveStarted) {
          this.hideScrollY = true;
        }
        this.isMoveStarted = true;
        let positionX = event.deltaX;

        this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(' + positionX + 'px,0px,0px)');
        this.renderer.setElementStyle(this.el, 'transform', 'translate3d(' + positionX + 'px,0px,0px)');
    })

    this.panGesture.on('panend', event => {

      if(!this.panStarted) return;
      if(this.isOnEdge()) {
        this.snapPosition = 0;
      } else if (Math.abs(event.deltaX) > 100 || Math.abs(event.overallVelocityX) > 0.5) {
        this.snapPosition = this.calculateSnapPosition();
        this.updateHoleIndex();
      } else {
        this.snapPosition = 0;
      }
      this.panStarted = false;
      this.renderer.setElementClass(this.el, 'animate-swipe', true);
      this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(' + this.snapPosition + '%, 0, 0)');
    })


  }

  ngOnDestroy() {
    this.panGesture.destroy();
  }

  onHoleChange(event) {
    if (event.direction === 'next') {
      this.direction = Direction.Next;
    } else {
      this.direction = Direction.Previous
    }
    this.snapPosition = this.calculateSnapPosition();
    this.updateHoleIndex();

    this.renderer.setElementClass(this.el, 'animate-swipe', true);
    this.renderer.setElementStyle(this.el, '-webkit-transform', 'translate3d(' + this.snapPosition + '%, 0, 0)');
  }

  updateHoleIndex() {
    let index = this.holeService.getIndex();

    if (this.direction === Direction.Previous && index > 0) {
      this.holeService.setIndex(index-1);
    } else if (this.direction === Direction.Next && index < this.holeService.getHoles().length) {
      this.holeService.setIndex(index+1);
    }
    this.holeService.getResult().multiplayerTab = false;
  }

  calculateSnapPosition() {
    if(this.direction === Direction.Next) {
      return this.snapLocations[2];
    } else if (this.direction === Direction.Previous) {
      return this.snapLocations[0];
    }
  }

  isOnEdge() {
    return (this.holeService.getIndex() === 0 && this.direction === Direction.Previous) || (this.holeService.getIndex() === this.holeService.getHoles().length-1 && this.direction === Direction.Next);
  }
}
