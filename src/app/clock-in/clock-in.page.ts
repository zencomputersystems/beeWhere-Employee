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

  /**
   * Bind data of locations (latitude & longitude) that being updated every few minutes
   * @memberof ClockInPage
   */
  public locWatch = {
    lat: null,
    long: null,
    name: null,
  };

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

  /**
   * Set value of empty project
   * @memberof ClockInPage
   */
  public projectNone = {
    SOC_NO: null,
    DESCRIPTION: null,
    PROJECT_GUID: "none",
    NAME: null,
    CLIENT_GUID: null,
  };

  /**
   * Set value of empty contract
   * @memberof ClockInPage
   */
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

  /**
   * Form group for clocks in clockout
   * @type {FormGroup}
   * @memberof ClockInPage
   */
  public clocksForm: FormGroup;

  /**
   * Bind value of job type list configured by admin in attendance profile
   * @memberof ClockInPage
   */
  public jobList;

  /**
   * Property of error message return by geolocation error
   * @memberof ClockInPage
   */
  public geoLocError = "";

  /**
   * Id of location timeout
   * @type {NodeJS.Timeout}
   * @memberof ClockInPage
   */
  locationTimerId: NodeJS.Timeout;

  /**
   * Id of auto-clockout timeout
   * @type {NodeJS.Timeout}
   * @memberof ClockInPage
   */
  autoClockoutLocationTimerId: NodeJS.Timeout;

  /**
   * Bind value to calculate confirm auto-clockout
   * @type {*}
   * @memberof ClockInPage
   */
  confirmAutoClockOut: any;

  /**
   * Bind value of clocked in info from localStorage
   * @type {*}
   * @memberof ClockInPage
   */
  public clockedInInfo: any;

  /**
   * Bind value of selected job type
   * @type {*}
   * @memberof ClockInPage
   */
  selectedJobType: any;

  /**
   *Creates an instance of ClockInPage.
   * @param {GlobalFnService} cinGlobalFn To get the methods from GlobalFnService
   * @param {Geolocation} geolocation To get the methods from geolocation
   * @param {Geofence} geofence To get the methods from geofence
   * @param {GlobalApiService} cinService To get the methods from GlobalApiService
   * @param {FormBuilder} clkFormBuilder To get the methods from FormBuilder
   * @param {Router} cinRouter To get the methods from Router
   * @param {AuthenticationService} cinAuthenticationService To get the methods from cinAuthenticationService
   * @param {APIService} cinApi To get the methods from APIService
   * @param {GlobalService} cinGlobal To get the methods from GlobalService
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
    this.data = this.cinGlobalFn.sampleDataList();
    this.selectedClient = this.clientNone;
    this.selectedProject = this.projectNone;
    this.selectedContract = this.contractNone;
    this.getBasicInfo();
    if (localStorage.getItem("cin_token") !== "true") {
      localStorage.setItem("cin_token", "false");
    }
    this.jobList = JSON.parse(localStorage.getItem("jobProfile"));
    this.selectedJobType = JSON.parse(localStorage.getItem("defJob"));
    if (localStorage.getItem("cid_token") !== null) {
      this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
      this.autoclockoutCheck();
    }
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

  /**
   * will be executed once user enter this page
   * @memberof ClockInPage
   */
  async ionViewDidEnter() {
    console.log("ionViewDidEnter");
    await this.getLoc();
    this.cinStartTime();
    this.getAllClient();
    this.getAllProject();
    this.getAllContract();
  }

  /**
   * Will be executed once user leave this page
   * @memberof ClockInPage
   */
  ionViewDidLeave() {
    console.log("leaveeeeee");
    clearInterval(this.locationTimerId);
    // this.watchSubscriptions.unsubscribe();
  }

  /**
   * Will be executed once user change job type segment (office/home/site/others).
   * To bind data of selected job type
   * @param {*} [job]
   * @memberof ClockInPage
   */
  chg(job?) {
    this.selectedJobType = job;
  }

  /**
   * To get current location positions (latitude & longitude),
   * watch location position every 5 minutes
   * @memberof ClockInPage
   */
  getLoc() {
    this.geoLocError = "";
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        // this.lat = resp.coords.latitude;
        // this.long = resp.coords.longitude;
        console.log("resp");
        console.log(resp);
        this.cinApi
          .getWithHeader(
            "/api/location/search/coordinate/" +
              resp.coords.latitude +
              "%2C" +
              resp.coords.longitude
          )
          .subscribe(
            (res) => {
              this.locWatch.lat = resp.coords.latitude;
              this.locWatch.long = resp.coords.longitude;
              this.locWatch.name = (res as any).results[0].formatted_address;
              console.log(resp.coords.latitude);
              console.log(resp.coords.longitude);
              console.log((res as any).results[0].formatted_address);
            },
            (error) => {
              console.log(error);
            }
          );
      })
      .catch((error) => {
        console.log("Error getting location", error);
        this.geoLocError = "Error getting location. " + error.message;
      });

    this.locationTimerId = setTimeout(() => {
      this.getLoc();
    }, 300000);
  }

  /**
   * Event to delete the selected task after delete button is being hit.
   * @param {*} selList selected task
   * @param {*} list task list
   * @memberof ClockInPage
   */
  onDeleteTask(selList, list, i) {
    console.log(selList);
    console.log(list);
    console.log(i);
    // this.checkAddNew = this.cinGlobalFn.deleteTask(selList, list, i);
    if (this.clockedInInfo !== undefined) {
      this.clockedInInfo.activities = this.cinGlobalFn.deleteTask(
        selList,
        list,
        i
      );
    } else {
      this.checkAddNew = this.cinGlobalFn.deleteTask(selList, list, i);
    }
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
      console.log(this.clockedInInfo);
      if (this.clockedInInfo !== undefined) {
        this.clockedInInfo.activities.push({
          statusFlag: false,
          name: this.newTask,
        });
      } else {
        this.checkAddNew.push({
          // id: this.checkAddNew.length,
          statusFlag: false,
          name: this.newTask,
        });
      }
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
    // this.getClientError = "";
    this.globalData.clients = JSON.parse(localStorage.getItem("clientList"));
    console.log(enableGeofiltering);

    if (
      enableGeofiltering &&
      this.locWatch.lat !== null &&
      this.locWatch.long !== null
    ) {
      this.globalData.clients = this.globalData.clients.filter((clients) => {
        return clients.LOCATION_DATA.some((clientLocation) => {
          const minLat = parseFloat(
            (clientLocation.LATITUDE - 0.005).toString()
          ).toFixed(3);
          const maxLat = parseFloat(this.locWatch.lat + 0.005).toFixed(3);
          const minLong = parseFloat(
            (clientLocation.LONGITUDE - 0.005).toString()
          ).toFixed(3);
          const maxLong = parseFloat(this.locWatch.long + 0.005).toFixed(3);
          return (
            minLat <= parseFloat(this.locWatch.lat).toFixed(3) &&
            parseFloat(this.locWatch.lat).toFixed(3) <= maxLat &&
            minLong <= parseFloat(this.locWatch.long).toFixed(3) &&
            parseFloat(this.locWatch.long).toFixed(3) <= maxLong
          );
        });
      });
      console.log(this.globalData.clients);
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
        console.error("get all client error");
        console.error(error);
        // this.getClientError =
        //   "Fail to fetch client list. Please contact developer. Error log: " +
        //   error.status +
        //   " " +
        //   error.error;
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
        this.globalData.projects = this.globalData.projects.filter((client) => {
          return client.CLIENT_GUID === this.selectedClient.CLIENT_GUID;
        });
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

  /**
   * Will be executed when any key is being hit on activities list
   * @param {*} evt
   * @memberof ClockInPage
   */
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
   * Will be executed when the page is loaded or after user success clockin.
   * Will check if auto-clockout function is enabled. If enabled, will get the radius of auto-clockout
   * then once user out from those radius for first 5 minutes will send warning. then will proceed auto-clockout
   * when user still out from client's radius.
   * @memberof ClockInPage
   */
  autoclockoutCheck() {
    console.log("autoclockoutCheck");
    console.log(this.clockedInInfo);
    if (
      this.clockedInInfo.jobType !== undefined &&
      this.clockedInInfo.jobType.autoclockout_filter.value
    ) {
      console.log("yess geofence");
      console.log(
        this.clockedInInfo.jobType.autoclockout_filter.range / 100000
      );
      const clocksRadius =
        this.clockedInInfo.jobType.autoclockout_filter.range / 100000; // 500m(+-0.005), 1000m(+-0.01), 1500m(+-0.015), 2000m(+-0.02)

      const currLat = parseFloat(this.locWatch.lat).toFixed(3);
      const currLong = parseFloat(this.locWatch.long).toFixed(3);
      console.log(currLat);
      console.log(currLong);
      this.cinApi
        .getWithHeader(
          "/api/location/" +
            JSON.parse(localStorage.getItem("cin_info")).clientId
        )
        .subscribe((locList) => {
          // console.log(locList);
          const list = locList.filter((clientLoc) => {
            // console.log(clientLoc);
            const minLat = parseFloat(
              (clientLoc.LATITUDE - clocksRadius).toString()
            ).toFixed(3);
            // Number(parseFloat(clientLoc.LATITUDE).toFixed(3)) - clocksRadius;
            // Number(parseFloat(clientLoc.LATITUDE).toFixed(3)) - clocksRadius;
            const maxLat = parseFloat(
              clientLoc.LATITUDE + clocksRadius
            ).toFixed(3);
            const minLong = parseFloat(
              (clientLoc.LONGITUDE - clocksRadius).toString()
            ).toFixed(3);
            const maxLong = parseFloat(
              clientLoc.LONGITUDE + clocksRadius
            ).toFixed(3);
            console.log(
              minLat + " - " + maxLat + ", " + minLong + " - " + maxLong
            );
            // console.log();
            return (
              minLat <= currLat &&
              currLat <= maxLat &&
              minLong <= currLong &&
              currLong <= maxLong
            );
            // console.log(maxLat + ", " + maxLong);
          });
          console.log(list);
          if (list.length < 1) {
            console.log("need to auto clockout");
            this.confirmAutoClockOut++;
            if (this.confirmAutoClockOut === 1) {
              this.cinGlobalFn.showAlert(
                "Alert",
                "You are not in the work zone. You'll be clocked out automatically in 5 minutes",
                "alert-warning"
              );
            } else if (this.confirmAutoClockOut > 1) {
              console.log("proceed clockout");
              this.saveClockIn("out");
            }
          } else {
            this.confirmAutoClockOut = 0;
          }
          // locList.filter((locClient) => {
          //   console.log(locClient);
          // });
        });
      this.autoClockoutLocationTimerId = setTimeout(() => {
        this.autoclockoutCheck();
      }, 30000);
    }
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
        console.log(this.selectedClient);
        console.log(this.selectedProject);
        console.log(this.selectedContract);
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
        console.log("clocks in");
        console.log(tempArr);

        this.cinApi.postWithHeader("/api/clock", tempArr).subscribe(
          (clkin) => {
            console.log("clkin");
            console.log(clkin);
            localStorage.setItem(
              "cin_info",
              JSON.stringify(
                Object.assign(tempArr, {
                  client: this.selectedClient,
                  project: this.selectedProject,
                  contract: this.selectedContract,
                  activities: this.checkAddNew,
                  jobType: this.selectedJobType,
                })
              )
            );
            localStorage.setItem("cin_token", "true");
            localStorage.setItem("cid_token", clkin[0].CLOCK_LOG_GUID);
            this.autoclockoutCheck();
            this.globalData.clocksInfo.list = clkin;
            this.globalData.clocksInfo.latest = clkin[0].CLOCK_LOG_GUID;
            console.log(this.globalData.clocksInfo);
            console.log(this.checkAddNew);
            this.patchActivityList(clkin[0].CLOCK_LOG_GUID, this.checkAddNew);
            this.data.userInfo.clockIn.status = true;
            this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
            console.log(this.clockedInInfo);
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
        console.log("clocks out");
        console.log(coutArr);
        this.cinApi.patchWithHeader("/api/clock", coutArr).subscribe(
          (coutResp) => {
            console.log("coutResp");
            console.log(coutResp);
            console.log(this.checkAddNew);

            console.log(this.clockedInInfo);
            this.patchActivityList(
              coutResp[0].CLOCK_LOG_GUID,
              this.clockedInInfo.activities // this.checkAddNew
            );
            this.globalData.clocksInfo.latest = null;
            localStorage.setItem("cin_token", "false");
            localStorage.removeItem("cin_info");
            localStorage.removeItem("cid_token");
            this.selectedClient = this.clientNone;
            this.selectedProject = this.projectNone;
            this.selectedContract = this.contractNone;
            this.selectedJobType = localStorage.getItem("defJob");
            this.data.userInfo.clockIn.status = false;
            this.checkAddNew = [];
            this.clockedInInfo.activities = [];
            // this.clockedInInfo = [];
            clearInterval(this.autoClockoutLocationTimerId);
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

    console.log(actvArr);

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
