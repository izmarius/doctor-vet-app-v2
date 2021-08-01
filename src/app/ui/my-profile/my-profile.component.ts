import {Component, OnInit} from '@angular/core';
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import IPhotoTitle from "./photo-text/photo-text.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DoctorService} from "../../services/doctor/doctor.service";
import {INPUT_LABELS_TXT, INPUT_REGEX_TEXTS, MY_PROFILE, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DOCTOR_SERVICES} from "../../shared-data/DoctorServicesConstants";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  profileHeaderData!: IPhotoTitle;
  userData!: DoctorDTO;
  userForm!: FormGroup;
  userDataText: any;
  formErrorMessage = '';
  formSuccessMessage = '';
  isFormValid = false;
  servicesUI: any;

  constructor(private doctorService: DoctorService) {
  }

  ngOnInit(): void {
    this.userDataText = MY_PROFILE;
    this.userDataText.labels = INPUT_LABELS_TXT;
    this.userData = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.setProfileData();
    this.initEditUserForm();
    this.setDoctorServices();
  }

  setDoctorServices(): void {
    this.servicesUI = DOCTOR_SERVICES;
    const userServiceCategories = Object.keys(<any>this.userData.services);
    // @ts-ignore
    let servicesCategories = Object.keys(<any>this.servicesUI);

    for (let k = 0; k < servicesCategories.length; k++) {

      for (let i = 0; i < userServiceCategories.length; i++) {
        // @ts-ignore
        if (this.servicesUI[servicesCategories[k]].serviceName === userServiceCategories[i]) {
          // @ts-ignore
          this.servicesUI[servicesCategories[k]].services.forEach((service) => {
            // @ts-ignore
            this.userData.services[userServiceCategories[i]].forEach((userService: string) => {
              if (service[0] === userService) {
                service[1] = true;
              }
            });
          });
        }
      }
    }
  }


  addOrRemoveServices(serviceDesc: string, serviceKey: string): void {
    // @ts-ignore
    let services = this.userData.services[serviceKey];
    debugger;
    if (!services) {
      services = [serviceDesc];
    } else {
      if (services.indexOf(serviceDesc) !== -1) {
        services.splice(services.indexOf(serviceDesc), 1);
      } else {
        services.push(serviceDesc);
      }
    }
  }

  initEditUserForm(): void {
    const emailPattern = INPUT_REGEX_TEXTS.email;
    const phonePattern = INPUT_REGEX_TEXTS.phoneNumber;

    this.userForm = new FormGroup({
      email: new FormControl(this.userData.email, [Validators.required, Validators.pattern(emailPattern)]),
      doctorName: new FormControl(this.userData.doctorName, Validators.required),
      location: new FormControl(this.userData.location, Validators.required),
      phoneNumber: new FormControl(this.userData.phoneNumber, [Validators.required, Validators.pattern(phonePattern)]),
      services: new FormControl([], Validators.required),
    });
  }

  getFormControlLabelName(field: string): string {
    const labels = {
      email: this.userDataText.emailLabel,
      phoneNumber: this.userDataText.phoneLabel,
      doctorName: this.userDataText.doctorNameLabel,
      location: this.userDataText.locationLabel
    };
    // @ts-ignore
    return labels[field];
  }

  getUserData(): DoctorDTO {
    return {
      id: this.userData.id,
      email: this.userForm.controls.email.value,
      phoneNumber: this.userForm.controls.phoneNumber.value,
      doctorName: this.userForm.controls.doctorName.value,
      location: this.userForm.controls.location.value,
    };
  }

  isDataChanged(): boolean {
    const formData = this.getUserData();
    if (this.userForm.invalid) {
      return true;
    }
    return this.userData.doctorName === formData.doctorName && this.userData.email === formData.email &&
      this.userData.phoneNumber === formData.phoneNumber && this.userData.location === formData.location;
  }

  onFormSubmit(): void {
    if (this.userForm.invalid) {
      for (const field in this.userForm.controls) {
        if (this.userForm.controls[field].status === 'INVALID') {
          this.formErrorMessage = MY_PROFILE.errorMessage[0] + ' "' + this.getFormControlLabelName(field) + '" ' + ' ' + MY_PROFILE.errorMessage[1];
          //todo use user form valid/invalid property?
          this.isFormValid = true;
          return;
        }
      }
    }
    this.doctorService.updateDoctorInfo(this.getUserData(), <string>this.userData.id).then(() => {
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.getUserData()));
      this.formSuccessMessage = MY_PROFILE.formSuccessMessage;
      this.isFormValid = false;
      this.profileHeaderData.title = this.userData.doctorName;
      setTimeout(() => {
        this.isFormValid = true;
      }, 5000);
    }).catch((err) => {
      console.log(err);
    });
  }

  setProfileData(): void {
    this.profileHeaderData = {};
    this.profileHeaderData.photo = '';
    this.profileHeaderData.title = this.userData.doctorName;
    this.profileHeaderData.style = {
      'margin-bottom': '2rem',
      display: 'flex',
    };
  }
}
