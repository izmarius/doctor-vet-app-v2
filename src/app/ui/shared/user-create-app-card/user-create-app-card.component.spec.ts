import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAppCardComponent } from './user-create-app-card.component';

describe('UserCreateAppCardComponent', () => {
  let component: UserCreateAppCardComponent;
  let fixture: ComponentFixture<UserCreateAppCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreateAppCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateAppCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
