// import { Refresher } from '@ionic/angular';
import { APIService } from '@services/_services/api.service';
import { Component, OnInit } from '@angular/core';
import * as sampledata from '../sampledata.json';

export let clickedClocks = {};

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class MainPage implements OnInit {
  constructor(public hApi: APIService) { }

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

  /**
   * Bind value of page for infinite scroll
   * @memberof MainPage
   */
  public initReq = 0;

  public checkNoMoreData = false;
  /**
   * Initialize this component
   * @memberof MainPage
   */
  ngOnInit() {
    console.log(this.currDate);
    // setInterval(this.currDate, 1000);
    this.getHistory();
  }

  /**
   * Send request to API to get history list by chunks
   * @param {*} [event]
   * @memberof MainPage
   */
  getHistory(event?) {
    console.log(this.initReq);
    console.log('get req history');
    this.hApi
      .getWithHeader("/api/clock/history-list/50/" + this.initReq)
      .subscribe(
        (histRes: any) => {
          console.log(histRes);
          histRes.forEach(itemHist => {
            itemHist.CLOCK_IN_TIME = new Date(itemHist.CLOCK_IN_TIME.replace(/-/g, "/"));
            itemHist.CLOCK_OUT_TIME = new Date(itemHist.CLOCK_OUT_TIME.replace(/-/g, "/"));
          });
          histRes.sort((a, b) => new Date(b.CLOCK_IN_TIME).getTime() - new Date(a.CLOCK_IN_TIME).getTime());
          if (this.initReq < 1) {
            this.globalData.histClocks = histRes;
          } else {
            this.globalData.histClocks = [
              ...this.globalData.histClocks,
              ...histRes,
            ];
            this.checkNoMoreData = (histRes.length < 1) ? true : false;
            event.target.complete();
          }
          console.log(this.globalData.histClocks);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  clickedInfo(currData) {
    console.log(currData);
    clickedClocks = currData;
  }

  /**
   * Emitted when the scroll reaches the threshold distance
   * @param {*} event
   * @memberof MainPage
   */
  doInfinite(event) {
    console.log(event);
    this.initReq = this.initReq + 50
    this.getHistory(event);
  }

  async refreshHistoryPage(event) {
    this.globalData.histClocks = [];
    this.initReq = 0;
    // async refreshHistoryPage(event: Refresher) {
    await this.getHistory();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
