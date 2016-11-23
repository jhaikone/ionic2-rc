import  { Injectable } from '@angular/core';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

@Injectable()
export class ApiService {
  constructor() {
    console.log('Rounds', MOCK_ROUND_CARDS)
  }

  getCourses() {
    return MOCK_COURSES;
  }

  getRoundData(course) {
    let gettingCourse = new Promise((resolve, reject) => resolve(MOCK_COURSES[0]));
    let gettingScore = new Promise((resolve, reject) => resolve(MOCK_ROUND_CARDS[1]));

    return Promise.all([gettingCourse, gettingScore]).then(value => {
      return {course: value[0], score: value[1]};
    });
  }

  getCourseData(id) {
    return new Promise((resolve, reject) => resolve(MOCK_COURSES[0]));
  }

  getRounds() {
    return MOCK_ROUNDS;
  }

  getRound(round) {
    return MOCK_ROUND_CARDS[round.id];
  }

}
