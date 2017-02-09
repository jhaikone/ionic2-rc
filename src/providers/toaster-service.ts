import { ToastController } from 'ionic-angular';

import { Injectable } from '@angular/core';

@Injectable()
export class ToasterService {

  private duration: number = 3000;
  private position: string = 'top';

  constructor(public toastCtrl: ToastController) {

  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: this.duration,
      position: this.position
    });
    toast.present();
  }

  error (response: any) {
    this.presentToast(this.formatResponse(response));
  }

  formatResponse (response) {
    return JSON.parse(response._body).error_description;
  }

  invalid(message) {
    this.presentToast(message);
  }

}