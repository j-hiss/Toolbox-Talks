-- Form 301 incident report details on each injury case, and what OSHA's online filing (Injury Tracking Application)
-- needs on the yearly summary. Additive: nullable or defaulted columns only. Same owners-and-admins-only policies.
-- Fields checked against OSHA Form 301 (Rev. 04/2004) and the ITA CSV specifications on 2026-10-10.

alter table public.injury_cases
  add column employee_address  text not null default '' check (char_length(employee_address) <= 300),   -- 301 field 2
  add column birth_date        date,                                                                     -- field 3
  add column hire_date         date,                                                                     -- field 4
  add column sex               text not null default '' check (sex in ('', 'M', 'F')),                   -- field 5
  add column provider_name     text not null default '' check (char_length(provider_name) <= 120),      -- field 6
  add column provider_facility text not null default '' check (char_length(provider_facility) <= 300),  -- field 7
  add column er_visit          boolean,                                                                  -- field 8
  add column inpatient         boolean,                                                                  -- field 9
  add column time_started      time,                                                                     -- field 12
  add column time_of_event     time,                                                                     -- field 13
  add column time_unknown      boolean not null default false,
  add column activity_before   text not null default '' check (char_length(activity_before) <= 1000),   -- field 14
  add column what_happened     text not null default '' check (char_length(what_happened) <= 2000),     -- field 15
  add column injury_detail     text not null default '' check (char_length(injury_detail) <= 1000),     -- field 16
  add column object_substance  text not null default '' check (char_length(object_substance) <= 500),   -- field 17
  add column death_date        date,                                                                     -- field 18
  add column completed_by      text not null default '' check (char_length(completed_by) <= 120),
  add column completed_title   text not null default '' check (char_length(completed_title) <= 120),
  add column completed_phone   text not null default '' check (char_length(completed_phone) <= 40);
alter table public.injury_cases
  add constraint injury_cases_301_dates check (
    (birth_date is null or birth_date < injury_date) and (hire_date is null or hire_date <= injury_date)
    and (death_date is null or (outcome = 'death' and death_date >= injury_date))),
  add constraint injury_cases_301_time check (not (time_unknown and time_of_event is not null));

-- What the online filing needs about the establishment (ITA establishment and summary file).
alter table public.injury_summaries
  add column legal_name      text not null default '' check (char_length(legal_name) <= 100),
  add column ein             text not null default '' check (ein ~ '^([0-9]{9})?$'),
  add column street          text not null default '' check (char_length(street) <= 100),
  add column city            text not null default '' check (char_length(city) <= 100),
  add column state           text not null default '' check (state ~ '^([A-Z]{2})?$'),
  add column zip             text not null default '' check (zip ~ '^([0-9]{5}([0-9]{4})?)?$'),
  add column peak_employees  int check (peak_employees between 0 and 1000000),
  add column establishment_type int not null default 1 check (establishment_type in (1, 2, 3));
