import { Component, OnInit } from '@angular/core';
import {HOMEPAGE_ARTICLE_DATA, HOMEPAGE_ARTICLE_STEPS_DATA} from "../../shared-data/Constants";

@Component({
  selector: 'app-feature-article',
  templateUrl: './feature-articles.component.html',
  styleUrls: ['./feature-articles.component.scss']
})
export class FeatureArticlesComponent implements OnInit {

  articleSectionTextData: any;
  articleStepsData: any;

  constructor() { }

  ngOnInit() {
    this.articleSectionTextData = HOMEPAGE_ARTICLE_DATA;
    this.articleStepsData = HOMEPAGE_ARTICLE_STEPS_DATA;
  }

}
