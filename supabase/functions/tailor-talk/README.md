# tailor-talk

Drafts a company version of a library talk with AI. The admin checks the draft and saves it as their own talk.

Set up (once, on your computer, after `supabase link`):

    supabase secrets set ANTHROPIC_API_KEY=...     # paste it in your terminal only, never in chat or the repo
    supabase functions deploy tailor-talk

Then add `NEXT_PUBLIC_AI_TAILORING=on` to `.env.local` (and the website's settings) to show the button.
Local testing: `supabase functions serve tailor-talk --env-file supabase/functions/.env` (that file is git-ignored).
