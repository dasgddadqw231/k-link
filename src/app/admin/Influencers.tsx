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
import { ExternalLink, Plus } from "lucide-react";
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
import { a, platformLabel, statusLabel, type AdminLang } from "./i18n";
import type { AdminData } from "./data";
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

const ALL_STATUSES: InfStatus[] = [...INF_FLOW, "dropped"];
const PLATFORMS: Platform[] = ["instagram", "tiktok", "youtube", "facebook", "other"];

/** 비용을 실제로 쓰기로 한 단계들. 발굴·컨택은 아직 확정이 아니다. */
const COMMITTED: InfStatus[] = ["confirmed", "shipped", "posted"];

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
}: {
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const [filter, setFilter] = useState<InfStatus | "all">("all");
  const [editing, setEditing] = useState<Influencer | "new" | null>(null);

  const list = useMemo(
    () =>
      filter === "all"
        ? data.influencers
        : data.influencers.filter((i) => i.status === filter),
    [data.influencers, filter],
  );

  const committedFee = data.influencers
    .filter((i) => COMMITTED.includes(i.status))
    .reduce((s, i) => s + Number(i.fee_thb), 0);

  const countOf = (s: InfStatus) => data.influencers.filter((i) => i.status === s).length;

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
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty>{c.infNone}</Empty>
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

function Form({
  inf,
  lang,
  onDone,
  onClose,
}: {
  inf: Influencer | null;
  lang: AdminLang;
  onDone: () => void;
  onClose: () => void;
}) {
  const c = a[lang];
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

  async function save() {
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
    const { error } = inf
      ? await supabase.from("influencers").update(row).eq("id", inf.id)
      : await supabase.from("influencers").insert(row);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
    onDone();
  }

  async function remove() {
    if (!inf || !confirm(c.confirmRemove)) return;
    setBusy(true);
    const { error } = await supabase.from("influencers").delete().eq("id", inf.id);
    setBusy(false);
    if (error) return setErr(c.saveFailed);
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
            <Btn onClick={remove} variant="danger" disabled={busy}>
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
      </div>

      {err && <p className="mt-4 text-sm text-rose-600">{err}</p>}
    </Sheet>
  );
}
