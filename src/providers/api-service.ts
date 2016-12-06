import  { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

const COURSES_URL = 'https://api.backand.com:443/1/objects/courses?pageSize=20&pageNumber=1';

@Injectable()
export class ApiService {
  constructor(public http: Http) {
    console.log('Rounds', MOCK_ROUND_CARDS)
  }

  getCourses() {
   return this.http.get(COURSES_URL)
       .toPromise()
       .then(res => res.json(), err => console.log(err));
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
