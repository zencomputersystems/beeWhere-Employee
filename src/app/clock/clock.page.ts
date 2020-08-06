import { ActivatedRoute } from '@angular/router';
import { GlobalFnService } from 'src/services/global-fn.service';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.page.html',
  styleUrls: ['./clock.page.scss'],
})
export class ClockPage implements OnInit {

  /**
   * Retrieve sample data from sampledata.json
   * @memberof ClockPage
   */
  public data = require("../sampledata.json");

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
  constructor(public coutGeolocation: Geolocation, public coutGlobalFn: GlobalFnService, public activatedRoute: ActivatedRoute) { }

  /**
   * Initialize this page methods and properties
   * @memberof ClockPage
   */
  ngOnInit() {
    this.coutGeolocation.getCurrentPosition().then((loc) => {
      this.currLocation.lat = loc.coords.latitude;
      this.currLocation.long = loc.coords.longitude;
    });
    console.log(this.data.userInfo.clockIn.historicalClockIn);
    // console.log(this.data.userInfo.clockIn.historicalClockIn.slice(-1));
    // const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    this.activatedRoute.paramMap.subscribe(item => {
      this.pageState = item;
    });
    // console.log(this.pageState.params.time);
    // console.log(new Date(this.pageState.params.time).setHours(0, 0, 0, 0));
    // console.log(this.pageState);
    this.checkState(this.pageState);
  }

  checkState(state) {
    return (state.params.id === 'edit') ? this.editMode() : this.clockOutMode();
  }

  editMode() {
    console.log('editmode');
    this.data.userInfo.clockIn.historicalClockIn.filter(item => {
      if (new Date(item.clockInDate).setHours(0, 0, 0, 0) === new Date(this.pageState.params.time).setHours(0, 0, 0, 0)) {
        this.currData = item.list.filter(itemList => {
          if (itemList.clockInTime === this.pageState.params.time) {
            // console.log(itemList);
            return itemList;
          }
        });
      }
    });
    console.log(this.currData);
  }

  clockOutMode() {
    console.log('clockOutMode');
    console.log(this.data.userInfo.clockIn.historicalClockIn.slice(-1));
    this.data.userInfo.clockIn.historicalClockIn.slice(-1).filter( item => {
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

  updateActivityList() {
    // const tempArr = this.data.userInfo.clockIn.historicalClockIn.slice(-1);
    if (this.pageState.params.id === 'out') {
      Object.assign(this.currData, {
      // Object.assign(tempArr[0].list.slice(-1)[0], {
        clockOutLocation: this.currLocation.lat + ", " + this.currLocation.long,
        clockOutTime: this.coutTime
      });
      this.data.userInfo.clockIn.status = false;
    }
    // else {
    //   // this.data.userInfo.clockIn.status = true;
    // }
    console.log(this.currData);
  }

}
