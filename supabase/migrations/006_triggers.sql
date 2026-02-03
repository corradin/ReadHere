-- Trigger to auto-update 'updated_at' on reviews
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reviews_set_updated_at
before update on reviews
for each row
execute procedure set_updated_at();
