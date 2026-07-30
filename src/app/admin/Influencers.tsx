/**
 * 인플루언서 — 발굴부터 게시까지 한 줄로 흐르는 파이프라인.
 *
 * 칸반 보드로 만들지 않았다. 모바일에서 가로로 스크롤하는 칸반은 열 하나만
 * 보이고 나머지는 안 보인다. 대신 상태 필터 + 목록으로 두면 어느 화면에서든
 * 같은 방식으로 읽힌다.
 *
 * 제품 발송은 재고 쪽에서 "인플루언서 발송" 사유로 출고를 잡는다. 두 시스템을
 * 코드로 엮지 않고 사유 하나로 이어 둔다 — 발송 수량과 시점이 창고 사정에
 * 따라 달라지는데 자동으로 차감하면 실제와 어긋난다.
 */
import { useMemo, useState } from "react";
import { ExternalLink, Package, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  INF_FLOW,
  compact,
  thb,
  todayBkk,
  type InfStatus,
  type Influencer,
  type Platform,
} from "../../lib/admin";
import { a, platformLabel, productName, statusLabel, type AdminLang } from "./i18n";
import type { AdminData } from "./data";
import type { Jump, Tab } from "./AdminApp";
import {
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

const ALL_STATUSES: InfStatus[] = [...INF_FLOW, "dropped"];
const PLATFORMS: Platform[] = ["instagram", "tiktok", "youtube", "facebook", "other"];

/** 비용을 실제로 쓰기로 한 단계들. 발굴·컨택은 아직 확정이 아니다. */
const COMMITTED: InfStatus[] = ["confirmed", "shipped", "posted"];

/** 제품을 보낼 만한 단계. 확정 전에는 보낼 일이 없고, 게시 후에는 이미 보냈다. */
const SEEDABLE: InfStatus[] = ["confirmed", "shipped"];

const STATUS_TONE: Record<InfStatus, "gray" | "blue" | "green" | "amber" | "rose"> = {
  lead: "gray",
  contacted: "blue",
  confirmed: "amber",
  shipped: "amber",
  posted: "green",
  dropped: "rose",
};

export default function Influencers({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
}) {
  const c = a[lang];
  const [filter, setFilter] = useState<InfStatus | "all">("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Influencer | "new" | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.influencers.filter(
      (i) =>
        (filter === "all" || i.status === filter) &&
        (needle === "" ||
          `${i.name} ${i.handle} ${i.deliverable} ${i.note}`.toLowerCase().includes(needle)),
    );
  }, [data.influencers, filter, q]);

  const committedFee = data.influencers
    .filter((i) => COMMITTED.includes(i.status))
    .reduce((s, i) => s + Number(i.fee_thb), 0);

  /**
   * 약정한 비용 옆에 재무에 실제로 잡힌 인플루언서 지출을 같이 보여 준다.
   * 두 숫자가 벌어져 있으면 아직 안 낸 돈이 있다는 뜻이고, 그게 이 화면에서
   * 가장 알고 싶은 것이다.
   */
  const paidFee = data.finance
    .filter((e) => e.direction === "out" && e.category === "influencer")
    .reduce((s, e) => s + Number(e.amount_thb), 0);

  const countOf = (s: InfStatus) => data.influencers.filter((i) => i.status === s).length;
  const searchable = data.influencers.length > 8;

  return (
    <Page
      title={c.infTitle}
      action={
        <Btn onClick={() => setEditing("new")}>
          <span className="flex items-center gap-1.5">
            <Plus size={15} />
            {c.add}
          </span>
        </Btn>
      }
    >
      {searchable && (
        <SearchBox value={q} onChange={setQ} placeholder={`${c.search} · ${c.infName}`} />
      )}

      <FilterRow>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {c.all} {data.influencers.length}
        </FilterChip>
        {ALL_STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {statusLabel(s, c)} {countOf(s)}
          </FilterChip>
        ))}
      </FilterRow>

      <div className="mb-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4">
        <p className="text-xs font-semibold text-neutral-500">{c.infTotalFee}</p>
        <p className="mt-1 text-xl font-black tabular-nums text-neutral-900">
          {thb(committedFee)}
        </p>
        <button
          onClick={() => go("fin")}
          className="mt-1 text-[11px] text-neutral-400 tabular-nums transition-colors hover:text-neutral-700"
        >
          {c.infTotalFeeSub} {thb(paidFee)}
        </button>
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty>{q.trim() ? c.noMatch : c.infNone}</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {list.map((i) => (
              <Row key={i.id} inf={i} lang={lang} onClick={() => setEditing(i)} />
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <Form
          inf={editing === "new" ? null : editing}
          lang={lang}
          data={data}
          go={go}
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
  inf,
  lang,
  onClick,
}: {
  inf: Influencer;
  lang: AdminLang;
  onClick: () => void;
}) {
  const c = a[lang];
  const overdue =
    inf.next_action_on !== null &&
    inf.next_action_on <= todayBkk() &&
    inf.status !== "posted" &&
    inf.status !== "dropped";

  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-bold text-neutral-900">{inf.name}</span>
            <Pill tone={STATUS_TONE[inf.status]}>{statusLabel(inf.status, c)}</Pill>
          </span>
          <span className="mt-0.5 block truncate text-xs text-neutral-400">
            {platformLabel(inf.platform, c)}
            {inf.handle && ` · @${inf.handle.replace(/^@/, "")}`}
            {inf.followers > 0 && ` · ${compact(inf.followers)}`}
          </span>
        </span>

        <span className="shrink-0 text-right">
          {Number(inf.fee_thb) > 0 && (
            <span className="block text-sm font-bold tabular-nums text-neutral-700">
              {thb(Number(inf.fee_thb))}
            </span>
          )}
          {inf.next_action_on && (
            <span
              className={`text-[11px] tabular-nums ${
                overdue ? "font-bold text-rose-600" : "text-neutral-400"
              }`}
            >
              {inf.next_action_on}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

function SentProducts({
  inf,
  lang,
  data,
}: {
  inf: Influencer;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const sent = data.moves.filter((m) => m.influencer_id === inf.id);

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.infSent}</p>
      {sent.length === 0 ? (
        <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
          {c.infSentNone}
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4">
          {sent.map((m) => {
            const p = data.products.find((x) => x.id === m.product_id);
            return (
              <li key={m.id} className="flex items-center gap-2.5 py-2.5">
                <Package size={14} className="shrink-0 text-neutral-400" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-neutral-700">
                    {p ? productName(p, lang) : m.product_id}
                  </span>
                  <span className="text-[11px] text-neutral-400">{m.moved_on}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-neutral-700 tabular-nums">
                  {Math.abs(m.qty)}
                  {p && <span className="ml-0.5 text-[11px] font-semibold text-neutral-400">{p.unit}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Form({
  inf,
  lang,
  data,
  go,
  onDone,
  onClose,
}: {
  inf: Influencer | null;
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [f, setF] = useState({
    name: inf?.name ?? "",
    handle: inf?.handle ?? "",
    platform: inf?.platform ?? ("instagram" as Platform),
    followers: String(inf?.followers ?? 0),
    status: inf?.status ?? ("lead" as InfStatus),
    fee_thb: String(inf?.fee_thb ?? 0),
    deliverable: inf?.deliverable ?? "",
    post_url: inf?.post_url ?? "",
    note: inf?.note ?? "",
    next_action_on: inf?.next_action_on ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  /** 저장된 행의 id를 돌려준다. 실패하면 null. */
  async function persist(): Promise<string | null> {
    setBusy(true);
    setErr("");
    const row = {
      name: f.name.trim(),
      handle: f.handle.trim(),
      platform: f.platform,
      followers: Number(f.followers) || 0,
      status: f.status,
      fee_thb: Number(f.fee_thb) || 0,
      deliverable: f.deliverable.trim(),
      post_url: f.post_url.trim(),
      note: f.note.trim(),
      next_action_on: f.next_action_on || null,
    };
    const { data: saved, error } = inf
      ? await supabase.from("influencers").update(row).eq("id", inf.id).select("id").single()
      : await supabase.from("influencers").insert(row).select("id").single();
    setBusy(false);
    if (error || !saved) {
      setErr(c.saveFailed);
      return null;
    }
    return (saved as { id: string }).id;
  }

  async function save() {
    if (!(await persist())) return;
    toast(c.saved);
    onDone();
  }

  /**
   * 여기서 적은 내용을 잃지 않도록 먼저 저장하고 재고 탭으로 넘긴다.
   * 새로 만든 사람은 아직 id가 없어서 저장 후 받은 id를 들고 간다.
   */
  async function saveAndSeed() {
    const id = await persist();
    if (!id) return;
    toast(c.saved);
    onDone();
    go({ tab: "stock", seedingId: id });
  }

  async function commitRemove() {
    if (!inf) return;
    setConfirming(false);
    setBusy(true);
    const { error } = await supabase.from("influencers").delete().eq("id", inf.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    toast(c.removed);
    onDone();
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={inf ? inf.name : c.infNew}
      footer={
        <div className="flex items-center gap-2">
          {inf && (
            <Btn onClick={() => setConfirming(true)} variant="danger" disabled={busy}>
              {c.remove}
            </Btn>
          )}
          <div className="flex-1" />
          <Btn onClick={onClose} variant="ghost">
            {c.cancel}
          </Btn>
          <Btn onClick={save} disabled={busy || !f.name.trim()}>
            {c.save}
          </Btn>
        </div>
      }
    >
      <div className="mb-4">
        <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.infStatus}</p>
        <Chips
          options={ALL_STATUSES}
          value={f.status}
          onChange={(s) => set("status", s)}
          labelOf={(s) => statusLabel(s, c)}
        />

        {/*
          제품을 보내기로 한 순간, 창고에서 물건이 빠진다. 그 출고를 잡으러 사람이
          재고 탭에서 제품을 다시 찾아 사유를 고르게 하지 않는다 — 저장하고 바로
          출고 화면으로 넘기고, 사유와 상대 이름은 채워 둔다. 수량은 창고 사정에
          따라 다르니 그것만 사람이 적는다.
        */}
        {SEEDABLE.includes(f.status) && f.name.trim() !== "" && (
          <button
            onClick={saveAndSeed}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#0C3F80]/25 bg-blue-50/60 py-2.5 text-sm font-semibold text-[#0C3F80] transition-colors hover:bg-blue-50 disabled:opacity-40"
          >
            <Package size={15} />
            {c.infSeedRecord}
          </button>
        )}
      </div>

      <div className="grid gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label={c.infName}>
            <input
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.infHandle}>
            <input
              value={f.handle}
              onChange={(e) => set("handle", e.target.value)}
              placeholder="@"
              className={inputCls}
            />
          </Field>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-neutral-500">{c.infPlatform}</p>
          <Chips
            options={PLATFORMS}
            value={f.platform}
            onChange={(p) => set("platform", p)}
            labelOf={(p) => platformLabel(p, c)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={c.infFollowers}>
            <input
              type="number"
              inputMode="numeric"
              value={f.followers}
              onChange={(e) => set("followers", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label={c.infFee}>
            <input
              type="number"
              inputMode="decimal"
              value={f.fee_thb}
              onChange={(e) => set("fee_thb", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label={c.infDeliverable}>
          <input
            value={f.deliverable}
            onChange={(e) => set("deliverable", e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label={c.infNextAction}>
          <input
            type="date"
            value={f.next_action_on}
            onChange={(e) => set("next_action_on", e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label={c.infPostUrl}>
          <input
            value={f.post_url}
            onChange={(e) => set("post_url", e.target.value)}
            placeholder="https://"
            className={inputCls}
          />
        </Field>

        {inf?.post_url && (
          <a
            href={inf.post_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C3F80] hover:underline"
          >
            <ExternalLink size={14} />
            {c.infOpenPost}
          </a>
        )}

        <Field label={c.note}>
          <textarea
            rows={3}
            value={f.note}
            onChange={(e) => set("note", e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </Field>

        {/*
          이 사람에게 실제로 나간 물건. 재고에서 시딩으로 잡은 출고를 키로 되짚어
          온다 — "보냈다고 상태만 바꿔 놓고 실제로는 안 보낸" 건을 여기서 잡는다.
        */}
        {inf && <SentProducts inf={inf} lang={lang} data={data} />}
      </div>

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}

      <Confirm
        open={confirming}
        title={c.confirmRemove}
        confirmLabel={c.remove}
        cancelLabel={c.cancel}
        onCancel={() => setConfirming(false)}
        onConfirm={() => void commitRemove()}
      />
    </Sheet>
  );
}
