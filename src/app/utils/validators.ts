import { AbstractControl, ValidationErrors } from '@angular/forms'
import { UrlRegex } from 'pks-common'

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    if (
      !control.value ||
      (typeof control.value === 'string' &&
        control.value !== '' &&
        UrlRegex.test(control.value.trim()))
    ) {
      return null
    }
    return { url: true }
  }
}
