/**
 * 프로세스 — 한국에서 만든 물건이 태국 매대에 오르기까지의 열 단계.
 *
 * 이 화면만 다른 탭과 성격이 다르다. 나머지는 숫자를 넣고 고치는 도구인데,
 * 여기는 읽는 화면이다. 무역을 한 번도 안 해 본 사람이 혼자 읽고 "우리가 무슨
 * 일을 하는 회사이고 지금 어디쯤인가"를 알 수 있어야 한다.
 *
 * 읽는 순서가 곧 화면 순서다.
 *  ① 개요 — 열 단계를 네 묶음으로 접어 한 화면에 넣는다.
 *  ② 전체 기간 — 단계마다 기간을 적어 두면 읽는 사람이 열 개를 더해 답을
 *     만드는데, 03과 04가 같이 돌기 때문에 그 덧셈은 틀린다. 그래서 더한
 *     답을 우리가 준다.
 *  ③ 단계 카드 — 실제로 일할 때 읽는 본문.
 *  ④ 물건·서류·돈 표와 원가표 — 찾아보는 표다.
 *
 * ④를 뒤로 뺀 것이 이 화면에서 가장 크게 바뀐 자리다. 앞에 두었을 때는
 * "01단계부터 뭘 하나"를 보려는 사람이 열 줄짜리 표 두 개를 먼저 통과해야 했고,
 * 그러느라 첫 단계가 2,400px 아래에 있었다. 무역이 어려운 이유가 물건·서류·돈이
 * 따로 다니기 때문이라는 것은 맞는 말이지만, 그건 한 번 배우면 되는 지도이고
 * 단계는 매번 읽는 본문이다.
 *
 * 긴 문서라 길을 잃는 게 가장 큰 불편이다. 그래서 단계 바로가기 줄을 위에
 * 붙여 두고, 지금 보는 단계를 표시한다. PC는 화면 맨 위, 모바일은 상단바 바로
 * 아래에 붙는다 — 두 곳 다 스크롤해도 늘 보이는 자리다.
 *
 * 색은 뜻이 있을 때만 쓴다. 단계 묶음은 색으로도 번호로도 나누지 않고 자리로만
 * 나눈다 — 단계가 이미 01~10을 갖고 있어서 묶음에까지 번호를 주면 "3번"이 어느
 * 쪽인지 사람마다 달라진다. 초록은 "넘어가도 좋다", 노랑은 "여기서 막힌다"
 * 두 가지에만 남겨 둔다.
 *
 * 접히는 것은 용어 사전 하나뿐이다. 설명서에서 내용을 접어 두면 접힌 쪽은
 * 없는 것과 같다. 용어는 아는 사람에게는 필요 없으니 그것만 접는다.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarClock,
  ChevronRight,
  CircleCheck,
  Coins,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  ListChecks,
  Package,
  Route,
  ShieldCheck,
  Split,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { brandStatusLabel, fdaLabel, a, type AdminDict, type AdminLang } from "./i18n";
import {
  BRAND_FLOW,
  EXTRA_PERMITS,
  FDA_FLOW,
  FOOD_GROUPS,
  LICENCE_KINDS,
  SHIP_FLOW,
  type LicenceKind,
  type ShipStage,
} from "../../lib/admin";
import { supabase } from "../../lib/supabase";
import type { AdminData } from "./data";
import {
  brandProgress,
  RENEW_WINDOW_DAYS,
  type BrandProgress,
  type StageState,
} from "./progress";
import { Card, Page, Pill, useToast } from "./ui";
import type { Jump, Tab } from "./AdminApp";
import {
  CHECKED_ON,
  COST_GROUPS,
  EXTRA_PERMIT_LABEL,
  F,
  FOOD_GROUP_LABEL,
  LICENCE_KIND_LABEL,
  PHASES,
  PREREQ,
  ROUTES,
  SHIP_STAGE_LABEL,
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
 * 단계로 뛸 때 제목이 붙어 있는 줄 밑에 숨지 않도록 비워 두는 높이.
 *
 * 고정된 숫자를 쓰면 안 되는 자리다. 바로가기 줄의 높이는 언어마다 다르다 —
 * 한국어·태국어는 칩이 두 줄로 접혀 79px인데 영어는 세 줄이라 113px이다.
 * 예전에는 여기에 80px을 박아 두었고, 그래서 한국어에서는 여유가 정확히 0이고
 * 영어에서는 제목이 줄 밑으로 1px 들어가 있었다. 글자 크기를 한 단계만 올려도
 * 다시 어긋나는 종류의 숫자다.
 *
 * 그래서 줄이 자기 높이를 재서 --rail 에 적고(StageRail 참조), 카드는 그 값을
 * 읽는다. 기본값은 줄을 아직 못 쟀을 때만 쓰인다.
 */
