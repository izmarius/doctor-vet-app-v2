import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOfDoctorPageComponent } from './users-of-doctor-page.component';

describe('UsersOfDoctorPageComponent', () => {
  let component: UsersOfDoctorPageComponent;
  let fixture: ComponentFixture<UsersOfDoctorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersOfDoctorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersOfDoctorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
