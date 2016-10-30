import { Injectable } from '@angular/core';

@Injectable()
export class CourseService {

  course: any = {};

  constructor() {
    console.log('Hello CourseService Provider');
  }

  setCourse(course) {
    this.course = course;
  }

  getCourse() {
    return this.course;
  }

}
