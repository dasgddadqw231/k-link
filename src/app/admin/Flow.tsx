/**
 * 프로세스 — 한국에서 만든 물건이 태국 매대에 오르기까지의 아홉 단계.
 *
 * 이 화면만 다른 탭과 성격이 다르다. 나머지는 숫자를 넣고 고치는 도구인데,
 * 여기는 읽는 화면이다. 무역을 한 번도 안 해 본 사람이 혼자 읽고 "우리가 무슨
 * 일을 하는 회사이고 지금 어디쯤인가"를 알 수 있어야 한다.
 *
 * 도식은 세 겹이다.
 *  ① 개요 — 아홉 단계를 네 묶음으로 접어 한 화면에 넣는다.
 *  ② 물건·서류·돈 표 — 무역이 어려운 진짜 이유는 이 셋이 같이 안 다니기
 *     때문이다. 단계마다 셋이 각각 어디 있는지 한 줄씩 끊어 보여 준다.
 *  ③ 단계 카드 — 실제로 일할 때 읽는 본문.
 *
 * 긴 문서라 길을 잃는 게 가장 큰 불편이다. 그래서 단계 바로가기 줄을 위에
 * 붙여 두고, 지금 보는 단계를 표시한다. PC는 화면 맨 위, 모바일은 상단바 바로
 * 아래에 붙는다 — 두 곳 다 스크롤해도 늘 보이는 자리다.
 *
 * 색은 뜻이 있을 때만 쓴다. 단계 묶음은 색으로 나누지 않고 자리와 번호로
 * 나눈다. 초록은 "넘어가도 좋다", 노랑은 "여기서 막힌다" 두 가지에만 남겨 둔다.
 *
 * 접히는 것은 용어 사전 하나뿐이다. 설명서에서 내용을 접어 두면 접힌 쪽은
 * 없는 것과 같다. 용어는 아는 사람에게는 필요 없으니 그것만 접는다.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CircleCheck,
  Coins,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Package,
  ShieldCheck,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { brandStatusLabel, fdaLabel, a, type AdminDict, type AdminLang } from "./i18n";
import { BRAND_FLOW, FDA_FLOW } from "../../lib/admin";
import type { AdminData } from "./data";
import { Card, Page, Pill } from "./ui";
import type { Jump, Tab } from "./AdminApp";
import {
  CHECKED_ON,
  F,
  PHASES,
  PREREQ,
  SOURCES,
  STAGES,
  TERMS,
  t,
  type Actor,
  type Lanes,
  type Phase,
  type Stage,
  type T,
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

/**
 * 위에 붙어 있는 두 줄(모바일 상단바 + 단계 바로가기) 높이. 단계로 뛸 때 제목이
 * 그 밑에 숨지 않도록 여유를 준다. PC는 상단바가 없어 한 줄만큼만 비운다.
 */
const SCROLL_MT = "scroll-mt-32 md:scroll-mt-20";

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

/** 일이 어느 나라에서 벌어지는지. 손이 넘어가는 지점을 눈으로 잡게 한다. */
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

/**
 * 지금 화면에 걸린 단계. 스크롤할 때마다 아홉 개의 위치를 읽지만 프레임당 한
 * 번으로 묶어 둬서 스크롤이 끊기지 않는다.
 */
