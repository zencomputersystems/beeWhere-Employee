import { ActivatedRoute } from '@angular/router';
import { GlobalFnService } from 'src/services/global-fn.service';
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

  /**
   * Bind data of location (latitude, longitude)
   * @memberof ClockOutPage
   */
  public currLocation = { lat: null, long: null };

  /**
   * Bind value of new task/activity to be added
   * @memberof ClockOutPage
   */
  public coutNewActivity;

  public pageState;
  constructor(public coutGeolocation: Geolocation, public coutGlobalFn: GlobalFnService, public _Activatedroute: ActivatedRoute) {}

  /**
   * Initialize this page methods and properties
   * @memberof ClockOutPage
   */
  ngOnInit() {
    this.coutGeolocation.getCurrentPosition().then((loc) => {
      this.currLocation.lat = loc.coords.latitude;
      this.currLocation.long = loc.coords.longitude;
    });
    const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    console.log(tempArr[0].list.slice(-1)[0]);
    this._Activatedroute.paramMap.subscribe(item => {
      this.pageState = item;
    });
    this.checkState(this.pageState);
  }

  checkState(state) {
    console.log(state);
  }


  updateActivityList() {
    const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    Object.assign(tempArr[0].list.slice(-1)[0], { 
      clockOutLocation: this.currLocation.lat + ", " + this.currLocation.long,
      clockOutTime: this.coutTime
    });
    console.log(tempArr[0].list.slice(-1)[0]);
    this.data.userInfo.clockIn.status = false;



  }

}
