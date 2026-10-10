#!/usr/bin/env python3
"""Step 2 of making recorded audio (run on your computer, not in the app): record each line in audio-out/lines.json.

Setup once on a Mac:
    brew install espeak-ng ffmpeg
    python3 -m pip install "kokoro>=0.9.4" soundfile

Then:
    python3 scripts/voice/generate.py

Writes audio-out/<voice>/<key>.mp3 and adds each key to audio-out/<voice>/manifest.json. Safe to stop and run again:
lines already recorded are skipped. Kokoro's model weights are Apache 2.0 (see docs/voice-licenses.md).
"""
import json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "audio-out")
LANG_CODE = {"en": "a", "es": "e", "pt": "p", "zh": "z"}  # Kokoro lang_code per app language

def main():
    try:
        import soundfile as sf
        from kokoro import KPipeline
    except ImportError:
        sys.exit("Install the voice tools first: brew install espeak-ng ffmpeg && python3 -m pip install 'kokoro>=0.9.4' soundfile")
    with open(os.path.join(OUT, "lines.json")) as f:
        rows = json.load(f)
    pipelines = {}
    done = 0
    for row in rows:
        folder = os.path.join(OUT, row["voice"])
        os.makedirs(folder, exist_ok=True)
        mp3 = os.path.join(folder, row["key"] + ".mp3")
        manifest_path = os.path.join(folder, "manifest.json")
        manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else []
        if row["key"] in manifest and os.path.exists(mp3):
            continue
        code = LANG_CODE[row["lang"]]
        if code not in pipelines:
            pipelines[code] = KPipeline(lang_code=code)
        audio = [a for _, _, a in pipelines[code](row["text"], voice=row["voice"], speed=row["speed"])]
        if not audio:
            print("No audio for:", row["text"][:60]); continue
        import numpy as np
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            sf.write(tmp.name, np.concatenate(audio), 24000)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name, "-ac", "1", "-b:a", "48k", mp3], check=True)
            os.unlink(tmp.name)
        manifest.append(row["key"])
        json.dump(sorted(set(manifest)), open(manifest_path, "w"))
        done += 1
        if done % 25 == 0:
            print(f"{done} recorded…")
    print(f"Recorded {done} line(s). Next: npm run voice:upload")

if __name__ == "__main__":
    main()
