import { Component } from '@angular/core';

import { ApiService } from '../../components/services/api-service/api-service.component';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];

  constructor(public apiService: ApiService) {
      this.courses = this.apiService.getCourses();
  }

  courseSelected(course) {
    console.log('selected course', course);
  }
}
