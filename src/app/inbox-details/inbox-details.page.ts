import { FormGroup, FormBuilder } from '@angular/forms';
// import { Refresher } from '@ionic/angular';
import { APIService } from '@services/_services/api.service';
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
  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");
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
   * Bind inbox data retrieved from api
   * @memberof InboxDetailsPage
   */
  public inboxData;

  /**
   * Bind error message returned from api
   * @memberof InboxDetailsPage
   */
  public errorMsg;

  public clarifyRecord;
  /**
   * Creates an instance of InboxDetailsPage.
   * @memberof InboxDetailsPage
   */
  constructor(private ibApi: APIService, private ibFormBuilder: FormBuilder) {}

  /**
   * Initiate this component
   * @memberof InboxDetailsPage
   */
  ngOnInit() {
    console.log(this.globalData);
    this.initGetDataList();
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

  toISO(time) {
    return new Date(time).toISOString();
  }

  /**
   * to get all support list from api
   * @memberof InboxDetailsPage
   */
  initGetDataList() {
    console.log("initGetDataList from support");
    this.ibApi.getWithHeader("/support").subscribe(
      (res) => {
        Object.entries(res).filter(([key, value]) =>
          key === "request" ? (this.inboxData = value) : null
        );
        this.inboxData.forEach((element) => {
          Object.assign(element, { isExpandView: false });
        });
        console.log(this.inboxData);
        // this.inboxData.forEach((element) => {
        //   if (element.TITLE.includes("rej")) {
        //     element.STATUS = "rejected";
        //   } else if (element.TITLE.includes("cl")) {
        //     element.STATUS = "clearify";
        //   }
        // });
      },
      (error) => {
        console.log(this.errorMsg);
        console.log(this.inboxData);
        console.log(error);
        this.errorMsg = error;
        console.log(this.errorMsg);
      }
    );
  }

  /**
   * Will be executed when user click on expand icon
   * @param {*} selected
   * @memberof InboxDetailsPage
   */
  expendNoti(selected) {
    selected.isExpandView = !selected.isExpandView;
  }

  /**
   * Will be executed once notification element is expanded
   * To get support conversation list based on support guid
   * @param {*} data
   * @memberof InboxDetailsPage
   */
  openMessager(data) {
    // console.log(data);
    this.ibApi.getWithHeader("/support/" + data.SUPPORT_GUID).subscribe(
      (res) => {
        res.forEach(element => {
          console.log(element.ATTACHMENT);
          element.ATTACHMENT = element.ATTACHMENT.split(",");
        });
        Object.assign(data, { MESSAGES: res });
        console.log(data)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  downloadAttachment(attachmentData) {
    console.log(attachmentData);
    return window.open(
      "https://zencloudservicesstore.blob.core.windows.net/cloudservices/eleave/" + attachmentData
    );
  }

  async refreshInboxPage(event) {
    await this.initGetDataList();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    // this.refresherRef.complete();
  }
}
