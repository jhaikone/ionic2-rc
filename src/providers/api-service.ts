import { Settings } from './settings';
import { StorageKeys } from '../environment/environment';
import  { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Storage } from '@ionic/storage';

import { MOCK_COURSES, MOCK_ROUNDS, MOCK_ROUND_CARDS } from '../mock/mock';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

// data urls
const COURSES_URL = 'https://api.backand.com:443/1/objects/courses';
const HOLES_URL = 'https://api.backand.com:443/1/objects/holes';
const ROUNDS_URL = 'https://api.backand.com:443/1/objects/rounds';
const ACCESS_URL = 'https://api.backand.com:443/token';
const SESSION_URL = 'https://api.backand.com:443/1/objects/sessions';

// security urls
const SIGN_UP_URL = 'https://api.backand.com/1/user/signup'

// custom query urls
const SCORE_CARD_QUERY_URL = 'https://api.backand.com/1/query/data/score_card';
const SESSION_QUERY_URL = 'https://api.backand.com/1/query/data/round_ids'


@Injectable()
export class ApiService {


  auth_token: { header_name: string, header_value: string } = { header_name: 'AnonymousToken', header_value: ANOM_TOKEN };
  options: RequestOptions;

  constructor(private http: Http, private storage: Storage, private settings: Settings) {
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

  async getRounds () {
    let userData = await this.storage.get(StorageKeys.userData);

    this.options.search = this.createUrlSearchParams('parameters', {user_id: userData.userId});
    return this.http.get(SESSION_QUERY_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }

  getRound (round) {
    console.log('gettin', round);
    this.options.search = this.createUrlSearchParams('parameters', {session_id: round.id});
    return this.http.get(SCORE_CARD_QUERY_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject('error')
    );
  }



  setRounds (holes: Array<any>) {
      return this.storage.get(StorageKeys.userData).then((data) => {
        console.log('DATA', data)
        let access_token:string = 'bearer ' + data.access_token;
        let auth_token: { header_name: string, header_value: string } = {
            header_name: "Authorization", 
            header_value: access_token
        };

        let opt = new RequestOptions({headers: this.authHeader(auth_token)})
        let dataReq = this.createRoundsRequest(holes);


        let req = {
          user_id: 2,
          tee: this.settings.selectedTee,
          startedAt: '',
          courseId: 2,
          //data: dataReq,
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
  signUp () {
    let auth_token: { header_name: string, header_value: string } = { header_name: 'SignUpToken', header_value: SIGN_UP_TOKEN };
    let opt = new RequestOptions({headers: this.authHeader(auth_token)})

    let data = { 
      "firstName": "Juuso",
      "lastName": "Haikonen",
      "email": TEST_USER_EMAIL,
      "password": TEST_USER_PASSWORD,
      "confirmPassword": TEST_USER_PASSWORD,
    };

    return this.http.post(SIGN_UP_URL,data, opt)
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
      .then(res => res.json(), err => Promise.reject('error')
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
          startedAt: player.startAt || '',
          finishedAt: player.finishedAt || '',
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

}
