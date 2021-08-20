import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSectionStepsComponent } from './article-section-steps.component';

describe('ArticleSectionStepsComponent', () => {
  let component: ArticleSectionStepsComponent;
  let fixture: ComponentFixture<ArticleSectionStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleSectionStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSectionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
