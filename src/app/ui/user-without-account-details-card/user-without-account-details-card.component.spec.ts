import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWithoutAccountDetailsCardComponent } from './user-without-account-details-card.component';

describe('UserWithoutAccountDetailsCardComponent', () => {
  let component: UserWithoutAccountDetailsCardComponent;
  let fixture: ComponentFixture<UserWithoutAccountDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWithoutAccountDetailsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWithoutAccountDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
