import { IArticleStepsData } from './../../../shared-data/IArticleStepsData';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-article-section-steps',
  templateUrl: './article-section-steps.component.html',
  styleUrls: ['./article-section-steps.component.scss']
})
export class ArticleSectionStepsComponent implements OnInit {
  @Input() articleStepsData!: IArticleStepsData;

  constructor() { }

  ngOnInit() {
  }

}
