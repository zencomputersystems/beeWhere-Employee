import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockPage } from './clock.page';

const routes: Routes = [
  {
    path: '',
    component: ClockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockPageRoutingModule {}
