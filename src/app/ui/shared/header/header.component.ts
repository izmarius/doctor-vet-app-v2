import { Component, OnInit } from '@angular/core';
import { HEADER_TEXT } from 'src/app/shared-data/Constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headerText: any;

  constructor() { }

  ngOnInit() {
    this.headerText = HEADER_TEXT;
  }

}
