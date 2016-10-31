import  { Injectable } from '@angular/core';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import { CourseService } from './course-service';

@Injectable()
export class ApiService {
  constructor(public courseService: CourseService) {

  }

  getCourses() {
    return MOCK_COURSES;
  }

  getCourse() {
    return MOCK_COURSES[0];
  }

  getRounds() {
    return MOCK_ROUNDS;
  }

  getRound(round) {
    return MOCK_ROUND_CARDS[round.id];
  }

  getParListFromCourse() {
    let course = this.courseService.getCourse();
    return MOCK_COURSES.find((c) => c.id === course.id).holes;
  }
}
