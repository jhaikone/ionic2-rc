import { ModalController } from 'ionic-angular';
import { Injectable, Component } from '@angular/core';

@Injectable()
export class ModalService {

  constructor(public modalCtrl: ModalController) {}

  presentModal(page: Component, data: any) {
    let modal = this.modalCtrl.create(page, data);
    modal.present();
  }

}