function useActiveStage(): string {
  const [active, setActive] = useState(STAGES[0].id);

  useEffect(() => {
    let queued = false;
    function measure() {
      queued = false;
      // 붙어 있는 줄 바로 아래를 기준선으로 삼는다. 그 선을 지난 마지막 단계가
      // 지금 읽고 있는 단계다.
      const line = 150;
      let cur = STAGES[0].id;
      for (const s of STAGES) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) cur = s.id;
      }
      setActive(cur);
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
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
  const active = useActiveStage();

  return (
    <>
      <StageRail lang={lang} active={active} />

      <Page title={t(F.pageTitle, lang)}>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-neutral-500">
          {t(F.pageLead, lang)}
        </p>

        <Overview lang={lang} />
        <LaneTable lang={lang} />
        <Status lang={lang} data={data} go={go} />
        <Prereq lang={lang} />

        {PHASES.map((phase) => (
          <PhaseSection key={phase.key} phase={phase} lang={lang} go={go} />
        ))}

        <Glossary lang={lang} />
        <Sources lang={lang} />

        <p className="mt-6 text-[11px] leading-relaxed text-neutral-400">{t(F.foot, lang)}</p>
      </Page>

      <ToTop label={t(F.toTop, lang)} />
    </>
  );
}

/**
 * 단계 바로가기. 아홉 장짜리 문서에서 길을 잃지 않게 하는 유일한 장치라
 * 스크롤해도 늘 보이는 자리에 둔다. 모바일은 가로로 밀고, PC는 줄바꿈한다 —
 * PC에서 가로 스크롤을 시키면 마우스로는 끝까지 못 가는 사람이 생긴다.
 */
function StageRail({ lang, active }: { lang: AdminLang; active: string }) {
  const activeChip = useRef<HTMLButtonElement | null>(null);

  /*
    모바일에서는 줄이 가로로 밀린다. 아래로 읽어 내려가는 동안 지금 단계 칩이
    화면 밖으로 나가 버리면 줄이 있으나 마나다. block: "nearest" 라서 세로
    스크롤은 건드리지 않고, PC에서는 줄바꿈이라 넘칠 곳이 없어 아무 일도 없다.
  */
  useEffect(() => {
    activeChip.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div className="sticky top-[57px] z-10 border-b border-neutral-200 bg-white/95 backdrop-blur md:top-0">
      <div className="mx-auto max-w-4xl px-5 py-2 md:px-8">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          {STAGES.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                ref={on ? activeChip : undefined}
                onClick={() => scrollToStage(s.id)}
                aria-current={on ? "true" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition-colors ${
                  on
                    ? "bg-[#0C3F80] text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                <span className={on ? "text-white/60" : "text-neutral-400"}>{s.no}</span>
                {t(s.title, lang)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 개요 — 아홉 단계를 네 묶음으로 접는다.
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

const LANE_KEYS = ["goods", "paper", "money"] as const;
const LANE_ICON = { goods: Package, paper: FileText, money: Coins };
const LANE_LABEL = { goods: F.laneGoods, paper: F.lanePaper, money: F.laneMoney };

/**
 * 물건·서류·돈이 단계마다 각각 어디 있는지.
 *
 * 색으로 세 줄을 나누지 않는다 — 초록·노랑은 이 화면에서 이미 "가도 된다",
 * "막힌다"는 뜻을 갖고 있어서 여기에 또 쓰면 경고가 배경으로 가라앉는다.
 * 대신 아이콘으로 나눈다. PC는 한 줄에 세 칸, 모바일은 세 줄로 쌓인다.
 */
function LaneTable({ lang }: { lang: AdminLang }) {
  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-3.5">
        <h2 className="text-sm font-bold text-neutral-800">{t(F.lanesTitle, lang)}</h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t(F.lanesLead, lang)}</p>
      </div>

      {/* PC 머리줄. 모바일은 칸마다 스스로 이름을 단다. */}
      <div className="hidden gap-3 border-b border-neutral-100 px-5 py-2 md:grid md:grid-cols-[9rem_1fr_1fr_1fr]">
        <span />
        {LANE_KEYS.map((k) => {
          const Icon = LANE_ICON[k];
          return (
            <span
              key={k}
              className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400"
            >
              <Icon size={12} />
              {t(LANE_LABEL[k], lang)}
            </span>
          );
        })}
      </div>

      <div className="divide-y divide-neutral-100">
        {STAGES.map((s) => (
          <div
            key={s.id}
            className="grid gap-1.5 px-5 py-3 md:grid-cols-[9rem_1fr_1fr_1fr] md:items-start md:gap-3"
          >
            <button
              onClick={() => scrollToStage(s.id)}
              className="flex items-center gap-1.5 text-left text-xs font-bold text-neutral-700 transition-colors hover:text-[#0C3F80]"
            >
              <span className="text-neutral-300 tabular-nums">{s.no}</span>
              <span className="min-w-0 truncate">{t(s.title, lang)}</span>
            </button>
            {LANE_KEYS.map((k) => (
              <LaneCell key={k} lane={k} value={s.lanes[k]} lang={lang} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function LaneCell({
  lane,
  value,
  lang,
}: {
  lane: keyof Lanes;
  value: T | undefined;
  lang: AdminLang;
}) {
  const Icon = LANE_ICON[lane];
  return (
    <span className="flex items-start gap-1.5 text-xs leading-relaxed">
      {/* 모바일에서만 이름을 단다. PC는 머리줄이 이미 말해 준다. */}
      <span className="flex shrink-0 items-center gap-1 text-neutral-400 md:hidden">
        <Icon size={11} />
        <span className="w-8 text-[11px] font-bold">{t(LANE_LABEL[lane], lang)}</span>
      </span>
      <span className={value ? "min-w-0 flex-1 text-neutral-700" : "text-neutral-300"}>
        {value ? t(value, lang) : "—"}
      </span>
    </span>
  );
}

/**
 * 브랜드마다 반복하지 않는 일. 단계 안에 섞으면 브랜드가 자기도 해야 하는 줄
 * 알고 겁을 먹어서 따로 뺐다.
 */
function Prereq({ lang }: { lang: AdminLang }) {
  return (
    <section className="mt-7 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/70">
      <div className="border-b border-neutral-200/70 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
          <ShieldCheck size={15} className="text-neutral-400" />
          {t(F.prereqTitle, lang)}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t(F.prereqLead, lang)}</p>
      </div>
      <ol className="divide-y divide-neutral-200/70">
        {PREREQ.map((p, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-neutral-300 text-[10px] font-black text-neutral-400 tabular-nums">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-800">{t(p.title, lang)}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{t(p.body, lang)}</p>
            </div>
          </li>
        ))}
      </ol>
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
        className={`${SCROLL_MT} overflow-hidden rounded-2xl border border-neutral-200 bg-white`}
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

          {/* 이 단계가 어디에 근거하는지. 규정이 바뀌면 여기부터 다시 본다. */}
          <p className="mt-3 border-t border-neutral-100 pt-3 text-[11px] leading-relaxed text-neutral-400">
            <span className="font-bold">{t(F.lblBasis, lang)}</span>
            <span className="mx-1.5 text-neutral-300">·</span>
            {t(stage.basis, lang)}
          </p>
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
 * 용어는 접어 둔다. 한 번 익히면 다시 볼 일이 없는데 아홉 단계 뒤에 펼쳐 두면
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

/**
 * 근거 자료. 이 화면의 숫자가 틀렸을 때 어디를 보고 고쳐야 하는지가 화면 안에
 * 있어야 한다 — 규정은 바뀌고, 바뀐 걸 아는 사람이 늘 곁에 있지는 않다.
 */
function Sources({ lang }: { lang: AdminLang }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-black tracking-tight text-neutral-900">
          <LinkIcon size={15} className="text-neutral-400" />
          {t(F.sourcesTitle, lang)}
        </h2>
        <p className="text-[11px] font-semibold text-neutral-400 tabular-nums">
          {t(F.checkedOn, lang)} {CHECKED_ON}
        </p>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-neutral-500">{t(F.sourcesLead, lang)}</p>

      <ul className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {SOURCES.map((s) => (
          <li key={s.url} className="border-b border-neutral-100 last:border-b-0">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <ExternalLink size={13} className="mt-0.5 shrink-0 text-neutral-400" />
              <span className="min-w-0 flex-1 text-sm text-neutral-700">{t(s.label, lang)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * 맨 위로. 아홉 장을 다 내려간 뒤 단계 바로가기 줄까지 돌아가려면 한참을 올려야
 * 한다. 조금 내려가서는 안 보이게 둬서 평소에는 화면을 가리지 않는다.
 *
 * 본문이 아니라 <body> 밑에 그린다 — 탭이 바뀔 때 본문에 transform이 걸리고,
 * transform이 걸린 조상이 있으면 position: fixed가 화면이 아니라 그 조상을
 * 기준으로 잡혀 버튼이 엉뚱한 자리에 뜬다.
 */
function ToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 800);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title={label}
      aria-label={label}
      className="fixed right-5 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 grid size-11 place-items-center rounded-full border border-neutral-200 bg-white/95 text-neutral-500 shadow-lg backdrop-blur transition-colors hover:text-[#0C3F80] md:right-6 md:bottom-6"
    >
      <ArrowUp size={18} />
    </button>,
    document.body,
  );
}
