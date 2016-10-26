import { Injectable } from '@angular/core';


/*
  Generated class for the CourseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CourseService {

  course: Object = {};

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
