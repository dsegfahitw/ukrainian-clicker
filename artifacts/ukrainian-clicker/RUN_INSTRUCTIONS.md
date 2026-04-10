# RUN_INSTRUCTIONS

## 1. Prerequisites
- Node.js 18+
- npm 9+
- For Android: Android Studio + JDK 17 (JDK 21 also works with current Gradle setup)
- For iOS: Xcode 15+ (macOS only) + CocoaPods

## 2. Install Dependencies
```bash
npm install
```

## 3. Run Development Server
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173)

## 4. Build Production Web Version
```bash
npm run build
```
Output: `dist/`

## 5. Sync to Mobile Platforms
```bash
npx cap sync
```

## 6. Android — Debug APK
```bash
npx cap open android
```
In Android Studio: `Build -> Generate Signed APK`

Or command line:
```bash
cd android && ./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## 7. Android — Release APK
```bash
cd android && ./gradlew assembleRelease
```
Requires keystore configuration in `build.gradle`.

## 8. iOS — Open in Xcode (macOS only)
```bash
npx cap open ios
```
In Xcode: `Product -> Archive -> Distribute App`

## 9. Deploy Web Version to Netlify/Vercel
Vercel:
```bash
npx vercel --prod
```

Netlify:
```bash
npx netlify deploy --prod --dir=dist
```

## 10. Game Save Location
Browser/WebView localStorage key:
```text
ukrainets_save
```

Clear save:
```js
localStorage.removeItem("ukrainets_save")
```
