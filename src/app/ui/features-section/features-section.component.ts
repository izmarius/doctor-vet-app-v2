import { Component, OnInit } from '@angular/core';
import {HOMEPAGE_CARD_TEXT, HOMEPAGE_SECTION_DATA} from "../../shared-data/Constants";

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent implements OnInit {

  sectionData: any;
  cardTextList: any;

  constructor() { }

  ngOnInit() {
    this.sectionData = HOMEPAGE_SECTION_DATA;
    this.cardTextList = HOMEPAGE_CARD_TEXT;
  }

}
