import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the CoursePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'course-page.html'
})
export class CoursePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CoursePage Page');
  }

}
