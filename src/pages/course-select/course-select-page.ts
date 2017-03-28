import { ToasterService } from '../../providers/toaster-service';
import { ErrorService } from '../../providers/error-service';
import { StorageKeys } from './../../environment/environment';
import { Settings } from '../../providers/settings';
import { Storage } from '@ionic/storage';
import { Component, ApplicationRef } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

@Component( {
  templateUrl: 'course-select-page.html'
})

export class CourseSelectPage {

  courses: Array<any> = [];
  loadFailed: boolean = false;

  constructor(
    private apiService: ApiService, 
    private navController: NavController, 
    private scoreCardService: ScoreCardService, 
    private loaderController: LoadingController,
    private storage: Storage,
    private settings: Settings,
    private errorService: ErrorService
  ) {
   
  }

  ionViewWillEnter() {
    this.initCourses();
  }

  async initCourses() {
    let data = await this.storage.get(StorageKeys.courses);
    let versions = await this.storage.get(StorageKeys.versions);

    this.courses = (data && data.courses) ? data.courses : [];
    if (this.courses.length === 0 || versions.courses > data.updated) {
      this.fetchCourses();
    }

  }

  courseSelected(course) {
    console.log('course', course)
    this.scoreCardService.setCourse(course);
    this.settings.courseId = course.id;
    this.navController.push(CoursePage, {});
  }

  async getItems(event) {
    let data = await this.storage.get(StorageKeys.courses);
    this.courses = data.courses;
    this.filterCourses(event);
  }

  private async fetchCourses () {
    let loader = this.loaderController.create(
      { content: "Haetaan kenttiä..." }
    );

    loader.present();

    try {
      let response = await this.apiService.getCourses();
      this.loadFailed = false;
      this.courses = response.data;
      let versions = await this.storage.get(StorageKeys.versions);
      let courseData = {
        courses: this.courses,
        updated: versions.courses
      }
      await this.storage.set(StorageKeys.courses, courseData);
      loader.dismiss();
    } catch (error) {
      console.log('error', error);
      this.loadFailed = true;
      this.courses = [];
      loader.dismiss();
      this.errorService.catch(error);
    }

  }
  
  private isNotEmpty(value) {
    return value && value.trim() != '';
  }

  private filterCourses (event) {
    let value = event.target.value;

    if (this.isNotEmpty(value)) {
      this.courses = this.courses.filter((course) => {
        return (course.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }

  }

}
