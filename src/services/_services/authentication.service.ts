import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '@services/_models/user';

/**
 * This service is used to login & logout of the app,
 * it notifies other components when the user logs in & out,
 * and allows access the currently logged in user.
 * @export
 * @class AuthenticationService
 */
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    // this.currentUserSubject = new BehaviorSubject<User>(
      // JSON.parse(localStorage.getItem("currentUser"))
    //   JSON.parse(localStorage.getItem("access_token"))
    // );
    // this.currentUser = this.currentUserSubject.asObservable();
  }

  // public get currentUserValue(): User {
  //   return this.currentUserSubject.value;
  // }

  public get isLoggedIn(): boolean {
    return (localStorage.getItem("access_token") !== null);
  }

  isAuthenticated(): boolean {
    return (
      localStorage.getItem("access_token") != null && !this.isTokenExpired()
    );
  }

  isTokenExpired(): boolean {
    return false;
  }

  testGet() {
    return this.http.get<any>(environment.URL_AUTH + "/").pipe(map((data) => {
      console.log(data);
      return data;
    }));
  }
  
  login(email, password) {
    password = window.btoa(password); //to encrypt pass
    localStorage.setItem("jobProfile", '[]');
    return this.http
      .post<any>(environment.URL_AUTH + "/api/auth/login", { email, password })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem("currentUser", user.access_token);
          if ( user && user.access_token) {
            console.log(user);
            localStorage.setItem("access_token", user.access_token);
            // localStorage.setItem("loginType", user.login_type);
            this.isAuthenticated();
            setTimeout(() => {
              this.isTokenExpired();
              this.isAuthenticated();
              this.logout();
            }, user.expires_in * 1000);
            // this.currentUserSubject.next(user);

          }
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem("currentUser");
    // localStorage.setItem('jobProfile', '[]');
    // localStorage.setItem('defJob', '{}');
    // localStorage.setItem('usr', '{}');
    localStorage.removeItem('defJob');
    localStorage.removeItem('usr');
    localStorage.removeItem('jobProfile');
    // localStorage.setItem('cin_token', 'false');
    localStorage.removeItem("access_token");
    // this.currentUserSubject.next(null);
  }
}
