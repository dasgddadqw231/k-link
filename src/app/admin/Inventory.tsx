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
import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Plus, Scale } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  MOVE_REASONS,
  num,
  thb,
  todayBkk,
  type MoveKind,
  type Product,
} from "../../lib/admin";
import { a, productName, reasonLabel, type AdminLang } from "./i18n";
import { onHand, type AdminData } from "./data";
import {
  Btn,
  Card,
  Chips,
  Empty,
  Field,
  FilterChip,
  FilterRow,
  Page,
  Pill,
  Sheet,
  inputCls,
} from "./ui";

/** 유통기한이 이 안에 들어오면 눈에 띄게 표시한다. */
const EXPIRY_WARN_DAYS = 90;

export default function Inventory({
  lang,
  data,
}: {
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const [showInactive, setShowInactive] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const list = useMemo(
    () => data.products.filter((p) => showInactive || p.active),
    [data.products, showInactive],
  );

  const retailValue = list
    .filter((p) => p.active)
    .reduce((s, p) => s + onHand(data.stock, p.id) * Number(p.price_thb), 0);

  const open = data.products.find((p) => p.id === openId) ?? null;

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
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty>{c.stockNoProducts}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {list.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                stock={onHand(data.stock, p.id)}
                expiry={data.stock[p.id]?.nearest_expiry ?? null}
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
  lang,
  onClick,
}: {
  product: Product;
  stock: number;
  expiry: string | null;
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
            {product.brand} · {product.sku}
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
  onClose,
  onEdit,
}: {
  product: Product;
  lang: AdminLang;
  data: AdminData;
  onClose: () => void;
  onEdit: () => void;
}) {
  const c = a[lang];
  const stock = onHand(data.stock, product.id);
  const history = data.moves.filter((m) => m.product_id === product.id);

  const [kind, setKind] = useState<MoveKind>("in");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState<string>(MOVE_REASONS.in[0]);
  const [lot, setLot] = useState("");
  const [expiry, setExpiry] = useState("");
  const [movedOn, setMovedOn] = useState(todayBkk());
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function switchKind(k: MoveKind) {
    setKind(k);
    setReason(MOVE_REASONS[k][0]);
  }

  const entered = Number(qty);
  // 실사는 센 수량을 받고 차이만 기록한다. 나머지는 부호만 붙인다.
  const delta = kind === "adjust" ? entered - stock : kind === "out" ? -entered : entered;
  const canSave = qty !== "" && Number.isFinite(entered) && entered >= 0 && delta !== 0;

  async function save() {
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
    });
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    await data.reload();
    setQty("");
    setLot("");
    setExpiry("");
    setNote("");
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
      <div className="mb-5 flex items-baseline justify-between rounded-xl bg-neutral-50 px-4 py-3">
        <span className="text-xs font-semibold text-neutral-500">{c.stockOnHand}</span>
        <span className="text-2xl font-black tabular-nums text-neutral-900">
          {num(stock)}
          <span className="ml-1 text-xs font-semibold text-neutral-400">{product.unit}</span>
        </span>
      </div>

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

      {err && <p className="mb-4 text-sm text-rose-600">{err}</p>}

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
                  <span className="text-[11px] text-neutral-400">{m.moved_on}</span>
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
  onDone,
  onClose,
}: {
  product: Product | null;
  lang: AdminLang;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const [f, setF] = useState({
    sku: product?.sku ?? "",
    brand: product?.brand ?? "",
    name_ko: product?.name_ko ?? "",
    name_th: product?.name_th ?? "",
    name_en: product?.name_en ?? "",
    unit: product?.unit ?? "ea",
    low_stock_at: String(product?.low_stock_at ?? 0),
    cost_krw: String(product?.cost_krw ?? 0),
    price_thb: String(product?.price_thb ?? 0),
    active: product?.active ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function save() {
    setBusy(true);
    setErr("");
    const row = {
      sku: f.sku.trim(),
      brand: f.brand.trim(),
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
    onDone();
  }

  async function remove() {
    if (!product || !confirm(c.confirmRemove)) return;
    setBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    onDone();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={product ? c.stockEditProduct : c.stockNewProduct}
      footer={
        <div className="flex items-center gap-2">
          {product && (
            <Btn onClick={remove} variant="danger" disabled={busy}>
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
          <Field label={c.stockBrand}>
            <input
              value={f.brand}
              onChange={(e) => set("brand", e.target.value)}
              className={inputCls}
            />
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
    </Sheet>
  );
}
