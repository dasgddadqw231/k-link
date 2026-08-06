import { Fragment } from "react";
import { motion } from "motion/react";
import { Mail, Phone, ArrowRight, MapPin, Tag, BadgeCheck } from "lucide-react";
import { Btn, Card, Container, Eyebrow, Figure, Footer, Section, SectionHead, T } from "./site";
/**
 * 이 페이지의 독자는 한국 브랜드 담당자다(docs/stp.md 페르소나 A). 연락 수단도
 * 그 사람 것으로 둔다 — 이메일과 전화. LINE은 두지 않는다. 태국 소비자의
 * 메신저라 여기서는 "설치부터 하라"는 요구가 되고, stp.md도 한국어 페이지에서
 * LINE 유도를 금지한다.
 */
import {
  COMPANY_REG_NO,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  TEL_HREF,
  mailto,
} from "../contact";
import {
  AddressFigure,
  CoverageDots,
  CoverageLegend,
  Dumbbell,
  LabelFigure,
  OyFigure,
  ProcessDiagram,
  RangeBand,
  ShareMeter,
} from "./ko-figures";

/**
 * 상담 메일에 미리 채워 두는 항목.
 *
 * 카피가 "제품 카테고리와 국내 유통 상황만 알려주시면"이라고 요청하는데, 빈
 * 메일창을 받으면 그걸 다시 떠올려 문장으로 만들어야 한다. 그 한 번의 부담에서
 * 사람이 창을 닫는다.
 */
const MAIL_BODY = [
  "브랜드명:",
  "제품 카테고리:",
  "국내 유통 채널(올리브영·쿠팡 등):",
  "보유 서류(HACCP·자가품질검사 등):",
  "연락처:",
  "",
  "— 위 항목만 채워 보내주시면 태국에서 등록 가능한 품목인지 먼저 확인해 드립니다.",
].join("\n");

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/**
 * 한국어 페이지의 독자는 태국 소비자가 아니라 태국 진출을 검토하는 한국 브랜드다.
 * 근거는 docs/stp.md 트랙 A. 캐릭터를 전면에 세우지 않고, 규제 사실로 설득한다.
 */

/**
 * 태국 법인이 아니면 애초에 성립하지 않는 요건들. 이 페이지의 유일한 논거다.
 *
 * 세 줄 다 문단으로 읽으면 한 번씩 더 생각해야 해서, 각 항목에 도해를 붙였다
 * (ko-figures.tsx). 도해에는 문단에 없는 사실을 넣지 않는다.
 *
 * 허가 서식 이름은 อ.7이다. 예전에 여기를 "Sor Bor 3"로 적었는데 그건 라벨
 * 승인 서식(สบ.3/1)이지 수입 허가가 아니다 — docs/stp.md 규제 절의 2026-08-04
 * 수정을 참고한다.
 */
const barriers = [
  {
    Icon: MapPin,
    title: "허가는 회사가 아니라 주소에 붙습니다",
    body: "판매 목적의 식품 수입 허가(อ.7)는 태국 내 창고·시설 주소로 발급되고, 승인 전에 태국 FDA의 현장 실사를 거칩니다. 유효기간은 3년입니다. 서울 주소로는 신청 자체가 성립하지 않습니다.",
    Fig: AddressFigure,
  },
  {
    Icon: Tag,
    title: "태국어 라벨은 통관 전에 붙어 있어야 합니다",
    body: "수입 식품은 태국에 들어오기 전 태국어 라벨이 부착된 상태여야 합니다. 번역의 문제가 아니라 표시 항목과 형식이 규정돼 있습니다.",
    Fig: LabelFigure,
  },
  {
    Icon: BadgeCheck,
    title: "อย. 번호 없이는 매대에 오르지 못합니다",
    body: "통제 대상 식품은 라벨 사전승인을 받아야 하고, 승인되면 소비자가 패키지에서 확인하는 식품 등록번호가 부여됩니다. 이 번호는 수입자 명의로 나옵니다.",
    Fig: OyFigure,
  },
];

/**
 * 규제 도해가 격자에서 앉을 열. 문자열을 조립하면 Tailwind가 훑을 때 못 찾으니
 * 완성된 클래스명으로 적어 둔다(진행 방식 도식의 STEP_COL과 같은 이유).
 */
const BARRIER_COL = ["md:col-start-1", "md:col-start-2", "md:col-start-3"];

