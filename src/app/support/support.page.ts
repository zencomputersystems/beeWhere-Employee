import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  public curSTime = new Date().toISOString();
  public data = require("../sampledata.json");

  public supportType = 'suggestion';
  constructor() { }

  ngOnInit() {
    console.log(this.supportType);
  }

}
