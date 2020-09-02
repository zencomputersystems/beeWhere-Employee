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
  constructor(public hApi: APIService) {}

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
    this.hApi
      .getWithHeader("/api/clock/history/list/10/" + this.initReq)
      .subscribe(
        (histRes: any) => {
          console.log(histRes);
          if (this.initReq < 1) {
            this.globalData.histClocks = histRes;
          } else {
            this.globalData.histClocks = [
              ...this.globalData.histClocks,
              ...histRes,
            ];
            event.target.complete();
          }
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
    this.initReq++;
    this.getHistory(event);
  }

  async refreshHistoryPage(event) {
  // async refreshHistoryPage(event: Refresher) {
    await this.getHistory();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
