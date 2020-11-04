import { Router } from '@angular/router';
import { APIService } from '@services/_services/api.service';
import { Injectable } from '@angular/core';
import * as sampleData from '../app/sampledata.json';
import { ToastController, ActionSheetController, LoadingController } from '@ionic/angular';

export let globalTime;
/**
 * This services is to store the general functions that might will be used in multiple pages
 * @export
 * @class GlobalFnService
 */
@Injectable({
  providedIn: "root",
})
export class GlobalFnService {
  // public currDateTime = new Date().toISOString();
  public currTime;

  private loading;
  constructor(private gfnApi: APIService, private gfToast: ToastController, private gfActionSheet: ActionSheetController, 
              private gfloading: LoadingController, private gfRouter: Router) {
    setInterval(this.myTimer, 1000);
  }

  /**
   * This method is to get the list of sample data in arrays from json file
   * @memberof GlobalFnService
   */
  sampleDataList() {
    return require("@app/sampledata.json");
    // return require("src/app/sampledata.json");
  }

  getCurrentTime() {
    return this.currTime;
  }

  aa() {
    const temp1 = new Date().toISOString();
    this.getIntervalTimer(temp1);
    return temp1;
  }

  getIntervalTimer(timer) {
    setInterval(timer, 1000);
    return timer;
  }
  
  myTimer() {
    this.currTime = new Date().toISOString();
    // this.currTime.toLocaleTimeString();
    globalTime = this.currTime;
    return this.currTime;
  }

  /**
   * To delete the selected task after delete button is being hit.
   * The process will filter based on task's id
   * @param {*} selectedTask Pass the object of selected task
   * @param {*} taskList Pass the array object of task list from selected task
   * @memberof GlobalFnService
   */
  deleteTask(selectedTask, taskList, keysNo) {
    // console.log(selectedTask);
    // console.log(taskList);
    // console.log(keysNo);
    const tsk = [];
    Object.entries(taskList).forEach(([key, value]) => {
      if (Number(key) !== keysNo) {
        tsk.push(value);
      }
    });
    return (taskList = tsk);
  }

  /**
   * To append new task list after enter being hit on activity list.
   * The process will proceed once the task's length is more than 0
   * @param {*} event keypress enter event
   * @memberof ClockInPage
   */
  addTask(event, newTask, taskList) {
    // console.log("addTask");
    // console.log(event);
    // console.log(newTask);
    // console.log(taskList);
    if (event.code === "Enter" && newTask.length > 0) {
      taskList = taskList.push({
        // id: taskList.length,
        statusFlag: false,
        name: newTask,
      });
      // taskList = taskList.concat({
      //   id: taskList.length,
      //   status: false,
      //   activity: newTask,
      // });
    }

    return taskList;
  }

  async showToast(msg, cls?) {
    const toast = await this.gfToast.create({
      message: msg,
      mode: "ios",
      position: "top",
      cssClass: cls,
      duration: 2000,
    });
    toast.present();
    // this.gfToas
  }

  async showAlert(title?, msg?, cls?, okButtonHandler?) {
    const alert = await document.createElement('ion-alert');
    alert.cssClass = cls;
    alert.header = title;
    // alert.subHeader = subtitle;
    alert.message = msg;
    // alert.buttons = ["Ok"];
    alert.buttons = [
      {
        text: 'Ok',
        role: 'Ok',
        handler: () => {
          console.log('okButtonHandler');
          if (okButtonHandler === '/login') {
           this.gfRouter.navigate([okButtonHandler]);
          }
          console.log(okButtonHandler);
        }
      }
    ];
    document.body.appendChild(alert);
    return alert.present();
  }


  /**
   * To show loading spinner
   * @param {*} [disableDuration]
   * @memberof GlobalFnService
   */
  async showLoading(disableDuration?) {
    this.loading = await this.gfloading.create({
      message: "Please wait...",
      duration: (disableDuration) ? null : 3000,
    });

    await this.loading.present();
  }

  /**
   * To dismmiss loading spinner
   * @memberof GlobalFnService
   */
  async dissmissLoading() {
    await this.loading.dismiss();
  }

  uploadDoc() {
    let formData = new FormData();
    console.log(formData);
  }

  isClockin() {
    return localStorage.getItem("cin_token");
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
    this.gfnApi.patchWithHeader("/api/login-log", tempActivityLog).subscribe((resPatchActivtiy) => {
    }, (error) => {
      console.log(error);
    });
  }
}
