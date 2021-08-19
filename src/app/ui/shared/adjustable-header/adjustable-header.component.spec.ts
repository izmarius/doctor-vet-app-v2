import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustableHeaderComponent } from './adjustable-header.component';

describe('AdjustableHeaderComponent', () => {
  let component: AdjustableHeaderComponent;
  let fixture: ComponentFixture<AdjustableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustableHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
