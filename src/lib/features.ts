// Features that are built but held back from real use. Set in .env.local; the preview turns them on.

/**
 * Insurance partner portal: needs counsel's privacy review before real use (Joe, 2026-10-10). Hidden unless
 * NEXT_PUBLIC_PARTNER_PORTAL=pilot. A partner who already has summaries can still read them; only the company-side
 * invite and send are hidden.
 */
export const partnerPortalPilot = (): boolean => process.env.NEXT_PUBLIC_PARTNER_PORTAL === "pilot";
