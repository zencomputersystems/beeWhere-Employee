import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SupportPageRoutingModule } from './support-routing.module';

import { SupportPage } from './support.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SupportPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SupportPage]
})
export class SupportPageModule {}
