import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];

  constructor(public apiService: ApiService, public navController: NavController, public scoreCardService: ScoreCardService) {
      this.initCourses();
  }

  initCourses() {
    this.courses = this.apiService.getCourses();
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
