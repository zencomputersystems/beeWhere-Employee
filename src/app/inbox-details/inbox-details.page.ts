import { GlobalFnService } from '@services/global-fn.service';
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

  /**
   * Bind form data for uploaded files
   * @private
   * @memberof InboxDetailsPage
   */
  private replyFormData = new FormData();

  /**
   * Bind uploaded data file
   * @memberof InboxDetailsPage
   */
  public choosenFile = "";

  public uploadedFile;

  /**
   * Creates an instance of InboxDetailsPage.
   * @memberof InboxDetailsPage
   */
  constructor(private ibApi: APIService, private ibGlobalFn: GlobalFnService) {}

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
    this.replyFormData = new FormData();
    this.choosenFile = "";
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
    // console.log(selected);
    selected.isExpandView = !selected.isExpandView;
    // if (selected.CHOOSEN_FILE_DATA !== undefined) {
      // document
      //   .getElementById("imgupload")
      //   .setAttribute("src", selected.CHOOSEN_FILE_DATA.link);
    // }
  }

  /**
   * Will be executed once notification element is expanded
   * To get support conversation list based on support guid
   * @param {*} data
   * @memberof InboxDetailsPage
   */
  openMessager(data) {
    // console.log(data);
    console.log(data);
    this.ibApi.getWithHeader("/support/" + data.SUPPORT_GUID).subscribe(
      (res) => {
        res.forEach((element) => {
          // console.log(res);
          element.ATTACHMENT = element.ATTACHMENT.split(",");
        });
        res.sort(
          (a, b) =>
            new Date(a.CREATION_TS).getTime() -
            new Date(b.CREATION_TS).getTime()
        );
        // console.log(res.sort((a, b) => a.CREATION_TS - b.CREATION_TS));
        Object.assign(data, {
          MESSAGES: res,
          REPLY_TEXT: "",
          CHOOSEN_FILE_DATA: null,
          CHOOSEN_FILE: ""
        });
        console.log(data);
        
        // document
        //   .getElementById("youriframeid")
        //   .contentWindow.location.reload(true);

      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Will be executed when user click on hyperlink file in notifications card
   * @param {*} attachmentData
   * @returns
   * @memberof InboxDetailsPage
   */
  downloadAttachment(attachmentData) {
    return window.open(
      "https://zencloudservicesstore.blob.core.windows.net/cloudservices/eleave/" +
        attachmentData
    );
  }

  /**
   * Will be executed when user click on send arrow
   * To reply message to admin to get clearification
   * @param {*} data
   * @memberof InboxDetailsPage
   */
  onSubmitReply(data) {
    // console.log(this.replyFormData);
    // this.ibApi.postUpload("/api/azure/upload", this.replyFormData).subscribe((res) => {
    //   console.log(res);
      
    console.log(data);
    // });

    this.ibApi
      .postWithHeader("/support/clarification", {
        supportId: data.SUPPORT_GUID,
        userId: data.USER_GUID,
        doc:
          data.CHOOSEN_FILE_DATA !== undefined &&
          data.CHOOSEN_FILE_DATA !== null
            ? data.CHOOSEN_FILE_DATA.filename
            : "",
        message: data.REPLY_TEXT,
      })
      .subscribe(
        (res) => {
          console.log(res[0]);
          data.REPLY_TEXT = "";
          this.openMessager(data);

          this.ibGlobalFn.showToast("Message send", "success");
        },
        (error) => {
          console.error(error);
          this.ibGlobalFn.showToast(error.error, "error");
        }
      );
  }

  /**
   * Referesh the pages and reset all
   * @param {*} event
   * @memberof InboxDetailsPage
   */
  async refreshInboxPage(event) {
    await this.initGetDataList();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    // this.refresherRef.complete();
  }

  /**
   * Upload image into azure
   * @param {*} evt
   * @memberof InboxDetailsPage
   */
  uploadFile(evt, data?) {
    console.log(evt);
    const file = (event as any).target.files[0];
    this.choosenFile = file.name;
    console.log(file);
    this.replyFormData.append("file", file, file.name);
    // (document.getElementById(
    //   "imgupload"
    // ) as any).src = window.URL.createObjectURL(file);
    Object.assign(data, {
      EVENT_ATTACHFILE: this.replyFormData,
      CHOOSEN_FILE: file.name,
    });
    console.log(data);

    this.ibApi
      .postUpload("/api/azure/upload", data.EVENT_ATTACHFILE)
      .subscribe((res) => {
        console.log(res);
        Object.assign(data, {
          CHOOSEN_FILE_DATA: res,
        });
        document
          .getElementById("imgupload")
          .setAttribute("src", data.CHOOSEN_FILE_DATA.link);
        this.replyFormData = new FormData();
      });
  }
}
