import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSectionTextComponent } from './article-section-text.component';

describe('ArticleSectionTextComponent', () => {
  let component: ArticleSectionTextComponent;
  let fixture: ComponentFixture<ArticleSectionTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleSectionTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSectionTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
