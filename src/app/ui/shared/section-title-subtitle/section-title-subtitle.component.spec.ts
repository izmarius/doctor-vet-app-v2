import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTitleSubtitleComponent } from './section-title-subtitle.component';

describe('SectionTitleSubtitleComponent', () => {
  let component: SectionTitleSubtitleComponent;
  let fixture: ComponentFixture<SectionTitleSubtitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionTitleSubtitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTitleSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
