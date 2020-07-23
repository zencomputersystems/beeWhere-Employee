import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: "app-clock-out",
  templateUrl: "./clock-out.page.html",
  styleUrls: ["./clock-out.page.scss"],
})
export class ClockOutPage implements OnInit {

  /**
   * Retrieve sample data from sampledata.json
   * @memberof ClockOutPage
   */
  public data = require("../sampledata.json");

  /**
   * Get and bind clocked out time in ISO format
   * @memberof ClockOutPage
   */
  public coutTime = new Date().toISOString();

  public currLocation = { lat: null, long: null };

  constructor(public coutGeolocation: Geolocation) {}

  ngOnInit() {
    // coutGeolocation
    Log.d("myTag", "This is my message");
    this.coutGeolocation.getCurrentPosition().then((loc) => {
      this.currLocation.lat = loc.coords.latitude;
      this.currLocation.long = loc.coords.longitude;
    });
  }

}
