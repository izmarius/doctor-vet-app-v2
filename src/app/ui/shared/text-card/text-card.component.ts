import {Component, Input, OnInit} from '@angular/core';
import {ITextCardData} from "../../../shared-data/itext-card-data";

@Component({
  selector: 'app-text-card',
  templateUrl: './text-card.component.html',
  styleUrls: ['./text-card.component.scss']
})
export class TextCardComponent implements OnInit {

  @Input() cardData!: ITextCardData;

  constructor() { }

  ngOnInit() {
  }
}
