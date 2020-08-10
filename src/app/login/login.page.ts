import { map, first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@services/_services/authentication.service';

/**
 * Component to construct login page
 * @export
 * @class LoginPage
 * @implements {OnInit}
 */
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  /**
   * Form group for email and password
   * @type {FormGroup}
   * @memberof LoginPage
   */
  public lForm: FormGroup;

  /**
   * Bind value of remember user password and email
   * @memberof LoginPage
   */
  public rememberMe: boolean;

  /**
   * Bind return url or login
   * @memberof LoginPage
   */
  public returnUrl;

  /**
   * Bind error message
   * @type {*}
   * @memberof LoginPage
   */
  error: any;

  /**
   * 
   * @type {boolean}
   * @memberof LoginPage
   */
  loading: boolean = false;

  /**
   *Creates an instance of LoginPage.
   * @param {FormBuilder} lFormBuilder
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {ActivatedRoute} route
   * @memberof LoginPage
   */
  constructor(
    public lFormBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.lForm = lFormBuilder.group({
      email: [window.atob(localStorage.getItem("val1")), Validators.required],
      password: [window.atob(localStorage.getItem("password")), Validators.required],
      showPassword: false,
    });

    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  /**
   * Initialization of this component
   * @memberof LoginPage
   */
  ngOnInit() {
    const tempVal3 = window.atob(localStorage.getItem("val3"));
    this.rememberMe = Boolean(tempVal3);
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"; 
    console.log(this.lForm)
  }

  /**
   * Will be executed when the remember me checkbox is fired
   * If checked, it will store the current remember me status
   * If unchecked, it will be oppose to it
   * @param {*} evt Checkbox event
   * @memberof LoginPage
   */
  onChangeRememberMe(token) {
    this.rememberMe =
      token === "clickedOnLabel" ? !this.rememberMe : this.rememberMe;
  }

  /**
   * Check remember me status
   * If checked, it will store the email, password value
   * If unchecked, it will be oppose to it
   * @param {*} isRemember
   * @memberof LoginPage
   */
  checkRememberMe() {
    localStorage.setItem("val3", window.btoa(this.rememberMe.toString()));
    if (this.rememberMe.toString() === "true") {
      localStorage.setItem("val1", window.btoa(this.lForm.get("email").value));
      localStorage.setItem(
        "val2",
        window.btoa(this.lForm.get("password").value)
      );
    } else {
      localStorage.removeItem("val1");
      localStorage.removeItem("val2");
    }
  }

  /**
   * Will be executed when login page is fired.
   * 1. check remember me logic
   * @memberof LoginPage
   */
  onLogin() {
    this.checkRememberMe();
    // window.btoa(pass);
    this.authenticationService
      .login(this.lForm.get("email").value, this.lForm.get("password").value)
      .pipe(first())
      .subscribe(
        (data) => {
          console.log(data);
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          console.log(error);
          console.log(error.error.message.error);
          console.log(error.error.message.message);
          this.error =
            error.error.message.error + ". " + error.error.message.message;
          this.loading = false;
        }
      );
    // ).subscribe(data => {
    //   console.log(data);
    // });
  }

  /**
   * Will be executed when forgot password label was executed
   * @returns
   * @memberof LoginPage
   */
  onForgotPassword() {
    return (window.location.href =
      environment.URL_FPASS + "/#/forgot-password/user");
  }
}
