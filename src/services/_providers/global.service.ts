import { Router } from '@angular/router';
import { APIService } from '@services/_services/api.service';
import { Injectable } from '@angular/core';

export let defJob = "office";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  constructor(private gApi: APIService, private router: Router) {}
  //  ClockInPage.clocksForm: FormGroup
  public globalData = require('@services/_providers/global.json');

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

  public dataGlobal = require('../../app/sampledata.json');
  // private globalData = require('./global.json');

  public initSelectedJobConfig = {
    type: "office",
    activity_list: true,
    client_list: true,
    contract_selection: true,
    geofence_filter: true,
    project_selection: true,
    value: true
  };

  public jobConfigs = [];

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
      console.log(resp);
      Object.assign(this.userInfo, resp);
      this.globalData.userInfo = resp;
      console.log(this.globalData);
      this.getJobProfile();
    });

    if (isNavToMain) {
      this.router.navigate(["/"]);
    }
  }

  getJobProfile() {
    console.log("getJobProfile");
    this.globalData.jobTypes = [];
    this.gApi
      .getWithHeader("/api/admin/attendance/user/" + this.userInfo.userId)
      .subscribe((resp) => {
        console.log(resp);
        Object.entries((resp as any).property).forEach((entry) => {
          const temp: any = entry[1];
          temp.type = entry[0];
          this.jobConfigs.push(temp);
          this.dataGlobal.userInfo.attendanceProfile2.push(temp);
          this.globalData.jobTypes.push(temp);
        });
        console.log(this.dataGlobal.userInfo);
        console.log(this.globalData.jobTypes);
        defJob = this.globalData.jobTypes.find((x) => {
          if (x.value) {
            return x.type;
          }
        });
        console.log(defJob);
      });
  }
}
 