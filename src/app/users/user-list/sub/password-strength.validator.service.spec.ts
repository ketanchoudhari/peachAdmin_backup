import { TestBed } from '@angular/core/testing';

import { PasswordStrengthValidatorService } from './password-strength.validator';

describe('PasswordStrengthValidatorService', () => {
  let service: PasswordStrengthValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStrengthValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
