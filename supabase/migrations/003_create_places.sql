-- Places table (formerly venues)
create table places (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  location geography(POINT) not null,
  address text,
  place_type text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Index for efficient geo queries
create index places_location_idx
  on places using GIST (location);
