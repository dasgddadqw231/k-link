/**
 * 재고 — SKU 목록과 입출고 기록.
 *
 * 현재고를 직접 고치는 입력란은 두지 않는다. 항상 "무슨 일이 있었는지"를 적고
 * 수량은 그 합으로 나온다. 재고가 왜 이 숫자인지 나중에 되짚을 수 있어야
 * 통관·유통기한 문제가 생겼을 때 로트를 추적할 수 있다.
 *
 * 실사 조정만 예외로 목표 수량을 받는다 — 창고에서 세고 온 사람은 차이가 아니라
 * 센 숫자를 들고 오기 때문이다.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Plus, Scale } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  FDA_FLOW,
  MOVE_REASONS,
  num,
  thb,
  todayBkk,
  type Brand,
  type Direction,
  type FdaStatus,
  type Influencer,
  type MoveKind,
  type Product,
  type StockMove,
} from "../../lib/admin";
import {
  a,
  brandName,
  categoryLabel,
  fdaLabel,
  productName,
  reasonLabel,
  type AdminLang,
} from "./i18n";
import { onHand, useMoveCount, useProductMoves, type AdminData } from "./data";
import {
  Banner,
  Btn,
  Card,
  Chips,
  Confirm,
  Empty,
  Field,
  FilterChip,
  FilterRow,
  Page,
  Pill,
  SearchBox,
  Sheet,
  inputCls,
  useToast,
} from "./ui";

/** 유통기한이 이 안에 들어오면 눈에 띄게 표시한다. */
const EXPIRY_WARN_DAYS = 90;

