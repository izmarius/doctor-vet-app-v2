import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section-title-subtitle',
  templateUrl: './section-title-subtitle.component.html',
  styleUrls: ['./section-title-subtitle.component.scss']
})
export class SectionTitleSubtitleComponent implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
