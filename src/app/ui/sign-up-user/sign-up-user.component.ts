import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AUTH_SIGNUP_FORM_TEXT, INPUT_LABELS_TXT, INPUT_REGEX_TEXTS} from "../../shared-data/Constants";
import {SignUpService} from "../../services/signup/sign-up.service";

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.scss']
})
export class SignUpUserComponent implements OnInit {
  userFormGroup!: FormGroup;
  userFormText: any;
  errorMessage = '';
  isErrorDisplayed = false;

  constructor(private signUpService: SignUpService) {
  }

  ngOnInit(): void {
    this.userFormText = AUTH_SIGNUP_FORM_TEXT;
    this.userFormText.labels = INPUT_LABELS_TXT;
    this.initForm();
  }

  initForm() {
    this.userFormGroup = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  onSubmitCreateUser(): void {
    if (this.userFormGroup.invalid) {
      this.isErrorDisplayed = true;
      this.errorMessage = this.userFormText.formErrorMessage;
      return;
    }

    const userPayload = {
      name: this.userFormGroup.controls.name.value,
      email: this.userFormGroup.controls.email.value,
      password: this.userFormGroup.controls.password.value,
      phone: this.userFormGroup.controls.phone.value,
      appointmentsMap: {}
    }

    this.errorMessage = '';
    this.isErrorDisplayed = false;

    this.signUpService.signUpNewUser(userPayload);
  }
}
