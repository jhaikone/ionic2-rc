import  { Component, OnInit, ViewChild } from '@angular/core';

import { ViewController, Slides } from 'ionic-angular';

import { TrophyService } from '../../components/services/trophy-service/trophy-service.component';
import { StorageService } from '../../components/services/storage-service/storage-service.component';

export enum Tabs {
  Xp,
  Medal,
  Trophy
}

const MOCK_LEVEL = {
  icon: 'ion-level-5',
  value: 3
};

const MOCK_EXPERIENCE = 124;

@Component({
  templateUrl: 'achievements-page.html'
})

export class AchievementsPage implements OnInit {

  @ViewChild('achievementSlider') slider: Slides;

  tab: number = 0;
  tabs = Tabs;
  width: String = '0';
  experience: any = 0;
  ribbons: any = [];
  medals: any = [];

  constructor (public viewCtrl: ViewController, public trophyService: TrophyService, public storageService: StorageService) {
    this.ribbons = this.trophyService.getRibbons();
    this.medals = this.trophyService.getRibbons();
    console.log('this', this.slider);
  }

  ionViewDidEnter() {
    this.width = ((MOCK_EXPERIENCE/(this.experience.toNext))*100).toString();
  }

  ngOnInit() {
    this.experience = this.trophyService.getLevel(MOCK_EXPERIENCE);
    console.log('tgegfe', this.experience);
  }

  close() {
    this.viewCtrl.dismiss();
  }

  isBig(ribbon) {
    let userRibbon = this.findInList(this.ribbons, 'Id', ribbon.id);
    return userRibbon ? userRibbon.Total < 10 : false;
  }

  findInList(list, key, id) {
    return list.find((object) => {
      return object[key] === id;
    })
  }

  isRibbonDiscovered(ribbon) {
    let userRibbon = this.findInList(this.ribbons, 'Id', ribbon.id);
    return userRibbon ? userRibbon.Total > 0 : false;
  }

  isMedalDiscovered(medal) {
    let userMedal = this.findInList(this.medals, 'Id', medal.id);
    return userMedal ? userMedal.Total > 0 : false;
  }

  getRibbonCount(ribbon) {
    let userRibbon = this.findInList(this.ribbons, 'Id', ribbon.id);
    return userRibbon ? userRibbon.Total : 0;
  }

  hasMedal(medal) {
    let userMedal = this.findInList(this.medals, 'Id', medal.id);
    return userMedal && userMedal.total > 0 ? 'checkmark' : 'remove';
  }

  activeTab(tab) {
    this.tab = tab;
  }

  getLevel() {
    return MOCK_LEVEL;
  }

  getColor(type) {
    return this.tab === type ? 'primary' : 'light';
  }

  onSlideChanged() {
    this.activeTab(this.slider.getActiveIndex());
  }

  slideTo(tab) {
    this.slider.slideTo(tab, 300);
  }


}
