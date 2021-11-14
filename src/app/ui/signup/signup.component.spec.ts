import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupComponent} from './signup.component';
import {SignUpService} from "../../services/signup/sign-up.service";
import {LocationService} from "../../services/location-service/location.service";
import {LoaderService} from "../../services/loader/loader.service";

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let element: any;

  class SignUpServiceMock {
  }

  class LocationServiceMock {
  }

  class LoaderServiceMock {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        {provide: SignUpService, useClass: SignUpServiceMock},
        {provide: LocationService, useClass: LocationServiceMock},
        {provide: LoaderService, useClass: LoaderServiceMock},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement
    fixture.detectChanges();
  });

  // const setupSignUpTest = () => {
  //   // create spies for services
  //   const signUpServiceSpy = jasmine.createSpyObj('SignUpService', ['signUpDoctor']);
  //   const locationServiceSpy = jasmine.createSpyObj('LocationService', ['getCitiesByCountyCode']);
  //   const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
  //   // mock data
  //   // signUpServiceSpy.signUpDoctor.and.returnValue({});
  //
  //   // return value needed to be injected
  //   return {signUpServiceSpy, locationServiceSpy, loaderServiceSpy};
  // }

  const setSignUpForm = () => {
    component.locality = 'Cluj-Napoca';
    component.selectedCounty = 'Cluj';
    component.authFormGroup.controls.email.setValue('pausan@gmail.com');
    component.authFormGroup.controls.password.setValue('password');
    component.authFormGroup.controls.phoneNumber.setValue('0743922666');
    component.authFormGroup.controls.name.setValue('Pausan Ionut');
    component.authFormGroup.controls.address.setValue('Str Criseni, nr 213');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form is valid', () => {
    it('should go to the second step of the form', () => {
      // setSignUpForm();
      // expect(element.getElementsByClassName('.services-container')).toBeFalsy();
      // expect(component.isAllowedToGoToThirdStep).toBeFalse();
      // component.clickFirstStepOnFormSubmit();
      // expect(element.getElementsByClassName('service-checkbox')).toBeTruthy();
      // expect(component.isAllowedToGoToThirdStep).toBeTrue();
    });
  });
});
