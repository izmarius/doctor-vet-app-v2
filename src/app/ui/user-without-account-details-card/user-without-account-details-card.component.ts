import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-user-without-account-details-card',
  templateUrl: './user-without-account-details-card.component.html',
  styleUrls: ['./user-without-account-details-card.component.scss']
})
export class UserWithoutAccountDetailsCardComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserWithoutAccountDetailsCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onCancelForm(bool: boolean) {
    this.dialogRef.close(bool);
  }

}
