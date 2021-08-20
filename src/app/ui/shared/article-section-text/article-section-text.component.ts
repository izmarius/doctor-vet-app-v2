import {Component, Input, OnInit} from '@angular/core';
import {IArticleText} from "../../../shared-data/iarticle-text";

@Component({
  selector: 'app-article-section-text',
  templateUrl: './article-section-text.component.html',
  styleUrls: ['./article-section-text.component.scss']
})
export class ArticleSectionTextComponent implements OnInit {
  @Input() articleSectionTextData!: IArticleText;

  constructor() { }

  ngOnInit() {
  }
}
