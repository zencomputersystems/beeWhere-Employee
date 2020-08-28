import { Refresher } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarComponentOptions } from 'ion2-calendar';
import { APIService } from '@services/_services/api.service';
// import * as moment from 'moment/moment.js';

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"],
})
export class ReportPage implements OnInit {
  @ViewChild("barChart") barChart;

  // moment = require('moment');
  bars: any;
  colorArray: any;

  public curRTime = new Date().toISOString();

  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

  public searchForm: FormGroup;

  public genReport;
  public dataAttendance;
  public dataActivtiy;
  public moment = require("moment");

  public dateRange;

  public type: "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  public optionsRange: CalendarComponentOptions = {
    from: new Date(1),
    pickMode: "range",
    showToggleButtons: true,
    // canBackwardsSelected: true,
  };

  constructor(private rpFormBuilder: FormBuilder, private rApi: APIService) {
    this.searchForm = this.rpFormBuilder.group({
      type: [null, Validators.required],
      duration: [null, Validators.required],
      enableStatus: true,
    });
  }

  ngOnInit() {
    console.log(this.globalData);
    console.log(this.searchForm);
  }

  reporte() {
    console.log(this.searchForm);
  }

  showReport() {
    console.log("showReport");
    console.log(this.searchForm);

    if (this.searchForm.status === "VALID") {
      let startDate;
      let endDate;
      switch (this.searchForm.get("duration").value) {
        case "custom":
          console.log("custom");
          console.log(this.dateRange);
          break;

        default:
          console.log(
            "startDate=>",
            this.moment().startOf(this.searchForm.get("duration").value).unix()
          );
          console.log(
            "endDate=>",
            this.moment().endOf(this.searchForm.get("duration").value).unix()
          );
          startDate = this.moment()
            .startOf(this.searchForm.get("duration").value)
            .unix();
          endDate = this.moment()
            .endOf(this.searchForm.get("duration").value)
            .unix();
          break;
      }

      this.generateReport(
        startDate,
        endDate,
        this.searchForm.get("type").value
      );
    }
  }

  generateReport(start, end, type) {
    this.rApi
      .getWithHeader("/api/clock/history/" + type + "/" + start + "/" + end)
      .subscribe((resp) => {
        this.genReport = true;
        console.log(resp);
        type === "attendance"
          ? (this.dataAttendance = resp)
          : (this.dataActivtiy = resp);
      });
  }

  refreshReportPage(event: Refresher) {
    this.searchForm.reset();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
