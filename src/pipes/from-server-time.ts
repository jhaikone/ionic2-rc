import { Pipe } from '@angular/core';

@Pipe({
  name: 'fromServerTime'
})

export class FromServerTime {
  transform(value, args) {
    return value;
  }
}
