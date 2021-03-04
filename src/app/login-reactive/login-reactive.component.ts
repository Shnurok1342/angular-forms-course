import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {createPasswordStrengthValidator} from '../validators/password-strength.validator';
import {createRequiredFileTypesValidator} from '../validators/required-file-types.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login-reactive.component.html',
  styleUrls: ['./login-reactive.component.css']
})
export class LoginReactiveComponent implements OnInit {
  form = this.fb.group({
    email: ['', {
      validators: [
        Validators.required,
        Validators.email
      ],
      updateOn: 'blur'
    }],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      createPasswordStrengthValidator()
    ]],
    thumbnail: [null, [createRequiredFileTypesValidator(['jpg'])]]
  });

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get thumbnail() {
    return this.form.controls['thumbnail'];
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  }
}
