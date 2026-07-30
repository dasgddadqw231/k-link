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
  krw,
  num,
  thb,
  todayBkk,
  type Brand,
  type FdaStatus,
  type Influencer,
  type MoveKind,
  type Product,
} from "../../lib/admin";
import { a, brandName, fdaLabel, productName, reasonLabel, type AdminLang } from "./i18n";
import { lastKrwRate, onHand, type AdminData } from "./data";
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
    (s, p) => s + onHand(data.stock, p.id) * Number(p.cost_krw),
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
          {c.stockCostValue} {krw(costValue)}
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
          moveCount={
            editing === "new"
              ? 0
              : data.moves.filter((m) => m.product_id === editing.id).length
          }
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
  const isLow = stock <= product.low_stock_at;
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
          <span
            className={`block text-lg font-black tabular-nums ${
              isLow ? "text-amber-600" : "text-neutral-900"
            }`}
          >
            {num(stock)}
          </span>
          <span className="text-[11px] text-neutral-400">
            {isLow ? c.stockLow : product.unit}
          </span>
        </span>

        <ChevronRight size={16} className="shrink-0 text-neutral-300" />
      </button>
    </li>
  );
}

const KIND_ICON = { in: ArrowDownLeft, out: ArrowUpRight, adjust: Scale } as const;

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
  const history = data.moves.filter((m) => m.product_id === product.id);

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
   * 한국 입고는 곧 돈을 쓴 사건이다. 원래는 재고에 입고를 잡고 재무 탭으로 가서
   * 같은 내용을 또 적어야 했고, 그러면 한쪽이 빠진다. 기본으로 켜 두고, 이미
   * 다른 경로로 결제를 기록했다면 끌 수 있게 한다.
   */
  const [alsoFinance, setAlsoFinance] = useState(true);
  const [rate, setRate] = useState(String(lastKrwRate(data.finance) ?? 0.026));

  function switchKind(k: MoveKind) {
    setKind(k);
    setReason(MOVE_REASONS[k][0]);
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

  /** 한국에서 들여오는 입고일 때만 매입 지출을 함께 적을 수 있다. */
  const isPurchase = kind === "in" && reason === "import";
  const purchaseKrw = isPurchase ? entered * Number(product.cost_krw) : 0;
  const purchaseRate = Number(rate);
  const canFinance = isPurchase && alsoFinance && purchaseKrw > 0 && purchaseRate > 0;

  async function commit() {
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("stock_moves").insert({
      product_id: product.id,
      kind,
      qty: delta,
      reason,
      lot: lot.trim(),
      expiry: expiry || null,
      note: note.trim(),
      moved_on: movedOn,
      influencer_id: reason === "seeding" ? (seeding?.id ?? null) : null,
    });
    if (error) {
      setBusy(false);
      setErr(c.saveFailed);
      return;
    }

    /*
      매입 지출을 같은 흐름에서 적는다.

      두 표에 나눠 쓰는 일이라 한쪽만 성공할 수 있다. 트랜잭션으로 묶으려면 DB
      함수를 하나 둬야 하는데, 지금 규모에서는 그 배포 부담보다 "재고는 들어갔고
      재무는 실패했다"를 정확히 알려 주는 쪽이 낫다 — 숨기면 장부에 구멍이 난 걸
      아무도 모른다.
    */
    if (canFinance) {
      const { error: finErr } = await supabase.from("finance_entries").insert({
        entry_on: movedOn,
        direction: "out",
        category: "goods",
        amount: purchaseKrw,
        currency: "KRW",
        rate_to_thb: purchaseRate,
        memo: [product.sku, `${num(entered)}${product.unit}`, lot.trim()]
          .filter(Boolean)
          .join(" · "),
      });
      if (finErr) {
        setBusy(false);
        await data.reload();
        setErr(c.stockFinancePartial);
        return;
      }
    }

    setBusy(false);
    await data.reload();
    // 로트마다 한 줄씩 적는 일이 많아 창은 열어 둔다. 대신 저장됐다고 분명히 말한다.
    setQty("");
    setLot("");
    setExpiry("");
    setNote("");
    toast(c.saved);
    if (seeding) onSeedingDone();
  }

  function save() {
    if (goesNegative) return setAskNegative(true);
    void commit();
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
          <Btn onClick={save} disabled={busy || !canSave}>
            {c.save}
          </Btn>
        </div>
      }
    >
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
            {c.stockCostKrw} {krw(Number(product.cost_krw))}
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
          onChange={(r) => setReason(r)}
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

      {isPurchase && (
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
                {c.stockAlsoFinance}
              </span>
              <span className="mt-0.5 block text-[11px] text-neutral-400">
                {c.stockAlsoFinanceHint}
              </span>
            </span>
          </label>

          {alsoFinance && (
            <div className="mt-3.5 border-t border-neutral-200 pt-3.5">
              <Field label={c.finRate}>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.000001"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <p className="mt-2 text-sm font-bold text-neutral-600 tabular-nums">
                {krw(purchaseKrw)}
                {purchaseRate > 0 && (
                  <span className="font-semibold text-neutral-400">
                    {" = "}
                    {thb(purchaseKrw * purchaseRate)}
                  </span>
                )}
              </p>
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

      <p className="mb-2 text-xs font-semibold text-neutral-500">{c.stockHistory}</p>
      {history.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">{c.stockNoHistory}</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {history.map((m) => {
            const Icon = KIND_ICON[m.kind];
            return (
              <li key={m.id} className="flex items-center gap-2.5 py-2.5">
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
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}

function ProductForm({
  product,
  lang,
  brands,
  moveCount,
  onDone,
  onClose,
}: {
  product: Product | null;
  lang: AdminLang;
  brands: Brand[];
  /** 입출고 기록 수. 이게 0이 아니면 삭제를 막는다 — 아래 remove()의 주석 참고. */
  moveCount: number;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [f, setF] = useState({
    sku: product?.sku ?? "",
    brand_id: product?.brand_id ?? "",
    name_ko: product?.name_ko ?? "",
    name_th: product?.name_th ?? "",
    name_en: product?.name_en ?? "",
    unit: product?.unit ?? "ea",
    low_stock_at: String(product?.low_stock_at ?? 0),
    cost_krw: String(product?.cost_krw ?? 0),
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
      low_stock_at: Number(f.low_stock_at) || 0,
      cost_krw: Number(f.cost_krw) || 0,
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

        <div className="grid grid-cols-2 gap-3">
          <Field label={c.stockUnit}>
            <input
              value={f.unit}
              onChange={(e) => set("unit", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.stockLowAt}>
            <input
              type="number"
              inputMode="numeric"
              value={f.low_stock_at}
              onChange={(e) => set("low_stock_at", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={c.stockCostKrw}>
            <input
              type="number"
              inputMode="decimal"
              value={f.cost_krw}
              onChange={(e) => set("cost_krw", e.target.value)}
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
          deletable ? undefined : (
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
