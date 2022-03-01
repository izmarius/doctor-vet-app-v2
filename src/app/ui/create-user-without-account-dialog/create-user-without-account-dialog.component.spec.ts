import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserWithoutAccountDialogComponent } from './create-user-without-account-dialog.component';

describe('CreateUserWithoutAccountDialogComponent', () => {
  let component: CreateUserWithoutAccountDialogComponent;
  let fixture: ComponentFixture<CreateUserWithoutAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserWithoutAccountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserWithoutAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