/**
 * has는 [시장 정보, 인허가 주체, 수입자, 유통 입점] 순서다(ko-figures의
 * CAPABILITIES와 같은 순서). 값은 옆 칸의 문장에서 그대로 읽어 온 것이지
 * 새로운 판단이 아니다 — 점이 문장보다 강하게 읽히므로 여기서 한 칸이라도
 * 앞서 나가면 그게 곧 과장이 된다.
 *
 * 대형 유통사의 '유통 입점'은 검증된 브랜드에 한해서다. 그 조건이 lacks에
 * 적혀 있으므로 점은 채우고 조건은 문장에 맡긴다.
 */
const alternatives = [
  {
    name: "KOTRA · 무역관",
    gives: "시장 정보, 바이어 매칭",
    lacks: "수입자가 되어주지 않습니다",
    has: [true, false, false, false],
  },
  {
    name: "수출 대행사",
    gives: "바이어 발굴, 중개",
    lacks: "인허가 주체도 재고 리스크도 브랜드가 집니다",
    has: [true, false, false, false],
  },
  {
    name: "대형 유통사",
    gives: "넓은 유통망",
    lacks: "이미 검증된 브랜드만 받습니다",
    has: [false, false, false, true],
  },
];

/**
 * 숫자는 전부 출처를 붙인다. 근거 없는 숫자는 브랜드 담당자가 가장 먼저 의심한다.
 *
 * Fig는 큰 숫자 아래에 붙는 작은 그림이다. 셋 다 문장에 이미 있는 값만 그리고,
 * 축의 최대값을 지어내야 하는 그림은 그리지 않는다 — 없는 눈금이 곧 없는 근거다.
 */
const marketFacts = [
  {
    value: "13,660개",
    label: "태국 7-Eleven 점포 수",
    body: "편의점 시장의 약 72%를 한 체인이 쥐고 있습니다.",
    source: "CP All, 2022년 말 기준",
    Fig: () => <ShareMeter pct={72} fill="7-Eleven" rest="나머지 편의점" />,
  },
  {
    value: "4배",
    label: "TikTok Shop 태국 매출 증가",
    body: "연매출이 121억에서 544억 바트로 늘며 Lazada를 제쳤습니다. 라이브커머스가 실질 채널입니다.",
    source: "2025년",
    Fig: () => (
      <Dumbbell
        from={121}
        to={544}
        fromLabel="전년"
        toLabel="2025"
        unit="억 바트"
      />
    ),
  },
  {
    value: "69~89바트",
    label: "‘작은 프리미엄’ 가격대",
    body: "가계부채로 큰 지출은 줄고, 1회분 소포장으로 소비가 이동하고 있습니다.",
    source: "USDA FAS 방콕, 2025.12",
    Fig: () => (
      <RangeBand from={69} to={89} unit="바트" note="약 2.2~2.9달러 · 1회분 완제품" />
    ),
  },
];

/**
 * 진행 중인 브랜드. stp.md는 이 섹션을 "증거"로 요구한다 — 제품 소개가 아니라
 * "어디까지 갔는지"가 증거다.
 *
 * stage는 푸터의 상태 문장과 같은 사실만 적는다(첫 제품군 태국 FDA 등록 진행 중).
 * 확인되지 않은 단계를 앞당겨 쓰면 그 자리가 가장 먼저 의심받는다.
 */
const brands = [
  {
    name: "포지티바",
    kind: "올리브오일 스틱",
    desc: "올레샷(유기농 EVOO 65% + 유기농 레몬 착즙 35%)과 올토샷(올리브오일·토마토), 각 20ml 스틱",
    img: "/brands/sku-olleshot.webp",
    stage: "태국 FDA 등록 진행 중",
  },
  {
    name: "은휘플로우",
    kind: "늙은호박즙",
    desc: "국내산 늙은호박 100%, 90ml 파우치, HACCP 인증 시설 생산",
    img: "/brands/sku-hobak.webp",
    stage: "태국 FDA 등록 진행 중",
  },
];

