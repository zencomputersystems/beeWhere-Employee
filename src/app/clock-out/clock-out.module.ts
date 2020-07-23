import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { ClockOutPageRoutingModule } from './clock-out-routing.module';

import { ClockOutPage } from './clock-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockOutPageRoutingModule
  ],
  providers: [Geolocation],
  declarations: [ClockOutPage]
})
export class ClockOutPageModule {}
