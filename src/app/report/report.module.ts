import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';

import { ReportPage } from './report.page';
import { CalendarModule } from 'ion2-calendar';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  declarations: [ReportPage],
})
export class ReportPageModule {}
