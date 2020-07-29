import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-inbox-details",
  templateUrl: "./inbox-details.page.html",
  styleUrls: ["./inbox-details.page.scss"],
})
export class InboxDetailsPage implements OnInit {
  
  public data = require('../sampledata.json');

  public curTime = new Date().toISOString();
  
  constructor() {}

  ngOnInit() {
    console.log(this.data);
    console.log(this.data.userInfo.notifications);
    console.log(this.data.userInfo.notifications.approval);
    console.log(this.data.userInfo.notifications.updates);
  }
}
