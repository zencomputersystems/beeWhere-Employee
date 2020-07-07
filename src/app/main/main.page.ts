import { Component, OnInit } from '@angular/core';
import * as sampledata from '../sampledata.json';

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class MainPage implements OnInit {
  constructor() {}

  public data = require('../sampledata.json');

  ngOnInit() {
    console.log(this.data);
  }
}
