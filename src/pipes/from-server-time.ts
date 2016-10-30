import { Pipe } from '@angular/core';

import moment from 'moment';

const dateFormat = "DD.MM.YYYY";

@Pipe({
  name: 'fromServerTime'
})

export class FromServerTime {
  transform(value, args) {
    return moment.unix(value).format(dateFormat);
  }

}
