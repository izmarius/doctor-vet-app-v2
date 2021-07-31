import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() cardData!: ICardData;
  @Output() cardButtonEmitter: EventEmitter<string | number>;
  @Output() cardButtonCancelEmitter: EventEmitter<string | number>;

  constructor() {
    this.cardButtonEmitter = new EventEmitter<string | number>();
    this.cardButtonCancelEmitter = new EventEmitter<string | number>();
  }

  ngOnInit(): void {
  }

  cardButtonIsClicked(): void {
    this.cardButtonEmitter.emit(this.cardData.buttonData.buttonId);
  }

  cardButtonCancelIsClicked(): void {
    this.cardButtonCancelEmitter.emit(this.cardData.buttonData.buttonId);
  }
}

export interface ICardData {
  title: string;
  buttonData: any;
  values: any;
}