/** 검색은 이름·SKU·브랜드를 한꺼번에 본다 — 어느 쪽을 기억하고 있을지 모른다. */
function matches(p: Product, q: string): boolean {
  const hay = `${p.sku} ${p.brand} ${p.name_ko} ${p.name_th} ${p.name_en}`.toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

/**
 * 브랜드는 키로 되찾는다. products.brand에 남아 있는 글자는 브랜드사 이름을
 * 고치면 낡으니, 연결이 살아 있으면 그쪽을 믿는다.
 */
function brandOf(p: Product, brands: Brand[], lang: AdminLang): string {
  const b = brands.find((x) => x.id === p.brand_id);
  return b ? brandName(b, lang) : p.brand;
}

export default function Inventory({
  lang,
  data,
  focusProductId,
  seedingId,
  onSeedingDone,
}: {
  lang: AdminLang;
  data: AdminData;
  /** 홈이나 다른 탭에서 짚어 준 제품. 들어오는 즉시 열어 준다. */
  focusProductId?: string;
  /** 인플루언서 발송을 출고로 잡는 중이라면 그 사람. */
  seedingId?: string;
  onSeedingDone: () => void;
}) {
  const c = a[lang];
  const [showInactive, setShowInactive] = useState(false);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(focusProductId ?? null);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  useEffect(() => {
    if (focusProductId) setOpenId(focusProductId);
  }, [focusProductId]);

  const list = useMemo(
    () =>
      data.products.filter(
        (p) => (showInactive || p.active) && (q.trim() === "" || matches(p, q)),
      ),
    [data.products, showInactive, q],
  );

  /** 재고 가치는 필터·검색과 무관하게 판매 중인 전부를 센다. */
  const active = data.products.filter((p) => p.active);
  const retailValue = active.reduce(
    (s, p) => s + onHand(data.stock, p.id) * Number(p.price_thb),
    0,
  );
  const costValue = active.reduce(
    (s, p) => s + onHand(data.stock, p.id) * Number(p.cost_thb),
    0,
  );

  const open = data.products.find((p) => p.id === openId) ?? null;
  const searchable = data.products.length > 6;
  const seeding = data.influencers.find((i) => i.id === seedingId) ?? null;

  return (
    <Page
      title={c.stockTitle}
      action={
        <Btn onClick={() => setEditing("new")}>
          <span className="flex items-center gap-1.5">
            <Plus size={15} />
            {c.stockNewProduct}
          </span>
        </Btn>
      }
    >
      {seeding && (
        <Banner
          label={c.stockSeedingFor}
          value={seeding.name}
          hint={c.stockPickProduct}
          onCancel={onSeedingDone}
          cancelLabel={c.cancel}
        />
      )}

      {searchable && (
        <SearchBox value={q} onChange={setQ} placeholder={`${c.search} · ${c.stockSku}`} />
      )}

      <FilterRow>
        <FilterChip active={!showInactive} onClick={() => setShowInactive(false)}>
          {c.all}
        </FilterChip>
        <FilterChip active={showInactive} onClick={() => setShowInactive(true)}>
          {c.stockShowInactive}
        </FilterChip>
      </FilterRow>

      <div className="mb-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold text-neutral-500">{c.stockTotalValue}</p>
        <p className="mt-1 text-xl font-black tabular-nums text-neutral-900">
          {thb(retailValue)}
        </p>
        <p className="mt-1 text-[11px] text-neutral-400 tabular-nums">
          {c.stockCostValue} {thb(costValue)}
        </p>
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty>{q.trim() ? c.noMatch : c.stockNoProducts}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {list.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                stock={onHand(data.stock, p.id)}
                expiry={data.stock[p.id]?.nearest_expiry ?? null}
                brandLabel={brandOf(p, data.brands, lang)}
                lang={lang}
                onClick={() => setOpenId(p.id)}
              />
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <ProductSheet
          product={open}
          lang={lang}
          data={data}
          seeding={seeding}
          onSeedingDone={onSeedingDone}
          onClose={() => setOpenId(null)}
          onEdit={() => {
            setOpenId(null);
            setEditing(open);
          }}
        />
      )}

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          lang={lang}
          brands={data.brands}
          onDone={async () => {
            setEditing(null);
            await data.reload();
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </Page>
  );
}

function expiryDaysLeft(expiry: string | null): number | null {
  if (!expiry) return null;
  const ms = new Date(`${expiry}T00:00:00Z`).getTime() - new Date(`${todayBkk()}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

function ProductRow({
  product,
  stock,
  expiry,
  brandLabel,
  lang,
  onClick,
}: {
  product: Product;
  stock: number;
  expiry: string | null;
  brandLabel: string;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  const days = expiryDaysLeft(expiry);

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-bold text-neutral-900">
              {productName(product, lang)}
            </span>
            {!product.active && <Pill>{c.stockInactive}</Pill>}
            {days !== null && days <= EXPIRY_WARN_DAYS && (
              <Pill tone={days < 0 ? "rose" : "amber"}>
                {c.stockExpirySoon} {expiry}
              </Pill>
            )}
          </span>
          <span className="mt-0.5 block truncate text-xs text-neutral-400">
            {[brandLabel, product.sku].filter(Boolean).join(" · ")}
          </span>
        </span>

        <span className="shrink-0 text-right">
          <span className="block text-lg font-black tabular-nums text-neutral-900">
            {num(stock)}
          </span>
          <span className="text-[11px] text-neutral-400">{product.unit}</span>
        </span>

        <ChevronRight size={16} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

const KIND_ICON = { in: ArrowDownLeft, out: ArrowUpRight, adjust: Scale } as const;

/** 재고 이동에 딸려 재무로 넘어가는 한 줄. 실패하면 이 모양 그대로 다시 시도한다. */
interface FinanceDraft {
  entry_on: string;
  direction: Direction;
  category: string;
  amount: number;
  memo: string;
  brand_id: string | null;
  stock_move_id: string;
}

/** 같은 이동을 두 번 기표하려 할 때 DB가 돌려주는 코드. 부분 유니크 색인이 막는다. */
const DUPLICATE = "23505";

/** 한 이동에 딸려 있는 재무 줄. 지우기 전에 무엇이 같이 사라지는지 보여 주려고 읽는다. */
interface LinkedEntry {
  id: string;
  direction: Direction;
  category: string;
  amount: number;
}

function ProductSheet({
  product,
  lang,
  data,
  seeding,
  onSeedingDone,
  onClose,
  onEdit,
}: {
  product: Product;
  lang: AdminLang;
  data: AdminData;
  seeding?: Influencer | null;
  onSeedingDone: () => void;
  onClose: () => void;
  onEdit: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  const stock = onHand(data.stock, product.id);
  /*
    이력은 이 제품 것만 따로 읽는다. 목록에 쓰는 moves는 전 제품 통틀어 최근
    500건이라, 잘 나가는 제품 하나가 다른 제품의 옛 기록을 밀어낸다. 이력에서
    이동을 지울 수 있게 된 이상 목록이 온전해야 한다.
  */
  const { moves: history, reload: reloadHistory } = useProductMoves(
    product.id,
    data.moves.filter((m) => m.product_id === product.id),
  );

  /** 재고·재무·이 제품 이력을 한꺼번에 맞춘다. 셋 중 하나만 묵으면 화면이 거짓말을 한다. */
  async function refreshAll() {
    await Promise.all([data.reload(), reloadHistory()]);
  }

  // 인플루언서 발송으로 넘어왔으면 출고·시딩까지 채워 놓고 시작한다.
  const [kind, setKind] = useState<MoveKind>(seeding ? "out" : "in");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState<string>(seeding ? "seeding" : MOVE_REASONS.in[0]);
  const [lot, setLot] = useState("");
  const [expiry, setExpiry] = useState("");
  const [movedOn, setMovedOn] = useState(todayBkk());
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [askNegative, setAskNegative] = useState(false);

  /**
   * 재고가 움직이면 돈도 움직인다 — 한국 입고는 나간 돈이고, 판매 출고는 들어온
   * 돈이다. 원래는 재고에 적고 재무 탭으로 가서 같은 내용을 또 적어야 했고,
   * 그러면 한쪽이 빠진다. 기본으로 켜 두고, 이미 다른 경로로 기록했다면 끈다.
   */
  const [alsoFinance, setAlsoFinance] = useState(true);
  /**
   * 재무에 적을 금액. null이면 수량 × 단가를 따라간다.
   *
   * 손대기 전까지 따라가게 두는 게 중요하다 — 수량을 고쳤는데 금액이 옛 수량에
   * 머물러 있으면 아무도 눈치채지 못한 채 틀린 매출이 장부에 남는다. 반대로 한 번
   * 고쳐 적은 금액은 그대로 지킨다. 할인·묶음 판매라 단가와 다른 경우다.
   */
  const [financeAmount, setFinanceAmount] = useState<string | null>(null);
  /**
   * 재고는 들어갔는데 재무가 실패해 아직 갈 곳이 없는 한 줄.
   *
   * 이게 남아 있는 동안은 새 입출고를 못 잡게 막는다. 구멍을 하나 열어 둔 채로
   * 다음 건을 쌓으면, 나중에 어느 줄이 빠졌는지 아무도 되짚지 못한다.
   */
  const [orphan, setOrphan] = useState<FinanceDraft | null>(null);
  /** 지울지 묻고 있는 이동과, 같이 사라질 돈 기록. */
  const [removing, setRemoving] = useState<{
    move: StockMove;
    finance: LinkedEntry | null;
  } | null>(null);

  function switchKind(k: MoveKind) {
    setKind(k);
    switchReason(MOVE_REASONS[k][0]);
  }

  /** 사유가 바뀌면 재무 금액도 새 맥락(매입가↔판매가)에서 다시 계산되게 놓아 준다. */
  function switchReason(r: string) {
    setReason(r);
    setFinanceAmount(null);
  }

  const entered = Number(qty);
  const valid = qty !== "" && Number.isFinite(entered) && entered >= 0;
  // 실사는 센 수량을 받고 차이만 기록한다. 나머지는 부호만 붙인다.
  const delta = kind === "adjust" ? entered - stock : kind === "out" ? -entered : entered;
  const canSave = valid && delta !== 0;
  const after = stock + delta;
  const goesNegative = valid && after < 0;

  /**
   * 저장 버튼을 눌렀을 때 몇 개가 되는지 미리 보여 준다.
   *
   * 실사에서 특히 중요하다 — 센 숫자를 넣는데 기록되는 건 차이라서, 그 차이가
   * 눈에 보이지 않으면 무엇을 저장하는지 모른 채 누르게 된다. 입고·출고는 적은
   * 수량이 곧 차이라서 다시 적지 않는다. 음수 둘이 나란히 서면 어느 쪽이 결과인지
   * 오히려 헷갈린다.
   */
  const preview = valid
    ? kind === "adjust"
      ? `${num(stock)} → ${num(after)} · ${delta > 0 ? "+" : ""}${num(delta)}`
      : `${num(stock)} → ${num(after)}`
    : null;

  /*
    돈이 오간 입출고만 재무로 이어 준다.

    한국 입고는 제품 매입(지출), 판매 출고는 매출(수입), 반품 입고는 환불(지출)이다.
    판매를 자동으로 기표하면서 반품도 같이 걸어야 했다 — 매출만 오르고 취소가
    안 잡히면 장부가 한쪽으로만 부푼다.

    시딩·샘플·파손은 재고만 줄고 그 순간 오간 현금이 없어서 여기에 걸지 않는다 —
    인플루언서 비용처럼 실제로 지불한 돈은 그쪽 탭에서 따로 적는다.
  */
  const isPurchase = kind === "in" && reason === "import";
  const isSale = kind === "out" && reason === "sale";
  const isRefund = kind === "in" && reason === "return";
  const linksFinance = isPurchase || isSale || isRefund;
  // 환불은 팔았던 값을 돌려주는 것이라 매입가가 아니라 판매가를 따라간다.
  const unitPrice = Number(isPurchase ? product.cost_thb : product.price_thb);
  const suggested = linksFinance ? entered * unitPrice : 0;
  const financeThb = financeAmount === null ? suggested : Number(financeAmount);
  const wantsFinance = linksFinance && alsoFinance;
  /** 켜 뒀는데 금액이 0이면 조용히 건너뛰지 않는다 — 저장 버튼을 잠근다. */
  const financeReady = financeThb > 0;
  const canFinance = wantsFinance && financeReady;
  /** 매출·환불은 브랜드 정산에 모이는데, 브랜드가 안 걸린 제품은 거기서 빠진다. */
  const brandGap = (isSale || isRefund) && alsoFinance && !product.brand_id;

  /*
    재무에 적을 한 줄. 재고가 저장된 뒤 실패하면 이 값을 그대로 들고 있다가
    재시도에 쓴다 — 폼은 이미 비워졌으므로 다시 만들어 낼 수가 없다.

    매출·환불에는 브랜드사를 달아 둔다. 정산할 때 "이 브랜드로 이번 달 얼마
    팔렸고 얼마 물러 줬나"를 재무에서 바로 뽑을 수 있어야 한다.
  */
  function financeRow(moveId: string): FinanceDraft {
    return {
      entry_on: movedOn,
      direction: isSale ? "in" : "out",
      category: isSale ? "sales" : isRefund ? "refund" : "goods",
      amount: financeThb,
      // 출고 메모에 적은 판매처가 재무에서도 보여야 나중에 그 건을 찾을 수 있다.
      memo: [product.sku, `${num(entered)}${product.unit}`, lot.trim(), note.trim()]
        .filter(Boolean)
        .join(" · "),
      brand_id: isSale || isRefund ? product.brand_id : null,
      stock_move_id: moveId,
    };
  }

  async function commit() {
    setBusy(true);
    setErr("");
    // 방금 만든 이동의 키를 받아 둔다 — 재무 한 줄이 어느 이동에서 나왔는지 잇는다.
    const { data: moved, error } = await supabase
      .from("stock_moves")
      .insert({
        product_id: product.id,
        kind,
        qty: delta,
        reason,
        lot: lot.trim(),
        expiry: expiry || null,
        note: note.trim(),
        moved_on: movedOn,
        influencer_id: reason === "seeding" ? (seeding?.id ?? null) : null,
      })
      .select("id")
      .single();
    if (error || !moved) {
      setBusy(false);
      setErr(c.saveFailed);
      return;
    }

    /*
      여기서부터 재고는 확정이다.

      두 표에 나눠 쓰는 일이라 재무만 실패할 수 있는데, 예전에는 에러만 띄우고
      입력값을 그대로 뒀다. 그러면 사람이 저장을 다시 누르고 — 재고가 두 번
      빠진다. 재무 한 줄을 못 적은 것보다 훨씬 고치기 어려운 상처다.

      그래서 재고가 들어간 즉시 입력을 비운다. 못 적은 재무 한 줄은 orphan에
      담아 두고 그것만 다시 시도하게 한다.
    */
    const pending = canFinance ? financeRow(moved.id) : null;
    // 로트마다 한 줄씩 적는 일이 많아 창은 열어 둔다. 대신 입력은 비워 둔다.
    setQty("");
    setLot("");
    setExpiry("");
    setNote("");
    setFinanceAmount(null);

    if (pending) {
      const { error: finErr } = await supabase.from("finance_entries").insert(pending);
      if (finErr) {
        setOrphan(pending);
        setBusy(false);
        await refreshAll();
        return;
      }
    }

    setBusy(false);
    await refreshAll();
    toast(c.saved);
    if (seeding) onSeedingDone();
  }

  /** 재고만 들어가고 못 적은 재무 한 줄을 다시 시도한다. 재고는 건드리지 않는다. */
  async function retryFinance() {
    if (!orphan) return;
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("finance_entries").insert(orphan);
    setBusy(false);
    /*
      23505는 실패가 아니라 "이미 들어가 있다"는 뜻이다.

      첫 시도가 서버에는 닿았는데 응답만 끊긴 경우다. 이걸 실패로 읽고 다시
      시도하게 두면 매출이 두 배로 적히는데, 이동당 한 줄만 허용하는 색인이
      그걸 막아 준다. 사람에게는 그냥 저장된 것으로 보이면 된다.
    */
    if (error && error.code !== DUPLICATE) return setErr(c.saveFailed);
    setOrphan(null);
    await refreshAll();
    toast(c.saved);
  }

  function save() {
    if (goesNegative) return setAskNegative(true);
    void commit();
  }

  /**
   * 지울 이동을 고르면 딸린 재무 한 줄이 있는지 먼저 확인한다.
   *
   * 화면에 들고 있는 거래 목록에서 찾지 않고 그때 물어본다 — 목록은 최근 2000건
   * 이라 오래된 이동의 짝은 거기 없을 수 있고, 지우기 직전에는 짐작이 아니라
   * 사실이 필요하다.
   */
  async function askRemove(move: StockMove) {
    setErr("");
    const { data: linked, error } = await supabase
      .from("finance_entries")
      .select("id, direction, category, amount")
      .eq("stock_move_id", move.id)
      .maybeSingle();
    /*
      못 물어봤으면 묻지 않은 채로 진행하지 않는다.

      여기서 조용히 "딸린 돈 기록 없음"으로 넘어가면, 확인창은 재고만 되돌아간다고
      말해 놓고 실제로는 매출 한 줄이 주인을 잃은 채 장부에 남는다. 모르는 것을
      아는 척하느니 한 번 더 눌러 달라고 하는 편이 낫다.
    */
    if (error) return setErr(c.saveFailed);
    setRemoving({ move, finance: (linked as LinkedEntry | null) ?? null });
  }

  /**
   * 이동을 지우고 딸린 돈 기록도 같이 지운다.
   *
   * 이동을 먼저 지운다. 외래키가 on delete set null이라 재무 줄은 남고 연결만
   * 끊기는데, 두 번째 삭제가 실패해도 돈 기록이 재무 탭에 그대로 보인다 —
   * 반대 순서였다면 돈만 사라지고 재고는 남는다. 둘 중 덜 나쁜 쪽을 고른다.
   */
  async function commitRemoveMove() {
    if (!removing) return;
    const { move, finance } = removing;
    setRemoving(null);
    setBusy(true);
    setErr("");

    const { error } = await supabase.from("stock_moves").delete().eq("id", move.id);
    if (error) {
      setBusy(false);
      setErr(c.saveFailed);
      return;
    }

    if (finance) {
      const { error: finErr } = await supabase
        .from("finance_entries")
        .delete()
        .eq("id", finance.id);
      if (finErr) {
        setBusy(false);
        await refreshAll();
        setErr(c.stockRemoveMoveFinanceLeft);
        return;
      }
    }

    setBusy(false);
    await refreshAll();
    toast(c.removed);
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={productName(product, lang)}
      footer={
        <div className="flex items-center gap-2">
          <Btn onClick={onEdit} variant="ghost">
            {c.stockEditProduct}
          </Btn>
          <div className="flex-1" />
          {/* 못 적은 재무 한 줄이 남아 있으면 그것부터 정리한다. */}
          <Btn
            onClick={save}
            disabled={busy || !!orphan || !canSave || (wantsFinance && !financeReady)}
          >
            {c.save}
          </Btn>
        </div>
      }
    >
      {orphan && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">{c.stockFinancePartial}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
            {c.stockFinanceSavedMove}
          </p>
          <p className="mt-2 text-sm font-bold text-amber-900 tabular-nums">
            {categoryLabel(orphan.category, c)} · {thb(orphan.amount)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Btn onClick={() => void retryFinance()} disabled={busy}>
              {c.stockFinanceRetry}
            </Btn>
            <Btn onClick={() => setOrphan(null)} variant="ghost" disabled={busy}>
              {c.stockFinanceDismiss}
            </Btn>
          </div>
        </div>
      )}

      <div className="mb-5 rounded-xl bg-neutral-50 px-4 py-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-neutral-500">{c.stockOnHand}</span>
          <span className="text-2xl font-black tabular-nums text-neutral-900">
            {num(stock)}
            <span className="ml-1 text-xs font-semibold text-neutral-400">{product.unit}</span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-neutral-200/70 pt-2 text-[11px] text-neutral-400 tabular-nums">
          <span>
            {c.stockCostThb} {thb(Number(product.cost_thb))}
          </span>
          <span>
            {c.stockPriceThb} {thb(Number(product.price_thb))}
          </span>
        </div>
      </div>

      {seeding && (
        <div className="mb-4">
          <Banner
            label={c.stockSeedingFor}
            value={seeding.name}
            onCancel={onSeedingDone}
            cancelLabel={c.cancel}
          />
        </div>
      )}

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.stockMove}</p>
        <Chips
          options={["in", "out", "adjust"] as const}
          value={kind}
          onChange={switchKind}
          labelOf={(k) => (k === "in" ? c.stockIn : k === "out" ? c.stockOut : c.stockAdjust)}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Field
          label={kind === "adjust" ? c.stockActual : c.stockQty}
          hint={kind === "adjust" ? c.stockActualHint : undefined}
        >
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={c.date}>
          <input
            type="date"
            value={movedOn}
            onChange={(e) => setMovedOn(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      {preview && (
        <p
          className={`-mt-2 mb-4 text-sm font-bold tabular-nums ${
            goesNegative ? "text-rose-600" : delta === 0 ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          <span className="mr-1.5 font-semibold text-neutral-400">{c.stockAfter}</span>
          {delta === 0 ? c.stockNoChange : preview}
        </p>
      )}

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.stockReason}</p>
        <Chips
          options={MOVE_REASONS[kind]}
          value={reason as (typeof MOVE_REASONS)[MoveKind][number]}
          onChange={switchReason}
          labelOf={(r) => reasonLabel(r, c)}
        />
      </div>

      {kind === "in" && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Field label={c.stockLot}>
            <input value={lot} onChange={(e) => setLot(e.target.value)} className={inputCls} />
          </Field>
          <Field label={c.stockExpiry}>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      )}

      <div className="mb-5">
        <Field label={c.note}>
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
        </Field>
      </div>

      {linksFinance && (
        <div className="mb-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={alsoFinance}
              onChange={(e) => setAlsoFinance(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#0C3F80]"
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-neutral-700">
                {isSale
                  ? c.stockAlsoFinanceSale
                  : isRefund
                    ? c.stockAlsoFinanceRefund
                    : c.stockAlsoFinance}
              </span>
              <span className="mt-0.5 block text-[11px] text-neutral-400">
                {isSale
                  ? c.stockAlsoFinanceSaleHint
                  : isRefund
                    ? c.stockAlsoFinanceRefundHint
                    : c.stockAlsoFinanceHint}
              </span>
            </span>
          </label>

          {alsoFinance && (
            <div className="mt-3.5 border-t border-neutral-200 pt-3.5">
              <Field label={c.stockFinanceAmount}>
                <input
                  type="number"
                  inputMode="decimal"
                  value={financeAmount ?? String(suggested)}
                  onChange={(e) => setFinanceAmount(e.target.value)}
                  className={inputCls}
                />
              </Field>
              {/*
                금액이 0이면 저장을 막고 이유를 적어 준다. 예전에는 그냥 재무만
                건너뛰었는데, 체크는 켜져 있으니 사람은 적힌 줄 알고 넘어갔다.
              */}
              <p
                className={`mt-2 text-sm font-bold tabular-nums ${
                  financeReady ? "text-neutral-600" : "text-rose-600"
                }`}
              >
                {financeReady ? (
                  <>
                    <span className="mr-1.5 font-semibold text-neutral-400">
                      {isSale ? c.finIn : c.finOut}
                    </span>
                    {thb(financeThb)}
                  </>
                ) : (
                  c.stockFinanceNeedsAmount
                )}
              </p>
              {/* 브랜드가 안 걸린 제품은 브랜드 정산 화면에서 조용히 빠진다. 미리 말해 준다. */}
              {brandGap && (
                <p className="mt-2 text-[11px] leading-relaxed text-amber-700">
                  {c.stockNoBrandLink}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {err && <p className="mb-4 text-sm text-rose-600">{err}</p>}

      <Confirm
        open={askNegative}
        tone="warn"
        title={c.stockNegativeTitle}
        body={c.stockNegativeBody}
        detail={
          <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 tabular-nums">
            {num(stock)} → <span className="text-rose-600">{num(after)}</span>
          </p>
        }
        confirmLabel={c.continue}
        cancelLabel={c.cancel}
        onCancel={() => setAskNegative(false)}
        onConfirm={() => {
          setAskNegative(false);
          void commit();
        }}
      />

      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold text-neutral-500">{c.stockHistory}</p>
        {history.length > 0 && (
          <p className="text-[11px] text-neutral-400">{c.stockHistoryTapToRemove}</p>
        )}
      </div>
      {history.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">{c.stockNoHistory}</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {history.map((m) => {
            const Icon = KIND_ICON[m.kind];
            return (
              <li key={m.id}>
                {/*
                  잘못 적은 이동을 되돌릴 길이 여기밖에 없다. 예전에는 기록을
                  넣기만 할 수 있어서, 수량을 틀리면 반대 이동을 하나 더 만들어
                  덮는 수밖에 없었다 — 그러면 이력에 없던 일이 두 줄 남는다.
                */}
                <button
                  onClick={() => void askRemove(m)}
                  disabled={busy}
                  className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-2.5 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-neutral-50 disabled:opacity-50"
                >
                  <Icon
                    size={14}
                    className={m.qty > 0 ? "shrink-0 text-emerald-600" : "shrink-0 text-rose-500"}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-neutral-700">
                      {reasonLabel(m.reason, c)}
                      {m.lot && <span className="text-neutral-400"> · {m.lot}</span>}
                    </span>
                    {/*
                      시딩이면 받은 사람 이름을 키로 되찾아 보여 준다. 목록에 없는
                      (지워진) 인플루언서면 메모로 물러선다 — 옛 기록은 이름만
                      남아 있다.
                    */}
                    <span className="block truncate text-[11px] text-neutral-400">
                      {[
                        m.moved_on,
                        m.influencer_id
                          ? (data.influencers.find((i) => i.id === m.influencer_id)?.name ?? m.note)
                          : m.note,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-sm font-bold tabular-nums ${
                      m.qty > 0 ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {m.qty > 0 ? "+" : ""}
                    {num(m.qty)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Confirm
        open={!!removing}
        tone="warn"
        title={c.stockRemoveMoveTitle}
        body={removing?.finance ? c.stockRemoveMoveWithFinance : c.stockRemoveMoveBody}
        detail={
          removing && (
            <div className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700">
              <p className="tabular-nums">
                {reasonLabel(removing.move.reason, c)} · {removing.move.qty > 0 ? "+" : ""}
                {num(removing.move.qty)} · {removing.move.moved_on}
              </p>
              {/* 같이 사라질 돈을 숫자로 보여 준다. 글로만 알리면 아무도 안 읽는다. */}
              {removing.finance && (
                <p className="mt-1.5 border-t border-neutral-200 pt-1.5 text-rose-600 tabular-nums">
                  {categoryLabel(removing.finance.category, c)} ·{" "}
                  {removing.finance.direction === "in" ? "+" : "−"}
                  {thb(Number(removing.finance.amount))}
                </p>
              )}
            </div>
          )
        }
        confirmLabel={c.remove}
        cancelLabel={c.cancel}
        onCancel={() => setRemoving(null)}
        onConfirm={() => void commitRemoveMove()}
      />
    </Sheet>
  );
}

function ProductForm({
  product,
  lang,
  brands,
  onDone,
  onClose,
}: {
  product: Product | null;
  lang: AdminLang;
  brands: Brand[];
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  /** 입출고 기록 수. 0이 아니면 삭제를 막는다 — 아래 commitRemove()의 주석 참고. */
  const moveCount = useMoveCount(product?.id ?? null);
  const [confirming, setConfirming] = useState(false);
  const [f, setF] = useState({
    sku: product?.sku ?? "",
    brand_id: product?.brand_id ?? "",
    name_ko: product?.name_ko ?? "",
    name_th: product?.name_th ?? "",
    name_en: product?.name_en ?? "",
    unit: product?.unit ?? "ea",
    cost_thb: String(product?.cost_thb ?? 0),
    price_thb: String(product?.price_thb ?? 0),
    active: product?.active ?? true,
    fda_status: product?.fda_status ?? ("none" as FdaStatus),
    fda_number: product?.fda_number ?? "",
    fda_on: product?.fda_on ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function save() {
    setBusy(true);
    setErr("");
    const chosen = brands.find((b) => b.id === f.brand_id);
    const row = {
      sku: f.sku.trim(),
      brand_id: f.brand_id || null,
      // 예전 자유 입력 칸도 브랜드명으로 맞춰 둔다 — 이걸 읽는 화면이 남아 있다.
      brand: chosen?.name ?? "",
      fda_status: f.fda_status,
      fda_number: f.fda_number.trim(),
      fda_on: f.fda_on || null,
      name_ko: f.name_ko.trim(),
      name_th: f.name_th.trim(),
      name_en: f.name_en.trim(),
      unit: f.unit.trim() || "ea",
      cost_thb: Number(f.cost_thb) || 0,
      price_thb: Number(f.price_thb) || 0,
      active: f.active,
    };
    const { error } = product
      ? await supabase.from("products").update(row).eq("id", product.id)
      : await supabase.from("products").insert(row);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    toast(c.saved);
    onDone();
  }

  /**
   * 입출고 기록이 있는 제품은 지우지 못하게 막는다.
   *
   * DB의 외래키가 ON DELETE RESTRICT라 실제 방어선은 그쪽이다. 여기서 미리
   * 막는 건 사람이 삭제를 누른 뒤 알 수 없는 오류를 보는 대신, 무엇이 걸려
   * 있고 대신 무엇을 하면 되는지(판매 중지) 먼저 알려 주기 위해서다.
   *
   * 그래도 넘어온 23503은 다른 화면에서 방금 입출고가 잡힌 경우다 — 그때도
   * 원인을 말해 준다.
   */
  async function commitRemove() {
    if (!product) return;
    setConfirming(false);
    setBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    setBusy(false);
    if (error) return setErr(error.code === "23503" ? c.stockDeleteRestricted : c.saveFailed);
    toast(c.removed);
    onDone();
  }

  const deletable = moveCount === 0;

  return (
    <Sheet
      open
      onClose={onClose}
      title={product ? c.stockEditProduct : c.stockNewProduct}
      footer={
        <div className="flex items-center gap-2">
          {product && (
            <Btn onClick={() => setConfirming(true)} variant="danger" disabled={busy}>
              {c.remove}
            </Btn>
          )}
          <div className="flex-1" />
          <Btn onClick={onClose} variant="ghost">
            {c.cancel}
          </Btn>
          <Btn onClick={save} disabled={busy || !f.sku.trim() || !f.name_ko.trim()}>
            {c.save}
          </Btn>
        </div>
      }
    >
      <div className="grid gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.stockSku}>
            <input value={f.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
          </Field>
          {/* 브랜드는 목록에서 고른다 — 손으로 적으면 오타 하나로 같은 브랜드가 둘이 된다. */}
          <Field label={c.stockBrand}>
            <select
              value={f.brand_id}
              onChange={(e) => set("brand_id", e.target.value)}
              className={inputCls}
            >
              <option value="">{c.none}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {brandName(b, lang)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={`${c.stockName} · 한국어`}>
          <input
            value={f.name_ko}
            onChange={(e) => set("name_ko", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={`${c.stockName} · ไทย`}>
          <input
            value={f.name_th}
            onChange={(e) => set("name_th", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={`${c.stockName} · EN`}>
          <input
            value={f.name_en}
            onChange={(e) => set("name_en", e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label={c.stockUnit}>
          <input
            value={f.unit}
            onChange={(e) => set("unit", e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={c.stockCostThb}>
            <input
              type="number"
              inputMode="decimal"
              value={f.cost_thb}
              onChange={(e) => set("cost_thb", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.stockPriceThb}>
            <input
              type="number"
              inputMode="decimal"
              value={f.price_thb}
              onChange={(e) => set("price_thb", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        {/*
          Thai FDA 신고는 품목 단위다 — 등록번호가 제품마다 따로 나온다. 그래서
          브랜드사가 아니라 여기에 둔다. 브랜드사 화면에서는 이 값을 모아 읽는다.
        */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
          <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.brandFda}</p>
          <Chips
            options={FDA_FLOW}
            value={f.fda_status}
            onChange={(s) => set("fda_status", s)}
            labelOf={(s) => fdaLabel(s, c)}
          />
          {f.fda_status !== "none" && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label={c.fdaNumber}>
                <input
                  value={f.fda_number}
                  onChange={(e) => set("fda_number", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label={c.fdaOn}>
                <input
                  type="date"
                  value={f.fda_on}
                  onChange={(e) => set("fda_on", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-sm font-semibold text-neutral-600">
          <input
            type="checkbox"
            checked={!f.active}
            onChange={(e) => set("active", !e.target.checked)}
            className="size-4 accent-[#0C3F80]"
          />
          {c.stockInactive}
        </label>
      </div>

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}

      <Confirm
        open={confirming}
        title={deletable ? c.confirmRemove : c.stockDeleteBlockedTitle}
        body={deletable ? undefined : c.stockDeleteBlockedBody}
        detail={
          // 아직 세는 중(null)이면 숫자를 지어내지 않는다. 0건이라고 말해 놓고 막으면 앞뒤가 안 맞는다.
          deletable || moveCount === null ? undefined : (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {c.stockDeleteMoves} {num(moveCount)}
            </p>
          )
        }
        confirmLabel={deletable ? c.remove : c.stockInactive}
        cancelLabel={c.cancel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          if (deletable) return void commitRemove();
          // 삭제 대신 판매 중지로 갈아탄다. 체크박스를 눌러 주고 저장은 사람이 확인한다.
          setConfirming(false);
          set("active", false);
        }}
      />
    </Sheet>
  );
}
