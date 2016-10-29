import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { TrophyService } from './trophy-service';

@Injectable()
export class StorageService {

  constructor(public trophyService: TrophyService, public storage: Storage) {

  }

  //Update Ribbon Total according trophies for Ribbons table
  setTrophies(trophies) {
    trophies.ribbons.forEach((ribbon) => {
      this.addRibbon(ribbon.key);
    });
  }

  addRibbon(key) {
    this.getRibbon(key).then((ribbon) => {
      let rib;
      if(ribbon && ribbon.key) {
        ribbon.total += 1;
        rib = ribbon;
      } else {
        rib = {key: key, total: 1};
      }
      this.storage.set(key, rib);
    });
  }

  // Get ribbon from our Ribbons table
  getRibbon(key) {
    return this.storage.get(key);
  }




}
