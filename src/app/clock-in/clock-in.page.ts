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
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;
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
  confirmAutoClockOut: number = 0;

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

  // public bglConfig: BackgroundGeolocationConfig = {
  //   // locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  //   // desiredAccuracy: 10,
  //   // stationaryRadius: 20,
  //   // distanceFilter: 30,
  //   debug: true, //  enable this hear sounds for background-geolocation life-cycle.
  //   stopOnTerminate: false, // enable this to clear background location settings when the app terminates,
  //   // activitiesInterval: 10000,
  //   notificationsEnabled: true,
  //   startForeground: true,
  //   notificationText: "gonna get location",
    

  //   // locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  //   // desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  //   // stationaryRadius: 50,
  //   // distanceFilter: 50,
  //   // notificationTitle: "Background tracking",
  //   // notificationText: "enabled",
  //   // debug: true,
  //   // interval: 10000,
  //   // fastestInterval: 5000,
  //   // activitiesInterval: 10000,
  //   // url: "http://192.168.81.15:3000/location",
  //   // httpHeaders: {
  //   //   "X-FOO": "bar",
  //   // },
  //   // // customize post properties
  //   // postTemplate: {
  //   //   lat: "@latitude",
  //   //   lon: "@longitude",
  //   //   foo: "bar", // you can also add your own properties
  //   // },
  // };
  notiLocationMessage: string;

  private cinPlatform = require("platform");

  private cinPublicIp = require("public-ip");

  /**
   * Token to decide disable clockin or not when location is turned off
   * @memberof ClockInPage
   */
  public allowClockin;

  /**
   * Count timeout getting location error. Need to count until 10 to end the process
   * @memberof ClockInPage
   */
  public countTimeoutReqLocation = 0;

  /**
   * bind hourly time lapse time
   * @type {string}
   * @memberof ClockInPage
   */
  public timeDiffHours: string;

  /**
   * Bind minutes time lapse time
   * @type {string}
   * @memberof ClockInPage
   */
  public timeDiffMinutes: string;

  /**
   * Bind value of public IP of current device
   * @type {*}
   * @memberof ClockInPage
   */
  cinPublicIPAddr: any;

  /**
   * Bind value of uuid of current device
   * @type {*}
   * @memberof ClockInPage
   */
  cinDeviceUUID: any;

  /**
   * Store selected job type
   * @type {*}
   * @memberof ClockInPage
   */
  public jobSel: any;


  /**
   * Creates an instance of ClockInPage.
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
    public cinGlobal: GlobalService,
    // private cinBackgroundGeolocation: BackgroundGeolocation,
    // private cinPlatform: Platform
  ) {

    (async () => {
      this.cinPublicIPAddr = await this.cinPublicIp.v4();
      this.cinDeviceUUID = await Device.getInfo();
    })();
    this.clocksForm = clkFormBuilder.group({
      dateToday: "",
      jobtype:
        (JSON.parse(localStorage.getItem("defJob")).type !== undefined ||
          JSON.parse(localStorage.getItem("defJob")).type !== null)
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
    // (window as any).plugins.mockgpschecker.check((a) => this.successCallback(a), (b) => this.errorCallback(b));

    // successCallback(result) {
    //   console.log(result); // true - enabled, false - disabled
    // }

    // errorCallback(error) {
    //   console.log(error);
    // }
    // this.cinBackgroundGeolocation.configure(this.bglConfig).then(() => {
    //   this.cinBackgroundGeolocation
    //     .on(BackgroundGeolocationEvents.location)
    //     .subscribe((location: BackgroundGeolocationResponse) => {
    //       console.log("configure background location");
    //       console.log(location);

    //       // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //       // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
    //       // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //       this.cinBackgroundGeolocation.finish(); // FOR IOS ONLY
    //     });
    // });

    // start recording location
    // this.cinBackgroundGeolocation.start();
    // If you wish to turn OFF background-tracking, call the #stop method.
    // this.cinBackgroundGeolocation.stop();

    document.addEventListener("deviceready", this.onDeviceReady, false);
    this.getBasicInfo();
    if (localStorage.getItem("cin_token") !== "true") {
      localStorage.setItem("cin_token", "false");
    }
    this.jobList = JSON.parse(localStorage.getItem("jobProfile"));
    this.selectedJobType = JSON.parse(localStorage.getItem("defJob"));
    if (localStorage.getItem("cid_token") !== null) {
      this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
      // this.autoclockoutCheck(); // Disabled for release 1
    }
    // (window as any).plugins.mocklocation.check(
    //   (a) => this.successCallback(a),
    //   (b) => this.errorCallback(b)
    // );
  }

  successCallback(result?) {
    console.log("1111s");
    console.log(result); // true - enabled, false - disabled
    if (result) {
      console.log("1111s spoofing detected");
      this.cinGlobalFn.showAlert(
        "Spoofing Detected",
        "You are using fake location application. Please stop location spoofing and try again",
        "alert-warning"
      );
    } else {
      console.log("no spoofing detected");
    }
  }

  errorCallback(error) {
    console.log("1111e");
    console.log(error);
  }

  onDeviceReady() {
    console.log("1111");

    const winMock = (window as any).plugins.mockgpschecker.check(
      (res) => {
        console.log("1111ismovk");
        console.log(res);
        // if (a) {
        //   console.log("spoofing detected");
        this.successCallback(res);
        // } else {
        // }
        // console.log(this.successCallback(a));
        // this.successCallback(a);
      },
      (error) => {
        console.log("1111dsdssderror");
        this.errorCallback(error);
      }
    );
    console.log("winMock");
    console.log(winMock);
  }

  /**
   *  To update time lively
   * @memberof ClockInPage
   */
  cinStartTime() {
    this.currTime = new Date().toISOString();
    if (JSON.parse(localStorage.getItem("cin_info")) !== null && (
        JSON.parse(localStorage.getItem("cin_info")).clockTime !== undefined
      || JSON.parse(localStorage.getItem("cin_info")).clockTime !== null) ) {
      this.getTimeLaplse(this.currTime, new Date(JSON.parse(localStorage.getItem("cin_info")).clockTime).toISOString());

    }
    setTimeout(() => {
      this.cinStartTime();
    }, 1000);
  }

  /**
   * To calculate time lapsed from last clocked-in
   * @param {*} [currTime]
   * @param {*} [cinTime]
   * @memberof ClockInPage
   */
  getTimeLaplse(currTime?: any , cinTime?: any) {
    currTime = new Date(currTime);
    cinTime = new Date(cinTime);
    // cinTime = new Date(cinTime * 1000);
    const timeDiff = (currTime.getTime() - cinTime.getTime()) / (1000 * 3600);
    this.timeDiffMinutes = (timeDiff.toFixed(2).split(".")[1] > "59")
      ? (Number(timeDiff.toFixed(2).split(".")[1]) - 59).toString() : timeDiff.toFixed(2).split(".")[1];
    this.timeDiffHours = (timeDiff.toFixed(2).split(".")[1] > "59") 
      ? (Number(timeDiff.toFixed(2).split(".")[0]) + 1).toString() : timeDiff.toFixed(2).split(".")[0];
  }
  
  /**
   * will be executed once user enter this page
   * @memberof ClockInPage
   */
  async ionViewDidEnter() {
    console.log("ionViewDidEnter");
    await this.getBasicInfo();
    this.countTimeoutReqLocation = 0;
    await this.getLoc();
    this.cinStartTime();
    this.getAllClient();
    this.getAllProject();
    this.getAllContract();
    this.checkCurrClocksStatus();
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
   * To check clockin status of logged user
   * @memberof ClockInPage
   */
  checkCurrClocksStatus() {
    this.cinApi.getWithHeader("/api/clock/history-list/0/0").subscribe(
      (resCinStat: any) => {
        if (resCinStat[0].CLOCK_OUT_TIME === null && resCinStat[0].CLOCK_IN_TIME !== null  
          && resCinStat[0].SOURCE_ID === 1) {
          localStorage.setItem("cin_token", "true");
          localStorage.setItem("cid_token", resCinStat[0].CLOCK_LOG_GUID);
          this.jobSel = JSON.parse(localStorage.getItem("jobProfile")).filter((jobItem) => {
            return jobItem.type === resCinStat[0].JOB_TYPE;
          });
          localStorage.setItem("defJob", JSON.stringify(this.jobSel));
          this.clocksForm.patchValue({
            jobtype: resCinStat[0].JOB_TYPE,
          });
          const tempArr = {};
          this.cinApi.getWithHeader("/api/clock/activity/" + resCinStat[0].CLOCK_LOG_GUID).subscribe((resActv: any) => {
            resActv = (resActv === null) ? [] : resActv;
            localStorage.setItem(
              "cin_info",
              JSON.stringify(
                Object.assign(tempArr, {
                  clientId: resCinStat[0].CLIENT_ID,
                  client: resCinStat[0].CLIENT_DATA,
                  project: resCinStat[0].PROJECT_DATA,
                  projectId: resCinStat[0].PROJECT_ID,
                  contract: resCinStat[0].CONTRACT_DATA,
                  contractId: resCinStat[0].CONTRACT_ID,
                  activities: resActv,
                  jobType: this.jobSel[0],
                  clockTime: resCinStat[0].CLOCK_IN_TIME,
                })
              )
            );

            this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
          }, (error) => {
            localStorage.setItem(
              "cin_info",
              JSON.stringify(
                Object.assign(tempArr, {
                  clientId: resCinStat[0].CLIENT_ID,
                  client: resCinStat[0].CLIENT_DATA,
                  project: resCinStat[0].PROJECT_DATA,
                  projectId: resCinStat[0].PROJECT_ID,
                  contract: resCinStat[0].CONTRACT_DATA,
                  contractId: resCinStat[0].CONTRACT_ID,
                  activities: this.checkAddNew,
                  jobType: this.jobSel[0],
                  clockTime: resCinStat[0].CLOCK_IN_TIME,
                })
              )
            );

            this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
          });
        } else {
          localStorage.setItem("cin_token", "false");
        }
      },
      (error) => {
        console.error(error);
      }
    );
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
    this.allowClockin = false;
    // this.cinBackgroundGeolocation.watchLocationMode();
    // if (!this.cinPlatform.is('mobileweb')) {
    //   this.cinBackgroundGeolocation.watchLocationMode().subscribe((res) => {
    //     console.log(JSON.stringify(res, null, " "));
    //   });
    //   this.cinBackgroundGeolocation
    //     .getCurrentLocation()
    //     .then((respBgLoc) => {
    //       console.log("return bg location");
    //       console.log(respBgLoc.latitude + ", " + respBgLoc.longitude);
    //       // console.log();
    //       // this.notiLocationMessage = respBgLoc.latitude + ", " + respBgLoc.longitude;
    //       console.log(JSON.stringify(respBgLoc, null, " "));
    //       this.cinApi
    //         .getWithHeader(
    //           "/api/location/search/coordinate/" +
    //             respBgLoc.latitude +
    //             "%2C" +
    //             respBgLoc.longitude
    //         )
    //         .subscribe(
    //           (res) => {
    //             this.locWatch.lat = respBgLoc.latitude;
    //             this.locWatch.long = respBgLoc.longitude;
    //             this.locWatch.name = (res as any).results[0].formatted_address;
    //             console.log(respBgLoc.latitude);
    //             console.log(respBgLoc.longitude);
    //             console.log((res as any).results[0].formatted_address);
    //           },
    //           (error) => {
    //             console.log(error);
    //           }
    //         );
    //     })
    //     .catch((error) => {
    //       console.log("location bg error");
    //       console.log("Error getting location", error);
    //       this.geoLocError = "Error getting location. " + error.message;
    //     });
    // } else {
      // this.geoLocError = "";
    this.geolocation
      .getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0})
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
              console.log("sslslslsls");
              console.log(resp.coords.latitude);
              console.log(resp.coords.longitude);
              console.log((res as any).results[0].formatted_address);
              this.allowClockin = true;
            },
            (error) => {
              console.log(error);
            }
          );
      })
      .catch((error) => {
        console.log("Error getting location", error);
        this.geoLocError = "Error getting location. " + error.message;
        if (this.countTimeoutReqLocation < 10) {
          setTimeout(() => {
            this.getLoc();
            this.countTimeoutReqLocation++;
          }, 2000);

        }
      });
    // }
    this.locationTimerId = setTimeout(() => {
      this.getLoc();
    }, 300000);
    // }, 300000);
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
    console.log(event)
    console.log(this.checkAddNew);
            // this.checkAddNew = [];
            // this.clockedInInfo.activities = [];
    if ((event.code === "Enter" || event.key === "Enter") && this.newTask !== null) {
      console.log(this.clockedInInfo);

      // console.log(this.clockedInInfo.activities);
      // console.log(this.clockedInInfo.activities.length);
      if (this.clockedInInfo !== undefined &&
        this.clockedInInfo.activities !== undefined && this.checkAddNew === []) {
        this.clockedInInfo.activities = (this.clockedInInfo.activities.length > 0 )
          ? this.clockedInInfo.activities : [];
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
    console.log(this.selectedJobType);
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
      console.log(this.globalData.clients.length);
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
   * NOTE: Autoclockout function will not included in release 1
   * @memberof ClockInPage
   */
  autoclockoutCheck() {
    // console.log("autoclockoutCheck");
    // console.log(this.clockedInInfo);
    if (
      this.clockedInInfo.jobType !== undefined &&
      this.clockedInInfo.jobType.autoclockout_filter.value
    ) {
      // console.log("yess geofence");
      // console.log(
      //   this.clockedInInfo.jobType.autoclockout_filter.range / 100000
      // );
      const clocksRadius =
        this.clockedInInfo.jobType.autoclockout_filter.range / 100000; // 500m(+-0.005), 1000m(+-0.01), 1500m(+-0.015), 2000m(+-0.02)

      const currLat = parseFloat(this.locWatch.lat).toFixed(3);
      const currLong = parseFloat(this.locWatch.long).toFixed(3);
      // console.log(currLat);
      // console.log(currLong);
      // console.log(JSON.parse(localStorage.getItem("cin_info")).clientId);
      if (JSON.parse(localStorage.getItem("cin_info")).clientId === "none") {
        // console.log("check auto clockout based on clocked in location");
        // console.log(JSON.parse(localStorage.getItem("cin_info")).location.lat);
        // console.log(JSON.parse(localStorage.getItem("cin_info")).location.long);
        const minLat = parseFloat(
          (
            JSON.parse(localStorage.getItem("cin_info")).location.lat -
            clocksRadius
          ).toString()
        ).toFixed(3);
        const maxLat = parseFloat(
          JSON.parse(localStorage.getItem("cin_info")).location.lat +
            clocksRadius
        ).toFixed(3);
        const minLong = parseFloat(
          (
            JSON.parse(localStorage.getItem("cin_info")).location.long -
            clocksRadius
          ).toString()
        ).toFixed(3);
        const maxLong = parseFloat(
          JSON.parse(localStorage.getItem("cin_info")).location.long +
            clocksRadius
        ).toFixed(3);

        console.log(
          minLat <= currLat &&
            currLat <= maxLat &&
            minLong <= currLong &&
            currLong <= maxLong
        );
        if (
          minLat <= currLat &&
          currLat <= maxLat &&
          minLong <= currLong &&
          currLong <= maxLong
        ) {
          // console.log('still on range');
          this.confirmAutoClockOut = 0;
        } else {
          // console.log('turn on auto clockout');
          this.confirmAutoClockOut++;
          // console.log(this.confirmAutoClockOut);
          if (this.confirmAutoClockOut === 1) {
            this.cinGlobalFn.showAlert(
              "Alert",
              "You are not in the work zone. You'll be clocked out automatically in 5 minutes",
              "alert-warning"
            );
          } else if (this.confirmAutoClockOut > 1) {
            // console.log("proceed clockout");
            this.saveClockIn("out");
          }
        }
      } else {
        this.cinApi
          .getWithHeader(
            "/api/location/" +
              JSON.parse(localStorage.getItem("cin_info")).clientId
          )
          .subscribe((locList: Array<any>) => {
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
            // console.log(list);
            if (list.length < 1) {
              // console.log("need to auto clockout");
              this.confirmAutoClockOut++;
              if (this.confirmAutoClockOut === 1) {
                this.cinGlobalFn.showAlert(
                  "Alert",
                  "You are not in the work zone. You'll be clocked out automatically in 5 minutes",
                  "alert-warning"
                );
              } else if (this.confirmAutoClockOut > 1) {
                // console.log("proceed clockout");
                this.saveClockIn("out");
              }
            } else {
              this.confirmAutoClockOut = 0;
            }
            // locList.filter((locClient) => {
            //   console.log(locClient);
            // });
          });
      }
      // this.autoClockoutLocationTimerId = setTimeout(() => {
      //   this.autoclockoutCheck();
      // }, 300000);
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
          userAgent: {
            description: this.cinPlatform.description,
            publicIp: this.cinPublicIPAddr,
            deviceID: (this.cinDeviceUUID.uuid !== undefined) ? this.cinDeviceUUID.uuid : null
          }
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
            this.globalData.clocksInfo.list = clkin;
            this.globalData.clocksInfo.latest = clkin[0].CLOCK_LOG_GUID;
            console.log(this.globalData.clocksInfo);
            console.log(this.checkAddNew);
            this.patchActivityList(clkin[0].CLOCK_LOG_GUID, this.checkAddNew);
            this.data.userInfo.clockIn.status = true;
            this.clockedInInfo = JSON.parse(localStorage.getItem("cin_info"));
            this.cinGlobal.addLoginActivity("Clock in");
            this.cinGlobalFn.showToast("Success Clocked In", "success");
            // this.autoclockoutCheck(); // disabled autoclockout function for release 1

            console.log(this.clockedInInfo);
          },
          (error) => {
            console.log("clkin");
            console.log(error);
            this.cinGlobalFn.showToast("Fail Clocked In", "error");
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
          userAgent: {
            description: this.cinPlatform.description,
            publicIp: this.cinPublicIPAddr,
            deviceID: (this.cinDeviceUUID.uuid !== undefined) ? this.cinDeviceUUID.uuid : null
          }
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
            this.cinGlobal.addLoginActivity("Clock out");

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
            this.cinGlobalFn.showToast("Success Clocked Out", "success");
            // this.clockedInInfo = [];
            // clearInterval(this.autoClockoutLocationTimerId); disable autoclockout function for release 1
          },
          (error) => {
            console.log("coutResp");
            console.log(error);
            this.cinGlobalFn.showToast("Fail Clocked In", "error");
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
    if (list !== undefined) {
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
  }

  /**
   * Will be executed when user click logout
   * @memberof ClockInPage
   */
  logout() {
    console.log('logouttt')
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
    // await this.getBasicInfo();
    await this.ionViewDidEnter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    // this.refresherRef.complete();
  }
}
