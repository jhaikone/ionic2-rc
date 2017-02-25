import { Pipe } from '@angular/core';

import moment from 'moment';

const dateFormat = "DD.MM.YYYY HH:mm";
const serverDateFormat = 'YYYY-MM-DDTHH:mm:ss';

@Pipe({
  name: 'fromServerTime'
})

export class FromServerTime {
  
  transform(value) {
    return moment(value).format(dateFormat);
  }

  toServerTime (timestamp: number) {
    return moment(new Date(timestamp*1000)).format(serverDateFormat);
  }

}
