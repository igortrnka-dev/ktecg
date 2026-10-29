-- Inquiry fields added after the first release (duration and shift pattern on the contact form).
-- Safe to run more than once, on a database that ran an older or the current 0001_init.sql.

alter table inquiries add column if not exists duration text;
alter table inquiries add column if not exists shift_pattern text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'inquiries'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%shift_pattern%'
  ) then
    alter table inquiries add constraint inquiries_shift_pattern_check
      check (shift_pattern in ('unsure', 'single', 'double', 'triple', 'rotation'));
  end if;
end $$;
