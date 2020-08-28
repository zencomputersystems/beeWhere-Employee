import { GlobalService } from '@services/_providers/global.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalFnService } from '@services/global-fn.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import { GlobalApiService } from '@services/global-api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/_services/authentication.service';
import { APIService } from '@services/_services/api.service';
import { Refresher } from "@ionic/angular";
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

  public globalData = require("@services/_providers/global.json");
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
    name: null,
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
    ABBR: null,
    CLIENT_GUID: "none",
    LOCATION_DATA: [],
    NAME: null,
    CONTRACT_DATA: [],
    PROJECT_DATA: [],
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
    SOC_NO: null,
    DESCRIPTION: null,
    PROJECT_GUID: "none",
    NAME: null,
    CLIENT_GUID: null,
  };

  public projectNone = {
    SOC_NO: null,
    DESCRIPTION: null,
    PROJECT_GUID: "none",
    NAME: null,
    CLIENT_GUID: null,
  };
  public contractNone = {
    CLIENT_GUID: null,
    CONTRACT_NO: null,
    DESCRIPTION: null,
    CONTRACT_GUID: "none",
    NAME: null,
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

  public currentUser = {};

  public setlect;
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
    private cinAuthenticationService: AuthenticationService,
    private cinApi: APIService,
    public cinGlobal: GlobalService
  ) {
    // this.cinAuthenticationService.currentUser.subscribe((x) => this.currentUser = x);
    geofence.initialize().then(
      () => console.log("Geofence plugin ready"),
      (err) => console.log(err)
    );

    this.clocksForm = clkFormBuilder.group({
      dateToday: "",
      jobtype: "office",
      inTime: ["", Validators.required],
      outTime: ["", Validators.required],
    });
  }

  /**
   * To initialize clock-in component
   * @memberof ClockInPage
   */
  ngOnInit() {
    // console.log(this.cinGlobal.userInfo);
    this.data = this.cinGlobalFn.sampleDataList();
    this.selectedClient = this.clientNone;
    this.selectedProject = this.projectNone;
    this.selectedContract = this.contractNone;
    this.getLoc();
    // setInterval(this.test, 1000);
    this.getBasicInfo();
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
    console.log(this.setlect);
    console.log(this.selectedClient);
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
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;

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
      this.cinApi
        .getWithHeader(
          "/api/location/search/coordinate/" +
            data.coords.latitude +
            "%2C" +
            data.coords.longitude
        )
        .subscribe(
          (res) => {
            this.locWatch.lat = data.coords.latitude;
            this.locWatch.long = data.coords.longitude;
            this.locWatch.name = (res as any).results[0].formatted_address;
            console.log(data.coords.latitude);
            console.log(data.coords.longitude);
            console.log((res as any).results[0].formatted_address);
          },
          (error) => {
            console.log(error);
          }
        );
      // this.clocksForm.patchValue({
      // });
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
  onDeleteTask(selList, list, i) {
    this.checkAddNew = this.cinGlobalFn.deleteTask(selList, list, i);
  }

  /**
   * To append new task list after enter being hit on activity list.
   * The process will proceed once the task's length is more than 0
   * @param {*} event keypress enter event
   * @memberof ClockInPage
   */
  addNewTask(event) {
    console.log(this.newTask);
    if (event.code === "Enter" && this.newTask !== null) {
      this.checkAddNew.push({
        // id: this.checkAddNew.length,
        statusFlag: false,
        name: this.newTask,
      });
      this.newTask = null;
    }
  }

  getClientList(enableGeofiltering) {
    console.log("locWatch");
    console.log(this.locWatch);

    console.log(enableGeofiltering);
    this.globalData.clients = [];
    if (enableGeofiltering) {
      if (this.locWatch.lat !== null && this.locWatch.long !== null) {
        // else use https://amscore.beesuite.app/api/client/coordinate/2.92508/101.701
        console.log("get client based on loc");
        this.cinApi
          .getWithHeader(
            "/api/client/coordinate/" +
            "2.92508" + //this.locWatch.lat +
              "/" +
              "101.701" // this.locWatch.long
          )
          .subscribe((clientRes: any[]) => {
            console.log(clientRes);
            console.log(clientRes[0].CLIENT_DATA);
            clientRes.forEach((cli) => {
              console.log(cli);
              this.globalData.clients.push(cli.CLIENT_DATA);
            });
            console.log(this.globalData.clients);
          });
      } else {
        this.getAllClient();
      }
    } else {
      this.getAllClient();
    }
  }

  getAllClient() {
    this.cinApi.getWithHeader("/api/client/detail").subscribe(
      (clientRes) => {
        this.globalData.clients = clientRes;
        // Object.assign(this.globalData.clients, clientRes);
        console.log(this.globalData.clients);
      },
      (error) => {
        console.log("get all client error");
        console.log(error);
      }
    );
    // use api https://amscore.beesuite.app/api/client/detail
  }

  getProjectList() {
    console.log("getProjectList");
    console.log(this.selectedClient.CLIENT_GUID);
    this.cinApi
      .getWithHeader("/api/project/" + this.selectedClient.CLIENT_GUID)
      .subscribe(
        (projectRes) => {
          console.log(projectRes);
          this.globalData.projects = projectRes;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getProjectContractList(type) {
    console.log("getProjectContractList:" + type);
    console.log(this.selectedClient.CLIENT_GUID);
    this.cinApi
      .getWithHeader("/api/" + type + "/" + this.selectedClient.CLIENT_GUID)
      .subscribe(
        (projcontRes) => {
          console.log(projcontRes);
          type === "project"
            ? (this.globalData.projects = projcontRes)
            : (this.globalData.contracts = projcontRes);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onKey(evt) {
    console.log("onKey");
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
    // const temp: any = new Date(this.currTime).setHours(0, 0, 0, 0);
    const timeNow = new Date().getTime();
    console.log(this.cinGlobal.userInfo);
    console.log(this.cinGlobal.userInfo.userId);
    switch (type) {
      case "in":
        this.clocksForm.patchValue({
          inTime: timeNow,
        });

        const tempArr = {
          userGuid: this.cinGlobal.userInfo.userId,
          clockTime: timeNow,
          jobType: this.clocksForm.get("jobtype").value,
          location: {
            lat: this.locWatch.lat,
            long: this.locWatch.long,
            name: this.locWatch.name,
          },
          clientId: this.selectedClient.CLIENT_GUID,
          projectId: this.selectedProject.PROJECT_GUID,
          contractId: this.selectedContract.CONTRACT_GUID,
        };

        this.cinApi.postWithHeader("/api/clock", tempArr).subscribe(
          (clkin) => {
            console.log("clkin");
            console.log(clkin);
            this.globalData.clocksInfo.list = clkin;
            this.globalData.clocksInfo.latest = clkin[0].CLOCK_LOG_GUID;
            console.log(this.globalData.clocksInfo);
            this.patchActivityList(clkin[0].CLOCK_LOG_GUID, this.checkAddNew);
            this.data.userInfo.clockIn.status = true;
          },
          (error) => {
            console.log("clkin");
            console.log(error);
          }
        );
        break;

      case "out":
        this.clocksForm.patchValue({
          outTime: timeNow,
        });

        const coutArr = {
          clockLogGuid: this.globalData.clocksInfo.latest,
          clockTime: timeNow,
          location: {
            lat: this.locWatch.lat,
            long: this.locWatch.long,
            name: this.locWatch.name,
          },
        };

        this.cinApi.patchWithHeader("/api/clock", coutArr).subscribe(
          (coutResp) => {
            console.log("coutResp");
            console.log(coutResp);
            console.log(this.checkAddNew);
            this.patchActivityList(
              coutResp[0].CLOCK_LOG_GUID,
              this.checkAddNew
            );
            this.globalData.clocksInfo.latest = null;
            this.selectedClient = this.clientNone;
            this.selectedProject = this.projectNone;
            this.selectedContract = this.contractNone;
            this.data.userInfo.clockIn.status = false;
            this.checkAddNew = [];
          },
          (error) => {
            console.log("coutResp");
            console.log(error);
          }
        );
        break;
    }

    // if (type === "out") {
    //   this.checkAddNew = [];
    // }
  }

  /**
   * To prepare structe to be patched into activities db based on clockin guid
   * @param {*} clockGuid
   * @param {*} list
   * @memberof ClockInPage
   */
  patchActivityList(clockGuid, list) {
    const actvArr = {
      clockLogGuid: clockGuid,
      activity: list,
    };

    this.cinApi.patchWithHeader("/api/clock/activity", actvArr).subscribe(
      (actvRes) => {
        console.log("actvRes");
        console.log(actvRes);
      },
      (error) => {
        console.log("actvRes");
        console.log(error);
      }
    );
  }

  logout() {
    this.cinAuthenticationService.logout();
    this.cinRouter.navigate(["/login"]);
  }

  getBasicInfo() {
    this.cinGlobal.getLoggedUserInfo();
    // evt.target.complete();
    // console.log("getAttendanceProfile");
    // console.log("/api/admin/attendance/user/" + this.cinGlobal.userInfo.userId);
  }

  async refreshClockinPage(event: Refresher) {
    await this.getBasicInfo();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    // this.refresherRef.complete();
  }
}
