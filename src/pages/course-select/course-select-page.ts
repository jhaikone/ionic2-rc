import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];
  loader: any = {};

  constructor(public apiService: ApiService, public navController: NavController, public scoreCardService: ScoreCardService,public loaderController: LoadingController) {
      this.loader = this.loaderController.create(
        { content: "Haetaan kenttiä..." }
      );
      this.initCourses();
  }

  initCourses() {
    this.loader.present();
    this.apiService.getCourses().then((res) => {
      this.courses = res.data;
      console.log('courses:', this.courses);
      this.loader.dismiss();
    });
    this.apiService.getHoles(1).then((res) => {
      console.log('kenttä', res);
    })
  }

  courseSelected(course) {
    this.scoreCardService.prepareCard(course, false);
    this.navController.push(CoursePage, {});
  }

  getItems(event) {
    this.initCourses();

    let value = event.target.value;

    if (this.isNotEmpty(value)) {
      this.courses = this.courses.filter((course) => {
        return (course.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }

  }

  private isNotEmpty(value) {
    return value && value.trim() != '';
  }

}
