import { APIService } from '@services/_services/api.service';
import { Component, OnInit } from '@angular/core';
import * as sampledata from '../sampledata.json';
import { parseXML, parseJSON } from 'jquery';

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class MainPage implements OnInit {
  constructor( public hApi: APIService ) {}

  /**
   * Get sample data from json
   * @memberof MainPage
   */
  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

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
    this.getHistory();
  }

  timeRefresh() {
    this.currDate = new Date().toISOString();
    console.log(this.currDate);
    return setInterval(this.currDate, 1000);
  }

  getHistory() {
    this.hApi.getWithHeader("/api/clock/history/list").subscribe((histRes) => {
      this.globalData.histClocks = histRes;
      console.log(this.globalData.histClocks);
      console.log(this.globalData.histClocks[1].list[0].ACTIVITY);
    }, (error) => {
      console.log(error);
    });
  }
}
