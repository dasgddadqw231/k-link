import { Fragment, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Check, X } from "lucide-react";
import { T } from "./site";

/**
 * 한국어 페이지의 도해 모음.
 *
 * 페이지가 문단으로만 이어져서 읽는 데 힘이 들었다. 그렇다고 장식을 얹지는
 * 않는다 — site.tsx의 원칙(색면 금지, 그림자 금지, 위계는 활자와 여백으로)을
 * 그대로 따르고, 여기 있는 도해는 전부 본문에 이미 있는 사실을 눈으로 옮긴
 * 것이다. 그림이 문장보다 먼저 읽히되, 그림에만 있는 정보는 두지 않는다.
 *
 * 숫자의 출처는 docs/stp.md, 단계별 기간과 주의는 src/app/admin/workflow.ts다.
 * 그 두 파일에 없는 값은 여기에 적지 않는다.
 */

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/* ------------------------------------------------------------------ *
 * 규제 도해 — "왜 혼자서는 안 되는가" 섹션
 * ------------------------------------------------------------------ */

/** 도해 안의 한 줄. 되는 것과 안 되는 것을 아이콘 모양으로도 구분한다(색만으로 나누지 않는다). */
function Row({
  ok,
  label,
  value,
}: {
  ok: boolean;
  label: string;
  value: string;
}) {
  return (
    <li
      className={`flex items-center gap-2.5 px-3.5 py-2.5 ${
        ok ? "bg-[#0C3F80]/[0.05]" : "bg-[#F4F6F8]"
      }`}
    >
      <span
        aria-hidden
        className={`grid size-4 shrink-0 place-items-center rounded-full ${
          ok ? "bg-[#0C3F80] text-white" : "bg-[#C4CBD5] text-white"
        }`}
      >
        {ok ? <Check size={10} strokeWidth={3.5} /> : <X size={10} strokeWidth={3.5} />}
      </span>
      <span
        className={`text-[13px] font-medium ${ok ? "text-[#12161F]" : "text-[#8B94A3]"}`}
      >
        {label}
      </span>
      <span
        className={`ml-auto shrink-0 text-[12px] font-semibold ${
          ok ? "text-[#0C3F80]" : "text-[#8B94A3]"
        }`}
      >
        {value}
      </span>
    </li>
  );
}

/** 도해 공통 껍데기. 머리카락 굵기 선 하나로만 두른다. */
function Frame({
  caption,
  children,
  note,
}: {
  caption: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <div className="overflow-hidden rounded-xl border border-[#E3E7ED] bg-white">
        {children}
      </div>
      {note && <p className={`mt-2.5 ${T.small}`}>{note}</p>}
    </figure>
  );
}

/**
 * 허가가 주소에 붙는다는 사실은 이 페이지의 첫 번째 논거다. 문장으로 읽으면
 * 한 번 더 생각해야 하지만, 두 줄을 나란히 놓으면 즉시 보인다.
 */
export function AddressFigure() {
  return (
    <Frame
      caption="수입 허가 신청 주소 비교"
      note="현장 실사 후 발급 · 유효기간 3년"
    >
      <ul className="divide-y divide-[#E3E7ED]">
        <Row ok={false} label="서울 본사 주소" value="신청 불가" />
        <Row ok label="태국 창고 주소" value="อ.7 발급" />
      </ul>
    </Frame>
  );
}

/**
 * 라벨 규정은 "번역"으로 오해되기 쉽다. 표시 항목이 정해져 있다는 걸 보이려면
 * 항목을 실제로 나열해야 한다. 고시 제450호 기준(workflow.ts의 produce 단계).
 */
