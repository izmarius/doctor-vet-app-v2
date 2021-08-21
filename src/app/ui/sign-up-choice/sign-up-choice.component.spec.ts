import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpChoiceComponent } from './sign-up-choice.component';

describe('SignUpChoiceComponent', () => {
  let component: SignUpChoiceComponent;
  let fixture: ComponentFixture<SignUpChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
