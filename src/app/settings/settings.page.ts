import { GlobalFnService } from '@services/global-fn.service';
import { APIService } from '@services/_services/api.service';
import { Component, OnInit } from '@angular/core';

/**
 * This component for Settings page
 * @export
 * @class SettingsPage
 * @implements {OnInit}
 */
@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  /**
   * To check opening of login activities list
   * @type {boolean}
   * @memberof SettingsPage
   */
  openLoginActivityList: boolean;

  /**
   * Bind value of login log
   * @memberof SettingsPage
   */
  public loginLog;

  /**
   * Bind option to show activites on log
   * @memberof SettingsPage
   */
  public isShowLoginActivitiesLog;

  /**
   * Bind index value of checking the show login log
   * @memberof SettingsPage
   */
  public checkShowLoginIndex;

  /**
   * Bind value of loginId from currSession in localStorage
   * @type {string}
   * @memberof SettingsPage
   */
  loginId: string;

  /**
   * Creates an instance of SettingsPage.
   * @param {APIService} stApi
   * @param {GlobalFnService} stFGlobal
   * @memberof SettingsPage
   */
  constructor(private stApi: APIService, private stFGlobal: GlobalFnService) {}

  /**
   * Initialize methods in this component
   * @memberof SettingsPage
   */
  ngOnInit() {}

  /**
   * Will be executed once this view was entered
   * @memberof SettingsPage
   */
  ionViewDidEnter() {
    this.loginLog = [];
  }

  /**
   * To return that will redirect url to beeSuite user web page
   * @param {*} redirectUrl
   * @returns
   * @memberof SettingsPage
   */
  navToOtherPage(redirectUrl) {
    return (window.location.href = redirectUrl);
  }

  /**
   * To get login log list based on userId. Will execute loading while waiting response
   * from db to get login log list. The loading component will dismissed once the log
   * finish the process
   * @memberof SettingsPage
   */
  toLoginActivity() {
    this.openLoginActivityList = true;
    this.stFGlobal.showLoading();
    this.stApi
      .getWithHeader(
        "/api/login-log/" + JSON.parse(localStorage.getItem("usr")).userId
      )
      .subscribe(
        (resLog: any) => {
          resLog.forEach((resItem) => {
            // resItem.LOGGED_TIMESTAMP = new Date(
            //   resItem.LOGGED_TIMESTAMP * 1000
            // );

            if (resItem.ACTIVITY !== null) {
              if (resItem.ACTIVITY.length === undefined) {
                resItem.ACTIVITY = [resItem.ACTIVITY];
              }

              // resItem.ACTIVITY.forEach((actItem) => {
              //   actItem.timestamp = new Date(actItem.timestamp * 1000);
              // });
            }
          });
          resLog.sort((a, b) => b.LOGGED_TIMESTAMP - a.LOGGED_TIMESTAMP);

          this.loginLog = resLog;
          this.loginId = localStorage.getItem("currSession");
          this.stFGlobal.dissmissLoading();
        },
        (error) => {
          console.log(error);
          this.stFGlobal.dissmissLoading();
          this.stFGlobal.showAlert(
            error.status + " " + error.statusText,
            error.error,
            "alert-error"
          );
        }
      );
  }
}
