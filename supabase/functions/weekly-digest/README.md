# weekly-digest

Monday-morning email to each company's owners, admins and office: last week's sign-ins by team, makeups running out,
training cards, open issues and crew reports. Built by the same code as the in-app preview (Admin → Company → Weekly
email), so the email and the app always agree. Anyone can turn their own copy off there.

## Set up (once, on your computer, after `supabase link`)

1. Make a free account at resend.com, add and verify your sending domain, and create an API key.
2. Set the secrets (paste them in your terminal only, never in chat or the repo):

       supabase secrets set RESEND_API_KEY=...
       supabase secrets set DIGEST_FROM="Safety summary <summary@yourdomain.com>"
       supabase secrets set APP_URL=https://your-app-address
       supabase secrets set DIGEST_SECRET=$(openssl rand -hex 32)    # note it for step 4

3. Deploy: `npm run functions:sync && supabase functions deploy weekly-digest --no-verify-jwt`
   (`--no-verify-jwt` because the schedule calls it with the secret header, not a user's sign-in.)
4. Schedule it in the Supabase SQL editor (Mondays 12:00 UTC = 8 AM Eastern). Put your project ref and the secret in:

       create extension if not exists pg_cron;
       create extension if not exists pg_net;
       select cron.schedule('weekly-digest', '0 12 * * 1', $$
         select net.http_post(
           url := 'https://<project-ref>.supabase.co/functions/v1/weekly-digest',
           headers := jsonb_build_object('Content-Type', 'application/json', 'x-digest-secret', '<DIGEST_SECRET>'),
           body := '{}'::jsonb, timeout_milliseconds := 120000)
       $$);

## Test without sending

    curl -X POST 'https://<project-ref>.supabase.co/functions/v1/weekly-digest?dry=1&company=<company id>' -H 'x-digest-secret: <DIGEST_SECRET>'

A dry run returns each company's subject, recipient count and text, and sends and logs nothing. With no RESEND_API_KEY
every run is dry. Locally: `supabase functions serve weekly-digest --env-file supabase/functions/.env --no-verify-jwt`.

## Rules
- One email per company per week (the send log claims the week before sending).
- Paused or closing companies are skipped. Addresses are never logged, only how many.
- The email says it documents safety meetings and doesn't mean the company is compliant.
