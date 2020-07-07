import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InboxDetailsPage } from './inbox-details.page';

const routes: Routes = [
  {
    path: '',
    component: InboxDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxDetailsPageRoutingModule {}
