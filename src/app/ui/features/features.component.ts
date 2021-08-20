import { Component, OnInit } from '@angular/core';
import {HOMEPAGE_CARD_TEXT} from "../../shared-data/Constants";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  cardText: any;

  constructor() { }
  // todo delete component and use card text component insetead - duplicate
  ngOnInit() {
    this.cardText = HOMEPAGE_CARD_TEXT;
  }
}
