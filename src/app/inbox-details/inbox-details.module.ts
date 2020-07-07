import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InboxDetailsPageRoutingModule } from './inbox-details-routing.module';

import { InboxDetailsPage } from './inbox-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InboxDetailsPageRoutingModule
  ],
  declarations: [InboxDetailsPage]
})
export class InboxDetailsPageModule {}
