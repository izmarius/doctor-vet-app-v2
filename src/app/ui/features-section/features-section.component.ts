import { Component, OnInit } from '@angular/core';
import { HOMEPAGE_SECTION_DATA } from 'src/app/shared-data/Constants';

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent implements OnInit {
  sectionData: any;

  constructor() { }

  ngOnInit() {
    this.sectionData = HOMEPAGE_SECTION_DATA;
  }

}
