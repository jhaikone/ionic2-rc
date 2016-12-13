import { Pipe } from '@angular/core';

import moment from 'moment';

const dateFormat = "DD.MM.YYYY hh:mm";

@Pipe({
  name: 'fromServerTime'
})

export class FromServerTime {
  transform(value) {
    return moment.unix(value).format(dateFormat);
  }

}
