import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"],
})
export class ReportPage implements OnInit {
  @ViewChild("barChart") barChart;

  bars: any;
  colorArray: any;

  public curRTime = new Date().toISOString();

  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

  public reportType;

  public searchForm: FormGroup;

  public genReport;
  constructor(private rpFormBuilder: FormBuilder) {
    this.searchForm = this.rpFormBuilder.group({
      type: [null, Validators.required],
      duration: [null, Validators.required],
      enableStatus: true
    });
  }

  ngOnInit() {
    console.log(this.globalData);
    console.log(this.searchForm);
  }


  reporte() {
    console.log(this.reportType);
    console.log(this.searchForm);
  }

  showReport() {
    console.log("showReport");
    console.log(this.searchForm);
  
    this.genReport = true;
    if (this.searchForm.status === "VALID") {
      console.log('success');
    }
  }

}
