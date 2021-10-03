import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
export default interface IPhotoTitle {
  title?: string;
  subtitle?: string;
  photo?: string;
  style?: any;
}

@Component({
  selector: 'app-photo-text',
  templateUrl: './photo-text.component.html',
  styleUrls: ['./photo-text.component.scss']
})
export class PhotoTextComponent implements OnInit {
  @Input() data!: IPhotoTitle;
  @Output() photoEmitter = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  // todo create cancel upload functionality
  getUploadedPhoto(photo: string): void {
    this.data.photo = photo;
    this.photoEmitter.emit(photo);
  }

}
