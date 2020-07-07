import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInPageRoutingModule } from './clock-in-routing.module';

import { ClockInPage } from './clock-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInPageRoutingModule
  ],
  declarations: [ClockInPage]
})
export class ClockInPageModule {}
