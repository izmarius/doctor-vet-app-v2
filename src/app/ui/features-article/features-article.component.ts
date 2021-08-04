import { HOMEPAGE_ARTICLE_DATA, HOMEPAGE_ARTICLE_STEPS_DATA } from './../../shared-data/Constants';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-features-article',
  templateUrl: './features-article.component.html',
  styleUrls: ['./features-article.component.scss']
})
export class FeaturesArticleComponent implements OnInit {
  articleSectionTextData: any;
  articleStepsData: any;

  constructor() { }

  ngOnInit() {
    this.articleSectionTextData = HOMEPAGE_ARTICLE_DATA;
    this.articleStepsData = HOMEPAGE_ARTICLE_STEPS_DATA;
  }

}
