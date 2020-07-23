import { Injectable } from '@angular/core';
import * as sampleData from '../app/sampledata.json';

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

  constructor() {}

  /**
   * This method is to get the list of sample data in arrays from json file
   * @memberof GlobalFnService
   */
  sampleDataList() {
    return require("src/app/sampledata.json");
  }

  /**
   * This method is to get current date & time locally
   * @returns
   * @memberof GlobalFnService
   */
  getCurrentDateTime() {
    return new Date().toISOString();
  }

  getIntervalDateTime() {
    return setInterval(this.getCurrentDateTime, 1000);
  }

  /**
   * To delete the selected task after delete button is being hit.
   * The process will filter based on task's id
   * @param {*} selectedTask Pass the object of selected task
   * @param {*} taskList Pass the array object of task list from selected task
   * @memberof GlobalFnService
   */
  deleteTask(selectedTask, taskList) {
    return (taskList = taskList.filter((data) => {
      if (data.id !== selectedTask.id) {
        console.log('data.id !== selectedTask.id')
        console.log(data);
      } else {
        console.log('dssds')
        console.log(data);
      }

      return data.id !== selectedTask.id;
    }));
  }

  /**
   * To append new task list after enter being hit on activity list.
   * The process will proceed once the task's length is more than 0
   * @param {*} event keypress enter event
   * @memberof ClockInPage
   */
  addTask(event, newTask, taskList) {
    console.log('addTask')
    console.log(JSON.stringify(taskList))
    console.log(taskList.lenth)
    if (event.code === "Enter" && newTask.length > 0) {
       taskList = taskList.push({
        id: taskList.length,
        status: false,
        activity: newTask,
      });
      // taskList = taskList.concat({
      //   id: taskList.length,
      //   status: false,
      //   activity: newTask,
      // });
    }
    console.log('lalalala')
    console.log(JSON.stringify(taskList))

    return taskList;
  }
}
