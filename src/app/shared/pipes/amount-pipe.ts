import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {

  transform(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      return String(value);
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

}
