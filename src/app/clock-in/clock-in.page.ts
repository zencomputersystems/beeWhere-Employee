import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalFnService } from '@services/global-fn.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import { GlobalApiService } from '@services/global-api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/_services/authentication.service';
import { User } from '@services/_models/user';

/**
 * Clockin component
 * @export
 * @class ClockInPage
 * @implements {OnInit}
 */
@Component({
  selector: "app-clock-in",
  templateUrl: "./clock-in.page.html",
  styleUrls: ["./clock-in.page.scss"],
})
export class ClockInPage implements OnInit {
  
  /**
   * Get value of current time in ISO format
   * @memberof ClockInPage
   */
  public currTime: any = new Date().toISOString();

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

  /**
   * Bind data of locations (latitude & longitude) that being updated every few minutes
   * @memberof ClockInPage
   */
  public locWatch = {
    lat: null,
    long: null,
  };
  public respo: any;

  /**
   * To bind id of selected client
   * @memberof ClockInPage
   */
  public selectedClient;

  /**
   * Set value of empty client
   * @memberof ClockInPage
   */
  public clientNone = {
    clientCode: null,
    clientId: "none",
    clientLocation: [],
    clientName: null,
    contract: [],
    project: [],
  };

  /**
   * To bind id of selected project
   * @memberof ClockInPage
   */
  public selectedProject;

  /**
   * Set value of empty project/contract
   * @memberof ClockInPage
   */
  public projectContractNone = {
    code: null,
    description: null,
    id: "none",
    name: null,
  };

  /**
   * To bind id of selected contract
   * @memberof ClockInPage
   */
  public selectedContract;

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


  public clocksForm: FormGroup;

