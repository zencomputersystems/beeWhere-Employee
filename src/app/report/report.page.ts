import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  public curRTime = new Date().toISOString();

  public data = require('../sampledata.json');
  constructor() { }

  ngOnInit() {
  }

}
