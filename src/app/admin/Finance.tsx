/**
 * 재무 — 한 달씩 끊어 보는 현금 장부.
 *
 * 손익계산서를 만들지 않는다. 지금 필요한 건 감가상각이 아니라 "이번 달에 돈이
 * 얼마 들어오고 나갔나"다. 회계는 태국 회계사가 별도로 맡는다.
 *
 * KRW로 쓴 돈은 그날의 환율을 함께 적어 THB 환산액을 고정한다. 나중에 환율이
 * 움직여도 지난달 장부가 흔들리지 않는다.
 */
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  BRAND_CATEGORIES,
  IN_CATEGORIES,
  OUT_CATEGORIES,
  RECEIPT_BUCKET,
  krw,
  monthOf,
  thb,
  todayBkk,
  type Brand,
  type Currency,
  type Direction,
  type FinanceEntry,
} from "../../lib/admin";
import { a, brandName, categoryLabel, type AdminLang } from "./i18n";
import { lastKrwRate, type AdminData } from "./data";
import { ReceiptBadge, ReceiptField } from "./receipts";
import {
  Btn,
  Card,
  Chips,
  Confirm,
  Empty,
  Field,
  Page,
  Pill,
  Sheet,
  Tile,
  inputCls,
  useToast,
} from "./ui";

function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** 원화로 적은 돈은 원금액도 보여 준다 — 나중에 그 건을 찾을 때 기억하는 숫자다. */
function original(e: FinanceEntry): string | null {
  if (e.currency === "THB") return null;
  return krw(Number(e.amount));
}

