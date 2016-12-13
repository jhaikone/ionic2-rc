import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { CoursePage } from '../course/course-page';

import { ApiService } from '../../providers/api-service';
import { ScoreCardService } from '../../providers/score-card-service';

const COURSES_KEY = 'courses';

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
    private storage: Storage
  ) {
    this.initCourses();
  }

  initCourses() {
    this.storage.get(COURSES_KEY).then((res) => {
      if (res && res.length > 0) {
         this.courses = res;     
      } else {
        this.fetchCourses();
      }
    });
  }

  courseSelected(course) {
    this.scoreCardService.prepareCard(course, false);
    this.navController.push(CoursePage, {});
  }

  getItems(event) {
    this.storage.get(COURSES_KEY).then((res) => {
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
      this.storage.set(COURSES_KEY, this.courses);
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
