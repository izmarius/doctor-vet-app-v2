import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UI_ALERTS_CLASSES, USER_LOCALSTORAGE, USER_STATE} from 'src/app/shared-data/Constants';
import {take} from "rxjs/operators";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {UserService} from "../../ui/user-profile/services/user.service";
import {AuthLoggedInServiceService} from "../auth-logged-in/auth-logged-in";
import {LoaderService} from "../loader/loader.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthStateChangeService {

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private userLoggedInService: AuthLoggedInServiceService,
              private loaderService: LoaderService,
              private routerService: Router) {
    // todo needs to be opened all the time?
    this.afAuth.authState.subscribe((user) => {
      this.loaderService.show();
      if (user) {
        // todo: fix in cloud functions
        // if(!user.emailVerified) {
        //   this.uiAlertInterceptor.setUiError({message: USER_STATE.emailVerified, class: UI_ALERTS_CLASSES.ERROR});
        // }
        this.userService.getUserByEmail(<string>user.email)
          .pipe(take(1))
          .subscribe((userOrDoctor) => {
            if (!userOrDoctor) {
              this.uiAlertInterceptor.setUiError({message: USER_STATE.patientNotFound, class: UI_ALERTS_CLASSES.ERROR});
            }
            const userFromLocalStorage = localStorage.getItem(USER_LOCALSTORAGE);
            if (!userFromLocalStorage && userOrDoctor) {
              this.redirectToPageBasedOnUser(userOrDoctor);
            }
            this.loaderService.hide();
            localStorage.removeItem(USER_LOCALSTORAGE);
            localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(userOrDoctor));
            this.userLoggedInService.setLoggedInUser(JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE)));
          });
      } else if (!user) {
        this.loaderService.hide();
        localStorage.removeItem(USER_LOCALSTORAGE);
      } else {
        this.loaderService.hide();
      }
    });

  }

  redirectToPageBasedOnUser(user: any) {
    if (user && user.doctorName) {
      this.routerService.navigate(['/calendar']);
    } else if (user && !user.doctorName) {
      this.routerService.navigate(['/my-animals']);
    }
  }
}