const SCROLL_MT = "scroll-mt-[var(--rail,7rem)]";

function actorLabel(actor: Actor, lang: AdminLang): string {
  return t(actor === "brand" ? F.actorBrand : actor === "kr" ? F.actorKr : F.actorTh, lang);
}

/**
 * 일하는 쪽을 색으로 구분한다. 이 표에서 사람들이 가장 먼저 세는 것은 "브랜드가
 * 몇 번 나오나"라서 브랜드만 뚜렷한 색을 갖는다.
 *
 * klink 한국과 klink 태국은 색을 멀리 두지 않고 밝기로 가른다. 앞에서는 파랑과
 * 청록이었는데, 그 둘은 색각 이상이면 거의 같은 색이라 색으로 나눈 뜻이 사라진다.
 * 나라는 태그 안의 글자가 이미 말해 주므로 색이 혼자 그 일을 할 필요가 없다.
 */
const ACTOR_TONE: Record<Actor, string> = {
  brand: "bg-violet-100 text-violet-800",
  kr: "bg-neutral-100 text-neutral-600",
  th: "bg-blue-50 text-[#0C3F80]",
};

function ActorTag({ actor, lang }: { actor: Actor; lang: AdminLang }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-xs font-bold whitespace-nowrap ${ACTOR_TONE[actor]}`}
    >
      {actorLabel(actor, lang)}
    </span>
  );
}

/** 일이 어느 나라에서 벌어지는지. 손이 넘어가는 지점을 눈으로 잡게 한다. */
function WhereTag({ where, lang }: { where: Stage["where"]; lang: AdminLang }) {
  const th = where === "th";
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-neutral-400">
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
 * 지금 화면에 걸린 단계. 스크롤할 때마다 열 개의 위치를 읽지만 프레임당 한
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

        <BrandBoard lang={lang} data={data} go={go} />
        <Status lang={lang} data={data} go={go} />
        <Overview lang={lang} />
        <Routes lang={lang} />
        <Prereq lang={lang} />

        {PHASES.map((phase) => (
          <PhaseSection key={phase.key} phase={phase} lang={lang} go={go} />
        ))}

        <LaneTable lang={lang} />
        <CostTable lang={lang} />
        <Glossary lang={lang} />
        <Sources lang={lang} />

        <p className="mt-6 text-xs leading-relaxed text-neutral-400">{t(F.foot, lang)}</p>
      </Page>

      <ToTop label={t(F.toTop, lang)} />
    </>
  );
}

/**
 * 단계 바로가기. 열 장짜리 문서에서 길을 잃지 않게 하는 유일한 장치라
 * 스크롤해도 늘 보이는 자리에 둔다. 모바일은 가로로 밀고, PC는 줄바꿈한다 —
 * PC에서 가로 스크롤을 시키면 마우스로는 끝까지 못 가는 사람이 생긴다.
 */
function StageRail({ lang, active }: { lang: AdminLang; active: string }) {
  const activeChip = useRef<HTMLButtonElement | null>(null);
  const rail = useRef<HTMLDivElement | null>(null);

  /*
    모바일에서는 줄이 가로로 밀린다. 아래로 읽어 내려가는 동안 지금 단계 칩이
    화면 밖으로 나가 버리면 줄이 있으나 마나다. block: "nearest" 라서 세로
    스크롤은 건드리지 않고, PC에서는 줄바꿈이라 넘칠 곳이 없어 아무 일도 없다.
  */
  useEffect(() => {
    activeChip.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  /*
    줄이 자기가 얼마나 자리를 차지하는지 재서 알려 준다. 카드는 그만큼을 비우고
    멈춘다(SCROLL_MT 참조).

    붙는 자리(top)까지 더해야 한다 — 모바일은 상단바 밑 57px에 붙고 PC는 0에
    붙는데, 그 값은 이 컴포넌트가 아니라 CSS에 적혀 있으므로 계산된 값을 읽는다.
    거기에 12px을 얹어 카드가 줄에 닿지 않게 한다.

    칩 줄 수는 언어와 글자 크기와 창 너비에 따라 바뀌므로 한 번 재고 마는 게
    아니라 크기가 바뀔 때마다 다시 잰다.
  */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    function measure() {
      if (!el) return;
      const stick = parseFloat(getComputedStyle(el).top) || 0;
      document.documentElement.style.setProperty(
        "--rail",
        `${Math.ceil(stick + el.offsetHeight) + 12}px`,
      );
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--rail");
    };
  }, [lang]);

  return (
    <div
      ref={rail}
      className="sticky top-[57px] z-10 border-b border-neutral-200 bg-white/95 backdrop-blur md:top-0"
    >
      {/*
        모바일에서는 열 개 중 서너 개만 보이고 스크롤바도 숨겨 두어서, 오른쪽에
        더 있다는 것을 알 방법이 없었다. 오른쪽 끝을 흐리게 해서 잘린 자리를
        보여 준다. PC는 줄바꿈이라 잘릴 일이 없으므로 끄고, 여백도 아낀다.
      */}
      <div className="relative mx-auto max-w-4xl px-5 py-2 md:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent md:hidden"
        />
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] md:flex-wrap md:overflow-visible">
          {STAGES.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                ref={on ? activeChip : undefined}
                onClick={() => scrollToStage(s.id)}
                aria-current={on ? "true" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
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
 * 개요 — 열 단계를 네 묶음으로 접는다.
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
        <p className="text-xs text-neutral-400">{t(F.overviewHint, lang)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4 md:gap-0">
        {PHASES.map((phase, pi) => {
          const stages = STAGES.filter((s) => s.phase === phase.key);
          const last = pi === PHASES.length - 1;
          return (
            <div key={phase.key} className={`flex ${last ? "" : "md:pr-3"}`}>
              <div className="min-w-0 flex-1">
                {/*
                  묶음에는 번호를 붙이지 않는다. 단계가 이미 01~10을 갖고 있어서
                  묶음에도 번호를 주면 "3번"이 물건 보내기인지 시장 검증인지
                  말하는 사람마다 달라진다.
                */}
                <h3 className="mb-2 truncate text-xs font-bold text-neutral-800">
                  {t(phase.title, lang)}
                </h3>
                <p className="mb-2.5 text-xs leading-relaxed text-neutral-400">
                  {t(phase.note, lang)}
                </p>
                <div className="flex flex-col gap-1.5">
                  {stages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToStage(s.id)}
                      className="group flex items-center gap-2 rounded-xl border border-neutral-200 px-2.5 py-2 text-left transition-colors hover:border-[#0C3F80] hover:bg-blue-50/40"
                    >
                      <span className="text-[11px] font-black text-neutral-300 tabular-nums group-hover:text-[#0C3F80]">
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

      <p className="mt-4 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
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
 * 전체가 몇 달인지.
 *
 * 개요 바로 아래에 둔다. 단계마다 기간은 적혀 있지만, 읽는 사람이 그것을 더해서
 * 답을 만들면 03과 04가 같이 도는 것을 모른 채 두 달을 더 얹는다. 그러니 더한
 * 답을 우리가 준다.
 */
function Routes({ lang }: { lang: AdminLang }) {
  return (
    <section className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
        <CalendarClock size={14} className="text-neutral-400" />
        {t(F.routesTitle, lang)}
      </h2>
      <p className="mt-1 mb-3.5 text-xs leading-relaxed text-neutral-500">{t(F.routesLead, lang)}</p>

      <div className="grid gap-2.5 md:grid-cols-2">
        {ROUTES.map((r) => (
          <div key={r.title.en} className="rounded-xl border border-neutral-200 px-4 py-3">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs font-bold text-neutral-500">{t(r.title, lang)}</span>
              <span className="text-base font-black tracking-tight text-[#0C3F80]">
                {t(r.span, lang)}
              </span>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t(r.body, lang)}</p>
          </div>
        ))}
      </div>
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
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-400"
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
        <span className="w-8 text-xs font-bold">{t(LANE_LABEL[lane], lang)}</span>
      </span>
      <span className={value ? "min-w-0 flex-1 text-neutral-700" : "text-neutral-300"}>
        {value ? t(value, lang) : "—"}
      </span>
    </span>
  );
}

/**
 * 창고에 물건이 놓일 때까지 붙는 돈을 순서대로 쌓아 보여 준다.
 *
 * 관세와 부가세만 세는 원가표가 실제로 틀리는 이유는 터미널 비용·통관 수수료·
 * 지체료가 빠져 있어서다. 세금이 어느 금액을 기준으로 계산되는지도 중간에
 * 끊어 적는다 — 운임을 빼고 부가세를 계산하면 매번 모자란다.
 */
function CostTable({ lang }: { lang: AdminLang }) {
  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
          <Coins size={14} className="text-neutral-400" />
          {t(F.costsTitle, lang)}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t(F.costsLead, lang)}</p>
      </div>

      {COST_GROUPS.map((g) => (
        <div key={g.key} className="border-b border-neutral-100 last:border-b-0">
          <p className="bg-neutral-50/70 px-5 py-1.5 text-xs font-bold text-neutral-500">
            {t(g.title, lang)}
          </p>
          <ul className="divide-y divide-neutral-100">
            {g.items.map((item, i) => (
              <li
                key={i}
                className="grid gap-0.5 px-5 py-2.5 md:grid-cols-[13rem_1fr] md:items-baseline md:gap-3"
              >
                <span className="text-xs font-semibold text-neutral-800">{t(item.label, lang)}</span>
                <span className="text-xs leading-relaxed text-neutral-500">{t(item.note, lang)}</span>
              </li>
            ))}
          </ul>
          {/* 이 묶음까지 더하면 무슨 금액이 되는지. 세금 계산의 기준선이라 눈에 띄게 둔다. */}
          {g.makes && (
            <p className="border-t border-dashed border-neutral-200 bg-blue-50/40 px-5 py-2 text-xs font-semibold text-[#0C3F80]">
              {t(g.makes, lang)}
            </p>
          )}
        </div>
      ))}
    </section>
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
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-neutral-300 text-[11px] font-black text-neutral-400 tabular-nums">
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

  /*
    셀 것이 하나도 없으면 이 칸은 "아직 등록된 것이 없습니다" 두 줄만 남는다.
    설명서 맨 위에 그 두 줄이 자리를 차지하고 있으면 읽는 사람은 화면이 아직
    준비 중이라고 읽는다. 셀 것이 생기면 그때 나타난다.
  */
  if (brandRows.length === 0 && fdaRows.length === 0) return null;

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
    <button onClick={onClick} className="group min-w-0 text-left">
      {/* 누르면 다른 탭으로 간다. 그 말을 화살표로 해 둔다 — 앞에서는 커서 말고 아무 표시가 없었다. */}
      <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-neutral-500 transition-colors group-hover:text-[#0C3F80]">
        {label}
        <ChevronRight size={12} className="text-neutral-300 group-hover:text-[#0C3F80]" />
      </p>
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

const STATE_TONE: Record<StageState, string> = {
  done: "bg-emerald-100 text-emerald-800",
  now: "bg-[#0C3F80] text-white",
  todo: "bg-neutral-100 text-neutral-400",
};

const STATE_LABEL: Record<StageState, T> = {
  done: F.legDone,
  now: F.legNow,
  todo: F.legTodo,
};

/**
 * 브랜드별 진행.
 *
 * 이 화면에서 가장 자주 받는 질문이 "그래서 포지티바는 지금 어디쯤이야"인데,
 * 앞에서는 답할 수가 없었다. 브랜드에 붙은 상태값은 lead→ended 다섯 개뿐이고
 * 그중 active 하나가 03~10을 전부 삼켰기 때문이다.
 *
 * 여기서는 단계마다 상태를 따로 낸다. 값이 붙는 자리가 넷이기 때문이다 —
 * 01·04는 제품, 02·03은 브랜드, 05~07은 선적, 10은 허가에 붙는다. 한 브랜드
 * 안에서 A제품은 팔리고 B제품은 등록 대기일 수 있고, 이번 컨테이너는 통관 중인데
 * 다음 발주는 생산 중일 수 있으므로 한 줄에 값 하나로는 적을 수 없다.
 *
 * 줄을 펴면 그 네 자리를 여기서 바로 고칠 수 있다. 진행 줄만 있고 고칠 데가
 * 없으면 칸은 영원히 비어 있고, 비어 있는 칸을 보고는 아무도 일을 못 한다.
 */
function BrandBoard({
  lang,
  data,
  go,
}: {
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
}) {
  /*
    오늘을 한 번만 읽어 모든 줄에 같은 값을 넘긴다. 줄마다 각자 시계를 보면
    자정을 걸친 계산에서 위 줄과 아래 줄의 "며칠 남음"이 하루씩 어긋난다.
  */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const rows = data.brands.map((b) =>
    brandProgress(b, data.products, data.shipments, data.moves, data.finance, data.licences, today),
  );

  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
          <Route size={14} className="text-neutral-400" />
          {t(F.progressTitle, lang)}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">{t(F.progressLead, lang)}</p>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
          {(["done", "now", "todo"] as StageState[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className={`size-3 rounded ${STATE_TONE[s]}`} aria-hidden />
              {t(STATE_LABEL[s], lang)}
            </span>
          ))}
        </div>
      </div>

      {data.shipmentsMissing && (
        <p className="flex items-start gap-2 border-b border-amber-100 bg-amber-50/70 px-5 py-3 text-xs leading-relaxed text-amber-800">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          <span>{t(F.shipMissing, lang)}</span>
        </p>
      )}

      {rows.length === 0 ? (
        <p className="px-5 py-5 text-sm text-neutral-400">{t(F.progressEmpty, lang)}</p>
      ) : (
        <div className="divide-y divide-neutral-100">
          {rows.map((row) => (
            <BrandRow key={row.brand.id} row={row} lang={lang} data={data} go={go} today={today} />
          ))}
        </div>
      )}
    </section>
  );
}

function BrandRow({
  row,
  lang,
  data,
  go,
  today,
}: {
  row: BrandProgress;
  lang: AdminLang;
  data: AdminData;
  go: (j: Tab | Jump) => void;
  today: Date;
}) {
  const c = a[lang];
  const [open, setOpen] = useState(false);

  return (
    <div className="px-5 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => go("brand")} className="group flex min-w-0 items-center gap-1.5 text-left">
          <span className="truncate text-sm font-bold text-neutral-800 group-hover:text-[#0C3F80]">
            {row.brand.name}
          </span>
          <ChevronRight size={13} className="shrink-0 text-neutral-300 group-hover:text-[#0C3F80]" />
        </button>
        <span className="text-xs text-neutral-400">
          {brandStatusLabel(row.brand.status, c)}
          <span className="mx-1.5 text-neutral-200">·</span>
          {t(F.shipTitle, lang)} {row.shipments.length}
        </span>
      </div>

      {/*
        열 칸을 한 줄로 놓는다. 좁은 화면에서도 접거나 가로로 밀지 않는다 —
        한눈에 보라고 만든 줄인데 일부만 보이면 그 줄이 하는 일이 없어진다.
      */}
      <div className="mt-2 grid grid-cols-10 gap-1">
        {row.cells.map((cell) => {
          const stage = STAGES.find((s) => s.id === cell.id);
          return (
            <button
              key={cell.id}
              onClick={() => scrollToStage(cell.id)}
              title={`${stage ? `${stage.no} ${t(stage.title, lang)}` : cell.id} — ${t(
                STATE_LABEL[cell.state],
                lang,
              )}${cell.hint ? ` · ${cell.hint}` : ""}`}
              className={`grid h-7 place-items-center rounded text-[11px] font-black tabular-nums transition-opacity hover:opacity-80 ${
                STATE_TONE[cell.state]
              }`}
            >
              {stage?.no ?? "?"}
            </button>
          );
        })}
      </div>

      {/* 셀 위에 얹은 한 줄들. 마우스를 올려야만 보이면 모바일에서는 없는 것과 같다. */}
      {row.cells.some((cell) => cell.hint) && (
        <p className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-neutral-500">
          {row.cells
            .filter((cell) => cell.hint)
            .map((cell) => (
              <span key={cell.id}>
                <span className="font-bold text-neutral-400 tabular-nums">
                  {STAGES.find((s) => s.id === cell.id)?.no}
                </span>{" "}
                {cell.hint}
              </span>
            ))}
        </p>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-[#0C3F80]"
      >
        <ChevronRight
          size={12}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
          aria-hidden
        />
        {t(F.progressTitle, lang)}
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <Panel label={t(F.panelScreen, lang)}>
            <ProductRows brand={row} lang={lang} data={data} />
          </Panel>
          <Panel label={t(F.panelValidate, lang)}>
            <ValidateRow brand={row} lang={lang} data={data} />
          </Panel>
          <Panel label={t(F.shipTitle, lang)}>
            <ShipmentList brand={row} lang={lang} data={data} />
          </Panel>
          <Panel label={t(F.panelKeep, lang)}>
            <LicenceList brand={row} lang={lang} data={data} today={today} />
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-3">
      <p className="mb-2 text-xs font-bold text-neutral-400">{label}</p>
      {children}
    </div>
  );
}

const FIELD = "rounded-lg border border-neutral-200 px-2 py-1 text-xs outline-none focus:border-[#0C3F80] disabled:bg-neutral-50";

/**
 * 값을 고르면 바로 저장하고 전체를 다시 읽는다.
 *
 * 저장 버튼을 따로 두지 않는 이유는, 이 화면에서 고치는 것이 한 번에 한 칸이고
 * 고친 결과가 바로 위 진행 줄의 색을 바꾸기 때문이다 — 고른 것과 줄이 어긋나
 * 있으면 무엇이 참인지 알 수 없다.
 */
function Choice<V extends string>({
  value,
  options,
  label,
  onPick,
  busy,
}: {
  value: V;
  options: readonly V[];
  label: (v: V) => string;
  onPick: (v: V) => void;
  busy: boolean;
}) {
  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => onPick(e.target.value as V)}
      className={FIELD}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {label(o)}
        </option>
      ))}
    </select>
  );
}

/**
 * 01단계 판정과 04단계 등록 상태를 제품마다 적는다.
 *
 * 01을 여기 둔 이유: 갈래·HS·부처는 제품에 붙는 값인데, 그 셋이 채워졌는지가
 * 곧 01단계가 끝났는지다. 재고 탭에도 제품 편집이 있지만 거기는 값을 넣는
 * 도구이고, 여기는 그 값이 단계에 무슨 뜻인지 옆에 두고 고르는 자리다.
 */
function ProductRows({
  brand,
  lang,
  data,
}: {
  brand: BrandProgress;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  /*
    실패를 삼키지 않는다.

    칩을 누르면 화면이 먼저 바뀌는데, 저장이 실패해도 아무 말이 없으면 사람은
    적힌 줄 알고 넘어간다. 다음에 다시 읽을 때 옛 값으로 돌아와 있고, 그때는
    누가 되돌렸는지 아무도 모른다.
  */
  async function patch(id: string, values: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.from("products").update(values).eq("id", id);
    if (error) {
      setBusy(false);
      return toast(c.saveFailed, "bad");
    }
    await data.reload();
    setBusy(false);
  }

  if (brand.products.length === 0) {
    return <p className="text-xs text-neutral-400">{t(F.noProducts, lang)}</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {brand.products.map((p) => (
        <li key={p.id} className="flex flex-col gap-1.5">
          <p className="truncate text-xs font-semibold text-neutral-700">{p.name_ko || p.sku}</p>
          <div className="flex flex-wrap gap-1.5">
            <Choice
              value={p.food_group}
              options={FOOD_GROUPS}
              label={(v) => t(FOOD_GROUP_LABEL[v], lang)}
              onPick={(v) => void patch(p.id, { food_group: v })}
              busy={busy}
            />
            <Choice
              value={p.extra_permit}
              options={EXTRA_PERMITS}
              label={(v) => t(EXTRA_PERMIT_LABEL[v], lang)}
              onPick={(v) => void patch(p.id, { extra_permit: v })}
              busy={busy}
            />
            <input
              defaultValue={p.hs_code}
              placeholder={t(F.hsCode, lang)}
              aria-label={t(F.hsCode, lang)}
              disabled={busy}
              onBlur={(e) =>
                e.target.value !== p.hs_code && void patch(p.id, { hs_code: e.target.value.trim() })
              }
              className={`${FIELD} w-24`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-neutral-400">{t(F.fdaStatus, lang)}</span>
            <Choice
              value={p.fda_status}
              options={FDA_FLOW}
              label={(v) => fdaLabel(v, c)}
              onPick={(v) => void patch(p.id, { fda_status: v })}
              busy={busy}
            />
            <span className="text-xs text-neutral-400">{t(F.labelStatus, lang)}</span>
            <Choice
              value={p.label_status}
              options={FDA_FLOW}
              label={(v) => fdaLabel(v, c)}
              onPick={(v) => void patch(p.id, { label_status: v })}
              busy={busy}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * 03단계는 날짜 한 칸이다.
 *
 * 시딩 건수로 완료를 짐작하지 않는다 — 몇 건을 보내야 검증이 끝난 것인지는
 * 규칙이 아니라 사람의 판단이고, 그 판단을 내린 날을 적는 것이 이 칸이다.
 */
function ValidateRow({
  brand,
  lang,
  data,
}: {
  brand: BrandProgress;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const on = brand.brand.validated_on;

  async function save(value: string | null) {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("brands")
      .update({ validated_on: value, updated_at: new Date().toISOString() })
      .eq("id", brand.brand.id);
    if (error) {
      setBusy(false);
      return toast(c.saveFailed, "bad");
    }
    await data.reload();
    setBusy(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-neutral-400">{t(F.validatedOn, lang)}</span>
      <input
        type="date"
        value={on ?? ""}
        disabled={busy}
        onChange={(e) => void save(e.target.value || null)}
        className={FIELD}
      />
      {!on && (
        <button
          onClick={() => void save(new Date().toISOString().slice(0, 10))}
          disabled={busy}
          className="rounded-lg border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-600 hover:border-[#0C3F80] hover:text-[#0C3F80] disabled:opacity-40"
        >
          {t(F.markToday, lang)}
        </button>
      )}
      {on && (
        <button
          onClick={() => void save(null)}
          disabled={busy}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-400 hover:text-rose-600 disabled:opacity-40"
        >
          {t(F.clear, lang)}
        </button>
      )}
    </div>
  );
}

/**
 * 10단계 — 만료가 있는 것들.
 *
 * 브랜드에 걸리지 않는 허가(อ.7 처럼 회사 전체에 걸리는 것)도 이 목록에 같이
 * 뜬다. 그게 만료되면 그날부터 모든 브랜드의 수입이 멈추기 때문이다 — 어느
 * 브랜드를 보고 있든 눈에 들어와야 한다.
 */
function LicenceList({
  brand,
  lang,
  data,
  today,
}: {
  brand: BrandProgress;
  lang: AdminLang;
  data: AdminData;
  today: Date;
}) {
  const c = a[lang];
  const toast = useToast();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<LicenceKind>("or7");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (busy || (!name.trim() && !expires)) return;
    setBusy(true);
    const { error } = await supabase.from("licences").insert({
      kind,
      name: name.trim(),
      expires_on: expires || null,
      // อ.7·부가세는 회사 전체에 걸린다. 브랜드에 묶으면 다른 브랜드에서 안 보인다.
      brand_id: kind === "or7" || kind === "vat" ? null : brand.brand.id,
    });
    if (error) {
      setBusy(false);
      // 적어 둔 것을 지우지 않는다 — 실패한 마당에 입력까지 날아가면 두 번 일한다.
      return toast(c.saveFailed, "bad");
    }
    setName("");
    setExpires("");
    await data.reload();
    setBusy(false);
  }

  async function remove(id: string) {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.from("licences").delete().eq("id", id);
    if (error) {
      setBusy(false);
      return toast(c.saveFailed, "bad");
    }
    await data.reload();
    setBusy(false);
  }

  function daysLeft(iso: string) {
    return Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
  }

  return (
    <div>
      {brand.licences.length === 0 ? (
        <p className="mb-2 text-xs text-neutral-400">{t(F.licNone, lang)}</p>
      ) : (
        <ul className="mb-2.5 flex flex-col gap-1.5">
          {brand.licences.map((l) => {
            const left = l.expires_on ? daysLeft(l.expires_on) : null;
            const tone = left === null ? "gray" : left < 0 ? "rose" : left <= RENEW_WINDOW_DAYS ? "amber" : "green";
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-xs text-neutral-700">
                  <span className="font-semibold">{t(LICENCE_KIND_LABEL[l.kind], lang)}</span>
                  {l.name && <span className="ml-1.5 text-neutral-500">{l.name}</span>}
                  {!l.brand_id && !l.product_id && (
                    <span className="ml-1.5 text-neutral-400">· {t(F.licCompanyWide, lang)}</span>
                  )}
                </span>
                {l.expires_on && (
                  <Pill tone={tone}>
                    {l.expires_on}
                    {left !== null && left < 0 && ` · ${t(F.licExpired, lang)}`}
                    {left !== null && left >= 0 && left <= RENEW_WINDOW_DAYS && ` · ${left}d`}
                  </Pill>
                )}
                <button
                  onClick={() => void remove(l.id)}
                  disabled={busy}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-400 hover:text-rose-600 disabled:opacity-40"
                >
                  {t(F.shipDelete, lang)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5">
        <Choice
          value={kind}
          options={LICENCE_KINDS}
          label={(v) => t(LICENCE_KIND_LABEL[v], lang)}
          onPick={setKind}
          busy={busy}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          // 바로 아래 선적 칸은 Enter로 들어간다. 여기만 안 되면 적어 놓고 Enter를
          // 친 사람은 저장된 줄 알고 넘어간다.
          onKeyDown={(e) => e.key === "Enter" && void add()}
          placeholder={t(F.licName, lang)}
          aria-label={t(F.licName, lang)}
          className={`${FIELD} min-w-0 flex-1`}
        />
        <input
          type="date"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          aria-label={t(F.licExpires, lang)}
          className={FIELD}
        />
        <button
          onClick={() => void add()}
          disabled={busy || (!name.trim() && !expires)}
          className="shrink-0 rounded-lg bg-[#0C3F80] px-3 py-1 text-xs font-bold text-white disabled:opacity-40"
        >
          {t(F.licAdd, lang)}
        </button>
      </div>
    </div>
  );
}

/**
 * 한 브랜드의 선적들. 05~07단계를 실제로 움직이는 자리다.
 *
 * 고칠 때마다 전체를 다시 읽는다. 이 규모에서는 몇십 킬로바이트라, 낙관적
 * 갱신으로 화면과 DB가 어긋날 여지를 만드는 것보다 다시 읽는 쪽이 틀릴 데가 없다
 * — data.ts가 세운 규칙을 여기서도 따른다.
 */
function ShipmentList({
  brand,
  lang,
  data,
}: {
  brand: BrandProgress;
  lang: AdminLang;
  data: AdminData;
}) {
  const c = a[lang];
  const toast = useToast();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    const name = code.trim();
    if (!name || busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("shipments")
      .insert({ brand_id: brand.brand.id, code: name });
    if (error) {
      setBusy(false);
      // 적어 둔 이름은 남겨 둔다. 다시 누르기만 하면 되게.
      return toast(c.saveFailed, "bad");
    }
    setCode("");
    await data.reload();
    setBusy(false);
  }

  async function advance(id: string, stage: ShipStage) {
    const next = SHIP_FLOW[Math.min(SHIP_FLOW.indexOf(stage) + 1, SHIP_FLOW.length - 1)];
    if (next === stage || busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("shipments")
      .update({ stage: next, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setBusy(false);
      return toast(c.saveFailed, "bad");
    }
    await data.reload();
    setBusy(false);
  }

  async function remove(id: string) {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) {
      setBusy(false);
      return toast(c.saveFailed, "bad");
    }
    await data.reload();
    setBusy(false);
  }

  return (
    <div className="mt-2 rounded-xl border border-neutral-200 p-3">
      {brand.shipments.length === 0 ? (
        <p className="text-xs text-neutral-400">{t(F.shipNone, lang)}</p>
      ) : (
        <ul className="mb-2.5 flex flex-col gap-1.5">
          {brand.shipments.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-neutral-700">
                {s.code || "—"}
              </span>
              <Pill tone={s.stage === "done" ? "green" : "blue"}>
                {t(SHIP_STAGE_LABEL[s.stage], lang)}
              </Pill>
              {s.stage !== "done" && (
                <button
                  onClick={() => void advance(s.id, s.stage)}
                  disabled={busy}
                  className="rounded-lg border border-neutral-200 px-2 py-1 text-xs font-semibold text-neutral-600 hover:border-[#0C3F80] hover:text-[#0C3F80] disabled:opacity-40"
                >
                  {t(F.shipNext, lang)}
                </button>
              )}
              <button
                onClick={() => void remove(s.id)}
                disabled={busy}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-400 hover:text-rose-600 disabled:opacity-40"
              >
                {t(F.shipDelete, lang)}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-1.5">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void add()}
          placeholder={t(F.shipCodeHint, lang)}
          aria-label={t(F.shipCode, lang)}
          disabled={data.shipmentsMissing}
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#0C3F80] disabled:bg-neutral-50"
        />
        <button
          onClick={() => void add()}
          disabled={busy || !code.trim() || data.shipmentsMissing}
          className="shrink-0 rounded-lg bg-[#0C3F80] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
        >
          {t(F.shipAdd, lang)}
        </button>
      </div>
    </div>
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
        <p className="min-w-0 flex-1 truncate text-xs text-neutral-400">
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
            <p className="mb-1 text-xs font-bold tracking-wide text-[#0C3F80]/70 uppercase">
              {t(F.lblPlain, lang)}
            </p>
            <p className="text-sm leading-relaxed text-neutral-700">{t(stage.plain, lang)}</p>
          </div>

          {/*
            번호가 붙어 있으면 사람은 그것을 순서로 읽는다. 같이 도는 단계는
            그 읽기를 여기서 끊어 준다 — "쉽게 말하면" 바로 밑, 할 일을 보기
            전에 나와야 순서를 잘못 잡은 채로 일을 시작하지 않는다.
          */}
          {stage.alongside && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-dashed border-[#0C3F80]/30 bg-blue-50/30 px-4 py-3">
              <Split size={14} className="mt-0.5 shrink-0 text-[#0C3F80]" />
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-neutral-600">
                <span className="font-bold text-[#0C3F80]">{t(F.lblAlongside, lang)}</span>
                <span className="mx-1.5 text-neutral-300">·</span>
                {t(stage.alongside, lang)}
              </p>
            </div>
          )}

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
                    className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600"
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

          {/*
            규정이 아니라 실무에서 돈과 시간이 새는 자리. 위의 경고와 색을 나눠
            둔다 — 같은 노란 칸에 넣으면 제일 크게 터지는 것 하나가 목록에 묻힌다.
          */}
          {stage.watch && (
            <div className="mt-3 rounded-xl border border-neutral-200 px-4 py-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-neutral-400 uppercase">
                <ListChecks size={13} />
                {t(F.lblWatch, lang)}
              </p>
              <ul className="flex flex-col gap-1.5">
                {stage.watch.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600">
                    <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-neutral-300" />
                    <span className="min-w-0 flex-1">{t(w, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.record && (
            <button
              onClick={() => go(stage.record!.tab)}
              className="mt-3 flex w-full items-start gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-left transition-colors hover:border-[#0C3F80] hover:bg-blue-50/40"
            >
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-[#0C3F80]" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold tracking-wide text-neutral-400 uppercase">
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
          <p className="mt-3 border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-400">
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
          <span className="text-xs font-bold text-neutral-400">{t(F.handoff, lang)}</span>
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
 * 용어는 접어 둔다. 한 번 익히면 다시 볼 일이 없는데 열 단계 뒤에 펼쳐 두면
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
        <p className="min-w-0 flex-1 truncate text-xs text-neutral-400">
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
        <p className="text-xs font-semibold text-neutral-400 tabular-nums">
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
 * 맨 위로. 열 장을 다 내려간 뒤 단계 바로가기 줄까지 돌아가려면 한참을 올려야
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
