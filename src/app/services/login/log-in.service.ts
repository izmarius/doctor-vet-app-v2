import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../../ui/login-dialog/login-dialog.component';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  logIn(email: string, password: string, dialogRef: MatDialogRef<LoginDialogComponent>): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        if (!userCredentials?.user?.emailVerified) {
          this.signOut();
          return;
        }
        dialogRef.close(true);
        // success message
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return !(user === null || !user.emailVerified);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['']);
      });
  }
}
