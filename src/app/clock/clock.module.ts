import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockPageRoutingModule } from './clock-routing.module';

import { ClockPage } from './clock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockPageRoutingModule
  ],
  providers: [Geolocation],
  declarations: [ClockPage]
})
export class ClockPageModule {}
