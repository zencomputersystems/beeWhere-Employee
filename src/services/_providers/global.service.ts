import { GlobalFnService } from '@services/global-fn.service';
import { Router } from '@angular/router';
import { APIService } from '@services/_services/api.service';
import { Injectable } from '@angular/core';

export let defJob;

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  constructor(
    private gApi: APIService,
    private router: Router,
    private gGF: GlobalFnService
  ) {}
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
    this.gApi.getWithHeader("/api/user-info").subscribe((resp) => {
      Object.assign(this.userInfo, resp);
      // localStorage.setItem("usr", btoa(JSON.stringify(resp)));
      localStorage.setItem("usr", JSON.stringify(resp));
      console.log(JSON.parse(localStorage.getItem("usr")));
      this.globalData.userInfo = resp;
      // console.log(this.globalData);
      this.getJobProfile(isNavToMain);
    });

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
    console.log(JSON.parse(localStorage.getItem("usr")).userId);
    // this.globalData.jobTypes = [];
    localStorage.setItem("jobProfile", "[]");
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
          const tempJob = [];
          Object.entries((resp as any).property).forEach((entry) => {
            const temp: any = entry[1];
            temp.type = entry[0];
            // this.globalData.jobTypes.push(temp);
            tempJob.push(temp);
          });
          console.log(this.dataGlobal.userInfo);
          // console.log(this.globalData.jobTypes);
          console.log(tempJob);
          localStorage.setItem("jobProfile", JSON.stringify(tempJob));
          defJob = tempJob.find((x) => {
            if (x.value) {
              console.log(x);
              return x.type;
            }
          });
          console.log(defJob);

          localStorage.setItem("defJob", JSON.stringify(defJob));
          console.log(JSON.parse(localStorage.getItem("defJob")));
          // console.log(this.globalData.jobTypes);
          if (isNavToMain) {
            this.router.navigate(["/"]);
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
            type: 'office',
            value: true,
          };
          localStorage.setItem("jobProfile", '[]');
          localStorage.setItem("defJob", JSON.stringify(defJob));
          if (isNavToMain) {
            this.router.navigate(["/"]);
          }
          // this.gGF.showAlert(
          //   "Oppss!",
          //   error.status + " " + error.statusText + ". " + error.error,
          //   "alert-error"
          // );
        }
      );
  }
}
 