# beeWhere-Employee
A project for employees mobile checkin


## Installation
```bash
$ npm install
```


## Running the app

```bash
# development
$ ionic serve
```

## Build for mobile 
Make sure you already install [Android Studio](https://developer.android.com/studio/) to build our android application and [XCode](https://developer.apple.com/xcode/) for iOS to build our android application 

1. Build the project to generate www folder
```bash
$ ionic build
```

2. Add android/ios platform using Capacitor
```bash
$ npx cap add android
$ npx cap add ios
```

3. Copy changes to native project
If only web code has changed
```bash
$ npx cap copy
```

If only plugins has changed
```bash
$ npx cap sync
```

For both copy your web code and update your plugins 
```bash
$ npx cap sync
```

4. Open project 
To open project using android studio
```bash
$ npx cap open android
```
To open project using XCode
```bash
$ npx cap open ios
```

More References: 

1. [Deploy Capactior Applications to Android Development](https://www.joshmorony.com/deploying-capacitor-applications-to-android-development-distribution/)
2. [Ionic framework documentations on developing ios](https://ionicframework.com/docs/developing/ios)
3. [Ionic framework documentations on developing android](https://ionicframework.com/docs/developing/android)
