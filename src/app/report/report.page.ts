import { GlobalFnService } from '@services/global-fn.service';
// import { Refresher } from '@ionic/angular';
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
  public rangeForm: FormGroup;
  public genReport;
  public dataAttendance;
  public dataActivtiy;
  public moment = require("moment");

  public dateRange;
  public labelStartDate;
  public labelEndDate;

  public startDateRange;
  public endDateRange;
  public countClickPrevButton = 0;
  public countClickNextButton = 0;
  public type: "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  public disabledCustom: boolean = false;

  public optionsRange: CalendarComponentOptions = {
    from: new Date(1),
    pickMode: "range",
    showToggleButtons: true,
    // canBackwardsSelected: true,
  };
  isShowDateTitle: boolean;
  isShowSkeletonText: boolean;
  countPrevReportEmpty: any = 0;
  countPrevValueClickPrevButton: number;

  constructor(private rpFormBuilder: FormBuilder, private rApi: APIService, public rGlobalFn: GlobalFnService) {
    this.searchForm = this.rpFormBuilder.group({
      type: [null, Validators.required],
      duration: [null, Validators.required],
      enableStatus: true,
    });

    this.rangeForm = this.rpFormBuilder.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  ngOnInit() { }

  showReport(isPrevNextReport?) {
    this.genReport = false;
    this.isShowSkeletonText = true;
    this.dataAttendance = [];
    this.dataActivtiy = [];

    if (this.searchForm.status === "VALID") {

      this.countPrevValueClickPrevButton = this.countClickPrevButton;
      switch (isPrevNextReport) {
        case "prev":
          this.countClickPrevButton++;
          this.countClickNextButton--;
          this.isShowDateTitle = true;
          this.isShowSkeletonText = true;
          break;

        case "next":
          this.countClickPrevButton--;
          this.countClickNextButton++;
          this.isShowDateTitle = true;
          this.isShowSkeletonText = true;
          break;

        default:
          this.countClickNextButton = 0;
          this.isShowDateTitle = false;
          this.isShowSkeletonText = false;
          break;
      }

      switch (this.searchForm.get("duration").value) {
        case "custom":
          this.startDateRange = new Date(this.rangeForm.value.startDate).getTime() / 1000;
          this.endDateRange = new Date(this.rangeForm.value.endDate).getTime() / 1000;
          break;

        case 'week':
          if (isPrevNextReport === 'prev') {
            this.startDateRange = this.moment().subtract(this.countClickPrevButton, 'isoWeek').startOf('isoWeek').unix();
            this.endDateRange = this.moment().subtract(this.countClickPrevButton, 'isoWeek').endOf('isoWeek').unix();
          } else if (isPrevNextReport === 'next') {
            this.startDateRange = this.moment().add(this.countClickNextButton, 'isoWeek').startOf('isoWeek').unix();
            this.endDateRange = this.moment().add(this.countClickNextButton, 'isoWeek').endOf('isoWeek').unix();

          } else {
            this.startDateRange = this.moment()
              .startOf('isoWeek')
              .unix();
            this.endDateRange = this.moment()
              .endOf('isoWeek')
              .unix();
          }
          break;

        default:
          if (isPrevNextReport === 'prev') {
            console.log(this.countClickPrevButton);
            console.log(this.searchForm.get("duration").value);
            this.startDateRange = this.moment()
              .subtract(this.countClickPrevButton, this.searchForm.get("duration").value)
              .startOf(this.searchForm.get("duration").value).unix();
            this.endDateRange = this.moment()
              .subtract(this.countClickPrevButton, this.searchForm.get("duration").value)
              .endOf(this.searchForm.get("duration").value).unix();

          } else if (isPrevNextReport === 'next') {
            console.log(this.countClickNextButton);
            console.log(this.searchForm.get("duration").value);
            this.startDateRange = this.moment()
              .add(this.countClickNextButton, this.searchForm.get("duration").value)
              .startOf(this.searchForm.get("duration").value).unix();
            this.endDateRange = this.moment()
              .add(this.countClickNextButton, this.searchForm.get("duration").value)
              .endOf(this.searchForm.get("duration").value).unix();
          } else {
            this.startDateRange = this.moment()
              .startOf(this.searchForm.get("duration").value)
              .unix();
            this.endDateRange = this.moment()
              .endOf(this.searchForm.get("duration").value)
              .unix();

          }
          break;
      }

      if ((this.startDateRange < this.endDateRange) && this.startDateRange !== null && this.endDateRange !== null) {
        console.log('ok');
        console.log(this.startDateRange);
        console.log(this.endDateRange);

        this.generateReport(
          this.startDateRange,
          this.endDateRange,
          this.searchForm.get("type").value
        );
      } else {
        console.log('error');
      }
    }
  }

  generateReport(start, end, type) {
    this.labelStartDate = new Date(start * 1000);
    this.labelEndDate = new Date(end * 1000);
    this.rApi
      .getWithHeader("/api/clock/history/" + type + "/" + start + "/" + end)
      .subscribe((resp) => {
        this.genReport = true;
        this.isShowDateTitle = true;
        this.isShowSkeletonText = false;
        this.rGlobalFn.dissmissLoading();
        type === "attendance"
          ? (this.dataAttendance = resp)
          : (this.dataActivtiy = resp);

        if (this.searchForm.get("duration").value === 'year') {
          this.countPrevReportEmpty = ((resp as any).length < 1 && (this.countClickPrevButton > this.countPrevValueClickPrevButton))
            ? this.countPrevReportEmpty + 1 : this.countPrevReportEmpty - 1;
        }
      }, (error) => {
        this.rGlobalFn.dissmissLoading();
        this.rGlobalFn.showAlert(
          error.status + " " + error.statusText,
          error.error,
          "alert-error"
        );
      });
  }

  generateReportFromButton(buttonType) {
    console.log(buttonType);


  }

  refreshReportPage(event) {
    // refreshReportPage(event: Refresher) {
    this.searchForm.reset();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
