import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoTextComponent } from './photo-text.component';

describe('PhotoTextComponent', () => {
  let component: PhotoTextComponent;
  let fixture: ComponentFixture<PhotoTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
