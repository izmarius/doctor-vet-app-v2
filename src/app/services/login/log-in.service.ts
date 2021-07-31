import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  logIn(email: string, password: string, dialogRef: MatDialogRef<any>): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        dialogRef.close(true);
        this.router.navigate(['/appointments'])
      })
      .catch((error) => {
        console.log('Error', error);
      });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    return !(user === null || !user.emailVerified);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['']);
      });
  }
}
