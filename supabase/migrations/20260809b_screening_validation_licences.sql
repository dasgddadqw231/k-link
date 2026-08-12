-- 아직 회색으로 남아 있던 세 자리를 채운다.
--
-- 앞 마이그레이션으로 05~07(선적)은 따라갈 수 있게 됐지만, 브랜드별 진행 줄에서
-- 01·03·10은 여전히 "적을 칸 없음"이었다. 없는 것을 있는 척하지 않으려고 회색으로
-- 둔 자리이고, 칸을 만들면 회색이 사라진다.
--
--  · 01 제품 검토·분류 — 갈래를 정한 결과가 어디에도 안 남았다. 그런데 이 판정이
--    전체 일정을 정한다(2영업일이냐 90영업일이냐). 남기지 않으면 두 달 뒤에
--    "우리 이거 무슨 갈래였지"를 다시 판정한다.
--  · 03 시장 검증 — 시딩은 인플루언서 탭에 건별로 남지만 "이 브랜드는 봤다"는
--    한 줄이 없었다. 날짜 하나면 된다.
--  · 10 사후관리 — อ.7 만료일은 회사에 붙지 브랜드나 제품에 붙지 않는다. 걸어 둘
--    표가 아예 없어서 만료 자체를 기록할 수 없었다.
--
-- 전부 더하기만 한다.

-- 01 — 판정 결과. 제품에 붙는다.
alter table public.products
  add column if not exists food_group text not null default 'unknown'
    check (food_group in ('unknown', 'general', 'labelled', 'standardised', 'controlled')),
  add column if not exists hs_code text not null default '',
  -- FDA 말고 어느 부처가 더 붙는지. 육류·계란·꿀이면 축산국(dld), 식물성 원료면
  -- 농업국(doa). unknown 과 none 은 다른 뜻이다 — 아직 안 봤다와 볼 것이 없다.
  add column if not exists extra_permit text not null default 'unknown'
    check (extra_permit in ('unknown', 'none', 'dld', 'doa', 'other'));

-- 03 — 시장 검증을 언제 마쳤는지. 비어 있으면 아직 안 본 것이다.
alter table public.brands
  add column if not exists validated_on date;

-- 10 — 만료가 있는 것들. 종류를 열로 고정하지 않고 행으로 둔다. 허가는 앞으로
-- 늘어나고(품목 추가, 창고 이전, 광고 심의 건별) 늘어날 때마다 열을 더하면
-- 그때마다 마이그레이션이 필요해진다.
create table if not exists public.licences (
  id uuid primary key default gen_random_uuid(),

  kind text not null default 'other'
    check (kind in ('or7', 'ad', 'vat', 'trademark', 'other')),

  name text not null default '',
  number text not null default '',

  -- 브랜드나 제품에 걸리는 허가면 채운다. อ.7 처럼 회사 전체에 걸리면 둘 다 빈다.
  brand_id uuid references public.brands (id) on delete cascade,
  product_id uuid references public.products (id) on delete cascade,

  issued_on date,
  expires_on date,

  note text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists licences_expires_on_idx on public.licences (expires_on);
create index if not exists licences_brand_id_idx on public.licences (brand_id);

alter table public.licences enable row level security;

drop policy if exists licences_authenticated on public.licences;
create policy licences_authenticated
  on public.licences
  for all
  to authenticated
  using (true)
  with check (true);
