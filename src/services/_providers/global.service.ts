import { AuthenticationService } from './../_services/authentication.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GlobalFnService } from '@services/global-fn.service';
import { Router } from '@angular/router';
import { APIService } from '@services/_services/api.service';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

export let defJob; // = "office";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  constructor(
    private gApi: APIService,
    private router: Router,
    private gGF: GlobalFnService,
    private glGeolocation: Geolocation,
    private glAuth: AuthenticationService
  ) { }
  //  ClockInPage.clocksForm: FormGroup
  public globalData = require("@services/_providers/global.json");

  public userInfo = {
    companyName: null,
    email: null,
    profilePictureUrl: null,
    profileSetting: {
      calendar: {
        restday: [],
      },
      workingHour: {
        end: null,
        start: null,
      },
    },
    userId: null,
  };

  public dataGlobal = require("../../app/sampledata.json");

  public publicIp = require("public-ip");
  public gPlatform = require("platform");
  // private globalData = require('./global.json');

  // public initSelectedJobConfig = {
  //   type: "office",
  //   activity_list: true,
  //   client_list: true,
  //   contract_selection: true,
  //   geofence_filter: true,
  //   project_selection: true,
  //   value: true
  // };

  get initUserInfo(): any {
    console.log("initUserInfo");
    return this.userInfo;
  }

  set initUserInfo(data: any) {
    console.log("set init userInfo");
    this.userInfo = data;
  }

  getLoggedUserInfo(isNavToMain?) {
    if (isNavToMain) {
      this.gGF.dissmissLoading();
    }
    this.gApi.getWithHeader("/api/user-info").subscribe(
      (resp) => {
        Object.assign(this.userInfo, resp);
        // localStorage.setItem("usr", btoa(JSON.stringify(resp)));
        localStorage.setItem("usr", JSON.stringify(resp));
        console.log(JSON.parse(localStorage.getItem("usr")));
        this.globalData.userInfo = resp;
        // console.log(this.globalData);
        this.getJobProfile(isNavToMain);
      },
      (error) => {
        console.log(error);
        if (error.status === 401 && error.statusText === "Unauthorized") {
          console.log('otw reauthhh');
          this.glAuth.login(JSON.parse(window.atob(localStorage.getItem('session_token'))).email,
            JSON.parse(window.atob(localStorage.getItem('session_token'))).password).pipe(first()).subscribe(
            (reauth) => {
              console.log(reauth);
              console.log('reauthhh');
            },
            (errorReAuth) => {
              console.log(errorReAuth);
              this.gGF.showAlert(
                errorReAuth.status + " " + errorReAuth.statusText,
                "Your access token was expired. This will redirect to login page after click Ok",
                "alert-error",
                "/login"
              );
            }
          );
        } else {
          this.gGF.showAlert(
            error.status + " " + error.statusText,
            error.error,
            "alert-error"
          );
        }
      }
    );


    // if (isNavToMain) {
    //   // this.router.navigate(["/"]);
    // }
  }

  /**
   * Get job profile
   * @memberof GlobalService
   */
  getJobProfile(isNavToMain?) {
    console.log("getJobProfile");
    const tempJob = [];
    let loginLat;
    let loginLong;
    let loginAddr;
    let loginPublicIp;
    let tempLoginLog;
    console.log(JSON.parse(localStorage.getItem("usr")).userId);
    // this.globalData.jobTypes = [];
    localStorage.setItem("jobProfile", "[]");
    (async () => {
      loginPublicIp = await this.publicIp.v4();
    })();
    // if (isNavToMain) {
    //   this.router.navigate(["/"]);
    // }

    this.gApi
      .getWithHeader(
        "/api/admin/attendance/user/" +
        JSON.parse(localStorage.getItem("usr")).userId
      )
      .subscribe(
        (resp) => {
          Object.entries((resp as any).property).forEach((entry) => {
            const temp: any = entry[1];
            temp.type = entry[0];
            // this.globalData.jobTypes.push(temp);
            tempJob.push(temp);
          });
          // console.log(this.dataGlobal.userInfo);
          // console.log(this.globalData.jobTypes);
          // console.log(tempJob);
          localStorage.setItem("jobProfile", JSON.stringify(tempJob));
          defJob = tempJob.find((x) => {
            if (x.value) {
              // console.log(x);
              return x.type;
            }
          });
          // console.log(defJob);

          localStorage.setItem("defJob", JSON.stringify(defJob));
          // console.log(JSON.parse(localStorage.getItem("defJob")));
          // console.log(this.globalData.jobTypes);
          if (isNavToMain) {
            setTimeout(() => {
              this.router.navigate(["/"]);
            }, 500);
            this.glGeolocation.getCurrentPosition().then((respLoc) => {
              loginLat = respLoc.coords.latitude;
              loginLong = respLoc.coords.longitude;
              this.gApi
                .getWithHeader(
                  "/api/location/search/coordinate/" +
                  respLoc.coords.latitude +
                  "%2C" +
                  respLoc.coords.longitude
                )
                .subscribe(
                  (resps: any) => {
                    loginAddr = resps.results[3].formatted_address;
                    tempLoginLog = {
                      userId: JSON.parse(localStorage.getItem("usr")).userId,
                      loggedTimestamp: Math.floor(Date.now() / 1000),
                      latitude: loginLat.toString(),
                      longitude: loginLong.toString(),
                      address: loginAddr,
                      deviceInfo: this.gPlatform.description,
                      devicePublicIp: loginPublicIp,
                    };
                    console.log(tempLoginLog);
                    this.addLoginLog(tempLoginLog);
                  },
                  (error) => {
                    console.log(error);
                    tempLoginLog = {
                      userId: JSON.parse(localStorage.getItem("usr")).userId,
                      loggedTimestamp: Math.floor(Date.now() / 1000),
                      latitude: loginLat.toString(),
                      longitude: loginLong.toString(),
                      address: null,
                      deviceInfo: this.gPlatform.description,
                      devicePublicIp: loginPublicIp,
                    };
                    console.log(tempLoginLog);
                    this.addLoginLog(tempLoginLog);
                  }
                );
            });
          }
        },
        (error) => {
          console.log(error);
          defJob = {
            activity_list: true,
            client_list: true,
            contract_selection: true,
            geofence_filter: true,
            project_selection: true,
            type: "office",
            value: true,
          };
          // localStorage.setItem("jobProfile", '[]');
          localStorage.setItem("defJob", JSON.stringify(defJob));
          if (isNavToMain) {
            this.router.navigate(["/"]);
            this.glGeolocation.getCurrentPosition().then((respLoc) => {
              loginLat = respLoc.coords.latitude;
              loginLong = respLoc.coords.longitude;
              this.gApi
                .getWithHeader(
                  "/api/location/search/coordinate/" +
                  respLoc.coords.latitude +
                  "%2C" +
                  respLoc.coords.longitude
                )
                .subscribe(
                  (resps: any) => {
                    loginAddr = resps.results[3].formatted_address;
                    tempLoginLog = {
                      userId: JSON.parse(localStorage.getItem("usr")).userId,
                      loggedTimestamp: Math.floor(Date.now() / 1000),
                      latitude: loginLat.toString(),
                      longitude: loginLong.toString(),
                      address: loginAddr,
                      deviceInfo: this.gPlatform.description,
                      devicePublicIp: loginPublicIp,
                    };
                    console.log(tempLoginLog);
                    this.addLoginLog(tempLoginLog);
                  },
                  (error) => {
                    console.log(error);
                    tempLoginLog = {
                      userId: JSON.parse(localStorage.getItem("usr")).userId,
                      loggedTimestamp: Math.floor(Date.now() / 1000),
                      latitude: loginLat.toString(),
                      longitude: loginLong.toString(),
                      address: null,
                      deviceInfo: this.gPlatform.description,
                      devicePublicIp: loginPublicIp,
                    };
                    console.log(tempLoginLog);
                    this.addLoginLog(tempLoginLog);
                  }
                );
            });
          }
          // this.gGF.showAlert(
          //   "Oppss!",
          //   error.status + " " + error.statusText + ". " + error.error,
          //   "alert-error"
          // );
        }
      );
  }

  /**
   * Send request to post login to create new login session
   * @param {*} obj
   * @memberof GlobalService
   */
  addLoginLog(obj) {
    this.gApi.postWithHeader("/api/login-log", obj).subscribe(
      (resLog) => {
        console.log(resLog);
        console.log(resLog[0].LOGIN_LOG_GUID);
        localStorage.setItem("currSession", resLog[0].LOGIN_LOG_GUID);
        this.addLoginActivity("Login");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Send request to patch login's activiy based on current logged session (loginId)
   * @param {*} task
   * @memberof GlobalService
   */
  addLoginActivity(task) {
    const tempActivityLog = {
      loginId: localStorage.getItem("currSession"),
      activities: [
        {
          timestamp: Math.floor(Date.now() / 1000).toString(),
          activity: task
        },
      ],
    };
    this.gApi.patchWithHeader("/api/login-log", tempActivityLog).subscribe((resPatchActivtiy) => {
    }, (error) => {
      console.log(error);
    });
  }
}
