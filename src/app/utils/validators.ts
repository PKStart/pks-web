import { AbstractControl, ValidationErrors } from '@angular/forms'

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    const format = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    if (
      !control.value ||
      (typeof control.value === 'string' &&
        control.value !== '' &&
        format.test(control.value.trim()))
    ) {
      return null
    }
    return { url: true }
  }
}
