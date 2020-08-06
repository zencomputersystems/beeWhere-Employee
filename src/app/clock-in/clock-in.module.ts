import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInPageRoutingModule } from './clock-in-routing.module';

import { ClockInPage } from './clock-in.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ClockInPageRoutingModule, MatSelectModule, ReactiveFormsModule],
  providers: [Geolocation, Geofence],
  declarations: [ClockInPage],
})
export class ClockInPageModule {}
