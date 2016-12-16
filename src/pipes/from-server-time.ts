import { Pipe } from '@angular/core';

import moment from 'moment';

const dateFormat = "DD.MM.YYYY HH:mm";

@Pipe({
  name: 'fromServerTime'
})

export class FromServerTime {
  transform(value) {
    return moment(value).format(dateFormat);
  }

}
