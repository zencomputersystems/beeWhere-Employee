import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  public curSTime = new Date().toISOString();
  public data = require("../sampledata.json");

  public supportType = 'requestForm';

  public mform: FormGroup;

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
  }

  ngOnInit() {
    console.log(this.supportType);
    // this.mform.valueChanges.subscribe(data => {
    //   if (data.supportType !== this.supportType) {
    //     this.supportType = data.supportType;
    //     // this.mform.reset();
    //     console.log(this.mform);
    //   }
    //   // this.supportType = data.supportType;
    //   // this.mform.reset();

    // });
  }

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

  getFormControls(type) {
    return (type === 'request') ? this.mform.controls.requestForm.controls : this.mform.controls.suggestionForm.controls;
  }
}
