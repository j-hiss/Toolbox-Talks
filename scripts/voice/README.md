# Recorded voices

The app reads talks with recorded voices where a recording exists and the phone's own voice for everything else
(site notes, today's heat index, draft translations, languages without a recorded voice). Recordings are made on a
computer, never in the app.

1. **Check the voice license.** The voice in `src/content/voices.ts` needs a row in `docs/voice-licenses.md` with
   "Yes" in "Commercial use OK?". The steps below skip any voice without one.
2. `npm run voice:lines` lists every line still to record (English, plus translations marked reviewed).
3. `python3 scripts/voice/generate.py` records them with Kokoro (setup steps are at the top of the file).
4. `npm run voice:upload` uploads new files, then each voice's manifest, to the `talk-audio` bucket.

Rewording a talk changes its lines, so step 2 picks up only what changed. Old recordings stay; nothing points at them.
`audio-out/` is ignored by git.
