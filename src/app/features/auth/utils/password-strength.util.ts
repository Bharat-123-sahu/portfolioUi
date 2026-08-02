import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type PasswordStrength = {
  score: number;
  label: string;
  checks: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
};

export function getPasswordStrength(value = ''): PasswordStrength {
  const checks = {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z\d]/.test(value),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const label = score <= 2 ? 'Weak' : score <= 4 ? 'Good' : 'Excellent';

  return {
    score,
    label,
    checks,
  };
}

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return getPasswordStrength(control.value).score === 5
      ? null
      : { strongPassword: true };
  };
}

export function matchFieldsValidator(
  field: string,
  matchingField: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.get(field)?.value;
    const matchingValue = control.get(matchingField)?.value;

    return value === matchingValue ? null : { passwordMismatch: true };
  };
}

export function differentFieldsValidator(
  field: string,
  differentField: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.get(field)?.value;
    const differentValue = control.get(differentField)?.value;

    return value && differentValue && value === differentValue
      ? { passwordSameAsCurrent: true }
      : null;
  };
}
