-- 브랜드별·분류별 전 기간 누계.
--
-- 화면은 최근 거래 2000건만 읽어 온다. 한 달 장부를 보기엔 충분하지만, 브랜드
-- 정산처럼 "계약 이후 전부"를 세는 숫자는 그 한도 밖이 잘리면 조용히 작아진다.
-- 판매를 자동으로 기표하기 시작하면서 행이 쌓이는 속도가 빨라져 실제로 닿는다.
--
-- 합계는 몇 줄뿐이라 통째로 읽어도 싸다. 세는 일은 DB에 맡기고 화면은 읽기만 한다.
create view public.finance_totals
with (security_invoker = on) as
select
  brand_id,
  direction,
  category,
  sum(amount) as total,
  count(*)::integer as entries
from public.finance_entries
group by brand_id, direction, category;
