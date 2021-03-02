import {Pipe, PipeTransform} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Pipe({
  name: 'onlyOneError'
})
export class OnlyOneErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null, priorities: string[] = []): ValidationErrors | null {
    if (!errors) {
      return null;
    }
    const priority = priorities.find(p => Boolean(errors[p]));
    return priority ? { [priority]: errors[priority] } : null;
  }
}
