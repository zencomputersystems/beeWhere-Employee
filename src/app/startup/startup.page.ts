import { AuthenticationService } from '@services/_services/authentication.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-startup",
  templateUrl: "./startup.page.html",
  styleUrls: ["./startup.page.scss"],
})
export class StartupPage implements OnInit {
  constructor(private stAuthenticationService: AuthenticationService) {}

  ngOnInit() {
    // console.log(this.stAuthenticationService.currentUserValue);
  }
}
