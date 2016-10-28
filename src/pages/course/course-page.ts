import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CourseService } from '../../providers/course-service';

/*
  Generated class for the CoursePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'course-page.html',
})
export class CoursePage {

  course: any = {};
  teeList: Array<Object> = [];

  constructor(public navCtrl: NavController,  public courseService: CourseService) {
    this.course = courseService.getCourse();
    this.initTeeList();
  }

  ionViewDidLoad() {

  }

  initTeeList() {
    this.course.tees.forEach((tee) => {
      console.log('tee', tee)
      switch(tee.name) {
        case 'red': {
          this.teeList.push({key: 'red', name: 'Punainen', metre: tee.metre});
          break;
        }
        case 'blue': {
          this.teeList.push({key: 'blue', name: 'Sininen', metre: tee.metre});
          break;
        }
        // case 'red': {
        //   this.teeList.push({key: 'red', name: 'Punainen'});
        //   break;
        // }
        // case 'red': {
        //   this.teeList.push({key: 'red', name: 'Punainen'});
        //   break;
        // }
        // case 'red': {
        //   this.teeList.push({key: 'red', name: 'Punainen'});
        //   break;
        // }
      }
    })
  }

}
