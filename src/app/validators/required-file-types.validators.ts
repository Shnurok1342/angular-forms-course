import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function createRequiredFileTypesValidator(fileTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    if (!value) {
      return null;
    }
    const isValidType = fileTypes.some(fileType => value.endsWith(fileType));
    return isValidType ? null : { invalidFileType: true, requiredFileTypes: fileTypes.join(', '), currentFileType: value };
  };
}
