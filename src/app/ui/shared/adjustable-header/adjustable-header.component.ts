import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-adjustable-header',
  templateUrl: './adjustable-header.component.html',
  styleUrls: ['./adjustable-header.component.scss']
})
export class AdjustableHeaderComponent implements OnInit {
  @Input() headerContent: any;
  @Output() headerButtonClickedEmitter = new EventEmitter<any>();
  isTitle: boolean;
  isSubtitle: boolean;
  isButton: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.headerContent) {
      return;
    }
    if (this.headerContent.title) {
      this.isTitle = true;
    }
    if (this.headerContent.subtitle) {
      this.isSubtitle = true;
    }
    if (this.headerContent.buttonText) {
      this.isButton = true;
    }
  }

}
