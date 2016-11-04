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

}