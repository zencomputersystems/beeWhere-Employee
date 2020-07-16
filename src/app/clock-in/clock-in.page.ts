import { Component, OnInit } from '@angular/core';
import { GlobalFnService } from 'src/services/global-fn.service';
// import * as sampleData from 'src/app/sampledata.json';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: "app-clock-in",
  templateUrl: "./clock-in.page.html",
  styleUrls: ["./clock-in.page.scss"],
})
export class ClockInPage implements OnInit {
  public currTime = new Date().toISOString();
  public data;
  public jobType = "office";
  constructor(
    public cinGlobalFn: GlobalFnService,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.data = this.cinGlobalFn.sampleDataList();
    console.log("curr time");
    console.log(this.currTime);
    console.log(this.data);
    console.log(this.data.userInfo.attendanceProfile);
    this.getLoc();
    // const time1:any = new Date(1594633144000);
    // const time2: any = new Date();
    // console.log('time1');
    // console.log(time1);
    // console.log(time2);
    // const difftime = time1 - time2;
    // console.log(difftime);
    // console.log(Math.floor(difftime / 60e3));

    // setInterval(this.test, 1000);
  }

  test() {
    this.currTime = new Date().toISOString();
    // console.log(this.currTime);
  }

  getLoc() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log("resp get current position");
        console.log(resp.coords.latitude);
        console.log(resp.coords.longitude);
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('watchhh');
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
 // data can be a set of coordinates, or an error (if an error occurred).
 // data.coords.latitude
 // data.coords.longitude
    });
  }
}
