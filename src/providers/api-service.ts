import  { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

const COURSES_URL = 'https://api.backand.com:443/1/objects/courses';
const HOLES_URL = 'https://api.backand.com:443/1/objects/holes';
const ROUND_URL = 'https://api.backand.com/1/query/data/score_card';
const DASHBOARD_URL = 'https://api.backand.com/1/query/data/round_ids'

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
   return this.http.get(COURSES_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }

  getHoles (id) {
    this.options.search = this.createUrlSearchParams('filter', [{ "fieldName": "course_id", "operator": "in", "value": id }]);

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
    this.options.search = this.createUrlSearchParams('parameters', {user_id: '1'});
    return this.http.get(DASHBOARD_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }

  getRound (round) {
    console.log('gettin', round);
    this.options.search = this.createUrlSearchParams('parameters', {session_id: '1'});
    return this.http.get(ROUND_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }

  private createUrlSearchParams (key:string, params:Object) {
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set(key, JSON.stringify(params));

    return urlParams;
  }

}
