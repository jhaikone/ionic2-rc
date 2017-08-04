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
    console.log('ERRRRRROR', response);
    this.presentToast(this.formatResponse(response));
  }

  formatResponse (response) {
    if (!(response && response._body)) return {};
    
    let error = JSON.parse(response._body);
    if (error.error_description) {
      return error.error_description;
    }
    return error;
  }

  invalid(message) {
    this.presentToast(message);
  }

}