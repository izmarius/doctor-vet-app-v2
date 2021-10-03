import {Component, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {UiErrorInterceptorService} from "./services/ui-error-interceptor.service";

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar,
              private uiInterceptor: UiErrorInterceptorService) {
  }

  ngOnInit(): void {
    this.uiInterceptor.uiError.subscribe((alert) => {
      if (alert?.message) {
        this.openSnackBar(alert.message, alert.class);
      }
    });
  }

  openSnackBar(errorMessage: string, styleClass: string): void {
    this.snackBar.open(errorMessage, '', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: styleClass
    });
  }
}
