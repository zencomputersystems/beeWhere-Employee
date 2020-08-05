import { Component, OnInit } from '@angular/core';
import * as sampledata from '../sampledata.json';

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class MainPage implements OnInit {
  constructor() {}

  /**
   * Get sample data from json
   * @memberof MainPage
   */
  public data = require("../sampledata.json");

  /**
   * Get current datetime
   * @memberof MainPage
   */
  public currDate = new Date().toISOString();

  ngOnInit() {
    console.log(this.currDate);
    console.log(this.data);
    console.log(this.data.userInfo.clockIn.historicalClockIn.length);
    // setInterval(this.currDate, 1000);
  }

  timeRefresh() {
    this.currDate = new Date().toISOString();
    console.log(this.currDate);
    return setInterval(this.currDate, 1000);
  }
}
