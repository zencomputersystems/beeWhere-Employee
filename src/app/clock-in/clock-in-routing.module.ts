import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInPage } from './clock-in.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInPageRoutingModule {}
