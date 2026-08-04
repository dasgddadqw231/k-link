/**
 * 프로세스 — 한국에서 만든 물건이 태국 매대에 오르기까지의 여덟 단계.
 *
 * 이 화면만 다른 탭과 성격이 다르다. 나머지는 숫자를 넣고 고치는 도구인데,
 * 여기는 읽는 화면이다. 새로 들어온 사람이 "우리가 무슨 일을 하는 회사이고
 * 지금 어디쯤인가"를 아무에게도 묻지 않고 알 수 있어야 한다.
 *
 * 도식은 두 겹이다. 위의 개요는 여덟 단계를 네 묶음으로 접어 한 화면에 넣고,
 * 아래 본문은 단계마다 펼쳐 놓는다. 개요에서 단계를 누르면 그 자리로 내려간다 —
 * 목차 없는 긴 문서는 두 번째 볼 때부터 아무도 안 읽는다.
 *
 * 색은 뜻이 있을 때만 쓴다. 단계 묶음은 색으로 나누지 않고 자리와 번호로 나눈다.
 * 초록은 "넘어가도 좋다", 노랑은 "여기서 막힌다" 두 가지에만 남겨 둔다 — 묶음까지
 * 색을 먹으면 경고가 배경으로 가라앉는다.
 *
 * 접히는 것은 용어 사전 하나뿐이다. 설명서에서 내용을 접어 두면 접힌 쪽은
 * 없는 것과 같다. 용어는 아는 사람에게는 필요 없으니 그것만 접는다.
 */
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  ExternalLink,
  FileText,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { brandStatusLabel, fdaLabel, a, type AdminDict, type AdminLang } from "./i18n";
import { BRAND_FLOW, FDA_FLOW } from "../../lib/admin";
import type { AdminData } from "./data";
import { Card, Page, Pill } from "./ui";
import type { Jump, Tab } from "./AdminApp";
import {
  F,
  PHASES,
  STAGES,
  TERMS,
  t,
  type Actor,
  type Phase,
  type Stage,
} from "./workflow";

/** 기록할 곳을 가리킬 때 탭 이름은 이미 번역돼 있다. 두 번 적지 않는다. */
const TAB_LABEL: Record<Tab, keyof AdminDict> = {
  home: "navHome",
  flow: "navFlow",
  brand: "navBrand",
  stock: "navStock",
  inf: "navInf",
  fin: "navFin",
};

function actorLabel(actor: Actor, lang: AdminLang): string {
  return t(actor === "brand" ? F.actorBrand : actor === "kr" ? F.actorKr : F.actorTh, lang);
}

/**
 * 일하는 쪽을 색으로 구분한다. 여기서만 쓰는 세 색이라 뜻이 겹치지 않는다 —
 * 브랜드가 어느 줄에 몇 번 나오는지가 이 표에서 사람들이 가장 먼저 세는 것이다.
 */
const ACTOR_TONE: Record<Actor, string> = {
  brand: "bg-violet-50 text-violet-700",
  kr: "bg-blue-50 text-[#0C3F80]",
  th: "bg-teal-50 text-teal-700",
};

