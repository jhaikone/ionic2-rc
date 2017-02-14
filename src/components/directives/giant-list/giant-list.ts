import { ScoreCardPage } from './../../../pages/score-card/score-card-page';
import { ScoreCardService } from '../../../providers/score-card-service';
import { LoadingController, NavController } from 'ionic-angular';
import { Component, Input, OnInit, ViewChild, Renderer, trigger, state, transition, animate, style, keyframes } from '@angular/core';

const BUTTON_COUNT: number = 6;

@Component({
  selector: 'giantlist',
  template: `
    <div *ngIf="getPageNumbers().length > 1" text-center class="button-container margin-auto center-horizontal"> 
        <button (click)="decrease()" *ngIf="pageNavigation" class="list-button" color="light" ion-button clear icon-only> <ion-icon name="rewind"> </ion-icon> </button>
        <div #pagecontainer class="page-container animate"><button [ngClass]="{'active': i === pageIndex}" class="list-button border" *ngFor="let icon of getPageNumbers(); let i = index" ion-button clear (click)="setPage(i)">{{i+1}}</button></div>
        <button (click)="increase()" *ngIf="pageNavigation" class="list-button" color="light" ion-button clear icon-only> <ion-icon name="fastforward"> </ion-icon> </button>
    </div> 
    <ion-list>
        <button (@flyInOut.done)="doNext()" [@flyInOut]="'in'" *ngFor="let round of rounds" ion-item (click)="getRound(round)" class="list-item">
            <ion-row>
            <ion-col width-40>
                <div><span class="course-label">{{round.name}}</span></div>
                <div><span class="font-xsmall" >{{round.startedAt | fromServerTime}}</span></div>
            </ion-col>
            <ion-col width-20 text-center>
                <div><span class="font-xsmall">Tulos</span></div>
                <div><a ion-text class="font-avarage" color="primary">{{round.score}}</a></div>
            </ion-col>
            <ion-col width-20 text-center>
                <div><span class="font-xsmall">Putit</span></div>
                <div><a ion-text class="font-avarage" color="primary">{{round.putts}}</a></div>
            </ion-col>
            </ion-row>
        </button>
    </ion-list>

    <div *ngIf="getPageNumbers().length > 1" text-center class="width-100"> 
        <button [ngClass]="{'active': i === pageIndex}" class="list-button" *ngFor="let icon of icons; let i = index" ion-button clear (click)="setPage(i)">{{i+1}}</button>
    </div> 

    <ion-label color="light" text-center *ngIf="!rounds.length">Ei pelattuja kierroksia</ion-label>
  `,
  animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(5px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
      ]))
    ])
  ])
]
})

export class GiantList implements OnInit  {

    @ViewChild('pagecontainer') buttonContainer;

    pageSize: number = 50;
    pageIndex: number = 0;
    rounds: Array<any> = [];
    pageNavigation: boolean;
    buttons: HTMLCollection;
    loading: boolean;
    next: number = 0;

    buttonIndex:number = 0;

    @Input() data : any;

    constructor(private renderer: Renderer, private loadingController: LoadingController, private scoreCardService: ScoreCardService, private navCtrl: NavController) {
    }

    
  getRound (selected) {
    let loader = this.loadingController.create(
      { content: "Haetaan tulosta..." }
    );

    loader.present();
    this.scoreCardService.prepareCard(selected, true).then(() => {
      loader.dismiss();
      this.navCtrl.push(ScoreCardPage, {});
    });

  }

    ngOnInit() {

        this.setRounds();
    }

    ngAfterViewInit() {
        if (this.buttonContainer) {
            this.buttons = this.buttonContainer.nativeElement.children;
        }
    }

    ngOnChanges() {
        console.log('data', this.data);
        this.doNext();
    }

    getPageNumbers() {
        let pageCount = Math.ceil(this.data.length / this.pageSize);
        this.pageNavigation = pageCount > BUTTON_COUNT ? true : false;
        return new Array(Math.ceil(this.data.length / this.pageSize));
    }

    setPage(i) {
        this.pageIndex = i;
        this.setRounds();
    }
    
    increase() {
         if (this.buttonIndex+BUTTON_COUNT < this.buttons.length) {
            this.renderer.setElementClass(this.buttons[this.buttonIndex], 'hide', true);
            this.buttonIndex++;
        }
    }

    decrease() {
        if (this.buttonIndex > 0) {
            console.log('index', this.buttonIndex)
            this.buttonIndex--;
            this.renderer.setElementClass(this.buttons[this.buttonIndex], 'hide', false);
        }   
    
        
    }

    private setRounds() {
        this.rounds = this.data.slice(this.pageSize*this.pageIndex, (this.pageSize*this.pageIndex)+this.pageSize);
    }

    doNext() {
        if(this.next < this.data.length) {
        this.rounds.push(this.data[this.next++]);
        }
    }

}
