import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnimalInfoComponent } from './user-animal-info.component';

describe('UserAnimalInfoComponent', () => {
  let component: UserAnimalInfoComponent;
  let fixture: ComponentFixture<UserAnimalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAnimalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAnimalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
