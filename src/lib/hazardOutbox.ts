// Hazard reports sent from the app go onto the phone first (./queue.ts), then upload: a jobsite with no signal never
// loses one, and a retry never sends it twice (one client id per report). Photos are shrunk on the phone first.
import { createQueue } from "./queue";
import type { HazardSend } from "@/lib/data/hazards";

/** companyId for reports sent signed in; site for reports from a jobsite sticker (no account). */
export type QueuedHazard = HazardSend & { companyId: string | null; site?: string };
export const hazardQueue = createQueue<QueuedHazard>("tt-hazard-outbox", "This phone is out of room. Connect to send the waiting reports, then try again.");
