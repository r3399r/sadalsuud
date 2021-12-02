import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function momentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || !control.value.isValid()) return { moment: 'invalid moment' };
    return null;
  };
}
