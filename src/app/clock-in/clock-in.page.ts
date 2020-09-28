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
// import { Refresher } from "@ionic/angular";
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
  public jobType = "office"; // JSON.parse(localStorage.getItem("defJob")).type; //"office";

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

  public jobList;

  public geoLocError = "";

  private watch;
  private watchSubscriptions;
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
      jobtype:
        JSON.parse(localStorage.getItem("defJob")).type !== undefined
          ? JSON.parse(localStorage.getItem("defJob")).type
          : "office", //"office",
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
    // setInterval(this.test, 1000);
    this.getBasicInfo();
    if (localStorage.getItem("cin_token") !== "true") {
      localStorage.setItem("cin_token", "false");
    }

    console.log(localStorage.getItem("jobProfile"));
    console.log(JSON.parse(localStorage.getItem("jobProfile")));
    this.jobList = JSON.parse(localStorage.getItem("jobProfile"));
    // localStorage.setItem('cin_token', "true");
  }

  /**
   *  To update time lively
   * @memberof ClockInPage
   */
  cinStartTime() {
    this.currTime = new Date().toISOString();

    setTimeout(() => {
      this.cinStartTime();
    }, 1000);
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.getLoc();
    this.cinStartTime();
    this.getAllClient();
    this.getAllProject();
    this.getAllContract();
  }
  ionViewDidLeave() {
    console.log("leaveeeeee");
    this.watchSubscriptions.unsubscribe();
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
    this.geoLocError = "";
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;

        const fence = {
          id: new Date().toISOString(),
          latitude: resp.coords.latitude, // 2.9270567,
          longitude: resp.coords.longitude, // 101.6511282, 
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
        this.geoLocError = "Error getting location. " + error.message;
      });

    this.watch = this.geolocation.watchPosition();
    this.watchSubscriptions = this.watch.subscribe((data) => {
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
    });
  }
  // https://amscore.beesuite.app/api/client/coordinate/2.92508/101.701
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

  /**
   * Will be executed when user click on select client drop down box.
   * Check client list based on geofiltering option. if enableGeofiltering is true,
   * filter client's locations based on +-0.005 latitude and longitude
   * @param {*} enableGeofiltering
   * @memberof ClockInPage
   */
  getClientList(enableGeofiltering) {
    this.getClientError = "";
    this.globalData.clients = JSON.parse(localStorage.getItem("clientList"));

    if (
      enableGeofiltering &&
      this.locWatch.lat !== null &&
      this.locWatch.long !== null
    ) {
      this.globalData.clients = this.globalData.clients.filter((clients) => {
        return clients.LOCATION_DATA.some((clientLocation) => {
          const minLat = parseFloat(clientLocation.LATITUDE).toFixed(3);
          const maxLat = parseFloat(this.locWatch.lat).toFixed(3);
          const minLong = parseFloat(clientLocation.LONGITUDE).toFixed(3);
          const maxLong = parseFloat(this.locWatch.long).toFixed(3);
          return (
            minLat <= parseFloat(this.locWatch.lat).toFixed(3) &&
            parseFloat(this.locWatch.lat).toFixed(3) <= maxLat &&
            minLong <= this.locWatch.long.toFixed(3) &&
            this.locWatch.long.toFixed(3) <= maxLong
          );
        });
      });
    }
  }

  /**
   * Get list of all clients from db. will be executed once this page is loaded or refreshed
   * @memberof ClockInPage
   */
  getAllClient() {
    this.globalData.clients = [];
    this.cinApi.getWithHeader("/api/client/detail").subscribe(
      (clientRes) => {
        this.globalData.clients = clientRes;
        // Object.assign(this.globalData.clients, clientRes);
        // console.log(this.globalData.clients);
        localStorage.setItem(
          "clientList",
          JSON.stringify(this.globalData.clients)
        );
      },
      (error) => {
        console.log("get all client error");
        console.log(error);
        this.getClientError =
          "Fail to fetch client list. Please contact developer. Error log: " +
          error.status +
          " " +
          error.error;
      }
    );
  }

  /**
   * Get list of all project from db. this will be executed once this page is loaded or refreshed
   * @memberof ClockInPage
   */
  getAllProject() {
    this.globalData.projects = [];
    this.cinApi.getWithHeader("/api/project").subscribe((projectRes) => {
      console.log("getAllProject");
      console.log(projectRes);

      this.globalData.projects = projectRes;
      localStorage.setItem(
        "projectList",
        JSON.stringify(this.globalData.projects)
      );
    });
  }

  /**
   * Get list of all contract from db. this will be executed once this page is loaded or refreshe
   * @memberof ClockInPage
   */
  getAllContract() {
    this.globalData.contracts = [];
    this.cinApi.getWithHeader("/api/contract").subscribe((contractRes) => {
      console.log("getAllContract");
      console.log(contractRes);

      this.globalData.contracts = contractRes;
      localStorage.setItem(
        "contractList",
        JSON.stringify(this.globalData.contracts)
      );
    });
  }

  /**
   * Check if client was selected, then will filter project & contract based on client.
   * Else, list down all project & contract
   * @param {*} type
   * @memberof ClockInPage
   */
  getProjectContractList(type) {
    console.log("getProjectContractList:" + type);
    if (this.selectedClient.CLIENT_GUID !== "none") {
      if (type === "project") {
        this.globalData.projects = JSON.parse(
          localStorage.getItem("projectList")
        );
        this.globalData.projects = this.globalData.projects.filter(
          (client) => {
            return client.CLIENT_GUID === this.selectedClient.CLIENT_GUID;
          }
        );
      } else {
        this.globalData.contracts = JSON.parse(
          localStorage.getItem("contractList")
        );
        this.globalData.contracts = this.globalData.contracts.filter(
          (client) => {
            return client.CLIENT_GUID === this.selectedClient.CLIENT_GUID;
          }
        );
      }
    }
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
    const timeNow = Math.round(new Date().getTime() / 1000); // new Date().getTime() / 1000;
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
            localStorage.setItem("cin_token", "true");
            localStorage.setItem("cid_token", clkin[0].CLOCK_LOG_GUID);
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
          clockLogGuid: localStorage.getItem("cid_token"),
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
            localStorage.setItem("cin_token", "false");
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

  /**
   * Will be executed when user click logout
   * @memberof ClockInPage
   */
  logout() {
    this.cinAuthenticationService.logout();
    this.cinRouter.navigate(["/login"]);
  }

  /**
   * Will reset user locations and get basic logged user info
   * @memberof ClockInPage
   */
  getBasicInfo() {
    this.locWatch.lat = null;
    this.locWatch.name = null;
    this.locWatch.long = null;
    this.cinGlobal.getLoggedUserInfo();
  }

  /**
   * Will be executed when user pull down to refresh data. Will get basic user info,
   * current location and all client, project & contract list.
   * @param {*} event
   * @memberof ClockInPage
   */
  async refreshClockinPage(event) {
    // async refreshClockinPage(event: Refresher) {
    await this.getBasicInfo();
    await this.ionViewDidEnter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    // this.refresherRef.complete();
  }
}
