import  { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

const COURSES_URL = 'https://api.backand.com:443/1/objects/courses';
const HOLES_URL = 'https://api.backand.com:443/1/objects/holes';

@Injectable()
export class ApiService {


  auth_token: {header_name: string, header_value: string} = {header_name: 'AnonymousToken', header_value: ANOM_TOKEN};
  options: RequestOptions;

  constructor(public http: Http) {
    console.log('Rounds', MOCK_ROUND_CARDS)
    this.options = new RequestOptions({headers: this.authHeader()})
  }

  private authHeader() {
    let authHeader = new Headers({ 'Content-Type': 'application/json' });
    authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
    return authHeader;
  }

  getCourses () {
   return this.http.get(COURSES_URL, this.options )
     .toPromise()
     .then(res => res.json(), err => console.log(err));
  }

  getHoles (id) {
    let params: URLSearchParams = new URLSearchParams();

    params.set('filter', JSON.stringify([{    "fieldName": "course_id",    "operator": "in",    "value": id  }]));

    this.options.search =  params;

    return this.http.get(HOLES_URL, this.options)
    .toPromise()
    .then(res => res.json(), err => console.log(err));
  }

  getRoundData (course) {
    let gettingCourse = new Promise((resolve, reject) => resolve(MOCK_COURSES[0]));
    let gettingScore = new Promise((resolve, reject) => resolve(MOCK_ROUND_CARDS[1]));

    return Promise.all([gettingCourse, gettingScore]).then(value => {
      return {course: value[0], score: value[1]};
    });
  }

  getCourseData (id) {
    return new Promise((resolve, reject) => resolve(MOCK_COURSES[0]));
  }

  getRounds () {
    return MOCK_ROUNDS;
  }

  getRound (round) {
    return MOCK_ROUND_CARDS[round.id];
  }

}
