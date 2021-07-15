import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() cardPlaceholder: any;
  @Input() cardData!: ICardData;
  @Output() cardButtonEmitter: EventEmitter<string | number>;

  constructor() {
    this.cardButtonEmitter = new EventEmitter<string | number>();
  }

  ngOnInit(): void {
  }

  cardButtonIsClicked(): void {
    this.cardButtonEmitter.emit(this.cardData.buttonId);
  }
}

export interface ICardData {
  title: string;
  buttonId: string | number;
  values: string[];
}

