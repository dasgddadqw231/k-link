-- 통화를 THB 하나로 통일한다.
--
-- 태국 법인의 장부라 회계사가 보는 숫자도, 팀이 매일 보는 숫자도 바트다. 원화
-- 금액과 그날 환율을 따로 들고 있으면 같은 거래가 두 숫자로 남고, 어느 쪽이
-- 장부인지 매번 되물어야 했다. 한국 매입도 결제한 바트 금액으로 적는다.
--
-- 적용 시점에 products의 cost_krw는 전부 0이고 finance_entries는 비어 있어
-- 환산할 값이 없었다.
--
-- 주의: 이 마이그레이션은 앞선 번들을 깨뜨린다. 옛 코드가 currency·rate_to_thb를
-- 쓰기 때문에, 배포보다 먼저 적용하면 라이브에서 저장이 전부 막힌다. 프런트를
-- 먼저 올리고 이걸 적용해야 한다.

alter table public.products rename column cost_krw to cost_thb;

-- amount_thb는 amount * rate_to_thb로 만들어지던 생성 열이다. 환율이 사라지면
-- amount와 같은 값이라, 하나만 남긴다.
alter table public.finance_entries drop column amount_thb;
alter table public.finance_entries drop column currency;
alter table public.finance_entries drop column rate_to_thb;
