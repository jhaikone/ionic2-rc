import { Helper } from './../../../providers/helper';
import { Directive, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';

import { Gesture } from 'ionic-angular/gestures/gesture';

import { HoleService } from '../../../providers/hole-service';
import { DirectionEnum } from '../../../environment/environment';

declare const Hammer: any;

const BLACK_LIST_ELEMENTS: Array<string> = [
  'button-inner'
];

@Directive({
  selector: '[pan]'
})

export class PanComponent implements OnInit, OnDestroy {

  element: HTMLElement;
  panGesture: Gesture;
  direction: DirectionEnum;
  private subscription;


  index: number = 0;
  holeCount: number = 0;
  snapLocations: Array<number> = [100, 0, -100];
  snapPosition: number;
  lockPanHorizontal: boolean = false;
  options: Object = {
    stopPropagation: true,
    preventDefault: true,
    invokeApply: false,
    direction:  Hammer.DIRECTION_HORIZONTAL,
    threshold: 10
  };

  constructor(elementRef: ElementRef, public holeService: HoleService, public renderer: Renderer, public helper: Helper) {
    this.element = elementRef.nativeElement;
  
    this.subscription = this.holeService.holeChanged$.subscribe(event => this.onHoleChange(event));
    this.index = holeService.getIndex();
    this.holeCount = holeService.getHoles().length;
  }

  nonDraggableItem (event) {
    return event.target && BLACK_LIST_ELEMENTS.indexOf(event.target.className) > -1;
  }

  ngOnInit() {
    this.renderer.listen(this.element, 'transitionend', (event) => {
      if (event.propertyName === 'transform') {
        this.index = this.holeService.getIndex();
        event.preventDefault();
        this.renderer.setElementStyle(this.element, '-webkit-transform', 'translate3d(0, 0, 0)');
        this.renderer.setElementClass(this.element, 'animate-swipe', false);
        this.lockPanHorizontal = false;
      }
    });

    this.panGesture = new Gesture(this.element, {
      recognizers: [
        [Hammer.Pan, this.options]
      ]
    });

    this.panGesture.listen();

    this.panGesture.on('panstart', event => {
      if  (this.nonDraggableItem(event)) return;

      this.lockPanHorizontal = Math.abs(event.deltaY) > 20;
      this.direction = event.deltaX < 0 ? DirectionEnum.Next : DirectionEnum.Previous;
      this.renderer.setElementClass(this.element, 'animate-swipe', false);
    })

    this.panGesture.on('panleft panright', event => {
        if  (this.nonDraggableItem(event)) return;
        if (this.lockPanHorizontal) return;

        if (this.hasNext() || this.hasPrevious()) {
          this.renderer.setElementStyle(this.element, '-webkit-transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
          this.renderer.setElementStyle(this.element, 'transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
        } else {
          //TODO: animte out of bounds;
        }

    })

    this.panGesture.on('panend', event => {
      if (this.lockPanHorizontal || this.nonDraggableItem(event)) return;
      this.snapPosition = 0;

      if (this.snappable() && (Math.abs(event.deltaX) > 100 || Math.abs(event.overallVelocityX) > 0.5)) {
        this.update();
      } else {
        this.animateHoleChange();
      }

    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.panGesture.destroy();
  }

  private onHoleChange(event) {
    this.direction = event.direction;
    this.update();
  }

  private update() {
    this.setTimeStamp('finishedAt');
    this.calculateSnapPosition();

    let index = this.holeService.getIndex();
    console.log('pan', index);
    if (this.hasPrevious()) {
      this.holeService.setIndex(index-1);
    } else  {
      this.holeService.setIndex(index+1);
      this.setTimeStamp('startedAt');
    }

    this.holeService.playerMode = 'singleplayer';
    this.animateHoleChange();
  }

  private setTimeStamp (key) {
    let model = this.holeService.getResult().singlePlayer;
    if (model[key]) return;

    model[key] = this.helper.timeNow();
  }

  private calculateSnapPosition() {
    this.snapPosition = this.direction === DirectionEnum.Next ? this.snapLocations[2] : this.snapLocations[0];
  }

  private snappable() {
    return this.hasPrevious() || this.hasNext();
  }

  private hasPrevious() {
    return this.direction === DirectionEnum.Previous && this.index > 0;
  }

  private hasNext() {
    return this.direction === DirectionEnum.Next && this.index < this.holeCount-1;
  }

  private animateHoleChange() {
    this.renderer.setElementClass(this.element, 'animate-swipe', true);
    this.renderer.setElementStyle(this.element, '-webkit-transform', 'translate3d(' + this.snapPosition + '%, 0, 0)');
  }

}
