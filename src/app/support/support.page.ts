import { GlobalFnService } from '@services/global-fn.service';
import { APIService } from '@services/_services/api.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  /**
   * Bind current time in ISO format
   * @memberof SupportPage
   */
  public curSTime = new Date().toISOString();

  /**
   * Get sample data from json
   * @memberof SupportPage
   */
  public data = require("../sampledata.json");
  public globalData = require("@services/_providers/global.json");

  /**
   * Bind support type either requestForm or suggestionForm. Initialized as requestForm
   * @memberof SupportPage
   */
  public supportType = 'requestForm';

  /**
   * Bind form values
   * @type {FormGroup}
   * @memberof SupportPage
   */
  public mform: FormGroup;

  public reqDetails: FormGroup;

  /**
   * Creates an instance of SupportPage.
   * @param {FormBuilder} formbuilder get methods from FormBuilder
   * @memberof SupportPage
   */
  constructor( public formbuilder: FormBuilder, private sApi: APIService, private sGFn: GlobalFnService) {
    this.mform = formbuilder.group({
      supportType: this.supportType,
      requestForm: this.formbuilder.group({
        type: ["", Validators.required],
        title: ["", Validators.required],
        supportDoc: [""],
        description: ""
      }),
      suggestionForm: this.formbuilder.group({
        title: ["", Validators.required],
        description: ""
      })
    });

    this.reqDetails = formbuilder.group({
      clocksTime: ["", Validators.required],
      inTime: ["", Validators.required],
      outTime: ["", Validators.required]
    })
  }

  /**
   * Initialize methods in this page
   * @memberof SupportPage
   */
  ngOnInit() {
    // console.log(this.globalData.userInfo.userId);
    // console.log(this.globalData.userInfo.email);
  }

  /**
   * Will be executed once submit button is pressed.
   * Get the validated form then post it
   * @memberof SupportPage
   */
  submitForm() {
    console.log(this.globalData.userInfo);
    console.log(this.data);
    console.log(this.mform);
    console.log(this.reqDetails.value);
    console.log(this.reqDetails.value.inTime);
    console.log(new Date(this.reqDetails.value.outTime).valueOf());
    let tempObj;
    switch (this.mform.get("supportType").value) {
      case 'suggestion':
        if (this.mform.get('suggestionForm').valid) {
          console.log(this.mform.get('suggestionForm').value);
          tempObj = {
            requestType: "suggestions",
            subject: this.mform.get("suggestionForm").value.title,
            starttime: null,
            endtime: null,
            supportingDoc: "",
            description: (this.mform.get("suggestionForm").value.description === null) ? ""
              : this.mform.get("suggestionForm").value.description,
            userGuid: this.globalData.userInfo.userId,
            userEmail: this.globalData.userInfo.email
          };

          console.log(tempObj);
          this.sApi.postWithHeader('/support', tempObj).subscribe((postRes) => {
            console.log(postRes);
            this.sGFn.showToast('Subitted', 'success');
            this.mform.get("suggestionForm").reset();
            console.log(this.mform.get("suggestionForm").value);
          });
        } else {
          this.sGFn.showToast('Please fill in required fields ', 'error');
        }
        break;

      default:
        if (this.mform.get("requestForm").valid) {
          console.log(this.mform.get("requestForm").value);
          tempObj = {
            requestType: this.mform.get("requestForm").value.type,
            subject: this.mform.get("suggestionForm").value.title,
            starttime: new Date(this.reqDetails.value.inTime).valueOf(),
            endtime: new Date(this.reqDetails.value.outTime).valueOf(),
            supportingDoc: this.mform.get("requestForm").value.supportDoc,
            description: (this.mform.get("suggestionForm").value.description === null) ? ""
              : this.mform.get("suggestionForm").value.descriptio,
            userGuid: this.globalData.userInfo.userId,
            userEmail: this.globalData.userInfo.email
          };
          console.log(tempObj);
        } else {
          this.sGFn.showToast('Please fill in required fields ', 'error');
        }
        break;
    }
  }

  /**
   * on change segment event either request or suggestion then update it into form (supportType)
   * @memberof SupportPage
   */
  changeSegmentType() {
    console.log(this.mform.value.supportType);
    this.supportType = this.mform.value.supportType;
    this.mform.reset();
    this.mform.controls.supportType.setValue(this.supportType);

  }

  /**
   * Get form validation states based on type (request or suggestion)
   * @param {*} type
   * @returns
   * @memberof SupportPage
   */
  getFormControls(type) {
    return (type === 'request') ? (this.mform.get('requestForm') as FormArray).controls 
    : (this.mform.get('suggestionForm') as FormArray).controls;
  }
}
