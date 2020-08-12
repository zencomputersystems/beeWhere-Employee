import { Router } from '@angular/router';
import { APIService } from '@services/_services/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  constructor(private gApi: APIService, private router: Router) {}

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

  // public jobConfig = {};
  public jobConfig = {
    home: {
      activity_list: true,
      client_list: true,
      contract_selection: true,
      geofence_filter: true,
      project_selection: true,
      value: true,
    },
    office: {
      activity_list: true,
      client_list: true,
      contract_selection: true,
      geofence_filter: true,
      project_selection: true,
      value: true,
    },
    site: {
      activity_list: true,
      client_list: true,
      contract_selection: true,
      geofence_filter: true,
      project_selection: true,
      value: true,
    },
    others: {
      activity_list: true,
      client_list: true,
      contract_selection: true,
      geofence_filter: true,
      project_selection: true,
      value: true,
    }
  };

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
      this.getJobProfile();
    });

    if (isNavToMain) {
      this.router.navigate(["/"]);
    }
  }

  getJobProfile() {
    console.log("getJobProfile");
    this.gApi
      .getWithHeader("/api/admin/attendance/user/" + this.userInfo.userId)
      .subscribe((resp) => {
        console.log(resp);
        // console.log(this.jobConfig);
        Object.assign(this.jobConfig, (resp as any).property);
      });
    console.log(this.jobConfig);
    // console.log(this.jobConfig.home.value);
  }
}
 