import { Component, OnInit } from '@angular/core';
import {HEADER_TEXT} from "../../../shared-data/Constants";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerText: any;

  constructor() { }

  ngOnInit() {
    // todo : do it as ain input when creating the component library
    this.headerText = HEADER_TEXT;
  }

}
