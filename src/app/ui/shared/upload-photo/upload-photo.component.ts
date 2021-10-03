import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput!: ElementRef<HTMLElement>;
  @Output() fileEmitter: EventEmitter<string> = new EventEmitter<string>();
  isUploaded!: boolean;
  private MAX_FILE_SIZE = 400000;

  constructor() {
  }

  ngOnInit(): void {
  }

  uploadFile(): void {
    this.uploadInput.nativeElement.click();
  }

  readFile(event: any): void {
    const reader = new FileReader();
    // returns the file as base64
    reader.readAsDataURL(event.target.files[0]);
    if (event.target.files[0].size > this.MAX_FILE_SIZE) {
      // todo -set max size of file alert('Image to big - it should be less than 4MB');
      // return;
    }
    reader.onloadend = () => {
      this.isUploaded = true;
      this.fileEmitter.emit(reader.result as string);
      event.target.value = '';
    };
  }
}
