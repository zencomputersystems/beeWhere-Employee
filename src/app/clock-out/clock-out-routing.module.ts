import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockOutPage } from './clock-out.page';

const routes: Routes = [
  {
    path: '',
    component: ClockOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockOutPageRoutingModule {}
