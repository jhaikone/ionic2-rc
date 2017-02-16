import { RoundInterface } from '../../../environment/round-interface';
import { ScoreCardPage } from './../../../pages/score-card/score-card-page';
import { ScoreCardService } from '../../../providers/score-card-service';
import { LoadingController, NavController } from 'ionic-angular';
import { Component, Input, OnInit, ViewChild, Renderer, trigger, state, transition, animate, style, keyframes, OnChanges, SimpleChanges } from '@angular/core';

const BUTTON_COUNT: number = 6;
const PAGE_SIZE: number = 50;

@Component({
  selector: 'giantlist',
  template: `
    <div *ngIf="getPageNumbers().length > 1" text-center class="button-container margin-auto center-horizontal"> 
        <button (click)="prevPageBullet()" *ngIf="pageNavigation" class="list-button" color="light" ion-button clear icon-only> <ion-icon name="rewind"> </ion-icon> </button>
        <div #pagecontainer class="page-container animate"><button [ngClass]="{'active': i === pageIndex}" class="list-button border" *ngFor="let icon of getPageNumbers(); let i = index" ion-button clear (click)="setPage(i)">{{i+1}}</button></div>
        <button (click)="nextPageBullet()" *ngIf="pageNavigation" class="list-button" color="light" ion-button clear icon-only> <ion-icon name="fastforward"> </ion-icon> </button>
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
                animate(150, keyframes([
                    style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(5px)',  offset: 0.3}),
                    style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
                ]))
            ])
        ])
    ]
})

export class GiantList implements OnInit, OnChanges {

    @ViewChild('pagecontainer') buttonContainer;

    pageIndex: number = 0;
    rounds: Array<RoundInterface> = [];
    pageNavigation: boolean;
    buttons: HTMLCollection;
    loading: boolean;
    next: number = 0;

    buttonIndex:number = 0;

    @Input() data : any;

    constructor(
        private renderer: Renderer, 
        private loadingController: LoadingController, 
        private scoreCardService: ScoreCardService, 
        private navCtrl: NavController
    ) {}

    ngOnInit () {
        this.setRounds();
    }

    ngOnChanges (changes: SimpleChanges) {
        let change = changes['data'];
        if (Array.isArray(change.currentValue) && Array.isArray(change.previousValue)) {
            if (change.currentValue.length || change.previousValue.length) {
                this.doNext();
            }
        }
    }

    ngAfterViewInit () {
        if (this.buttonContainer) {
            this.buttons = this.buttonContainer.nativeElement.children;
        }
    }

    getRound (selected) {
        let loader = this.loadingController.create(
            { content: "Haetaan kierrosta..." }
        );

        loader.present ();
        this.scoreCardService.prepareCard(selected, true).then(() => {
        loader.dismiss();
        this.navCtrl.push(ScoreCardPage, {});
        });

    }

    getPageNumbers () {
        let pageCount = Math.ceil(this.data.length / PAGE_SIZE);
        this.pageNavigation = pageCount > BUTTON_COUNT ? true : false;
        return new Array(Math.ceil(this.data.length / PAGE_SIZE));
    }

    setPage (i) {
        this.pageIndex = i;
        this.setRounds();
    }
    
    nextPageBullet () {
        if (this.buttonIndex+BUTTON_COUNT >= this.buttons.length) return;

        this.hidePageBullet(true);
        this.buttonIndex++;
    }

    prevPageBullet () {
        if (this.buttonIndex <= 0) return;

        this.buttonIndex--;
        this.hidePageBullet(false);
    }

    doNext () {
        if(this.next < this.data.length) {
        this.rounds.push(this.data[this.next++]);
        }
    }

    private hidePageBullet (isAdd: boolean ) {
        this.renderer.setElementClass(this.buttons[this.buttonIndex], 'hide', isAdd);
    }

    private setRounds () {
        this.rounds = this.data.slice(PAGE_SIZE*this.pageIndex, (PAGE_SIZE*this.pageIndex)+PAGE_SIZE);
    }

}
