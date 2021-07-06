import {Component, OnInit} from '@angular/core';
import {AuthStateChangeService} from "./services/auth/auth-state-change.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'doctor-vet-appv2';
  constructor(private authStateChange: AuthStateChangeService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['']);
    }
  }
}
