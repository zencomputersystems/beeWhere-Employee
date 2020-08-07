import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

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
  public rememberMe = localStorage.getItem("rmbr");

  /**
   * Creates an instance of LoginPage.
   * @param {FormBuilder} lFormBuilder to get methods from FormBuilder
   * @memberof LoginPage
   */
  constructor(public lFormBuilder: FormBuilder) {
    this.lForm = lFormBuilder.group({
      email: [localStorage.getItem("email"), Validators.required],
      password: [localStorage.getItem("password"), Validators.required],
      showPassword: false,
    });
  }

  /**
   * Initialization of this component
   * @memberof LoginPage
   */
  ngOnInit() {
    console.log(this.rememberMe);
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
      (token === "clickedOnLabel") ? !this.rememberMe : this.rememberMe;
  }

  /**
   * Check remember me status
   * If checked, it will store the email, password value
   * If unchecked, it will be oppose to it
   * @param {*} isRemember
   * @memberof LoginPage
   */
  checkRememberMe() {
    localStorage.setItem("rmbr", this.rememberMe.toString());
    if (this.rememberMe.toString() === "true") {
      localStorage.setItem("email", this.lForm.get("email").value);
      localStorage.setItem("password", this.lForm.get("password").value);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  }

  /**
   * Will be executed when login page is fired.
   * 1. check remember me logic
   * @memberof LoginPage
   */
  onLogin() {
    this.checkRememberMe();
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

  s(evt?, m?) {
    console.log("isRemember");
  }
}
