import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up-choice',
  templateUrl: './sign-up-choice.component.html',
  styleUrls: ['./sign-up-choice.component.scss']
})
export class SignUpChoiceComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  redirectTo(isDoctor: boolean) {
    if (isDoctor) {
      this.router.navigate(['signup-doctor'])
    } else {
      this.router.navigate(['signup-user'])
    }
  }
}