export function LabelFigure() {
  const items = ["태국어 표시", "알레르기 표시", "유통기한", "อย. 번호"];
  return (
    <Frame caption="태국어 라벨의 필수 표시 항목" note="라벨 고시 제450호 · 통관 전 부착">
      <div className="px-3.5 py-3.5">
        <p className="text-[11.5px] font-semibold text-[#8B94A3]">
          통관 전 부착돼 있어야 하는 것
        </p>
        {/* 네 칸을 흘려 놓으면 폭에 따라 3+1로 접힌다. 2×2로 못 박아 둔다. */}
        <ul className="mt-2.5 grid grid-cols-2 gap-1.5">
          {items.map((it) => (
            <li
              key={it}
              className="rounded-md border border-[#D7DCE4] px-2 py-1 text-center text-[12px] font-medium text-[#12161F]"
            >
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/**
 * อย. 번호는 소비자가 패키지에서 실제로 보는 것이라, 형식을 보여 주는 편이
 * 설명보다 빠르다. 실제 번호를 쓰면 아직 받지도 않은 번호를 주장하는 셈이라
 * 자리만 X로 채운다.
 */
export function OyFigure() {
  return (
    <Frame caption="식품 등록번호 표기 형식" note="번호는 수입자 명의로 발급됩니다">
      <div className="flex items-center gap-3 px-3.5 py-3.5">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-[#0C3F80] text-[13px] font-bold text-[#0C3F80]"
        >
          อย.
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[15px] font-semibold tracking-[0.02em] text-[#12161F]">
            XX-X-XXXXX-X-XXXX
          </p>
          <p className="mt-0.5 text-[11.5px] text-[#8B94A3]">
            라벨 사전승인 시 부여되는 13자리
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ *
 * 진행 방식 — 눌러서 펼치는 5단계
 * ------------------------------------------------------------------ */

/**
 * 각 단계에서 누가 무엇을 하는지. 브랜드의 가장 큰 불안은 "그래서 내가 뭘
 * 해야 하나"다.
 *
 * brand가 null인 단계는 브랜드가 손댈 일이 없다는 뜻이고, handoff는 일이
 * 넘어오는 지점이다. 둘 다 이 표의 결론이라 데이터에 적어 둔다 — 화면에서
 * 문자열을 보고 짐작하지 않는다.
 *
 * takes·detail·watch는 admin의 workflow.ts에서 가져왔다. 그쪽이 출처를 달고
 * 관리하는 원본이고, 여기는 브랜드가 읽을 만큼만 줄인 것이다. 두 곳의 숫자가
 * 어긋나면 workflow.ts가 맞다.
 */
const steps: {
  no: string;
  title: string;
  brand: string | null;
  klink: string;
  takes: string;
  detail: string;
  watch: string;
  handoff?: boolean;
}[] = [
  {
    no: "01",
    title: "제품 검토",
    brand: "샘플, 성분표, 제조공정서",
    klink: "태국 시장 적합성과 등록 가능 여부 확인",
    takes: "서류가 다 오면 3~5일",
    detail:
      "성분 배합표(%)를 보고 태국의 식품 네 갈래 중 어디에 속하는지 가릅니다. 일반식품은 등록이 아예 필요 없고, 구체적 통제식품은 서너 달이 걸립니다. 여기서 일정과 비용이 몇 배 갈립니다.",
    watch:
      "배합비가 %로 적혀 있지 않으면 판정 자체를 못 합니다. 갈래를 잘못 잡으면 두 달 뒤에 처음부터 다시 합니다.",
  },
  {
    no: "02",
    title: "시장 검증",
    brand: "소량 물량",
    klink: "FDA 등록 전 소량으로 현지 반응 확인, 인플루언서 시딩",
    takes: "4~6주",
    detail:
      "등록이 끝나기를 기다리는 동안 소량만 들여와 인플루언서에게 보내고 반응을 봅니다. 그 결과를 보고 본물량과 판매가를 정합니다. 안 팔릴 물건을 컨테이너째 떠안는 일을 여기서 막습니다.",
    watch:
      "2026년 1월 1일부터 1바트 이상 모든 수입품에 관세와 부가세가 붙습니다. 등록 전에는 판매 목적으로 수입할 수 없어 이 물량은 시딩과 시식에만 씁니다.",
  },
  {
    no: "03",
    title: "태국 FDA 등록",
    brand: "제조사 발급 서류 협조",
    klink: "저희 법인 명의로 신고, 라벨 사전승인",
    takes: "제품 등록 2~90영업일 · 라벨 사전승인 약 60일",
    detail:
      "사실 두 가지 일입니다 — 제품 등록으로 อย. 번호를 받는 일과, 라벨 도안을 미리 승인받는 일. 라벨 쪽이 훨씬 오래 걸려서 일정의 기준이 됩니다.",
    watch:
      "제조품질증명서는 발급일로부터 1년 이내여야 하고, 제조국 정부나 정부가 인정한 기관이 발급한 것이어야 합니다. 반려는 대개 이 서류에서 납니다.",
  },
  {
    no: "04",
    title: "수입 · 통관",
    brand: "한국에서 출고",
    klink: "수입자로서 통관, 태국어 라벨 부착",
    takes: "해상 FCL 7~10일 · 통관 초록선이면 2~5일",
    detail:
      "선적 건마다 수입 사전신고(LPI)를 국가단일창구에 미리 올립니다. 이게 없으면 물건이 도착해도 통관이 시작되지 않습니다. 원산지증명서도 선적이 끝난 뒤에는 발급이 까다로워 이 단계에서 같이 처리합니다.",
    watch:
      "Form AK가 없으면 FTA 특혜세율 대신 일반세율을 냅니다. 인보이스 수량이 실물과 한 개만 달라도 통관이 멈춥니다.",
    handoff: true,
  },
  {
    no: "05",
    title: "유통 · 판매",
    brand: null,
    klink: "도매·리테일 입점, 인플루언서 시딩",
    takes: "상시",
    detail:
      "도매·리테일 입점과 인플루언서 시딩을 이어서 돌립니다. 끝나는 단계가 아니라, 재고가 유통기한보다 빨리 도는지를 계속 보는 구간입니다.",
    watch:
      "건강 효능은 광고 사전 심의를 받은 범위 안에서만 말할 수 있습니다. 인플루언서에게 주는 가이드에도 이 선을 넣습니다 — 남이 대신 한 말도 우리 광고로 봅니다.",
  },
];

/**
 * 단계마다 격자에서 앉을 열. 문자열을 조립하면 Tailwind가 훑을 때 못 찾으니
 * 완성된 클래스명으로 적어 둔다.
 */
const STEP_COL = [
  "md:col-start-2",
  "md:col-start-3",
  "md:col-start-4",
  "md:col-start-5",
  "md:col-start-6",
];

/**
 * 표가 아니라 도식으로 읽힌다.
 *
 * 데스크톱은 두 레인(대한민국·태국)이 다섯 단계를 가로지른다. 격자가 행 높이를
 * 맞춰 주니 칸마다 그은 윗괘선이 한 줄로 이어지고, 그래서 "이 줄은 브랜드 것,
 * 저 줄은 우리 것"이 글을 읽기 전에 잡힌다.
 *
 * 모바일은 단계별로 쌓는다. 좁은 화면에서 레인을 지키려면 가로 스크롤이 되고,
 * 그러면 다섯 단계 중 하나만 보인다.
 *
 * 글은 DOM에 한 번만 넣고 데스크톱에서는 격자 좌표로 자리를 잡는다. 두 레이아웃을
 * 각각 쓰면 크롤러와 스크린리더가 같은 문장을 두 번 읽는다.
 *
 * 색면은 쓰지 않는다(site.tsx의 원칙). 레인은 괘선 색과 라벨로만 나눈다.
 *
 * 여기에 "눌러서 펼치기"를 얹었다. 기간과 주의사항까지 항상 펼쳐 두면 이 섹션이
 * 페이지에서 가장 긴 글덩어리가 되고, 개요로서의 쓸모가 사라진다. 그래서 개요는
 * 그대로 두고 깊이는 눌렀을 때만 나온다.
 *
 * 상세 칸은 다섯 개를 전부 DOM에 넣고 hidden으로 감춘다. 활성 항목만 렌더하면
 * 프리렌더된 HTML에서 그 문장들이 통째로 빠진다 — main.tsx가 hydrate가 아니라
 * 새로 render하므로 화면은 멀쩡하지만, 크롤러가 받는 첫 HTML에는 없다.
 */
export function ProcessDiagram() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-14 grid grid-cols-1 md:grid-cols-[5.5rem_repeat(5,minmax(0,1fr))] md:gap-x-4 md:gap-y-7">
      {steps.map((s, i) => {
        const isOpen = open === s.no;
        return (
          <Fragment key={s.no}>
            {/*
              제목 칸이 곧 버튼이다. 옆에 따로 "자세히" 링크를 두면 좁은 화면에서
              누를 것이 두 개가 되고, 어느 쪽을 눌러야 하는지가 또 하나의 질문이 된다.
            */}
            <motion.div
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className={`${STEP_COL[i]} md:row-start-1 ${i === 0 ? "" : "mt-12 md:mt-0"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.no)}
                aria-expanded={isOpen}
                aria-controls={`step-detail-${s.no}`}
                className={`w-full border-t-2 pt-4 text-left transition-colors ${
                  isOpen
                    ? "border-[#0C3F80]"
                    : "border-[#0C3F80]/45 hover:border-[#0C3F80]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold tabular-nums text-[#0C3F80]">
                    {s.no}
                  </span>
                  {/* 열림 표시는 부호 하나로 충분하다. 아이콘을 더 얹으면 격자가 시끄러워진다. */}
                  <span
                    aria-hidden
                    className={`text-[12px] font-semibold leading-none text-[#8B94A3] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </span>
                <span className={`mt-1.5 block ${T.h3}`}>{s.title}</span>
                <span className="mt-1 block text-[11.5px] text-[#8B94A3]">
                  {s.takes}
                </span>
              </button>
            </motion.div>

            {/*
              한 단계의 세 조각은 같은 지연으로 함께 들어온다. 제목만 움직이게
              두면 스크롤 중에 본문이 먼저 서 있고 제목이 뒤늦게 나타난다.
            */}
            <motion.div
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className={`${STEP_COL[i]} mt-5 border-t border-[#D7DCE4] pt-4 md:row-start-2 md:mt-0`}
            >
              <span className="mb-1.5 block text-[12px] font-semibold text-[#8B94A3] md:hidden">
                브랜드
              </span>
              {s.brand ? (
                <p className="text-[14.5px] leading-relaxed text-[#5A6373]">
                  {s.brand}
                </p>
              ) : (
                <p className="text-[13.5px] leading-relaxed text-[#8B94A3]">
                  브랜드가 할 일 없음
                </p>
              )}
              {/* 일이 넘어오는 지점. 이 페이지에서 브랜드가 가장 알고 싶은 한 줄이다. */}
              {s.handoff && (
                <p className="mt-3 flex items-start gap-1.5 text-[12.5px] font-semibold text-[#0C3F80]">
                  <ArrowDown size={14} strokeWidth={2.5} className="mt-px shrink-0" />
                  브랜드의 일은 여기서 끝납니다
                </p>
              )}
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className={`${STEP_COL[i]} mt-4 border-t border-[#0C3F80] pt-4 md:row-start-3 md:mt-0`}
            >
              <span className="mb-1.5 block text-[12px] font-semibold text-[#0C3F80] md:hidden">
                klink
              </span>
              <p className="text-[14.5px] leading-relaxed text-[#12161F]">{s.klink}</p>
            </motion.div>

            {/*
              상세는 데스크톱에서 격자 아래 한 줄을 통째로 쓴다. 좁은 열 안에서
              펼치면 글줄이 열 자도 안 되게 끊긴다. 모바일에서는 DOM 순서 그대로
              누른 단계 바로 밑에 온다.
            */}
            <div
              id={`step-detail-${s.no}`}
              hidden={!isOpen}
              className="mt-4 rounded-xl border border-[#E3E7ED] bg-white p-5 md:col-span-6 md:col-start-1 md:row-start-4 md:mt-0 md:p-6"
            >
              <p className="text-[12px] font-semibold text-[#0C3F80]">
                {s.no} · {s.title}
                <span className="ml-2 font-medium text-[#8B94A3]">{s.takes}</span>
              </p>
              <p className={`mt-3 max-w-[62ch] ${T.body}`}>{s.detail}</p>
              <p className="mt-4 max-w-[62ch] border-t border-[#E3E7ED] pt-4 text-[13.5px] leading-relaxed text-[#5A6373]">
                <span className="font-semibold text-[#12161F]">여기서 자주 막힙니다 — </span>
                {s.watch}
              </p>
            </div>
          </Fragment>
        );
      })}

      {/* 레인 축 — 데스크톱에서만. 모바일에서는 각 칸이 스스로 라벨을 단다. */}
      <div className="hidden md:col-start-1 md:row-start-2 md:block md:border-t md:border-[#D7DCE4] md:pt-4">
        <span className="block text-[11.5px] font-semibold text-[#8B94A3]">
          대한민국
        </span>
        <span className="mt-0.5 block text-[13.5px] font-semibold text-[#5A6373]">
          브랜드
        </span>
      </div>
      <div className="hidden md:col-start-1 md:row-start-3 md:block md:border-t md:border-[#0C3F80] md:pt-4">
        <span className="block text-[11.5px] font-semibold text-[#8B94A3]">태국</span>
        <span className="mt-0.5 block text-[13.5px] font-semibold text-[#0C3F80]">
          klink
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 대안 비교 — 어디까지 해주는가
 * ------------------------------------------------------------------ */

/**
 * 비교 표에서 결론을 내리는 축은 네 가지다. 글로만 읽으면 "해주는 것/안 해주는
 * 것" 두 문단을 비교해야 하는데, 점으로 찍으면 세 줄이 한눈에 대조된다.
 *
 * 채움 여부는 표의 문장에서 그대로 따온 것이고 새로운 주장을 더하지 않는다.
 * 색만으로 나누지 않도록 채운 점과 빈 점의 모양을 다르게 두고, 각 점에 읽을 수
 * 있는 라벨을 붙인다.
 */
export const CAPABILITIES = ["시장 정보", "인허가 주체", "수입자", "유통 입점"];

export function CoverageDots({
  has,
  name,
}: {
  has: boolean[];
  name: string;
}) {
  return (
    <ul className="flex items-center gap-1.5" aria-label={`${name}이 맡는 범위`}>
      {CAPABILITIES.map((cap, i) => (
        <li key={cap} className="flex items-center">
          <span className="sr-only">
            {cap}: {has[i] ? "해줌" : "안 해줌"}
          </span>
          <span
            aria-hidden
            className={`block size-2.5 rounded-full ${
              has[i] ? "bg-[#0C3F80]" : "border border-[#C4CBD5] bg-transparent"
            }`}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * 점이 무엇을 뜻하는지 한 번만 말한다. 행마다 반복하면 표가 라벨로 뒤덮인다.
 *
 * 자리 이름만 늘어놓으면 빈 점이 "이 항목은 없음"인지 "그냥 눈금"인지 헷갈린다.
 * 채움의 뜻을 한 줄로 먼저 말하고 자리 이름을 잇는다.
 */
export function CoverageLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="block size-2.5 rounded-full bg-[#0C3F80]" />
        <span className="text-[11.5px] font-medium text-[#5A6373]">해줍니다</span>
      </span>
      <span aria-hidden className="h-3 w-px bg-[#D7DCE4]" />
      {CAPABILITIES.map((cap, i) => (
        <span key={cap} className="text-[11.5px] text-[#8B94A3]">
          {i + 1}. {cap}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 시장 근거 — 숫자 옆의 작은 그림
 * ------------------------------------------------------------------ */

/**
 * 하나의 비율. 조각 두 개짜리 원그래프 대신 같은 궤도 위의 눈금으로 그린다.
 * 72%가 "거의 4분의 3"이라는 것이 길이로 즉시 읽힌다.
 */
export function ShareMeter({
  pct,
  fill,
  rest,
}: {
  pct: number;
  fill: string;
  rest: string;
}) {
  return (
    <figure className="mt-5">
      <figcaption className="sr-only">
        {fill} {pct}%, {rest} {100 - pct}%
      </figcaption>
      {/* 두 칸 사이를 선으로 나누지 않고 바탕색 틈으로 띄운다 */}
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        <span
          aria-hidden
          className="block rounded-full bg-[#0C3F80]"
          style={{ width: `${pct}%` }}
        />
        <span aria-hidden className="block flex-1 rounded-full bg-[#DDE2E9]" />
      </div>
      <div className="mt-2 flex justify-between text-[11.5px] text-[#8B94A3]">
        <span className="font-medium text-[#0C3F80]">
          {fill} {pct}%
        </span>
        <span>
          {rest} {100 - pct}%
        </span>
      </div>
    </figure>
  );
}

/**
 * 전 → 후 한 쌍. 막대 두 개를 세우면 이 칸에서 너무 무거워서, 같은 축 위의 두
 * 점과 그 사이 선으로만 그린다. 지난해 자리가 왼쪽에 남아 있어야 "4배"가 보인다.
 */
export function Dumbbell({
  from,
  to,
  fromLabel,
  toLabel,
  unit,
}: {
  from: number;
  to: number;
  fromLabel: string;
  toLabel: string;
  unit: string;
}) {
  const max = to * 1.06;
  const x = (v: number) => `${(v / max) * 100}%`;

  return (
    <figure className="mt-5">
      <figcaption className="sr-only">
        {fromLabel} {from}
        {unit}에서 {toLabel} {to}
        {unit}로
      </figcaption>
      <div className="relative h-2.5">
        <span
          aria-hidden
          className="absolute top-1/2 h-px -translate-y-1/2 bg-[#0C3F80]/35"
          style={{ left: x(from), right: `${100 - (to / max) * 100}%` }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C4CBD5]"
          style={{ left: x(from) }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0C3F80]"
          style={{ left: x(to) }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11.5px]">
        <span className="text-[#8B94A3]">
          {fromLabel} {from.toLocaleString("ko-KR")}
          {unit}
        </span>
        <span className="font-medium text-[#0C3F80]">
          {toLabel} {to.toLocaleString("ko-KR")}
          {unit}
        </span>
      </div>
    </figure>
  );
}

/**
 * 가격대는 값이 아니라 구간이다. 눈금 없는 축에 막대를 그리면 최대값을 지어내야
 * 하므로 축을 두지 않고 구간의 폭만 그린다.
 *
 * 끝을 동그라미로 찍으면 바로 위 칸의 Dumbbell과 같은 모양이 되는데, 그쪽은
 * 점의 위치가 값이다. 같은 줄에서 두 그림이 서로 다른 뜻이 되면 눈금 없는 이
 * 그림이 눈금 있는 것처럼 읽힌다. 그래서 여기는 자를 대듯 세로 마감으로 끝낸다.
 */
export function RangeBand({
  from,
  to,
  unit,
  note,
}: {
  from: number;
  to: number;
  unit: string;
  note: string;
}) {
  return (
    <figure className="mt-5">
      <figcaption className="sr-only">
        {from}
        {unit}에서 {to}
        {unit} 구간
      </figcaption>
      <div className="flex items-center gap-2">
        <span className="text-[11.5px] font-medium text-[#0C3F80]">
          {from}
          {unit}
        </span>
        <span aria-hidden className="relative h-2.5 flex-1">
          <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[#0C3F80]/20" />
          <span className="absolute left-0 top-0 h-2.5 w-0.5 bg-[#0C3F80]" />
          <span className="absolute right-0 top-0 h-2.5 w-0.5 bg-[#0C3F80]" />
        </span>
        <span className="text-[11.5px] font-medium text-[#0C3F80]">
          {to}
          {unit}
        </span>
      </div>
      <p className="mt-2 text-[11.5px] text-[#8B94A3]">{note}</p>
    </figure>
  );
}
