import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor() { }

  headerContent = {
    title: 'Te asteptam in locul unde prietenii tai cei mai buni raman sanatosi. O singura aplicatie pentru datele animalului tau - DoctorVett.',
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
