-- Reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  visit_day smallint,     -- 0 = Monday, 6 = Sunday
  visit_time text,         -- 'morning', 'afternoon', 'evening', 'night'
  quietness smallint not null check (quietness between 1 and 5),
  comfort smallint not null check (comfort between 1 and 5),
  lighting smallint not null check (lighting between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Optional: one review per user per place
create unique index reviews_user_place_unique
  on reviews (user_id, place_id);
