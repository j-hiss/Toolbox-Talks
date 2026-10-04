# Toolbox Talks

Weekly safety toolbox talks for crews, without the clipboard. Pick this week's talk, read it to the crew in their
language (or let the phone read it), collect finger signatures, and keep a signed PDF record the owner can pull up
anytime.

Company-neutral and multi-company: construction, manufacturing, agriculture & fertilizer, and warehouse & logistics.
One codebase runs as a website, an iPhone app and an Android app.

This app documents safety meetings. It does not by itself certify OSHA compliance.

## Status
- **Prototype:** complete (`prototype/index.html`, open it in a browser). It is the reference behavior.
- **Real app:** project set up. Core logic (talk library, climate, 52-week plan, attendance statuses) is ported with
  tests. The first database tables (companies, members, roles, teams, people) are in place with company isolation
  proven by a test. Screens are next, ported one at a time from the prototype.

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
To try it on your phone, connect it to the same Wi-Fi and open `http://<your-mac's-name>.local:3000`.

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

### Checks (run each on its own before pushing)
```sh
npm run typecheck
npm run lint
npm test          # core logic tests
npm run build     # the static site that ships to web, iPhone and Android
npm run test:db   # company isolation test (needs local Supabase running)
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
