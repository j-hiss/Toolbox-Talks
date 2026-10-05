# Toolbox Talks

Weekly safety toolbox talks for crews, without the clipboard. Pick this week's talk, read it to the crew in their
language (or let the phone read it), collect finger signatures, and keep a signed PDF record the owner can pull up
anytime.

Company-neutral and multi-company: construction, manufacturing, agriculture & fertilizer, and warehouse & logistics.
One codebase runs as a website, an iPhone app and an Android app.

This app documents safety meetings. It does not by itself certify OSHA compliance.

## Status
- **Prototype:** complete (`prototype/index.html`, open it in a browser). It is the reference behavior.
- **Real app:** sign-in, company setup, Admin (people, teams, jobsites, roles, company info), jobsite GPS, and the
  full talk flow (read with read-aloud, who's here, signatures, saved record) with offline saving and a Records
  list. Core logic is tested and company isolation is proven by a database test. Next: the PDF record and reports.

## Run it on your Mac (free, nothing in the cloud)

### One-time setup
1. **Node.js 22**: install from https://nodejs.org (the LTS installer).
2. **Docker Desktop**: install from https://www.docker.com/products/docker-desktop and open it once. Local Supabase
   runs inside it.
3. **Xcode** (for the iPhone app): install from the Mac App Store, open it once to accept the license, then
   install an iPhone simulator when it asks.
4. **Android Studio** (for the Android app): install from https://developer.android.com/studio and let it set up
   an emulator.
5. Get the code and install:
   ```sh
   git clone https://github.com/j-hiss/Toolbox-Talks.git
   cd Toolbox-Talks
   npm install
   cp .env.example .env.local
   ```

### Every time
```sh
npm run db:start      # starts local Supabase (first run downloads it, a few minutes)
npx supabase status   # copy the API URL and anon key into .env.local (first time only)
npm run dev           # the web app at http://localhost:3000
```
**Signing in locally:** enter any email on the sign-in screen. The email doesn't really go out; local Supabase
catches it. Open the test inbox at http://127.0.0.1:54324 to get the 6-digit code. The first account you create
sets up a company and becomes its owner.

**Which database address to use.** The app talks to local Supabase at the address in `.env.local`, and
`127.0.0.1` means "this device". That's right for the browser on your Mac and the iPhone simulator, but not for:
- **Your real phone on the same Wi-Fi:** set `NEXT_PUBLIC_SUPABASE_URL=http://<your-mac's-name>.local:54321`, restart
  `npm run dev`, then open `http://<your-mac's-name>.local:3000` on the phone.
- **The Android emulator:** it reaches your Mac at `10.0.2.2`, so use `NEXT_PUBLIC_SUPABASE_URL=http://10.0.2.2:54321`
  and run `CAP_LOCAL=1 npm run android` (lets the test app use plain `http` to your Mac; never ship that build).

Your Mac's name is in System Settings → General → Sharing (shown as `something.local`).

`npm run db:stop` shuts local Supabase down when you're done.

### iPhone and Android apps
First time only, create the native projects:
```sh
npm run build
npx cap add ios
npx cap add android
```
Then any time:
```sh
npm run ios       # builds the app and opens it in Xcode → press ▶ to run it in the simulator
npm run android   # builds the app and opens it in Android Studio → press ▶ to run it in the emulator
```

### Location (GPS)
"Use my location" and "Find nearest" use the phone's GPS. Browsers only allow it on `https` or on the computer
running the app (`localhost`), so on a real phone over Wi-Fi (`http://your-mac.local:3000`) the browser will refuse.
Test GPS in the iPhone simulator (Features → Location) or in the phone apps. When you first create the native
projects, add the permission text:
- **iPhone:** in Xcode, `ios/App/App/Info.plist` → add **Privacy - Location When In Use Usage Description**, e.g.
  "Finds the jobsite you're at so talks are logged to the right place."
- **Android:** in `android/app/src/main/AndroidManifest.xml` add
  `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />` and `ACCESS_COARSE_LOCATION`.

### Camera (crew photo)
The optional crew photo uses the phone's camera through a normal file picker. In the native projects add:
- **iPhone:** `Info.plist` → **Privacy - Camera Usage Description** ("Takes an optional photo of the crew at a
  safety talk.") and **Privacy - Photo Library Usage Description** (same text).
- **Android:** `<uses-permission android:name="android.permission.CAMERA" />` in `AndroidManifest.xml`.

### Signatures and photos are private files
Signatures and crew photos are stored in a private Supabase Storage bucket (`talk-files`, created by migration
0009), in a folder per company and per talk. Only that company's members can add or read them, nobody can replace or
delete them, and the app reads them through one-minute signed links. After pulling this change run
`npx supabase migration up`. Records saved before it keep their signatures inside the record and still show.

### Phone preview
`npm run preview:build` packs the current screens into one page with demo data (`preview/dist/preview.html`). It's
published in Claude so you can check progress from your phone. It opens already signed in (code `123456` if you sign
out). The preview can't use GPS.

### Phone reminders
Reminders are scheduled by the phone itself (Capacitor Local Notifications), so they only work in the iPhone and
Android apps. After `git pull` and `npm install`, run `npm run app:sync` so the native projects pick up the plugin.

### Checks (run each on its own before pushing)
```sh
npm run typecheck
npm run lint
npm test          # core logic tests
npm run build     # the static site that ships to web, iPhone and Android
npm run test:db   # company isolation test (needs local Supabase running)
npm run test:preview   # clicks through the phone preview in a real browser (first time: npx playwright install chromium)
```

## What's here
| Path | What it is |
|---|---|
| `src/core/` | Shared logic with no screens: plan, climate, attendance, talks. Used by web and the phone apps |
| `src/content/talks.ts` | The talk library (English + draft Spanish) |
| `src/app/` | Screens |
| `supabase/migrations/` | Database tables and row-level security |
| `scripts/db-isolation-test.mjs` | Proves one company can't see another's data |
| `prototype/index.html` | The working prototype, the reference for every screen |
| `docs/SPEC.md` | What the product does and why |
| `CLAUDE.md` | Rules for anyone (or any agent) building here: read first |
| `BLUEPRINT-reuse-map.md` | What already exists and where, so nothing gets built twice |
| `docs/build-go-template.md` | How a build task is handed off and reported back |
| `docs/lessons-learned.md` | Mistakes worth not repeating |
| `docs/voice-licenses.md` | License check for every voice used in audio |
