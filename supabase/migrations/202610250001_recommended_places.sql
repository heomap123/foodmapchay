create table if not exists public.recommended_places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  price_range text not null default '',
  real_review text not null default '',
  signature_dishes text not null default '',
  hygiene text not null default '',
  ambience text not null default '',
  suitable_hours text not null default '',
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.vegetarian_places (
  id text primary key,
  name text not null,
  address text not null,
  district text not null default '',
  ward text not null default '',
  city text not null default 'Cần Thơ',
  lat double precision not null,
  lng double precision not null,
  cuisine text not null default 'vegetarian',
  opening_hours text not null default '',
  price_range text not null default '',
  rating numeric(3,1) not null default 4.5,
  review_count integer not null default 0,
  source text not null default 'seed',
  created_at timestamptz not null default now()
);

create table if not exists public.recommendation_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.recommended_places enable row level security;
alter table public.vegetarian_places enable row level security;
alter table public.recommendation_admins enable row level security;

create or replace function public.is_recommendation_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.recommendation_admins as admins
    where admins.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_recommendation_admin() from public;
grant execute on function public.is_recommendation_admin() to anon, authenticated;
grant select on public.recommended_places to anon, authenticated;
grant select on public.vegetarian_places to anon, authenticated;
grant insert, update, delete on public.recommended_places to authenticated;
grant insert, update, delete on public.vegetarian_places to authenticated;
revoke all on public.recommendation_admins from anon, authenticated;

create policy "Anyone can view recommended places"
  on public.recommended_places for select
  to anon, authenticated
  using (true);

create policy "Anyone can view vegetarian places"
  on public.vegetarian_places for select
  to anon, authenticated
  using (true);

