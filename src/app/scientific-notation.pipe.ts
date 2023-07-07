import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'scientificNotation' })
export class ScientificNotationPipe implements PipeTransform {
  transform(value: number): string {
    const billion = 1000000000;

    if (value >= billion) {
      const exponent = Math.floor(Math.log10(value) / 3) * 3;
      const mantissa = (value / Math.pow(10, exponent)).toFixed(2);

      return mantissa + 'E' + exponent;
    }
    else {
      return value.toFixed(1)
    }
  }
}
