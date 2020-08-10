import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@services/_helpers/auth-guard.service';

const routes: Routes = [
  {
    path: "",
    redirectTo: "clock-in",
    pathMatch: "full",
    canActivate: [AuthGuardService],
  },
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "startup",
    loadChildren: () =>
      import("./startup/startup.module").then((m) => m.StartupPageModule),
  },
  {
    path: "main",
    loadChildren: () =>
      import("./main/main.module").then((m) => m.MainPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "clock-in",
    loadChildren: () =>
      import("./clock-in/clock-in.module").then((m) => m.ClockInPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "inbox-details",
    loadChildren: () =>
      import("./inbox-details/inbox-details.module").then(
        (m) => m.InboxDetailsPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "support",
    loadChildren: () =>
      import("./support/support.module").then((m) => m.SupportPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "clock-out/:id/:time",

    loadChildren: () =>
      import("./clock-out/clock-out.module").then((m) => m.ClockOutPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "clock/:id/:time",
    loadChildren: () =>
      import("./clock/clock.module").then((m) => m.ClockPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "report",
    loadChildren: () =>
      import("./report/report.module").then((m) => m.ReportPageModule),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