insert into public.vegetarian_places (id, name, address, district, ward, city, lat, lng, cuisine, opening_hours, price_range, rating, review_count, source)
values
  ('data-1', 'Ngon Vegan - Bến Ninh Kiều', '28 Hai Bà Trưng, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Khánh', 'Cần Thơ', 10.0383, 105.7859, 'vegan', '07:30–22:00', '100k-250k', 4.7, 12, 'seed'),
  ('data-2', 'Cơm chay Thiện Duyên', '262 Đường 30 Tháng 4, Tân An, Cần Thơ', 'Ninh Kiều', 'Tân An', 'Cần Thơ', 10.0289, 105.7732, 'vegetarian', '06:00–20:00', '50k-150k', 4.4, 701, 'seed'),
  ('data-3', 'Tịnh Chay', '60 Nam Kỳ Khởi Nghĩa, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Hòa', 'Cần Thơ', 10.0392, 105.7808, 'vegetarian', '06:00–19:00', '80k-220k', 4.9, 145, 'seed'),
  ('data-4', 'Quán ăn chay Bách Thảo', '86A Đề Thám, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Khánh', 'Cần Thơ', 10.0397, 105.7853, 'vegetarian', '06:30–21:30', '80k-180k', 5.0, 1, 'seed'),
  ('data-5', 'Nhà hàng chay Tịnh Bình', '80–82 Lương Định Của, Cái Khế, Cần Thơ', 'Cái Răng', 'Cái Khế', 'Cần Thơ', 10.0334, 105.7651, 'vegetarian', '08:30–21:00', '150k-400k', 4.8, 307, 'seed'),
  ('data-6', 'Nhà hàng chay Quý Liên', '4 Trần Văn Trà, KDC Hưng Phú 1, Cần Thơ', 'Cái Răng', 'Hưng Phú', 'Cần Thơ', 10.0168, 105.7561, 'vegetarian', '06:00–22:00', '100k-250k', 4.3, 705, 'seed'),
  ('data-7', 'Quán Chay An', 'Đường Nguyễn Văn Linh, Tân An, Cần Thơ', 'Ninh Kiều', 'Tân An', 'Cần Thơ', 10.0213, 105.7701, 'vegetarian', '09:00–21:30', '50k-200k', 4.7, 111, 'seed'),
  ('data-8', 'Mê Rau Vegetarian - Buffet Lẩu Rau Nấm', '102 Nguyễn An Ninh, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Hòa', 'Cần Thơ', 10.0421, 105.7821, 'vegan', '10:00–21:30', '150k-300k', 4.7, 140, 'seed'),
  ('data-9', 'Buffet Chay Tịnh Lạc', '34–36 Trần Đại Nghĩa, Cái Khế, Cần Thơ', 'Cái Răng', 'Cái Khế', 'Cần Thơ', 10.0265, 105.7615, 'vegetarian', '07:00–22:00', '100k-260k', 4.6, 104, 'seed'),
  ('data-10', 'Quán chay Ngọc Thảo', '98 Nguyễn Thái Học, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Khánh', 'Cần Thơ', 10.0364, 105.7812, 'vegetarian', 'Chưa có dữ liệu', '70k-180k', 4.7, 59, 'seed'),
  ('code-1', 'Quán Chay 3/2', '226 Đường 3/2, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Khánh', 'Cần Thơ', 10.0408, 105.7767, 'vegetarian', '08:00-21:00', '200k-400k', 4.7, 12, 'code'),
  ('code-2', 'Mì Chay Lê Bình', '18 Lê Bình, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Khánh', 'Cần Thơ', 10.0379, 105.7804, 'vegetarian', '09:00-21:00', '80k-200k', 4.6, 9, 'code'),
  ('code-3', 'Bún Chay Hưng Phú', '105 Hưng Phú, Cái Răng, Cần Thơ', 'Cái Răng', 'Hưng Phú', 'Cần Thơ', 10.0128, 105.7484, 'vegan', '07:00-20:00', '50k-150k', 4.5, 15, 'code'),
  ('code-4', 'Chay Tâm An', '57 Nguyễn Văn Cừ, Bình Thủy, Cần Thơ', 'Bình Thủy', 'Bình Thủy', 'Cần Thơ', 10.0725, 105.7469, 'vegetarian', '10:00-22:00', '150k-300k', 4.8, 27, 'code'),
  ('code-5', 'Nhà Chay Cần Thơ', '12 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'An Hòa', 'Cần Thơ', 10.0492, 105.7838, 'vegan', '08:30-21:30', '120k-250k', 4.7, 22, 'code'),
  ('code-6', 'Bếp Chay An Bình', '334 An Hòa, Bình Thủy, Cần Thơ', 'Bình Thủy', 'An Hòa', 'Cần Thơ', 10.0215, 105.7721, 'vegetarian', '08:00-20:30', '90k-180k', 4.6, 18, 'code'),
  ('code-7', 'Cơm Chay Xuân Khánh', '23 Xuân Khánh, Ninh Kiều, Cần Thơ', 'Ninh Kiều', 'Xuân Khánh', 'Cần Thơ', 10.0469, 105.7919, 'vegetarian', '09:00-21:00', '100k-220k', 4.5, 11, 'code'),
  ('code-8', 'Quán Chay Ô Môn', '12 Nguyễn Hữu Thọ, Ô Môn, Cần Thơ', 'Ô Môn', 'Thới Hòa', 'Cần Thơ', 10.1228, 105.6312, 'vegan', '07:30-20:30', '80k-180k', 4.6, 10, 'code')
  on conflict (id) do update set
    name = excluded.name,
    address = excluded.address,
    district = excluded.district,
    ward = excluded.ward,
    city = excluded.city,
    lat = excluded.lat,
    lng = excluded.lng,
    cuisine = excluded.cuisine,
    opening_hours = excluded.opening_hours,
    price_range = excluded.price_range,
    rating = excluded.rating,
    review_count = excluded.review_count,
    source = excluded.source;

create policy "Admins can add recommended places"
  on public.recommended_places for insert
  to authenticated
  with check ((select public.is_recommendation_admin()));

create policy "Admins can update recommended places"
  on public.recommended_places for update
  to authenticated
  using ((select public.is_recommendation_admin()))
  with check ((select public.is_recommendation_admin()));

create policy "Admins can delete recommended places"
  on public.recommended_places for delete
  to authenticated
  using ((select public.is_recommendation_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'locafood-recommendation-photos',
  'locafood-recommendation-photos',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can view recommended place photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'locafood-recommendation-photos');

create policy "Admins can upload recommended place photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'locafood-recommendation-photos'
    and (select public.is_recommendation_admin())
  );

create policy "Admins can update recommended place photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'locafood-recommendation-photos'
    and (select public.is_recommendation_admin())
  )
  with check (
    bucket_id = 'locafood-recommendation-photos'
    and (select public.is_recommendation_admin())
  );

create policy "Admins can delete recommended place photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'locafood-recommendation-photos'
    and (select public.is_recommendation_admin())
  );