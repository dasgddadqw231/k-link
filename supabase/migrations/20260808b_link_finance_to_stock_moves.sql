-- 재고 이동과 그 이동이 만든 재무 한 줄을 잇는다.
--
-- 이 열이 없을 때는 memo의 "SKU · 수량"이 유일한 단서였다. 판매를 잘못 적었을 때
-- 어느 재무 항목을 같이 고쳐야 하는지 사람이 눈으로 찾아야 했고, 그래서 아무도
-- 안 고쳤다. 키로 이어 두면 이동을 지울 때 딸린 돈 기록도 같이 정리할 수 있다.
--
-- on delete set null: 이동이 사라져도 돈 기록은 남긴다. 장부에서 금액이 소리 없이
-- 증발하는 것보다, 출처를 잃은 줄이 눈에 띄게 남는 쪽이 낫다.
alter table public.finance_entries
  add column stock_move_id uuid references public.stock_moves(id) on delete set null;

-- 한 이동에 재무는 한 줄.
--
-- 재무 기록이 실패했을 때 앱이 그 한 줄만 다시 시도하는데, 서버에는 들어갔고
-- 응답만 끊긴 경우가 있다. 그때 재시도가 두 번째 줄을 만들면 매출이 부풀어도
-- 아무도 모른다. 여기서 DB가 막고, 앱은 23505를 "이미 적혔음"으로 읽는다.
create unique index finance_entries_stock_move_uniq
  on public.finance_entries (stock_move_id)
  where stock_move_id is not null;
