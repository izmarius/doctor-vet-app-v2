import {Component, OnInit} from '@angular/core';
import {AuthStateChangeService} from "./services/auth/auth-state-change.service";
import {Router} from "@angular/router";
import {USER_LOCALSTORAGE} from "./shared-data/Constants";
import {LoaderService} from "./services/loader/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'doctor-vet-appv2';
  loader$ = this.loaderService.loaderObs$;

  constructor(private authStateChange: AuthStateChangeService,
              private router: Router,
              private loaderService: LoaderService ) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem(USER_LOCALSTORAGE)) {
      this.router.navigate(['']);
    }
  }
}
