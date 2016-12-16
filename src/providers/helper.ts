import { Injectable } from '@angular/core';

import _ from 'lodash';

@Injectable()
export class Helper {

  constructor() {
    console.log('Hello Helper Provider');
  }

  fromToArray(start, end, array) {
    let copy = _.map(array, _.clone);
    return copy.splice(start, end);
  }

  getTotal(array, key) {
    let total = 0;
    array.forEach((item) => {
      total += item[key];
    })
    return total;
  }


  round(value, precision = 1) {
    let multiplier = Math.pow(10, precision || 0);
    return (Math.round(value * multiplier) / multiplier).toFixed(precision);
  }

  sortNumberArray(array, key, reverse = false) {
    return array.sort((a, b) => {
      if (reverse) {
        return b[key] - a[key];
      }
      return a[key] - b[key];
    });
  }

  cleanArrayBy(array, key) {
    return array.filter(this.isSet);
  }

  private isSet(value) {
    console.log('value', value);
    return !(value === '' || value === undefined || value === null || _.isEmpty(value));
  }

  clone(array) {
    return _.clone(array);
  }

  isEmpty (object) {
    return _.isEmpty(object);
  }

  isNotEmpty(object) {
    return !_.isEmpty(object);
  }

  timeNow () {
    return Math.round(+new Date()/1000);
  }

}
