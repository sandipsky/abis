import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
