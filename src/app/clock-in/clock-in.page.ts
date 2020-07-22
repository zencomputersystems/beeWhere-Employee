import { Component, OnInit } from '@angular/core';
import { GlobalFnService } from 'src/services/global-fn.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import { GlobalApiService } from 'src/services/global-api.service';

@Component({
  selector: "app-clock-in",
  templateUrl: "./clock-in.page.html",
  styleUrls: ["./clock-in.page.scss"],
})
export class ClockInPage implements OnInit {
  public currTime = new Date().toISOString();

  /**
   * To bind value from sampledata.json
   * @memberof ClockInPage
   */
  public data;

  /**
   * To bind data of enabled job type
   * @memberof ClockInPage
   */
  public jobType = "office";

  public test1;
  public lat;
  public long;
  public locWatch = {
    lat: null,
    long: null,
  };
  public respo: any;

  /**
   * To bind id of selected client
   * @memberof ClockInPage
   */
  public selectedClient = "none";

  /**
   * To bind id of selected project
   * @memberof ClockInPage
   */
  public selectedProject = "none";

  /**
   * To bind id of selected contract
   * @memberof ClockInPage
   */
  public selectedContract = "none";

  /**
   * To bind new task value
   * @memberof ClockInPage
   */
  public newTask;

  /**
   * To bind the array of created tasks list
   * @memberof ClockInPage
   */
  public checkAddNew = [];

  /**
   * Creates an instance of ClockInPage.
   * @param {GlobalFnService} cinGlobalFn To get the methods from GlobalFnService
   * @param {Geolocation} geolocation To get the methods from geolocation
   * @param {Geofence} geofence To get the methods from geofence
   * @memberof ClockInPage
   */
  constructor(
    public cinGlobalFn: GlobalFnService,
    private geolocation: Geolocation,
    public geofence: Geofence,
    public cinService: GlobalApiService
  ) {
    geofence.initialize().then(
      () => console.log("Geofence plugin ready"),
      (err) => console.log(err)
    );
  }

  /**
   * To initialize clock-in component
   * @memberof ClockInPage
   */
  ngOnInit() {
    this.data = this.cinGlobalFn.sampleDataList();
    console.log("curr time");
    console.log(this.currTime);
    console.log(this.data);
    console.log(this.data.userInfo.attendanceProfile);
    this.getLoc();
    this.getClientList();
    // const time1:any = new Date(1594633144000);
    // const time2: any = new Date();
    // console.log('time1');
    // console.log(time1);
    // console.log(time2);
    // const difftime = time1 - time2;
    // console.log(difftime);
    // console.log(Math.floor(difftime / 60e3));

    // setInterval(this.test, 1000);
  }

  /**
   * Test get current time
   * @memberof ClockInPage
   */
  test() {
    this.currTime = new Date().toISOString();
    // console.log(this.currTime);
  }

  /**
   * To get current location positions (latitude & longitude),
   * watch location positions. and add geofence on specific location based on
   * determined latitude and longitude
   * @memberof ClockInPage
   */
  getLoc() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log("resp get current position");
        console.log(resp.coords.latitude);
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        console.log(resp.coords.longitude);

        const fence = {
          id: new Date().toISOString(),
          latitude: 2.9270567, // resp.coords.latitude,
          longitude: 101.6511282, // resp.coords.longitude,
          radius: 5,
          transitionType: 3,
          notification: {
            id: 1,
            title: "You cross the line",
            text: "You just arrive to the point.",
            openAppOnClick: true,
          },
        };

        this.geofence.addOrUpdate(fence).then(
          () => (this.test1 = "Geofence added"),
          (err) => console.log("Geofence failed to add")
        );

        this.geofence.onTransitionReceived().subscribe((res) => {
          this.respo = res;
        });
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log("watchhh");
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      this.locWatch.lat = data.coords.latitude;
      this.locWatch.long = data.coords.longitude;
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

  /**
   * Event to delete the selected task after delete button is being hit.
   * @param {*} selList selected task
   * @param {*} list task list
   * @memberof ClockInPage
   */
  onDeleteTask(selList, list) {
    this.checkAddNew = this.cinGlobalFn.deleteTask(selList, list);
  }

  /**
   * To append new task list after enter being hit on activity list.
   * The process will proceed once the task's length is more than 0
   * @param {*} event keypress enter event
   * @memberof ClockInPage
   */
  addNewTask(event) {
    this.checkAddNew = this.cinGlobalFn.addTask(
      event,
      this.newTask,
      this.checkAddNew
    );
    this.newTask = null;
  }

  getClientList(enableGeofiltering) {
    console.log("getClientList");
    console.log(enableGeofiltering);
    console.log(this.data);
  }
}
