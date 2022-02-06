import {Component, OnInit} from '@angular/core';
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import IPhotoTitle from "./photo-text/photo-text.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DoctorService} from "../../services/doctor/doctor.service";
import {
  COUNTIES, COUNTIES_ABBR,
  INPUT_LABELS_TXT,
  INPUT_REGEX_TEXTS,
  MY_PROFILE,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DOCTOR_SERVICES} from "../../shared-data/DoctorServicesConstants";
import {LocationService} from "../../services/location-service/location.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  counties!: string[];
  county!: string;
  countiesAbbr: any;
  localities!: string[];
  locality!: string;
  profileHeaderData!: IPhotoTitle;
  userData!: DoctorDTO;
  userForm!: FormGroup;
  userDataText: any;
  formErrorMessage = '';
  formSuccessMessage = '';
  isFormValid = false;
  servicesUI: any;
  dbDoctorServices: any;
  uploadedPhoto = '';

  constructor(private doctorService: DoctorService,
              private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.countiesAbbr = COUNTIES_ABBR;
    this.userDataText = MY_PROFILE;
    this.userDataText.labels = INPUT_LABELS_TXT;
    this.userData = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    // @ts-ignore
    this.dbDoctorServices = JSON.parse(JSON.stringify(this.userData.services));
    this.setProfileData();
    this.initEditUserForm();
    this.setDoctorServices();
  }

  setCountyAndSetLocalities(county: string): void {
    this.county = county;
    this.locality = '';
    this.locationService.getCitiesByCountyCode(this.countiesAbbr[county])
      .pipe(take(1))
      .subscribe((response: any) => {
        this.localities = response
      }, error => {
        console.log(error);
      });
  }

  setLocality(locality: string): void {
    this.locality = locality;
  }

  setDoctorServices(): void {
    // todo see if we can refactor this - starting from the data structure
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
    if (!services) {
      services = [serviceDesc];
    } else {
      if (services.indexOf(serviceDesc) !== -1) {
        services.splice(services.indexOf(serviceDesc), 1);
      } else {
        services.push(serviceDesc);
      }
    }
    // @ts-ignore
    this.userData.services[serviceKey] = services;
  }

  initEditUserForm(): void {
    this.locality = this.userData.locality;
    this.county = this.userData.county;
    this.userForm = new FormGroup({
      email: new FormControl(this.userData.email, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      doctorName: new FormControl(this.userData.doctorName, Validators.required),
      location: new FormControl(this.userData.location, Validators.required),
      phoneNumber: new FormControl(this.userData.phoneNumber, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)])
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
      photo: this.uploadedPhoto,
      services: this.userData.services,
      county: this.county,
      locality: this.locality,
      appointmentFrequency: this.userData.appointmentFrequency,
      appointmentInterval: this.userData.appointmentInterval,
      schedule: this.userData.schedule,
      unavailableTime: this.userData.unavailableTime
    };
  }

  isServiceChanged(): boolean {
    const dbServicesKeys = Object.keys(this.dbDoctorServices);
    const doctorServicesKeys = Object.keys(<any>this.userData.services);
    if (dbServicesKeys.length !== doctorServicesKeys.length) {
      return true;
    }

    for (let i = 0; i < dbServicesKeys.length; i++) {
      for (let j = 0; j < doctorServicesKeys.length; j++) {
        // @ts-ignore
        if (dbServicesKeys[i] === doctorServicesKeys[j] && this.dbDoctorServices[dbServicesKeys[i]].length !== this.userData.services[doctorServicesKeys[j]].length) {
          return true;
        }
      }
    }
    return false;
  }

  isDataChanged(): boolean {
    const formData = this.getUserData();
    if (this.userForm.invalid) {
      return true;
    }
    // @ts-ignore
    return this.uploadedPhoto.length !== this.userData.photo.length || this.userData.doctorName !== formData.doctorName
      || this.userData.email !== formData.email || this.userData.phoneNumber !== formData.phoneNumber
      || this.userData.locality !== formData.locality || this.userData.county !== formData.county
      || this.userData.location !== formData.location || this.isServiceChanged();
  }

  onEditDoctorFormSubmit(): void {
    if (!this.isDataChanged()) {
      console.log('datele nu s au modificat');
      return;
    } else if (!this.locality) {
      console.log('Trebuie selectata o localitate');
      return;
    }

    for (const field in this.userForm.controls) {
      if (this.userForm.controls[field].status === 'INVALID') {
        this.formErrorMessage = MY_PROFILE.errorMessage[0] + ' "' + this.getFormControlLabelName(field) + '" ' + ' ' + MY_PROFILE.errorMessage[1];
        this.isFormValid = true;
        return;
      }
    }
    this.doctorService.updateDoctorInfo(this.getUserData(), <string>this.userData.id).then(() => {
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.getUserData()));
      this.formSuccessMessage = MY_PROFILE.formSuccessMessage;
      this.isFormValid = false;
      this.profileHeaderData.title = this.userData.doctorName;
      this.profileHeaderData.photo = this.userData.photo;
      setTimeout(() => {
        this.isFormValid = true;
      }, 5000);
    }).catch((err) => {
      console.log(err);
    });
  }

  setDoctorPhoto(photo: string): void {
    this.isFormValid = true;
    this.uploadedPhoto = photo;
  }

  setProfileData(): void {
    this.profileHeaderData = {};
    this.profileHeaderData.photo = this.userData.photo;
    this.profileHeaderData.title = this.userData.doctorName;
    this.profileHeaderData.style = {
      'margin-bottom': '2rem',
      display: 'flex',
    };
  }
}
