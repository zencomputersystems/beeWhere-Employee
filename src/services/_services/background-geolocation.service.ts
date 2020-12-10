import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse} from '@ionic-native/background-geolocation/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundGeolocationService {

  public bgLocConfig: BackgroundGeolocationConfig = {
    debug: true,
    startForeground: true,
    stopOnTerminate: false,
    notificationsEnabled: true,
    notificationText: "this app is runningggg"
  }
  
  constructor(
    private bggeoloc: BackgroundGeolocation
  ) { }

  configureBackgroundLocation() {
    this.bggeoloc.configure(this.bgLocConfig).then(() => {
      this.bggeoloc.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        console.log("configureBackgroundLocation");
        console.log(location);
        this.bggeoloc.finish();
      });
    });
  } 

  startBackgroundLocationDevice() {
    return this.bggeoloc.start();
  }

  stopBackgroundLocationDevice() {
    return this.bggeoloc.stop();
  }

  getBackgroundLocationPosition() {
    console.log("getBackgroundLocationPosition");
    return this.bggeoloc.getCurrentLocation();
  }

  

  watchBackgroundLocation() {
    this.bggeoloc.watchLocationMode().subscribe((resWatchLoc) => {
      console.log(resWatchLoc);
      console.log(JSON.stringify(resWatchLoc, null, " "));
    })
  }
}
