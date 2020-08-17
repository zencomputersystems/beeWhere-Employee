import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

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
  constructor( public formbuilder: FormBuilder ) {
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
  }

  /**
   * Will be executed once submit button is pressed.
   * Get the validated form then post it
   * @memberof SupportPage
   */
  submitForm() {
    console.log(this.getFormControls('request'));
    console.log(this.mform.value);
  }

  /**
   * on change segment event either request or suggestion then update it into form (supportType)
   * @memberof SupportPage
   */
  changeSegmentType() {
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
