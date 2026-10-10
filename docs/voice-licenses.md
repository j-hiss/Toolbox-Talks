# Voice license ledger

**No voice is used for shipped audio until it has a row here with commercial use confirmed.** Check the model card /
license for each individual voice, not just the engine. Skip anything marked non-commercial ("NC").

The audio files are generated on our machine and only the files ship in the app, so the engines' software licenses
don't reach customers. The **voice** license is what matters.

| Language | Engine | Voice | License | Commercial use OK? | Checked on | Source link | Notes |
|---|---|---|---|---|---|---|---|
| English | Kokoro v1.0 | af_heart | Apache 2.0 (model weights and voices) | Yes | 2026-10-10 | https://huggingface.co/hexgrad/Kokoro-82M | Graded A (the top American English voice). Model card: "Apache-licensed weights … deployed in numerous projects and commercial APIs". Caveat for counsel: the card says part of the training audio was synthetic audio from closed TTS providers' models |
| Spanish | Kokoro v1.0 | ef_dora | Apache 2.0 (model weights and voices) | Yes | 2026-10-10 | https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md | Ungraded (3 Spanish voices: ef_dora, em_alex, em_santa). Same caveat as English. Listen against Piper es_MX before settling. Only reviewed translations are recorded |
| Spanish | Piper | _tbd (es_MX)_ | _per voice_ | _verify_ | | https://github.com/rhasspy/piper/blob/master/VOICES.md | Backup / comparison |
| Portuguese | Kokoro or Piper | _tbd_ | | | | | Kokoro has Brazilian Portuguese |
| Vietnamese | Piper | _tbd (vi_VN)_ | _per voice_ | _verify_ | | | |
| Chinese | Kokoro or Piper | _tbd_ | | | | | Kokoro has Mandarin |
| Haitian Creole | — | — | — | — | | | No Kokoro or Piper voice. Paid service or human recording |

Before launch, have someone confirm this table. This is a checklist, not legal advice. The voice tools
(`scripts/voice/`) only record voices with "Yes" in the commercial-use column.