  public currentUser: User;

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
    public cinService: GlobalApiService,
    public clkFormBuilder: FormBuilder,
    private cinRouter: Router,
    private cinAuthenticationService: AuthenticationService
  ) {

    this.cinAuthenticationService.currentUser.subscribe((x) => this.currentUser = x);

    geofence.initialize().then(
      () => console.log("Geofence plugin ready"),
      (err) => console.log(err)
    );

    this.clocksForm = clkFormBuilder.group({
      dateToday: "",
      jobtype: "office",
      inTime: ["", Validators.required],
      inLocationName: "",
      inLocationLat: null,
      inLocationLong: null,
      outTime: ["", Validators.required],
      outLocationName: "",
      outLocationLat: "",
      outLocationLong: "",
      selectedClient: clkFormBuilder.group({
        code: null,
        description: null,
        id: "none",
        name: null
      }),
      selectedProject: clkFormBuilder.group({
        code: null,
        description: null,
        id: "none",
        name: null
      }),
      selectedContract: clkFormBuilder.group({
        code: null,
        description: null,
        id: "none",
        name: null,
      })
    });
  }

  /**
   * To initialize clock-in component
   * @memberof ClockInPage
   */
  ngOnInit() {
    this.data = this.cinGlobalFn.sampleDataList();
    this.selectedClient = this.clientNone;
    this.selectedProject = this.projectContractNone;
    this.selectedContract = this.projectContractNone;
    // console.log("curr time");
    // console.log(this.currTime);
    // console.log(this.data);
    // console.log(this.data.userInfo.attendanceProfile);
    console.log(this.clocksForm);
    this.getLoc();
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

  chg() {
    console.log(this.clocksForm)
  }

  chooseClient(evt) {
    console.log(evt.detail.value)
    this.clocksForm.controls.selectedClient.patchValue({
      code: evt.detail.value.clientCode,
      description: null,
      id: evt.detail.value.clientId,
      name: evt.detail.value.clientName
    });

  }

  chooseOpt(type, evt) {
  
    switch (type) {
      case 'project':
        this.clocksForm.controls.selectedProject.patchValue({
          code: evt.detail.value.code,
          description: evt.detail.value.description,
          id: evt.detail.value.id,
          name: evt.detail.value.name
        });
        break;

      case 'contract':
        this.clocksForm.controls.selectedContract.patchValue({
          code: evt.detail.value.code,
          description: evt.detail.value.description,
          id: evt.detail.value.id,
          name: evt.detail.value.name
        });
        break;

      default: //client by default
        this.clocksForm.controls.selectedClient.patchValue({
          code: evt.detail.value.clientCode,
          description: null,
          id: evt.detail.value.clientId,
          name: evt.detail.value.clientName
        });
        break;
    }

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
        // console.log("resp get current position");
        // console.log(resp.coords.latitude);
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        // console.log(resp.coords.longitude);

        const fence = {
          id: new Date().toISOString(),
          latitude: 2.9270567, // resp.coords.latitude,
          longitude: 101.6511282, // resp.coords.longitude,
          radius: 500,
          transitionType: 3,
          notification: {
            id: 1,
            title: "You cross the line",
            text: "You just arrive to zen",
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
      // this.clocksForm.patchValue({
      //   inLocationLat: data.coords.latitude,
      //   inLocationLong: data.coords.longitude
      // });
      // inLocationLat: this.locWatch.lat,
      //   inLocationLong: this.locWatch.long,
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
    console.log(event);
    console.log(this.newTask);
    console.log(JSON.stringify(this.checkAddNew));
    console.log(this.checkAddNew.length);
    // this.checkAddNew = this.cinGlobalFn.addTask(
    //   event,
    //   this.newTask,
    //   this.checkAddNew
    // );

    if (event.code === "Enter" && this.newTask.length > 0) {
      this.checkAddNew.push({
        id: this.checkAddNew.length,
        status: false,
        activity: this.newTask,
      });
      this.newTask = null;
    }
  }

  getClientList(enableGeofiltering, clientList) {
    console.log(enableGeofiltering);
    if (enableGeofiltering) {
      console.log("getClientList: true");
      console.log(clientList);
    } else {
      console.log("getClientList: false");
      console.log(clientList);
    }
  }
  onKey(evt) {
    console.log('onKey');
    console.log(evt.code);
    console.log(evt.key);
    console.log(evt.keyCode);
    console.log(evt);
    console.log(JSON.stringify(evt.code, null, " "));
    console.log(JSON.stringify(evt.key, null, " "));
    console.log(JSON.stringify(evt.keyCode, null, " "));
    console.log(JSON.stringify(evt, null, " "));
    
  }
  /**
   * To bind data and save clockin
   * @memberof ClockInPage
   */
  saveClockIn(type) {
    const temp: any = new Date(this.currTime).setHours(0, 0, 0, 0);
    const timeNow = new Date().toISOString();
    switch (type) {
      case 'in':
        this.clocksForm.patchValue({
          inLocationName: this.locWatch.lat + ", " + this.locWatch.long,
          inLocationLat: this.locWatch.lat,
          inLocationLong: this.locWatch.long,
          inTime: timeNow
        });
        this.data.userInfo.clockIn.status = true;
        break;

      case 'out':
        this.clocksForm.patchValue({
          outLocationName: this.locWatch.lat + ", " + this.locWatch.long,
          outLocationLat: this.locWatch.lat,
          outLocationLong: this.locWatch.long,
          outTime: timeNow
        });
        this.data.userInfo.clockIn.status = false;
        break;
    }

    const clockinObj = {
      clockInDate: new Date(temp).toISOString(),
      list: [
        {
          activityList: this.checkAddNew,
          clientCode: this.clocksForm.controls.selectedClient.get('code').value, // this.selectedClient.clientCode,
          clockInLocation: this.clocksForm.get('inLocationName').value, // this.locWatch.lat + ", " + this.locWatch.long,
          clockInTime: this.clocksForm.get('inTime').value, // this.currTime,
          clockOutLocation: this.clocksForm.get('outLocationName').value, // null,
          clockOutTime: this.clocksForm.get('outTime').value, // null,
          jobType: this.clocksForm.get('jobtype').value, // this.jobType,
          projectCode: this.clocksForm.controls.selectedProject.get('code').value, // this.selectedProject.code,
          projectDesc: this.clocksForm.controls.selectedProject.get('description').value, // this.selectedProject.description,
          contractCode: this.clocksForm.controls.selectedContract.get('code').value, // this.selectedContract.code,
          contractDesc: this.clocksForm.controls.selectedContract.get('description').value, // this.selectedContract.description,
        },
      ],
    };

    console.log(clockinObj);
    console.log(this.clocksForm);
    // const checkExist: boolean = this.data.userInfo.clockIn.historicalClockIn.filter( list => {
    //   console.log(list)
    //   if (list.clockInDate === clockinObj.clockInDate) {
    //     console.log('list');
    //   //   Object.assign(list, clockinObj); 
    //     return true;
    //   } else {
    //     console.log('list 2');
    //     return false;
        
    //   }
    // });
    // console.log(checkExist)
    // if (checkExist === false) {
    this.data.userInfo.clockIn.historicalClockIn.push(clockinObj);
    if (type === 'out') {
      this.checkAddNew = [];
    }
    // }
    // console.log(this.data.userInfo.clockIn.historicalClockIn);
    // Object.assign(this.data.userInfo.clockIn.historicalClockIn, clockinObj);
  }

  logout() {
    this.cinAuthenticationService.logout();
    this.cinRouter.navigate(['/login']);
  }
}
