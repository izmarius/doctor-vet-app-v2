import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureArticlesComponent } from './feature-articles.component';

describe('FeatureArticlesComponent', () => {
  let component: FeatureArticlesComponent;
  let fixture: ComponentFixture<FeatureArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureArticlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
