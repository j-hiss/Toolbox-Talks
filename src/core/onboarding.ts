// First-week setup checklist (Home, owners and admins). Pure module: which steps are done, worked out from what the
// company already has, never from a box someone ticked. Same steps for every industry.

export type SetupCounts = {
  people: number;      // active people on the roster
  teams: number;
  jobsites: number;    // active places (jobsites, office or shop)
  talks: number;       // saved talk records
  helpers: number;     // other people with app access, or invited
  certs: number;       // training cards on file
};

export type SetupStep = { id: keyof SetupCounts; title: string; why: string; href: string; done: boolean; optional?: boolean };

export function setupSteps(c: SetupCounts): SetupStep[] {
  return [
    { id: "people", title: "Add your people", why: "Everyone who signs at talks. Import a spreadsheet or add them one by one.", href: "/admin/#people", done: c.people >= 2 },
    { id: "teams", title: "Put them in teams", why: "Each team gets its own sign-in sheet and its own week on the report.", href: "/admin/#teams", done: c.teams >= 1 },
    { id: "jobsites", title: "Add a jobsite", why: "Talks are tied to a place, and the weather notes come from it. Your CRM can add them for you.", href: "/admin/#jobsites", done: c.jobsites >= 1 },
    { id: "talks", title: "Give your first talk", why: "Read it, collect signatures, and the PDF record is saved.", href: "/talk/", done: c.talks >= 1 },
    { id: "helpers", title: "Invite a foreman or the office", why: "Presenters give talks on their own phones; office sees reports.", href: "/admin/#access", done: c.helpers >= 1 },
    { id: "certs", title: "Add training cards", why: "Forklift, OSHA 10, first aid… expiring cards show up before they lapse.", href: "/admin/#training", done: c.certs >= 1, optional: true },
  ];
}

/** Done when every step that isn't optional is done. */
export const setupDone = (steps: SetupStep[]) => steps.every((s) => s.done || s.optional);
export const setupProgress = (steps: SetupStep[]) => ({ done: steps.filter((s) => s.done).length, total: steps.length });
