-- Recorded read-aloud audio for the built-in talk library (src/core/voice.ts, scripts/voice/). Additive: one bucket.
--
-- Public read: it holds only recordings of the library's own words, the same for every company: no company data,
-- names, signatures or site notes (those are never recorded). Files are named by a fingerprint of the words, so
-- rewording a talk makes new files. Nobody can write from the app: uploads happen from the owner's computer with the
-- service-role key (scripts/voice/upload.ts), which bypasses these policies and never reaches the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('talk-audio', 'talk-audio', true, 1048576, array['audio/mpeg', 'application/json'])
on conflict (id) do nothing;
