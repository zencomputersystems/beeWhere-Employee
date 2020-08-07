import { environment } from 'src/environments/environment.prod';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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
  ngOnInit() {}

  /**
   * Will be executed when the remember me checkbox is fired
   * If checked, it will store the current remember me status
   * If unchecked, it will be oppose to it
   * @param {*} evt Checkbox event
   * @memberof LoginPage
   */
  onChangeRememberMe(evt) {
    return localStorage.setItem('rmbr', evt.detail.checked);
  }

  /**
   * Check remember me status
   * If checked, it will store the email, password value
   * If unchecked, it will be oppose to it
   * @param {*} isRemember
   * @memberof LoginPage
   */
  checkRememberMe(isRemember) {
    console.log(isRemember);
    if (isRemember === "true") {
      console.log(this.lForm);
      localStorage.setItem("email", this.lForm.get("email").value);
      localStorage.setItem("password", this.lForm.get("password").value);
    } else {
      localStorage.setItem("rmbr", isRemember);
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  }

  /**
   * Will be executed when login page is fired
   * @memberof LoginPage
   */
  onLogin() {
    this.checkRememberMe(localStorage.getItem("rmbr"));
  }

  onForgotPassword() { 
    return window.location.href = environment.URL_FPASS + '/#/forgot-password/user';
  }
  
  s() {
    console.log('isRemember');
  }
}
