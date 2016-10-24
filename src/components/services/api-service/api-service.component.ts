import  { Injectable } from '@angular/core';

import { MOCK_COURSES } from '../../../mock/mock';

@Injectable()
export class ApiService {

  getCourses() {
    return MOCK_COURSES;
  }

  getCourse() {
    return MOCK_COURSES[0];
  }
}
