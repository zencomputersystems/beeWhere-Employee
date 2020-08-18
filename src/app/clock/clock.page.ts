import { APIService } from '@services/_services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFnService } from '@services/global-fn.service';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: "app-clock",
  templateUrl: "./clock.page.html",
  styleUrls: ["./clock.page.scss"],
})
export class ClockPage implements OnInit {
  /**
   * Retrieve sample data from sampledata.json
   * @memberof ClockPage
   */
  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

  /**
   * Get and bind clocked out time in ISO format
   * @memberof ClockPage
   */
  public coutTime = new Date().toISOString();

  /**
   * Bind data of location (latitude, longitude)
   * @memberof ClockPage
   */
  public currLocation = { lat: null, long: null };

  /**
   * Bind value of new task/activity to be added
   * @memberof ClockPage
   */
  public coutNewActivity;

  public pageState;

  public currData;
  constructor(
    public coutGeolocation: Geolocation,
    public coutGlobalFn: GlobalFnService,
    public activatedRoute: ActivatedRoute,
    private clApi: APIService,
    private clRouter: Router
  ) {}

  /**
   * Initialize this page methods and properties
   * @memberof ClockPage
   */
  ngOnInit() {
    this.coutGeolocation.getCurrentPosition().then((loc) => {
      this.currLocation.lat = loc.coords.latitude;
      this.currLocation.long = loc.coords.longitude;
    });
    // console.log(this.data.userInfo.clockIn.historicalClockIn);
    // console.log(this.data.userInfo.clockIn.historicalClockIn.slice(-1));
    // const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    this.activatedRoute.paramMap.subscribe((item) => {
      console.log(item);
      this.pageState = item;
    });
    // console.log(this.pageState.params.time);
    // console.log(new Date(this.pageState.params.time).setHours(0, 0, 0, 0));
    // console.log(this.pageState);
    this.checkState(this.pageState);
  }

  checkState(state) {
    return state.params.id === "edit"
      ? this.editMode(state.params.clockguid)
      : this.clockOutMode();
  }

  editMode(id) {
    console.log("editmode");
    this.getClocksInfo(id);
    // this.data.userInfo.clockIn.historicalClockIn.filter(item => {
    //   if (new Date(item.clockInDate).setHours(0, 0, 0, 0) === new Date(this.pageState.params.time).setHours(0, 0, 0, 0)) {
    //     this.currData = item.list.filter(itemList => {
    //       if (itemList.clockInTime === this.pageState.params.time) {
    //         // console.log(itemList);
    //         return itemList;
    //       }
    //     });
    //   }
    // });
  }

  clockOutMode() {
    console.log("clockOutMode");
    console.log(this.data.userInfo.clockIn.historicalClockIn.slice(-1));
    this.data.userInfo.clockIn.historicalClockIn.slice(-1).filter((item) => {
      // console.log(item.list.slice(-1));
      this.currData = item.list.slice(-1);
    });
    // this.currData = this.data.userInfo.clockIn.historicalClockIn.slice(-1)[0].list;
    // this.data.userInfo.clockIn.historicalClockIn.filter(item => {
    //   if (new Date(item.clockInDate).setHours(0, 0, 0, 0) === new Date(this.pageState.params.time).setHours(0, 0, 0, 0)) {
    //     this.currData = item.list.filter(itemList => {
    //       if (itemList.clockInTime === this.pageState.params.time) {
    //         // console.log(itemList);
    //         return itemList;
    //       }
    //     });
    //   }
    // });
    console.log(this.currData);
  }

  getClocksInfo(clockGuid) {
    console.log("getClocksInfo");
    console.log(clockGuid);
    this.clApi.getWithHeader("/api/clock/" + clockGuid).subscribe(
      (clkRes) => {
        console.log(clkRes);
        // console.log(this.globalData);
        this.currData = clkRes;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateActivityList() {
    // const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    if (this.pageState.params.id === "out") {
      Object.assign(this.currData, {
        // Object.assign(tempArr[0].list.slice(-1)[0], {
        clockOutLocation: this.currLocation.lat + ", " + this.currLocation.long,
        clockOutTime: this.coutTime,
      });
      this.data.userInfo.clockIn.status = false;
    } else {
      console.log(this.currData);
      // update activity based on clock guid
      var tempUpdArray = {
        clockLogGuid: this.currData.CLOCK_LOG_GUID,
        activity: [
          //this.currData.ACTIVITY
          {
            name: "Update system",
            statusFlag: true,
          },
          {
            name: "task 2",
            statusFlag: true,
          },
          {
            name: "task 3",
            statusFlag: false,
          },
        ],
      };

      this.clApi.patchWithHeader("/api/clock/activity", tempUpdArray).subscribe(
        (clkAct) => {
          console.log(clkAct);
          this.clRouter.navigate["/main"];
        },
        (error) => {
          console.log(error);
        }
      );
    }
    // else {
    //   // this.data.userInfo.clockIn.status = true;
    // }
    console.log(this.currData);
  }

}