export default function Finance({ lang, data }: { lang: AdminLang; data: AdminData }) {
  const c = a[lang];
  const thisMonth = monthOf(todayBkk());
  const [month, setMonth] = useState(thisMonth);
  const [editing, setEditing] = useState<FinanceEntry | "new" | null>(null);

  const entries = useMemo(
    () => data.finance.filter((e) => monthOf(e.entry_on) === month),
    [data.finance, month],
  );

  const inSum = entries
    .filter((e) => e.direction === "in")
    .reduce((s, e) => s + Number(e.amount_thb), 0);
  const outSum = entries
    .filter((e) => e.direction === "out")
    .reduce((s, e) => s + Number(e.amount_thb), 0);

  const recentRate = useMemo(() => lastKrwRate(data.finance), [data.finance]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      if (e.direction !== "out") continue;
      map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount_thb));
    }
    return [...map.entries()].sort((x, y) => y[1] - x[1]);
  }, [entries]);

  return (
    <Page
      title={c.finTitle}
      action={
        <Btn onClick={() => setEditing("new")}>
          <span className="flex items-center gap-1.5">
            <Plus size={15} />
            {c.add}
          </span>
        </Btn>
      }
    >
      {/*
        달을 고르는 줄.

        앞으로는 이번 달에서 멈춘다. 원래는 2099년까지 넘길 수 있었는데, 아직 오지
        않은 달의 장부에는 볼 것이 없고 빈 화면만 나온다. 그리고 지난달을 보다가
        돌아올 길이 없었다 — 몇 번 눌렀는지 세고 있어야 했다. "이번 달"을 둔다.

        달 이름은 2026-07처럼 그대로 적는다. 네이티브 월 선택칸(type="month")을
        써 봤지만 두 가지가 걸린다. 브라우저 언어로 표시돼서 태국어로 바꿔도 저
        칸만 한국어로 남고, 사파리는 이 입력 형식을 지원하지 않아 아이폰에서는
        사람이 직접 "2026-07"을 타이핑하는 칸이 된다.
      */}
      <div className="mb-4 flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-2 py-2">
        <button
          onClick={() => setMonth(shiftMonth(month, -1))}
          title={c.finPrevMonth}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="flex-1 text-center text-sm font-bold text-neutral-900 tabular-nums">
          {month}
        </span>

        <button
          onClick={() => setMonth(shiftMonth(month, 1))}
          disabled={month >= thisMonth}
          title={c.finNextMonth}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={18} />
        </button>

        {month !== thisMonth && (
          <button
            onClick={() => setMonth(thisMonth)}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-[#0C3F80] transition-colors hover:bg-blue-50"
          >
            {c.finThisMonth}
          </button>
        )}
      </div>

      {/*
        좁은 화면에서 셋을 한 줄에 넣으면 여섯 자리 금액이 카드 밖으로 삐져나온다.
        순현금은 이 화면의 결론이니 한 줄을 다 준다 — 수입·지출을 먼저 보고 그
        아래에서 결과를 읽는 순서도 자연스럽다.
      */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile label={c.finIn} value={thb(inSum)} tone="good" />
        <Tile label={c.finOut} value={thb(outSum)} tone="bad" />
        <div className="col-span-2 md:col-span-1">
          <Tile
            label={c.finNet}
            value={thb(inSum - outSum)}
            tone={inSum - outSum >= 0 ? "good" : "bad"}
          />
        </div>
      </div>

      {byCategory.length > 0 && (
        <div className="mb-5">
          <Card title={c.finByCategory}>
            <ul className="divide-y divide-neutral-100">
              {byCategory.map(([cat, amount]) => (
                <li key={cat} className="px-5 py-3">
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-neutral-700">
                      {categoryLabel(cat, c)}
                    </span>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-neutral-900">
                      {thb(amount)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-[#0C3F80]"
                      style={{ width: `${outSum ? (amount / outSum) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <Card title={c.finEntries}>
        {entries.length === 0 ? (
          <Empty>{c.finNone}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {entries.map((e) => (
              <Row key={e.id} entry={e} lang={lang} onClick={() => setEditing(e)} />
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <Form
          entry={editing === "new" ? null : editing}
          lang={lang}
          defaultDate={month === thisMonth ? todayBkk() : `${month}-01`}
          lastRate={recentRate}
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

function Row({
  entry,
  lang,
  onClick,
}: {
  entry: FinanceEntry;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  const isIn = entry.direction === "in";
  const src = original(entry);
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-neutral-800">
              {categoryLabel(entry.category, c)}
            </span>
            {entry.currency !== "THB" && <Pill>{entry.currency}</Pill>}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="truncate">
              {entry.entry_on}
              {entry.memo && ` · ${entry.memo}`}
            </span>
            <ReceiptBadge count={entry.receipts?.length ?? 0} />
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span
            className={`block text-sm font-bold tabular-nums ${
              isIn ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isIn ? "+" : "−"}
            {thb(Number(entry.amount_thb))}
          </span>
          {src && <span className="text-[11px] text-neutral-400 tabular-nums">{src}</span>}
        </span>
      </button>
    </li>
  );
}

function Form({
  entry,
  lang,
  defaultDate,
  lastRate,
  brands,
  onDone,
  onClose,
}: {
  entry: FinanceEntry | null;
  lang: AdminLang;
  defaultDate: string;
  /** 최근에 쓴 원화 환율. 없으면 대략의 기준값으로 시작한다. */
  lastRate: number | null;
  brands: Brand[];
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [direction, setDirection] = useState<Direction>(entry?.direction ?? "out");
  const [category, setCategory] = useState(
    entry?.category ?? (direction === "in" ? IN_CATEGORIES[0] : OUT_CATEGORIES[0]),
  );
  const [entryOn, setEntryOn] = useState(entry?.entry_on ?? defaultDate);
  const [amount, setAmount] = useState(entry ? String(entry.amount) : "");
  const [currency, setCurrency] = useState<Currency>(entry?.currency ?? "THB");
  const [rate, setRate] = useState(String(entry?.rate_to_thb ?? lastRate ?? 0.026));
  const [memo, setMemo] = useState(entry?.memo ?? "");
  const [receipts, setReceipts] = useState<string[]>(entry?.receipts ?? []);
  const [brandId, setBrandId] = useState(entry?.brand_id ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const rateIsInherited = !entry && lastRate !== null;

  const categories = direction === "in" ? IN_CATEGORIES : OUT_CATEGORIES;

  function switchDirection(d: Direction) {
    setDirection(d);
    setCategory(d === "in" ? IN_CATEGORIES[0] : OUT_CATEGORIES[0]);
  }

  /** 정산·수수료·매출은 언제나 상대가 있다. 나머지 분류에는 브랜드사 칸을 내지 않는다. */
  const wantsBrand = (BRAND_CATEGORIES as readonly string[]).includes(category);

  const effectiveRate = currency === "THB" ? 1 : Number(rate);
  const preview = (Number(amount) || 0) * (Number.isFinite(effectiveRate) ? effectiveRate : 0);
  const canSave = Number(amount) > 0 && effectiveRate > 0;

  async function save() {
    setBusy(true);
    setErr("");
    const row = {
      entry_on: entryOn,
      direction,
      category,
      amount: Number(amount),
      currency,
      rate_to_thb: effectiveRate,
      memo: memo.trim(),
      receipts,
      // 브랜드사를 달아 둘 분류가 아니면 비운다 — 분류를 바꿨는데 옛 상대가 남으면 안 된다.
      brand_id: wantsBrand ? brandId || null : null,
    };
    const { error } = entry
      ? await supabase.from("finance_entries").update(row).eq("id", entry.id)
      : await supabase.from("finance_entries").insert(row);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    toast(c.saved);
    onDone();
  }

  async function commitRemove() {
    if (!entry) return;
    setConfirming(false);
    setBusy(true);
    const { error } = await supabase.from("finance_entries").delete().eq("id", entry.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    // 거래가 사라지면 붙어 있던 영수증은 아무도 찾을 수 없다. 같이 지운다.
    if (entry.receipts?.length) {
      await supabase.storage.from(RECEIPT_BUCKET).remove(entry.receipts);
    }
    toast(c.removed);
    onDone();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={entry ? c.edit : c.finNew}
      footer={
        <div className="flex items-center gap-2">
          {entry && (
            <Btn onClick={() => setConfirming(true)} variant="danger" disabled={busy}>
              {c.remove}
            </Btn>
          )}
          <div className="flex-1" />
          <Btn onClick={onClose} variant="ghost">
            {c.cancel}
          </Btn>
          <Btn onClick={save} disabled={busy || !canSave}>
            {c.save}
          </Btn>
        </div>
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-xl bg-neutral-100 p-1.5">
        {(["out", "in"] as const).map((d) => (
          <button
            key={d}
            onClick={() => switchDirection(d)}
            className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${
              direction === d
                ? d === "in"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "bg-white text-rose-600 shadow-sm"
                : "text-neutral-500"
            }`}
          >
            {d === "in" ? c.finIn : c.finOut}
          </button>
        ))}
      </div>

      <div className="grid gap-3.5">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.finCategory}</p>
          <Chips
            options={categories}
            value={category as (typeof categories)[number]}
            onChange={(v) => setCategory(v)}
            labelOf={(v) => categoryLabel(v, c)}
          />
        </div>

        {wantsBrand && brands.length > 0 && (
          <Field label={c.brandTitle}>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
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
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label={c.finAmount}>
            <input
              type="number"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.date}>
            <input
              type="date"
              value={entryOn}
              onChange={(e) => setEntryOn(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.finCurrency}</p>
          <Chips
            options={["THB", "KRW"] as const}
            value={currency}
            onChange={setCurrency}
            labelOf={(v) => v}
          />
        </div>

        {currency === "KRW" && (
          <>
            <Field
              label={c.finRate}
              hint={rateIsInherited ? c.finRateRecent : c.finRateHint}
            >
              <input
                type="number"
                inputMode="decimal"
                step="0.000001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={inputCls}
              />
            </Field>
            <p className="-mt-1 text-sm font-semibold text-neutral-500 tabular-nums">
              {krw(Number(amount) || 0)} = {thb(preview)}
            </p>
          </>
        )}

        <Field label={c.note}>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} className={inputCls} />
        </Field>

        <ReceiptField paths={receipts} onChange={setReceipts} c={c} />
      </div>

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}

      <Confirm
        open={confirming}
        title={c.confirmRemove}
        detail={
          <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-700 tabular-nums">
            {categoryLabel(category, c)} · {thb(preview)}
          </p>
        }
        confirmLabel={c.remove}
        cancelLabel={c.cancel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void commitRemove()}
      />
    </Sheet>
  );
}
