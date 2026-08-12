-- 브랜드별로 프로세스 어디쯤인지 따라갈 수 있게 만드는 마이그레이션.
--
-- 왜 필요했나. 지금까지 진행 상태는 두 개뿐이었다 — brands.status(lead→ended)와
-- products.fda_status. 그런데 프로세스 문서는 열 단계이고, 축이 서로 안 맞는다.
--
--  · brands.status 는 브랜드당 값 하나인데 'active' 하나가 03~10을 전부 삼킨다.
--  · 05~07(생산·선적·통관)은 브랜드 단위도 제품 단위도 아니고 선적 건 단위다.
--    같은 제품이라도 이번 컨테이너는 통관 중이고 다음 발주는 생산 중일 수 있다.
--
-- 그래서 선적을 개체로 만든다. 이게 없으면 그 선적의 B/L이 무엇이고 Form AK를
-- 받았는지 LPI를 넣었는지 걸어 둘 데가 없다 — 문서에서 가장 자주 막힌다고
-- 경고한 구간이 정확히 기록이 안 되는 구간이었다.
--
-- 전부 더하기만 한다. 지우거나 바꾸는 것은 없다.

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),

  brand_id uuid not null references public.brands (id) on delete cascade,

  -- 단일 품목 선적이면 채우고, 여러 품목을 섞어 보내면 비워 둔다.
  -- 비어 있어도 07단계에서 붙는 입고 기록으로 무엇이 들어왔는지는 알 수 있다.
  product_id uuid references public.products (id) on delete set null,

  -- 사람이 부르는 이름. "2026-03 포지티바 1차" 처럼.
  code text not null default '',

  -- 프로세스 문서의 단계 id를 그대로 쓴다. 화면이 단계를 짐작하지 않고
  -- 저장된 값을 그대로 세게 하려면 두 곳의 이름이 같아야 한다.
  stage text not null default 'produce'
    check (stage in ('produce', 'export', 'import', 'done')),

  incoterm text not null default '',

  -- 06단계에서 있어야 넘어가는 것들. 문서의 gate 를 그대로 칸으로 옮긴 것이다.
  bl_no text not null default '',
  form_ak boolean not null default false,
  lpi_filed boolean not null default false,

  etd date,
  eta date,
  cleared_on date,

  note text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shipments_brand_id_idx on public.shipments (brand_id);
create index if not exists shipments_stage_idx on public.shipments (stage);

alter table public.shipments enable row level security;

drop policy if exists shipments_authenticated on public.shipments;
create policy shipments_authenticated
  on public.shipments
  for all
  to authenticated
  using (true)
  with check (true);

-- 07단계 입고를 그 선적에 잇는다. 선적을 지워도 입고 기록은 남아야 하므로
-- set null 이다 — 재고 숫자가 스키마 정리 때문에 움직이면 안 된다.
alter table public.stock_moves
  add column if not exists shipment_id uuid references public.shipments (id) on delete set null;

create index if not exists stock_moves_shipment_id_idx on public.stock_moves (shipment_id);

-- 04단계는 사실 두 가지 일이다 — 제품 등록(อย. 번호)과 라벨 사전승인이고,
-- 라벨 쪽이 훨씬 오래 걸린다. 칸이 fda_status 하나뿐이라 "등록은 끝났는데 라벨을
-- 기다리는 중"을 적을 수 없었다. 그 상태가 04단계에서 가장 오래 머무는 자리다.
alter table public.products
  add column if not exists label_status text not null default 'none'
    check (label_status in ('none', 'preparing', 'submitted', 'approved', 'rejected'));
