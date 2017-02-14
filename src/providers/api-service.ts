import { ErrorService } from './error-service';
import { Settings } from './settings';
import { StorageKeys } from '../environment/environment';
import  { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

import _ from 'lodash';

// data urls
const COURSES_URL = 'https://api.backand.com:443/1/objects/courses';
const HOLES_URL = 'https://api.backand.com:443/1/objects/holes';
const ROUNDS_URL = 'https://api.backand.com:443/1/objects/rounds';
const ACCESS_URL = 'https://api.backand.com:443/token';
const SESSION_URL = 'https://api.backand.com:443/1/objects/sessions';
const USER_URL = 'https://api.backand.com:443/1/objects/users';

// security urls
const SIGN_UP_URL = 'https://api.backand.com/1/user/signup'

// custom query urls
const SCORE_CARD_QUERY_URL = 'https://api.backand.com/1/query/data/score_card';
const SESSION_QUERY_URL = 'https://api.backand.com/1/query/data/round_ids'


@Injectable()
export class ApiService {


  auth_token: { header_name: string, header_value: string } = { header_name: 'AnonymousToken', header_value: ANOM_TOKEN };
  options: RequestOptions;

  constructor(private http: Http, private storage: Storage, private settings: Settings, private errorService: ErrorService) {
    console.log('Rounds', MOCK_ROUND_CARDS)
    this.options = new RequestOptions({headers: this.authHeader()})
  }

  private authHeader(authToken:{ header_name: string, header_value: string } = this.auth_token, contentType:String = 'application/json') {
    let authHeader = new Headers({ 'Content-Type': contentType });
    authHeader.set('AppName', APP_NAME);
    authHeader.append(authToken.header_name, authToken.header_value);
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
    let options = this.copyOptions();
    options.search = this.createUrlSearchParams('filter', [{ "fieldName": "course_id", "operator": "in", "value": id }]);

    return this.http.get(HOLES_URL, options)
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

  async getRounds () {
    let userData = await this.storage.get(StorageKeys.userData);
    let options = this.copyOptions();
    console.log('USERDATE', userData);
    options.search = this.createUrlSearchParams('parameters', {user_id: userData.userId});
    
    return this.http.get(SESSION_QUERY_URL, options)
        .timeout(10000)
        .toPromise()
        .then(res => res.json(), err => {
          this.errorService.catch(err);
        }
      );
  }

  async getUser(data) {
    let options = this.copyOptions();
    
    return this.http.get(USER_URL+ '/'+data.userId, options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject(err)
    );
  }

  getRound (round) {
    console.log('gettin', round);
    let options = this.copyOptions();
    options.search = this.createUrlSearchParams('parameters', {session_id: round.id});
    return this.http.get(SCORE_CARD_QUERY_URL, options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject(err)
    );
  }

  setRounds (holes: Array<any>) {
      return this.storage.get(StorageKeys.userData).then((data) => {
        console.log('DATA', data)
        let access_token:string = 'Bearer ' + data.access_token;
        let auth_token: { header_name: string, header_value: string } = {
            header_name: "Authorization", 
            header_value: access_token
        };

        let opt = new RequestOptions({headers: this.authHeader(auth_token)})
        console.log('holes', holes);
        console.log('getCourse', this.settings.courseId);
        let req = {
          user_id: data.userId.toString(),
          tee: this.settings.selectedTee,
          startedAt: '',
          courseId: this.settings.courseId.toString(),
          data: this.createRoundsRequest(holes)
        };
        
        console.log('isArray', req);

        return this.http.post(SESSION_URL, req, this.options)
          .timeout(10000)
          .toPromise()
          .then(res => res.json(), err => Promise.reject(err)
        );
      })

      
    }
  
  getAccessToken () {
    return this.http.get(ACCESS_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }


  /**
  * this method is used to sign up users
  */
  signUp (form) {
    let auth_token: { header_name: string, header_value: string } = { header_name: 'SignUpToken', header_value: SIGN_UP_TOKEN };
    let opt = new RequestOptions({headers: this.authHeader(auth_token)})
 
    let data = { 
      "email": form.email,
      "password": form.password,
      "confirmPassword": form.password,
      "firstName": form.firstName,
      "lastName": form.lastName,
      "parameters": {"hcp": form.hcp, "club": form.club}
    };
    
    return this.http.post(SIGN_UP_URL, data, opt)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }

  /**
  * this method is used to sign in users
  */
  signIn (user, password) {
    
    let creds = `username=${user}` +
      `&password=${password}` +
      `&appName=${APP_NAME}` +
      `&grant_type=password`;
      
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(ACCESS_URL, creds, { headers: header})
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject(err)
    );
  }

  private createUrlSearchParams (key:string, params:Object) {
    let urlParams: URLSearchParams = new URLSearchParams();
    urlParams.set(key, JSON.stringify(params));

    return urlParams;
  }

  private createRoundsRequest (scoreCard: Array<any>) {
    let bulkActions = [];

    scoreCard.forEach((result) => {
      let player = result.singlePlayer; 
      let data = {
        data: {
          hole_id: player.hole_id,
          score: player.strokes,
          putts: player.putts,
          startedAt: '', // format these to server data
          finishedAt: '', // format these to server date
          isFairway: player.fairway,
          isGir: player.gir,
          isSandSave: player.sandSave,
          penalties: player.penalties
        }
      }
      bulkActions.push(data);
    });

    return bulkActions;
  }

  private copyOptions () {
    return _.merge(this.options, {});
  }

}
