import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-inbox-details",
  templateUrl: "./inbox-details.page.html",
  styleUrls: ["./inbox-details.page.scss"],
})
export class InboxDetailsPage implements OnInit {
  
  public data = require("../sampledata.json");

  constructor() {}

  ngOnInit() {}
}
