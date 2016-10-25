import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../components/services/api-service/api-service.component';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];

  constructor(public apiService: ApiService, public navController: NavController) {
      this.courses = this.apiService.getCourses();
  }

  courseSelected(course) {
    this.navController.push(CoursePage, {selected: course});
  }
}
