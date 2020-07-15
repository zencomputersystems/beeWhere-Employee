import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInPageRoutingModule } from './clock-in-routing.module';

import { ClockInPage } from './clock-in.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInPageRoutingModule,
  ],
  providers: [Geolocation],
  declarations: [ClockInPage]
})
export class ClockInPageModule {}