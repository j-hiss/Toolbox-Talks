-- My record: an employee sees their own talk history and what they owe. Working out which weeks counted needs the
-- company's talk cadence (every week, every 2 weeks, ...), which until now only staff could read. A cadence is a
-- company setting, not anyone's personal data, so an employee may read their own company's. Additive: one policy.
create policy "employees read cadences" on public.company_cadences for select to authenticated using (private.is_employee(company_id));
