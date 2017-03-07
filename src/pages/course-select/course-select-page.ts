import { StorageKeys } from './../../environment/environment';
import { Settings } from '../../providers/settings';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
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
    private settings: Settings
  ) {
    this.initCourses();
  }

  async initCourses() {
    this.courses = await this.storage.get(StorageKeys.courses) || [];
    if (this.courses.length === 0) {
      this.fetchCourses();
    }
  }

  courseSelected(course) {
    console.log('course', course)
    this.scoreCardService.setCourse(course);
    this.settings.courseId = course.id;
    this.navController.push(CoursePage, {});
  }

  getItems(event) {
    this.storage.get(StorageKeys.courses).then((res) => {
      this.courses = res;
      this.filterCourses(event);
    })
  }

  private fetchCourses () {
    let loader = this.loaderController.create(
      { content: "Haetaan kenttiä..." }
    );

    loader.present();

    this.apiService.getCourses().then((res) => {
      console.log('success', res.data );
      this.loadFailed = false;
      this.courses = res.data;
      this.storage.set(StorageKeys.courses, this.courses);
      loader.dismiss();
    }, () => {
      console.log('error');
      this.loadFailed = true;
      this.courses = [];
      loader.dismiss();
    })
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
