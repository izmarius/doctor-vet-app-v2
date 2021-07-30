import { Component, OnInit } from '@angular/core';
import { HOMEPAGE_CARD_TEXT } from 'src/app/shared-data/Constants';


@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  cardText: any;

  constructor() { }

  ngOnInit() {
    this.cardText = HOMEPAGE_CARD_TEXT;
  }

}
