import { Helper } from './helper';
import { LoadingController } from 'ionic-angular';
import { FromServerTime } from './../pipes/from-server-time';
import { UserDataInterface } from '../environment/user-data-interface';
import { ErrorService } from './error-service';
import { Settings } from './settings';
import { StorageKeys } from '../environment/environment';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BackandService } from '@backand/angular2-sdk';

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
const UPDATE_URL = 'https://api.backand.com:443/1/objects/updates';

// security urls
const SIGN_UP_URL = 'https://api.backand.com/1/user/signup'

// custom query urls
const SCORE_CARD_QUERY_URL = 'https://api.backand.com/1/query/data/score_card';
const SESSION_QUERY_URL = 'https://api.backand.com/1/query/data/round_ids';
const USER_EMAIL_QUERY_URL = 'https://api.backand.com/1/query/data/user_email';


@Injectable()
export class ApiService {


  auth_token: { header_name: string, header_value: string } = { header_name: 'AnonymousToken', header_value: ANOM_TOKEN };
  options: RequestOptions;

  constructor(
    private http: Http, 
    private storage: Storage, 
    private settings: Settings, 
    private errorService: ErrorService,
    private loadingCtrl: LoadingController,
    private fromServerTime: FromServerTime,
    private helper: Helper,
    private backandService: BackandService
  ) {
    console.log('BACKANDSERVICE', this.backandService)
    this.options = new RequestOptions({headers: this.authHeader()});
    this.backandService.init({
      appName: APP_NAME,
      anonymousToken: ANOM_TOKEN
    })
  }

  private authHeader(authToken:{ header_name: string, header_value: string } = this.auth_token, contentType:String = 'application/json') {
    let authHeader = new Headers({ 'Content-Type': contentType });
    authHeader.set('AppName', APP_NAME);
    authHeader.append(authToken.header_name, authToken.header_value);
    return authHeader;
  }

  getCourses () {
    /*
   return this.http.get(COURSES_URL, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => Promise.reject(err)
    ); */
    return this.backandService.object.getList('courses').then((res) => {
      console.log('NEW backandservice', res)
      return res;
    }, (err) => this.errorService.catch(err));
  }

  async checkUpdates () {
    let loader = this.loadingCtrl.create(
      { content: "Tarkistetaan päivityksiä..." }
    );

    loader.present();

    return this.http.get(UPDATE_URL + '/1', this.options)
     .toPromise()
     .then(async res => {
        let response = res.json();
        console.log('UPDATE VERSIONS', response);
        await this.storage.set(StorageKeys.versions, response);
        loader.dismiss();
        return response;
      }, 
      (err) => {
        console.log(err);
        loader.dismiss();
        this.errorService.catch(err);
      });
  }



  async getHoles (id) {
    let options = this.copyOptions();
    options.search = this.createUrlSearchParams('filter', [{ "fieldName": "course_id", "operator": "in", "value": id }]);

    let loader = this.loadingCtrl.create(
      { content: "Valmistellaan peliä..." }
    );

    loader.present();

    return this.http.get(HOLES_URL, options)
     .toPromise()
     .then(async res => {
        loader.dismiss();
        let response = res.json();
        let versions = await this.storage.get(StorageKeys.versions);
        let holeData = { updated: versions.holes, data: response.data };
        await this.storage.set(StorageKeys.course + '-' + id, holeData)
        return holeData;
      }, 
      (err) => {
        console.log(err);
        loader.dismiss();
        this.errorService.catch(err);
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
    console.log('options', options);

    let loader = this.loadingCtrl.create(
          { content: "Haetaan kierrosta..." }
    );

    loader.present ();
    return this.http.get(SCORE_CARD_QUERY_URL, options)
      .timeout(10000)
      .toPromise()
      .then( (res) => {
        loader.dismiss();
        return res.json()
      }, (err) => {
        loader.dismiss();
        this.errorService.catch(err)
      }
    );
  }

  async updateUser() {
    let userData = await this.storage.get(StorageKeys.userData);
    console.log('uiserCDate', userData);
    return this.http.put(USER_URL + '/'+userData.userId, userData, this.options)
      .timeout(10000)
      .toPromise()
      .then(res => res, err => this.errorService.catch(err)
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
        let bulks = this.createRoundsRequest(holes);
        console.log('bulks', bulks);
        let invalid = bulks.some((bulk) => bulk.data.score === 0);
        console.log('invalid', invalid)
        let req = {
          user_id: data.userId.toString(),
          tee: this.settings.selectedTee,
          startedAt: bulks[0].data.startedAt,
          courseId: this.settings.courseId.toString(),
          validRound: !invalid,
          fullRound: this.settings.fullRound,
          data: bulks
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

  googleSignIn (googleData) {
    let auth_token: { header_name: string, header_value: string } = { header_name: 'MasterToken', header_value: MASTER_TOKEN };
    let opt = new RequestOptions({headers: this.authHeader(auth_token)})
 
    let data = { 
      "email": googleData.email,
      "password": googleData.userId,
      "confirmPassword": googleData.userId,
      "firstName": googleData.firstName,
      "lastName": googleData.lastName,
      "parameters": {"hcp": 36, "club": "", "imageUrl": googleData.imageUrl}
    };
    
    return this.http.post(ACCESS_URL, data, opt)
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => this.errorService.catch(err)
    );
  }

  mockMe () {
    let auth_token: { header_name: string, header_value: string } = { header_name: 'MasterToken', header_value: MASTER_TOKEN };
    let opt = new RequestOptions({headers: this.authHeader(auth_token,'application/x-www-form-urlencoded')})
 
    let data = { 
      "email": 'uus@mail.com',
      "password": 1235535321312312522312,
      "confirmPassword": 1235535321312312522312,
      "firstName": 'mokkaus',
      "lastName": 'facebook',
      "parameters": {"hcp": 36, "club": "", "imageUrl": 'awdawdawd'}
    };
    
    let header = new Headers();
    header.append('Content-Type', "application/x-www-form-urlencoded");
    header.append('header_name', "MasterToken");
    header.append('header_value', MASTER_TOKEN);

    return this.http.post(ACCESS_URL, data, {headers: header})
      .timeout(10000)
      .toPromise()
      .then(res => res.json(), err => this.errorService.catch(err)
    );
  }

  ByEmail  (email) {
    return this.backandService.query.get('user_email', { email: email }).then((res)=> {
      return res.data;
    }, err => this.errorService.catch(err));
  }

  async registerGoogleUser(data) {
    let users = await this.backandService.query.get('google_user', { google_id: data.userId }).then((res)=> {
      return res.data;
    }, err => this.errorService.catch(err));

    console.log('users', users);

    if (users.length) {
      return this.backandService.object.getOne('users', users[0].user_id).then((res)=> {
        return res.data;
      }, err => this.errorService.catch(err));
    }

    return this.backandService.object.create(
      'users', 
      {
        firstName: data.givenName,
        lastName: data.familyName,
        hcp: 36,
        club: '',
        email: data.email,
        imageUrl: data.imageUrl
      },
      { returnObject:  true },
      { google_id: data.userId, sync: true }
      ).then((res)=> {
      return res.data;
    }, err => this.errorService.catch(err));
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
          startedAt: this.fromServerTime.toServerTime(player.startedAt), // format these to server data
          finishedAt: this.fromServerTime.toServerTime(player.finishedAt), // format these to server date
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
