import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../components/services/api-service/api-service.component';
import { CourseService } from '../../providers/course-service';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];

  constructor(public apiService: ApiService, public navController: NavController, public courseService: CourseService) {
      this.initCourses();
  }

  initCourses() {
    this.courses = this.apiService.getCourses();
  }

  courseSelected(course) {
    this.courseService.setCourse(course);
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