function ActorTag({ actor, lang }: { actor: Actor; lang: AdminLang }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${ACTOR_TONE[actor]}`}
    >
      {actorLabel(actor, lang)}
    </span>
  );
}

/** 일이 어느 나라에서 벌어지는지. 개요에서 손이 넘어가는 지점을 눈으로 잡게 한다. */
function WhereTag({ where, lang }: { where: Stage["where"]; lang: AdminLang }) {
  const th = where === "th";
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-neutral-400">
      <span
        className={`size-1.5 rounded-full ${th ? "bg-[#0C3F80]" : "bg-neutral-300"}`}
        aria-hidden
      />
      {t(th ? F.whereTh : F.whereKr, lang)}
    </span>
  );
}

function scrollToStage(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Flow({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
}) {
  return (
    <Page title={t(F.pageTitle, lang)}>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-neutral-500">
        {t(F.pageLead, lang)}
      </p>

      <Overview lang={lang} />
      <Status lang={lang} data={data} go={go} />

      {PHASES.map((phase) => (
        <PhaseSection key={phase.key} phase={phase} lang={lang} go={go} />
      ))}

      <Glossary lang={lang} />

      <p className="mt-6 text-[11px] leading-relaxed text-neutral-400">{t(F.foot, lang)}</p>
    </Page>
  );
}

/**
 * 개요 — 여덟 단계를 네 묶음으로 접는다.
 *
 * PC는 네 묶음이 가로로 서서 왼쪽에서 오른쪽으로 흐르고, 모바일은 세로로 쌓인다.
 * 가로 스크롤은 쓰지 않는다 — 좁은 화면에서 레인을 지키려다 한 묶음만 보이면
 * 흐름을 보여주려던 그림이 오히려 흐름을 가린다.
 */
function Overview({ lang }: { lang: AdminLang }) {
  return (
    <section className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-neutral-800">{t(F.overview, lang)}</h2>
        <p className="text-[11px] text-neutral-400">{t(F.overviewHint, lang)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4 md:gap-0">
        {PHASES.map((phase, pi) => {
          const stages = STAGES.filter((s) => s.phase === phase.key);
          const last = pi === PHASES.length - 1;
          return (
            <div key={phase.key} className={`flex ${last ? "" : "md:pr-3"}`}>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-neutral-900 text-[10px] font-black text-white">
                    {pi + 1}
                  </span>
                  <h3 className="truncate text-xs font-bold text-neutral-800">
                    {t(phase.title, lang)}
                  </h3>
                </div>
                <p className="mb-2.5 text-[11px] leading-relaxed text-neutral-400">
                  {t(phase.note, lang)}
                </p>
                <div className="flex flex-col gap-1.5">
                  {stages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToStage(s.id)}
                      className="group flex items-center gap-2 rounded-xl border border-neutral-200 px-2.5 py-2 text-left transition-colors hover:border-[#0C3F80] hover:bg-blue-50/40"
                    >
                      <span className="text-[10px] font-black text-neutral-300 tabular-nums group-hover:text-[#0C3F80]">
                        {s.no}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-neutral-700">
                        {t(s.title, lang)}
                      </span>
                      <WhereTag where={s.where} lang={lang} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 묶음 사이의 화살표. 세로로 쌓이는 모바일에서는 위아래 순서가 곧 흐름이다. */}
              {!last && (
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="mt-1 -mr-1 hidden shrink-0 self-start text-neutral-300 md:block"
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400">
        <span className="mr-1 inline-block size-1.5 rounded-full bg-neutral-300 align-middle" />
        {t(F.whereKr, lang)}
        <span className="mx-2 text-neutral-200">·</span>
        <span className="mr-1 inline-block size-1.5 rounded-full bg-[#0C3F80] align-middle" />
        {t(F.whereTh, lang)}
      </p>
    </section>
  );
}

/**
 * 지금 어느 단계에 몇 건이 있는지.
 *
 * 저장된 상태값만 센다. 여러 값을 엮어 "이 브랜드는 5단계쯤"이라고 짐작하지
 * 않는다 — 규칙이 짐작한 자리는 틀렸을 때도 맞은 것처럼 보이고, 그러면 이 숫자를
 * 보고 일을 놓친다. 브랜드 진행 단계와 FDA 상태는 사람이 직접 적는 칸이라
 * 그대로 세도 거짓말이 되지 않는다.
 */
function Status({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
}) {
  const c = a[lang];

  const brandRows = BRAND_FLOW.map((s) => ({
    key: s,
    label: brandStatusLabel(s, c),
    n: data.brands.filter((b) => b.status === s).length,
  })).filter((r) => r.n > 0);

  const fdaRows = FDA_FLOW.map((s) => ({
    key: s,
    label: fdaLabel(s, c),
    n: data.products.filter((p) => p.active && p.fda_status === s).length,
  })).filter((r) => r.n > 0);

  return (
    <Card title={t(F.statusTitle, lang)}>
      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
        <StatusGroup
          label={t(F.statusBrands, lang)}
          rows={brandRows}
          empty={t(F.statusEmpty, lang)}
          onClick={() => go("brand")}
        />
        <StatusGroup
          label={t(F.statusFda, lang)}
          rows={fdaRows}
          empty={t(F.statusEmpty, lang)}
          onClick={() => go("stock")}
        />
      </div>
    </Card>
  );
}

function StatusGroup({
  label,
  rows,
  empty,
  onClick,
}: {
  label: string;
  rows: { key: string; label: string; n: number }[];
  empty: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="min-w-0 text-left">
      <p className="mb-2 text-xs font-semibold text-neutral-500">{label}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-400">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {rows.map((r) => (
            <Pill key={r.key} tone="blue">
              {r.label} {r.n}
            </Pill>
          ))}
        </div>
      )}
    </button>
  );
}

function PhaseSection({
  phase,
  lang,
  go,
}: {
  phase: Phase;
  lang: AdminLang;
  go: (j: Tab | Jump) => void;
}) {
  const stages = STAGES.filter((s) => s.phase === phase.key);
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-baseline gap-2.5">
        <h2 className="text-base font-black tracking-tight text-neutral-900">
          {t(phase.title, lang)}
        </h2>
        <p className="min-w-0 flex-1 truncate text-[11px] text-neutral-400">
          {t(phase.note, lang)}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {stages.map((s) => (
          <StageCard key={s.id} stage={s} lang={lang} go={go} />
        ))}
      </div>
    </section>
  );
}

function StageCard({
  stage,
  lang,
  go,
}: {
  stage: Stage;
  lang: AdminLang;
  go: (j: Tab | Jump) => void;
}) {
  const c = a[lang];

  return (
    <>
      <article
        id={stage.id}
        /* 모바일 상단바가 제목을 덮지 않게 목적지에 여유를 둔다. */
        className="scroll-mt-20 overflow-hidden rounded-2xl border border-neutral-200 bg-white md:scroll-mt-6"
      >
        <header className="flex items-start gap-3 border-b border-neutral-100 px-5 py-4">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-[#0C3F80] text-xs font-black text-white tabular-nums">
            {stage.no}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-bold text-neutral-900">{t(stage.title, lang)}</h3>
              <WhereTag where={stage.where} lang={lang} />
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">{t(stage.lead, lang)}</p>
          </div>
        </header>

        <div className="px-5 py-4">
          {/* 용어를 모르는 사람이 읽을 한 문단. 단계마다 이게 먼저 온다. */}
          <div className="mb-4 rounded-xl bg-blue-50/60 px-4 py-3">
            <p className="mb-1 text-[11px] font-bold tracking-wide text-[#0C3F80]/70 uppercase">
              {t(F.lblPlain, lang)}
            </p>
            <p className="text-sm leading-relaxed text-neutral-700">{t(stage.plain, lang)}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-neutral-500">
                {t(F.lblDoes, lang)}
              </p>
              <ul className="flex flex-col gap-2">
                {stage.does.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">
                      <ActorTag actor={d.actor} lang={lang} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-700">
                      {t(d.text, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <FileText size={13} className="text-neutral-400" />
                {t(F.lblDocs, lang)}
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {stage.docs.map((d, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600"
                  >
                    {t(d, lang)}
                  </span>
                ))}
              </div>
              <p className="flex items-start gap-1.5 text-xs text-neutral-500">
                <Timer size={13} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>
                  <span className="font-semibold text-neutral-600">
                    {t(F.lblTakes, lang)}
                  </span>{" "}
                  {t(stage.takes, lang)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Note
              icon={<CircleCheck size={14} />}
              tone="good"
              label={t(F.lblGate, lang)}
              body={t(stage.gate, lang)}
            />
            <Note
              icon={<TriangleAlert size={14} />}
              tone="warn"
              label={t(F.lblRisk, lang)}
              body={t(stage.risk, lang)}
            />
          </div>

          {stage.record && (
            <button
              onClick={() => go(stage.record!.tab)}
              className="mt-3 flex w-full items-start gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-left transition-colors hover:border-[#0C3F80] hover:bg-blue-50/40"
            >
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-[#0C3F80]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold tracking-wide text-neutral-400 uppercase">
                  {t(F.lblRecord, lang)}
                </span>
                <span className="block text-sm font-semibold text-[#0C3F80]">
                  {c[TAB_LABEL[stage.record.tab]]}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">
                  {t(stage.record.what, lang)}
                </span>
              </span>
            </button>
          )}
        </div>
      </article>

      {/* 브랜드가 손을 떼는 자리. 단계 안에 문장으로 묻으면 아무도 못 본다. */}
      {stage.handoff && (
        <div className="flex items-center gap-3 px-1 py-1">
          <span className="h-px flex-1 border-t border-dashed border-neutral-300" />
          <span className="text-[11px] font-bold text-neutral-400">{t(F.handoff, lang)}</span>
          <span className="h-px flex-1 border-t border-dashed border-neutral-300" />
        </div>
      )}
    </>
  );
}

function Note({
  icon,
  tone,
  label,
  body,
}: {
  icon: ReactNode;
  tone: "good" | "warn";
  label: string;
  body: string;
}) {
  const look =
    tone === "good"
      ? "bg-emerald-50/70 text-emerald-700"
      : "bg-amber-50/70 text-amber-700";
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 ${look}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p className="min-w-0 flex-1 text-xs leading-relaxed">
        <span className="font-bold">{label}</span>
        <span className="mx-1.5 opacity-40">·</span>
        <span className="text-neutral-700">{body}</span>
      </p>
    </div>
  );
}

/**
 * 용어는 접어 둔다. 한 번 익히면 다시 볼 일이 없는데 여덟 단계 뒤에 펼쳐 두면
 * 화면이 두 배가 되고, 정작 매번 읽어야 할 단계 설명이 멀어진다.
 */
function Glossary({ lang }: { lang: AdminLang }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline gap-2.5">
        <h2 className="flex items-center gap-2 text-base font-black tracking-tight text-neutral-900">
          <BookOpen size={16} className="text-neutral-400" />
          {t(F.termsTitle, lang)}
        </h2>
        <p className="min-w-0 flex-1 truncate text-[11px] text-neutral-400">
          {t(F.termsLead, lang)}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {TERMS.map((term, i) => (
          <details
            key={i}
            className="group border-b border-neutral-100 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50">
              <span className="min-w-0 flex-1">{t(term.term, lang)}</span>
              <span
                aria-hidden
                className="shrink-0 text-neutral-300 transition-transform group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
              {t(term.body, lang)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
