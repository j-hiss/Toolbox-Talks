// The attendance status model. Every roster person on a saved record ends as exactly one of these.
// Origin: prototype/index.html counts, STATUS. Every report counts with this; do not add a second tally.

export type AttendanceStatus = "signed" | "not_signed" | "absent";

export const STATUS_LABEL: Record<AttendanceStatus, string> = {
  signed: "Signed",
  not_signed: "Not signed",
  absent: "Absent",
};

export const isFlagged = (s: AttendanceStatus) => s !== "signed";

export type StatusCounts = Record<AttendanceStatus, number> & { flagged: number; total: number };

export function countStatuses(attendees: { status: AttendanceStatus }[]): StatusCounts {
  const c = { signed: 0, not_signed: 0, absent: 0 };
  for (const a of attendees) {
    if (!(a.status in c)) throw new Error(`Unknown attendance status: ${String(a.status)}`);
    c[a.status]++;
  }
  return { ...c, flagged: c.not_signed + c.absent, total: attendees.length };
}

/**
 * Decide each roster person's status when a talk is saved. Present + signature = signed; present without a
 * signature = not_signed; not present = absent. A signature from someone marked absent is ignored, never upgraded.
 */
export function resolveStatus(present: boolean, hasSignature: boolean): AttendanceStatus {
  if (!present) return "absent";
  return hasSignature ? "signed" : "not_signed";
}
