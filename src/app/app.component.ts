import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appVersion: AppVersion,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.appVersion.getVersionCode().then(value => {
      if (localStorage.getItem("app_versioncode") === null) {
        localStorage.setItem("app_versioncode", value.toString());
      } else {
        if (Number(localStorage.getItem("app_versioncode")) !== value) {
          localStorage.clear();
          this.router.navigate(["/"]);
        }
      }
    }).catch(err => {
      localStorage.clear();
      this.router.navigate(["/"]);
    });
  }
}
