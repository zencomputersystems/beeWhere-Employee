import { Component, OnInit } from '@angular/core';

/**
 * Component for inbox page
 * @export
 * @class InboxDetailsPage
 * @implements {OnInit}
 */
@Component({
  selector: "app-inbox-details",
  templateUrl: "./inbox-details.page.html",
  styleUrls: ["./inbox-details.page.scss"],
})
export class InboxDetailsPage implements OnInit {
  
  /**
   * Get data from sampledata.json
   * @memberof InboxDetailsPage
   */
  public data = require('../sampledata.json');

  /**
   * Get current time in ISO format
   * @memberof InboxDetailsPage
   */
  public curTime = new Date().toISOString();
  

  /**
   * Bind value for days difference
   * @memberof InboxDetailsPage
   */
  public daysDifference;

  /**
   * Bind value of hours difference
   * @memberof InboxDetailsPage
   */
  public hoursDifference;
  /**
   * Creates an instance of InboxDetailsPage.
   * @memberof InboxDetailsPage
   */
  constructor() {}

  /**
   * Initiate this component
   * @memberof InboxDetailsPage
   */
  ngOnInit() {
  }

  /**
   * To calculate day & hour difference with current tiome
   * @param {*} time Time to be compared with current time
   * @returns
   * @memberof InboxDetailsPage
   */
  dayDiff(time) {
    const currTimestamp = new Date(this.curTime).getTime();
    let difftime = currTimestamp - time;

    this.daysDifference = Math.floor(difftime / 1000 / 60 / 60 / 24);
    difftime -= this.daysDifference * 1000 * 60 * 60 * 24;

    this.hoursDifference = Math.floor(difftime / 1000 / 60 / 60);
    difftime -= this.hoursDifference * 1000 * 60 * 60;

    return this.daysDifference;
  }
}
