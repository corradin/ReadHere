-- Bookmarks table
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Prevent duplicate bookmarks
create unique index bookmarks_user_place_unique
  on bookmarks (user_id, place_id);
