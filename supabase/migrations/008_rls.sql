-- Enable RLS on tables that need it
alter table profiles enable row level security;
alter table reviews enable row level security;
alter table bookmarks enable row level security;

-- Places are public

-- Policies: profiles
create policy "public read profiles"
  on profiles
  for select
  using (true);

create policy "users update own profile"
  on profiles
  for update
  using (auth.uid() = id);

create policy "users delete own profile"
  on profiles
  for delete
  using (auth.uid() = id);


-- Policies: reviews
create policy "public read reviews"
  on reviews
  for select
  using (true);

create policy "users insert own review"
  on reviews
  for insert
  with check (auth.uid() = user_id);

create policy "users update own review"
  on reviews
  for update
  using (auth.uid() = user_id);

create policy "users delete own review"
  on reviews
  for delete
  using (auth.uid() = user_id);


-- Policies: bookmarks
create policy "users insert own bookmarks"
  on bookmarks
  for insert
  with check (auth.uid() = user_id);

create policy "users select own bookmarks"
  on bookmarks
  for select
  using (auth.uid() = user_id);

create policy "users update own bookmarks"
  on bookmarks
  for update
  using (auth.uid() = user_id);

create policy "users delete own bookmarks"
  on bookmarks
  for delete
  using (auth.uid() = user_id);
