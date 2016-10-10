import  { Injectable } from '@angular/core';

const TROPHY = {
  ribbons: [
    { id: 1, key: 'noResults', name: 'Tumpelo', label: 'Merkkaa korttiin yli tripla bogey', icon: 'ion-ribbon-no-result', xp: 25 },
    { id: 2, key: 'par', name: 'Parittaja', label: 'Merkkaa korttiin par tulos', icon: 'ion-ribbon-par', xp: 50 },
    { id: 3, key: 'birdie', name: 'Pirkottaja', label: 'Merkkaa korttiin birdie tulos', icon: 'ion-ribbon-birdie', xp: 75 },
    // {name: 'eagle', label: 'Merkkaa korttiin eagle tulos', icon: 'ion-ribbon-birdie',: 150}
  ],
  medals: [
    // { name: 'ten-rounds', label: 'Pelaa 10 kierrosta', icon: 'ion-medal-ten-rounds', xp: 1000,ribbonId: 1 },
    // { name: 'ten-rounds', label: 'Pelaa 20 kierrosta', icon: 'ion-medal-twenty-rounds', xp: 2000,ribbonId: 1 },
    // { name: 'ten-rounds', label: 'Pelaa 50 kierrosta', icon: 'ion-medal-fifty-rounds', xp: 4000,ribbonId: 1 },
    // { name: 'ten-rounds', label: 'Pelaa 100 kierrosta', icon: 'ion-medal-hundred-rounds', xp: 10000,ribbonId: 1 },
    // { name: 'eagle', label: 'Saavuta 25 eaglea', icon: 'ion-medal-eagle', xp: 15000,ribbonId: 1 },
    {
      id: 1, key: 'noResults', name="Master tumpelo" label: 'Saavuta 25 Tumpelo-nauhaa', icon: 'ion-medal-no-results', xp: 15000, ribbon: { id: 1, cap: 25 }
    }
  ]
}

const EXPERIENCE = {
  levelCaps: [
    { level:1, cap: 100, toNext: 150 },
    { level:2, cap: 150, toNext: 200 },
    { level:3, cap: 200, toNext: 250 },
    { level:4, cap: 250, toNext: 300 },
    // { level:5, cap: 300, toNext: 150 },
    // { level:6, cap: 375, toNext: 150 },
    // { level:7, cap: 450, toNext: 150 },
    // { level:8, cap: 525, toNext: 150 },
    // { level:9, cap: 650, toNext: 150 },
    // { level:10, cap: 800, toNext: 150 }

],
  icon: {
    5: 'ion-level-5',
    10: 'ion-level-10',
    15: 'ion-level-15',
    20: 'ion-level-20'
  }
}

@Injectable()
export class TrophyService {

  getRibbons() {
    return TROPHY.ribbons;
  }

  getRibbon(key) {
    return TROPHY.ribbons[key];
  }

  getMedals() {
    return TROPHY.medals;
  }

  getLevel(xp) {
    for (let i = 0; i < EXPERIENCE.levelCaps.length; i++) {
      if(xp < EXPERIENCE.levelCaps[0].cap) {
        return EXPERIENCE.levelCaps[0];
      }
      if(xp >= EXPERIENCE.levelCaps[i].cap && xp < EXPERIENCE.levelCaps[i+1].cap) {
        return EXPERIENCE.levelCaps[i];
      }
    }
  }

  getTrophies(information) {
    let trophies = {
      ribbons: [],
      medals: []
    }

    console.log('info', information);
    console.log('stati', information.statistics)

    TROPHY.ribbons.forEach((ribbon) => {
      if(this.hasRibbon(information.player.statistics[ribbon.key])) {
        trophies.ribbons.push(ribbon);
      }
    });
    console.log('trophies', trophies);
    return trophies;
  }

  hasRibbon(stat) {
    return stat.amount > 0;
  }

}
