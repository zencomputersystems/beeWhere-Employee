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
  }
}
