import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  public inputText!: string;
  public searchResult = [];
  public isSearchResult = false
  @Output() valueEmitter = new EventEmitter();
  @Input() placeholder!: string;
  @Input() autocomplete = false;
  @Input() seriesList!: string[];
  @Input() defaultValue!: any;

  constructor() {
  }

  ngOnInit(): void {
    this.inputText = this.defaultValue;
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.isSearchResult = false;
      this.searchResult = [];
    }, 250);
  }

  fetchSeries(): void {
    if (!this.inputText) {
      this.isSearchResult = false;
      this.searchResult = [];
      return;
    }
    if(!this.seriesList) {
      return;
    }
    // @ts-ignore
    this.searchResult = this.seriesList.filter((series) => {
      return series.toLowerCase().startsWith(this.inputText.toLowerCase());
    });
    if (this.searchResult && this.searchResult.length > 0) {
      this.isSearchResult = true;
    }
  }

  emitSelectedValue(value: string): void {
    this.inputText = value;
    this.isSearchResult = false;
    this.valueEmitter.emit(value);
  }

  openDropdown(): void {
    this.isSearchResult = !this.isSearchResult;
    if (this.searchResult && this.searchResult.length > 0) {
      return;
    }
    // @ts-ignore
    this.searchResult = this.seriesList;
  }

}
