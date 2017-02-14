import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-sign-up-confirmation',
  templateUrl: 'sign-up-confirmation.html'
})

export class SignUpConfirmationPage {

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
      console.log('nav', this.navParams);
  }

  close () {
    this.viewCtrl.dismiss();
  }

  signUp () {
      console.log('sign')
  }

}
