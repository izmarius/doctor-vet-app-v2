import {Component, OnInit} from '@angular/core';
import {AuthStateChangeService} from "./services/auth/auth-state-change.service";
import {Router} from "@angular/router";
import {AngularFireFunctions} from "@angular/fire/functions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'doctor-vet-appv2';

  constructor(private authStateChange: AuthStateChangeService,
              private router: Router,
              private functions: AngularFireFunctions) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['']);
    }
    this.testApp();
  }

  testApp(): void {
    const callable = this.functions.httpsCallable('sendSMSNotification');
    const obs = callable({phoneNumber: '+40743922689'});
    obs.subscribe((res: any) => {
      console.log(res);
    });
  }
}
