import { Injectable } from '@angular/core';
import * as sampleData from '../app/sampledata.json';

/**
 * This services is to store the general functions that might will be used in multiple pages
 * @export
 * @class GlobalFnService
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalFnService {

  // public currDateTime = new Date().toISOString();

  constructor() { }

  /**
   * This method is to get the list of sample data in arrays from json file
   * @memberof GlobalFnService
   */
  sampleDataList() {
    return require('src/app/sampledata.json');
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
}
