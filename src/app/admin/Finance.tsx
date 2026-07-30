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
  IN_CATEGORIES,
  OUT_CATEGORIES,
  monthOf,
  thb,
  todayBkk,
  type Currency,
  type Direction,
  type FinanceEntry,
} from "../../lib/admin";
import { a, categoryLabel, type AdminLang } from "./i18n";
import type { AdminData } from "./data";
import {
  Btn,
  Card,
  Chips,
  Empty,
  Field,
  Page,
  Pill,
  Sheet,
  Tile,
  inputCls,
} from "./ui";

function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export default function Finance({ lang, data }: { lang: AdminLang; data: AdminData }) {
  const c = a[lang];
  const [month, setMonth] = useState(() => monthOf(todayBkk()));
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
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-2 py-2">
        <button
          onClick={() => setMonth(shiftMonth(month, -1))}
          title={c.finPrevMonth}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-bold tabular-nums text-neutral-900">{month}</span>
        <button
          onClick={() => setMonth(shiftMonth(month, 1))}
          title={c.finNextMonth}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Tile label={c.finIn} value={thb(inSum)} tone="good" />
        <Tile label={c.finOut} value={thb(outSum)} tone="bad" />
        <Tile
          label={c.finNet}
          value={thb(inSum - outSum)}
          tone={inSum - outSum >= 0 ? "good" : "bad"}
        />
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
          defaultDate={month === monthOf(todayBkk()) ? todayBkk() : `${month}-01`}
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
          <span className="mt-0.5 block truncate text-xs text-neutral-400">
            {entry.entry_on}
            {entry.memo && ` · ${entry.memo}`}
          </span>
        </span>
        <span
          className={`shrink-0 text-sm font-bold tabular-nums ${
            isIn ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isIn ? "+" : "−"}
          {thb(Number(entry.amount_thb))}
        </span>
      </button>
    </li>
  );
}

function Form({
  entry,
  lang,
  defaultDate,
  onDone,
  onClose,
}: {
  entry: FinanceEntry | null;
  lang: AdminLang;
  defaultDate: string;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const [direction, setDirection] = useState<Direction>(entry?.direction ?? "out");
  const [category, setCategory] = useState(
    entry?.category ?? (direction === "in" ? IN_CATEGORIES[0] : OUT_CATEGORIES[0]),
  );
  const [entryOn, setEntryOn] = useState(entry?.entry_on ?? defaultDate);
  const [amount, setAmount] = useState(entry ? String(entry.amount) : "");
  const [currency, setCurrency] = useState<Currency>(entry?.currency ?? "THB");
  const [rate, setRate] = useState(String(entry?.rate_to_thb ?? 0.026));
  const [memo, setMemo] = useState(entry?.memo ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const categories = direction === "in" ? IN_CATEGORIES : OUT_CATEGORIES;

  function switchDirection(d: Direction) {
    setDirection(d);
    setCategory(d === "in" ? IN_CATEGORIES[0] : OUT_CATEGORIES[0]);
  }

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
    };
    const { error } = entry
      ? await supabase.from("finance_entries").update(row).eq("id", entry.id)
      : await supabase.from("finance_entries").insert(row);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    onDone();
  }

  async function remove() {
    if (!entry || !confirm(c.confirmRemove)) return;
    setBusy(true);
    const { error } = await supabase.from("finance_entries").delete().eq("id", entry.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
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
            <Btn onClick={remove} variant="danger" disabled={busy}>
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
            <Field label={c.finRate} hint={c.finRateHint}>
              <input
                type="number"
                inputMode="decimal"
                step="0.000001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={inputCls}
              />
            </Field>
            <p className="-mt-1 text-sm font-semibold text-neutral-500">
              = {thb(preview)}
            </p>
          </>
        )}

        <Field label={c.note}>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} className={inputCls} />
        </Field>
      </div>

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}
    </Sheet>
  );
}