export default function LandingKo() {
  return (
    /*
      한글은 단어 안에서 끊지 않는다. 기본값이면 "사전승인"이 "사전승/인"으로,
      "태국"이 "태/국"으로 갈라져서 읽다가 걸린다. 페이지 전체에 걸어 둔다 —
      한국어 본문뿐인 페이지라 예외를 둘 곳이 없다.
    */
    <div className="min-h-screen bg-[#FCFCFD] text-[#12161F] antialiased [word-break:keep-all]">
      {/* HERO — 한국 브랜드 담당자에게 필요한 건 귀여움이 아니라 실행 능력의 증거다 */}
      <section className="border-b border-[#E3E7ED] bg-[#FCFCFD] pb-20 pt-24 md:pb-28 md:pt-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid items-end gap-12 md:grid-cols-12 md:gap-16"
          >
            <div className="md:col-span-7">
              <img
                src="/brands/klink-mark.webp"
                alt="B&Y k-link"
                className="mb-8 h-10 w-auto"
              />
              <Eyebrow>한국 브랜드의 태국 진출</Eyebrow>
              <h1 className={`mt-5 ${T.display}`}>
                태국 진출을
                <br />
                대행하지 않습니다
                <br />
                <span className="text-[#0C3F80]">수입자가 됩니다</span>
              </h1>
              <p className={`mt-7 max-w-[46ch] ${T.lead}`}>
                태국에 등록된 저희 법인 명의로 수입 허가를 갖고, 태국 FDA 등록부터
                통관, 매대 입점까지 진행합니다. 브랜드는 한국에서 출고만 하시면
                됩니다.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Btn href="#contact">
                  진출 상담 신청
                  <ArrowRight size={17} />
                </Btn>
                <Btn href="#process" variant="secondary">
                  어떻게 진행되는지 보기
                </Btn>
              </div>
            </div>

            {/* 데스크톱에서 오른쪽이 비지 않도록, 페이지의 핵심 주장을 요약해 세운다 */}
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-[#E3E7ED] bg-white p-7">
                <p className="text-[12.5px] font-semibold text-[#0C3F80]">
                  역할 분담
                </p>
                <dl className="mt-5 divide-y divide-[#E3E7ED]">
                  <div className="grid grid-cols-[5.5rem_1fr] gap-4 pb-4">
                    <dt className="text-[13px] font-semibold text-[#8B94A3]">
                      브랜드
                    </dt>
                    <dd className="text-[14px] leading-relaxed text-[#5A6373]">
                      한국에서 제조하고 출고합니다
                    </dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-4 pt-4">
                    <dt className="text-[13px] font-semibold text-[#0C3F80]">
                      klink
                    </dt>
                    <dd className="text-[14px] leading-relaxed text-[#12161F]">
                      태국에서 등록하고, 통관하고, 매대에 올립니다
                    </dd>
                  </div>
                </dl>

                {/*
                  비용 이야기를 맨 아래 상담 섹션에만 두면 늦다. 소규모 브랜드
                  대표(stp.md 페르소나 A2)는 비용에 매우 민감해서, 읽기 시작할지
                  말지를 여기서 정한다. 확정되지 않은 금액은 쓰지 않고 이미 사실인
                  것만 적는다.
                */}
                <p className="mt-5 border-t border-[#E3E7ED] pt-5 text-[13px] leading-relaxed text-[#5A6373]">
                  등록 가능 여부를 확인하는{" "}
                  <strong className="font-semibold text-[#12161F]">검토 단계는 무료</strong>
                  입니다.
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 문제 정의 — 규제 사실로 못박는다. 여기가 무너지면 나머지가 다 무의미하다. */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead
              label="왜 혼자서는 안 되는가"
              title={"허가는 회사가 아니라\n주소에 붙습니다"}
            />
          </motion.div>

          {/*
            카드 상자 대신 위쪽 괘선으로만 나눈다 — 같은 카드 스택의 반복을 끊는다.

            글과 도해를 격자의 다른 행에 앉힌다. 한 칸에 같이 넣으면 본문 길이가
            칸마다 달라서 도해 세 개가 제각각 다른 높이에서 시작한다. 행을 나누면
            글의 길이와 무관하게 도해 줄이 한 줄로 맞는다.
          */}
          <div className="mt-14 grid gap-x-10 gap-y-6 md:grid-cols-3 md:grid-rows-[auto_auto]">
            {barriers.map((b, i) => (
              <Fragment key={b.title}>
                <motion.div
                  {...fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className={`${BARRIER_COL[i]} border-t border-[#0C3F80] pt-6 md:row-start-1 ${
                    i === 0 ? "" : "mt-6 md:mt-0"
                  }`}
                >
                  <span className="text-[#0C3F80]">
                    <b.Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className={`mt-5 ${T.h3}`}>{b.title}</h3>
                  <p className={`mt-3 ${T.body}`}>{b.body}</p>
                </motion.div>

                <motion.div
                  {...fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className={`${BARRIER_COL[i]} md:row-start-2`}
                >
                  <b.Fig />
                </motion.div>
              </Fragment>
            ))}
          </div>

          <motion.blockquote
            {...fadeUp}
            className="mt-16 border-l-2 border-[#0C3F80] pl-6 md:pl-8"
          >
            <p className="max-w-[52ch] text-[18px] font-semibold leading-[1.6] tracking-[-0.01em] md:text-[21px]">
              그래서 한국 브랜드가 단독으로 태국에 식품을 파는 방법은 존재하지
              않습니다. 태국 법인을 수입자로 세우는 것이 유일한 경로입니다.
            </p>
          </motion.blockquote>
        </Container>
      </Section>

      {/* 역할 분담 — "그래서 내가 뭘 해야 하나"에 답한다. 카드가 아니라 표로 읽힌다. */}
      <Section id="process" tone="alt">
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead
              label="진행 방식"
              title={"브랜드가 하는 일과\n저희가 하는 일"}
            />
          </motion.div>

          {/*
            개요는 그대로 두고, 단계별 기간·주의사항은 눌렀을 때만 펼친다.
            도식과 상세는 ko-figures.tsx의 ProcessDiagram 하나에 들어 있다.
          */}
          <p className="mt-6 text-[13px] text-[#8B94A3]">
            단계를 누르면 걸리는 기간과 자주 막히는 지점이 열립니다.
          </p>
          <ProcessDiagram />
        </Container>
      </Section>

      {/* 대안 비교 — 담당자는 이미 KOTRA를 다녀왔다. 그 경험과 대조시킨다. */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead label="다른 선택지와 비교" title="어디까지 해주는가" />
          </motion.div>

          {/*
            네 칸짜리 점줄을 이름 아래에 붙인다. 두 문단을 대조해 읽지 않아도
            어느 줄이 어디까지 가는지가 먼저 보인다. 점의 뜻은 표 위에서 한 번만
            말한다 — 행마다 반복하면 표가 라벨로 뒤덮인다.
          */}
          <motion.div {...fadeUp} className="mt-12">
            <CoverageLegend />
          </motion.div>

          <div className="mt-6 border-t border-[#E3E7ED]">
            <div className="hidden grid-cols-12 gap-6 border-b border-[#E3E7ED] py-3 md:grid">
              <span className="col-span-3 text-[12px] font-semibold text-[#8B94A3]" />
              <span className="col-span-4 text-[12px] font-semibold text-[#8B94A3]">
                해주는 것
              </span>
              <span className="col-span-5 text-[12px] font-semibold text-[#8B94A3]">
                안 해주는 것
              </span>
            </div>

            {alternatives.map((a, i) => (
              <motion.div
                key={a.name}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="grid gap-2 border-b border-[#E3E7ED] py-6 md:grid-cols-12 md:gap-6"
              >
                <div className="md:col-span-3">
                  <h3 className="text-[15px] font-semibold text-[#12161F]">{a.name}</h3>
                  <div className="mt-2.5">
                    <CoverageDots has={a.has} name={a.name} />
                  </div>
                </div>
                <p className="text-[14.5px] leading-relaxed text-[#5A6373] md:col-span-4">
                  {a.gives}
                </p>
                <p className="text-[14.5px] leading-relaxed text-[#8B94A3] md:col-span-5">
                  {a.lacks}
                </p>
              </motion.div>
            ))}

            {/* 우리 행만 네이비로 — 큰 색면 대신 글자색과 옅은 배경으로 구분한다 */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.15 }}
              className="grid gap-2 rounded-b-2xl bg-[#0C3F80]/[0.045] px-5 py-7 md:grid-cols-12 md:gap-6 md:px-6"
            >
              <div className="md:col-span-3">
                <h3 className="text-[15px] font-bold text-[#0C3F80]">B&amp;Y k-link</h3>
                <div className="mt-2.5">
                  <CoverageDots
                    has={[true, true, true, true]}
                    name="B&Y k-link"
                  />
                </div>
              </div>
              <p className="text-[14.5px] font-medium leading-relaxed text-[#12161F] md:col-span-4">
                시장 검증, 태국 FDA 등록, 통관, 유통 입점까지
              </p>
              <p className="text-[14.5px] leading-relaxed text-[#5A6373] md:col-span-5">
                인허가 주체가 저희이므로 통관에서 막힐 위험을 브랜드가 지지 않습니다.
                한국 내 제조와 품질은 브랜드 몫입니다.
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/*
        준비 중인 브랜드 — stp.md가 요구하는 "증거" 섹션이다.

        예전에는 여기서 "브랜드마다 캐릭터를 같이 만듭니다"라고 했는데 사실이
        아니다. 캐릭터 제작은 저희가 브랜드에 제공하는 서비스가 아니다. 대신
        실제로 하는 일(FDA 전 소량 시장 검증, 인플루언서 시딩)을 둔다 — 초도
        물량을 떠안는 것이 페르소나 A의 가장 큰 두려움이라 이쪽이 훨씬 세다.
      */}
      <Section tone="alt">
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead
              label="지금 준비 중인 브랜드"
              title={"큰 물량을 넣기 전에\n먼저 확인합니다"}
              lead="태국 FDA 등록이 끝나기 전에 소량 물량을 들여와 현지 반응을 봅니다. 인플루언서 시딩으로 초기 반응을 확인하고, 그 결과를 보고 본물량을 정합니다. 지금 두 브랜드가 이 과정에 있습니다."
            />
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {brands.map((b, i) => (
              <motion.article key={b.name} {...fadeUp} transition={{ delay: i * 0.06 }}>
                <Card className="flex h-full flex-col gap-6 sm:flex-row sm:items-start">
                  <Figure
                    src={b.img}
                    alt={b.name}
                    ratio="aspect-[4/5]"
                    className="w-full shrink-0 sm:w-32"
                  />
                  <div className="min-w-0">
                    <h3 className={T.h3}>{b.name}</h3>
                    <p className="mt-1 text-[13px] font-medium text-[#0C3F80]">
                      {b.kind}
                    </p>
                    <p className={`mt-3 ${T.body}`}>{b.desc}</p>
                    {/* 어디까지 갔는지가 이 섹션의 요점이다. 제품 설명보다 이게 증거다. */}
                    <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#F4F6F8] px-3 py-1.5 text-[12px] font-semibold text-[#0C3F80]">
                      <span aria-hidden className="size-1.5 rounded-full bg-[#0C3F80]" />
                      {b.stage}
                    </p>
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 왜 지금 태국인가 — 숫자는 전부 출처를 붙인다 */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead
              label="왜 지금 태국인가"
              title={"대형 리테일 없이도\n시작할 수 있습니다"}
            />
          </motion.div>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {marketFacts.map((f, i) => (
              <motion.div key={f.label} {...fadeUp} transition={{ delay: i * 0.06 }}>
                <div className="border-t border-[#E3E7ED] pt-6">
                  <p className="text-[34px] font-bold leading-none tracking-[-0.03em] text-[#0C3F80] md:text-[40px]">
                    {f.value}
                  </p>
                  <p className="mt-4 text-[14px] font-semibold text-[#12161F]">
                    {f.label}
                  </p>
                  <f.Fig />
                  <p className={`mt-4 ${T.body}`}>{f.body}</p>
                  <p className={`mt-4 ${T.small}`}>{f.source}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 상담 */}
      <Section id="contact" tone="alt">
        <Container>
          <motion.div {...fadeUp} className="max-w-[52ch]">
            <h2 className={T.h2}>태국 진출, 검토부터 시작하세요</h2>
            <p className={`mt-5 ${T.lead}`}>
              제품 카테고리와 현재 국내 유통 상황만 알려주시면, 태국에서 등록이
              가능한 품목인지부터 확인해 드립니다. 검토 단계에서는 비용이 들지
              않습니다.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn href={mailto("태국 진출 상담 요청", MAIL_BODY)}>
                <Mail size={17} />
                이메일로 문의
              </Btn>
              <Btn href={TEL_HREF} variant="secondary">
                <Phone size={17} />
                전화로 문의
              </Btn>
            </div>

            {/* 데스크톱에서는 mailto·tel이 열리지 않는 환경이 있다. 눈으로 읽고
                옮겨 적을 수 있게 주소와 번호를 그대로 둔다. */}
            <p className={`mt-6 ${T.small}`}>
              {CONTACT_EMAIL} · {CONTACT_PHONE}
            </p>
          </motion.div>
        </Container>
      </Section>

      {/*
        등기 사항을 적는 이유는 장식이 아니다. 이 페이지는 처음 보는 상대에게
        "저희 법인 명의로 수입합니다"라고 말하는데, 그 법인이 실재하는지 확인할
        방법이 없으면 그 문장이 가장 먼저 의심받는다. 번호와 주소를 적어 두면
        DBD 등기부에서 바로 대조된다.
      */}
      <Footer
        legal={`태국 법인등록번호 ${COMPANY_REG_NO} · 등기상 본점 52/6 Moo 5, Bang Nam Chuet, Mueang Samut Sakhon, Samut Sakhon, Thailand`}
        links={[
          [CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`],
          [CONTACT_PHONE, TEL_HREF],
        ]}
        note="현재 첫 제품군의 태국 FDA 등록을 진행 중이며 아직 판매를 시작하지 않았습니다. 2026년 출시 예정."
      >
        B&amp;Y k-link co., ltd. — 태국 사뭇사콘
      </Footer>
    </div>
  );
}
