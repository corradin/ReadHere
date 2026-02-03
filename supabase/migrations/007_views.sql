-- Aggregation view for map queries and lists
create view place_with_scores as
select
  p.id,
  p.name,
  p.place_type,
  p.location,
  p.address,
  r.visit_day,
  r.visit_time,
  avg(r.quietness)::numeric(3,2) as avg_quietness,
  avg(r.comfort)::numeric(3,2) as avg_comfort,
  avg(r.lighting)::numeric(3,2) as avg_lighting,
  count(r.id) as review_count
from places p
left join reviews r on r.place_id = p.id
group by p.id, r.visit_day, r.visit_time;
