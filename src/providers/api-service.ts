import  { Injectable } from '@angular/core';

import { MOCK_COURSES, MOCK_ROUNDS } from '../mock/mock';

@Injectable()
export class ApiService {

  getCourses() {
    return MOCK_COURSES;
  }

  getCourse() {
    return MOCK_COURSES[0];
  }

  getRounds() {
    return MOCK_ROUNDS;
  }
}
