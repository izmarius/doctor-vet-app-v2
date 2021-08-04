import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  headerContent = {
    title: 'Share or jump into any project conversation, without the CC/BCC dance sation, without the CC/BCC dance conversation, without the CC/BCC dance sation, without the CC/BCC dance conversation, without the CC/BCC dance sation, without the CC/BCC dance',
    style: this.getHeaderStyle()
  };

  ngOnInit(): void {
  }

  getHeaderStyle(): any {
    return {
      headerContainer: {
        height: '300px',
        background: '#ffdc4d',
      },
      headerContent: {
        height: '180px'
      }
    };
  }

}
