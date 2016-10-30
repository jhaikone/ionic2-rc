import { Directive, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';

import { Gesture } from 'ionic-angular/gestures/gesture';

import { HoleService } from '../../../providers/hole-service';
import { DirectionEnum } from '../../../environment/environment';

declare const Hammer: any;

@Directive({
  selector: '[pan]'
})

export class PanComponent implements OnInit, OnDestroy {

  element: HTMLElement;
  panGesture: Gesture;
  direction: DirectionEnum;

  index: number = 0;
  snapLocations: Array<number> = [100, 0, -100];
  snapPosition: number;
  lockPanHorizontal: boolean = false;
  options: Object = {
    stopPropagation: true,
    preventDefault: true,
    invokeApply: false,
    direction:  Hammer.DIRECTION_HORIZONTAL
  };

  constructor(elementRef: ElementRef, public holeService: HoleService, public renderer: Renderer) {
    this.element = elementRef.nativeElement;
    this.holeService.holeChanged$.subscribe(event => this.onHoleChange(event));
  }

  ngOnInit() {
    this.renderer.listen(this.element, 'transitionend', (event) => {
      if (event.propertyName === 'transform') {
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
      this.lockPanHorizontal = Math.abs(event.deltaY) > 20;
      this.direction = event.deltaX < 0 ? DirectionEnum.Next : DirectionEnum.Previous;
      this.renderer.setElementClass(this.element, 'animate-swipe', false);
    })

    this.panGesture.on('panleft panright', event => {
        if (this.lockPanHorizontal) return;

        if (this.hasNext() || this.hasPrevious()) {
          this.renderer.setElementStyle(this.element, '-webkit-transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
          this.renderer.setElementStyle(this.element, 'transform', 'translate3d(' + event.deltaX + 'px,0px,0px)');
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

    this.holeService.playerMode = 'singleplayer';
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
    this.renderer.setElementClass(this.element, 'animate-swipe', true);
    this.renderer.setElementStyle(this.element, '-webkit-transform', 'translate3d(' + this.snapPosition + '%, 0, 0)');
  }

}
