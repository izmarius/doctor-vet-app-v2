import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSetterComponent } from './schedule-setter.component';

describe('ScheduleSetterComponent', () => {
  let component: ScheduleSetterComponent;
  let fixture: ComponentFixture<ScheduleSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleSetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
