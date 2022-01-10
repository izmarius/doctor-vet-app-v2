import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() sidebarContent: ISidebar[] = [];
  @Input() isListBullet: boolean = false;
  @Output() clickOnList: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  setAndGetUserDetails(link: any) {
    this.clickOnList.emit(link.target.id);
  }

}

interface ISidebar {
  title: string,
  list: IListLinks[]
}

interface IListLinks {
  name: string,
  id: string
}
