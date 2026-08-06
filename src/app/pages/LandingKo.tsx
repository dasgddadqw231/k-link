import { Fragment } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  ArrowRight,
  ArrowDown,
  MapPin,
  Tag,
  BadgeCheck,
} from "lucide-react";
import { Btn, Card, Container, Eyebrow, Figure, Footer, Section, SectionHead, T } from "./site";

/**
 * 이 페이지의 독자는 한국 브랜드 담당자다(docs/stp.md 페르소나 A). 연락 수단도
 * 그 사람 것으로 둔다 — 이메일과 전화. LINE은 두지 않는다. 태국 소비자의
 * 메신저라 여기서는 "설치부터 하라"는 요구가 되고, stp.md도 한국어 페이지에서
 * LINE 유도를 금지한다.
 */
const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string) || "info@b-y-klink.com";
const CONTACT_PHONE =
  (import.meta.env.VITE_CONTACT_PHONE as string) || "010-7376-7012";

/** tel: 링크는 하이픈을 못 읽는 다이얼러가 있어 숫자만 남긴다. */
const TEL_HREF = `tel:${CONTACT_PHONE.replace(/[^0-9+]/g, "")}`;

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

/** 태국 법인이 아니면 애초에 성립하지 않는 요건들. 이 페이지의 유일한 논거다. */
const barriers = [
  {
    Icon: MapPin,
    title: "허가는 회사가 아니라 주소에 붙습니다",
    body: "판매 목적의 식품 수입 허가(Sor Bor 3)는 태국 내 창고·시설 주소로 발급되고, 승인 전에 태국 FDA의 현장 실사를 거칩니다. 유효기간은 3년입니다. 서울 주소로는 신청 자체가 성립하지 않습니다.",
  },
  {
    Icon: Tag,
    title: "태국어 라벨은 통관 전에 붙어 있어야 합니다",
    body: "수입 식품은 태국에 들어오기 전 태국어 라벨이 부착된 상태여야 합니다. 번역의 문제가 아니라 표시 항목과 형식이 규정돼 있습니다.",
  },
  {
    Icon: BadgeCheck,
    title: "อย. 번호 없이는 매대에 오르지 못합니다",
    body: "통제 대상 식품은 라벨 사전승인을 받아야 하고, 승인되면 소비자가 패키지에서 확인하는 식품 등록번호가 부여됩니다. 이 번호는 수입자 명의로 나옵니다.",
  },
];

/**
 * 각 단계에서 누가 무엇을 하는지. 브랜드의 가장 큰 불안은 "그래서 내가 뭘 해야 하나"다.
 *
 * brand가 null인 단계는 브랜드가 손댈 일이 없다는 뜻이고, handoff는 일이 넘어오는
 * 지점이다. 둘 다 이 표의 결론이라 데이터에 적어 둔다 — 화면에서 문자열을 보고
 * 짐작하지 않는다.
 */
const steps: {
  no: string;
  title: string;
  brand: string | null;
  klink: string;
  handoff?: boolean;
}[] = [
  {
    no: "01",
    title: "제품 검토",
    brand: "샘플, 성분표, 제조공정서",
    klink: "태국 시장 적합성과 등록 가능 여부 확인",
  },
  {
    no: "02",
    title: "시장 검증",
    brand: "소량 물량",
    klink: "FDA 등록 전 소량으로 현지 반응 확인, 인플루언서 시딩",
  },
  {
    no: "03",
    title: "태국 FDA 등록",
    brand: "제조사 발급 서류 협조",
    klink: "저희 법인 명의로 신고, 라벨 사전승인",
  },
  {
    no: "04",
    title: "수입 · 통관",
    brand: "한국에서 출고",
    klink: "수입자로서 통관, 태국어 라벨 부착",
    handoff: true,
  },
  {
    no: "05",
    title: "유통 · 판매",
    brand: null,
    klink: "도매·리테일 입점, 인플루언서 시딩",
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

const alternatives = [
  {
    name: "KOTRA · 무역관",
    gives: "시장 정보, 바이어 매칭",
    lacks: "수입자가 되어주지 않습니다",
  },
  {
    name: "수출 대행사",
    gives: "바이어 발굴, 중개",
    lacks: "인허가 주체도 재고 리스크도 브랜드가 집니다",
  },
  {
    name: "대형 유통사",
    gives: "넓은 유통망",
    lacks: "이미 검증된 브랜드만 받습니다",
  },
];

/** 숫자는 전부 출처를 붙인다. 근거 없는 숫자는 브랜드 담당자가 가장 먼저 의심한다. */
const marketFacts = [
  {
    value: "13,660개",
    label: "태국 7-Eleven 점포 수",
    body: "편의점 시장의 약 72%를 한 체인이 쥐고 있습니다.",
    source: "CP All, 2022년 말 기준",
  },
  {
    value: "4배",
    label: "TikTok Shop 태국 매출 증가",
    body: "연매출이 121억에서 544억 바트로 늘며 Lazada를 제쳤습니다. 라이브커머스가 실질 채널입니다.",
    source: "2025년",
  },
  {
    value: "69~89바트",
    label: "'작은 프리미엄' 가격대",
    body: "가계부채로 큰 지출은 줄고, 1회분 소포장으로 소비가 이동하고 있습니다.",
    source: "USDA FAS 방콕, 2025.12",
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

          {/* 카드 상자 대신 위쪽 괘선으로만 나눈다 — 같은 카드 스택의 반복을 끊는다 */}
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {barriers.map((b, i) => (
              <motion.div key={b.title} {...fadeUp} transition={{ delay: i * 0.06 }}>
                <div className="border-t border-[#0C3F80] pt-6">
                  <span className="text-[#0C3F80]">
                    <b.Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className={`mt-5 ${T.h3}`}>{b.title}</h3>
                  <p className={`mt-3 ${T.body}`}>{b.body}</p>
                </div>
              </motion.div>
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
            표가 아니라 도식으로 읽힌다.

            데스크톱은 두 레인(대한민국·태국)이 네 단계를 가로지른다. 격자가 행
            높이를 맞춰 주니 칸마다 그은 윗괘선이 한 줄로 이어지고, 그래서 "이 줄은
            브랜드 것, 저 줄은 우리 것"이 글을 읽기 전에 잡힌다.

            모바일은 단계별로 쌓는다. 좁은 화면에서 레인을 지키려면 가로 스크롤이
            되고, 그러면 네 단계 중 하나만 보인다.

            글은 DOM에 한 번만 넣고 데스크톱에서는 격자 좌표로 자리를 잡는다. 두
            레이아웃을 각각 쓰면 크롤러와 스크린리더가 같은 문장을 두 번 읽는다.

            색면은 쓰지 않는다(site.tsx의 원칙). 레인은 괘선 색과 라벨로만 나눈다.
          */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-[5.5rem_repeat(5,minmax(0,1fr))] md:gap-x-4 md:gap-y-7">
            {steps.map((s, i) => (
              <Fragment key={s.no}>
                <motion.div
                  {...fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className={`${STEP_COL[i]} border-t-2 border-[#0C3F80] pt-4 md:row-start-1 ${
                    i === 0 ? "" : "mt-12 md:mt-0"
                  }`}
                >
                  <span className="text-[12px] font-semibold tabular-nums text-[#0C3F80]">
                    {s.no}
                  </span>
                  <h3 className={`mt-1.5 ${T.h3}`}>{s.title}</h3>
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
                  <p className="text-[14.5px] leading-relaxed text-[#12161F]">
                    {s.klink}
                  </p>
                </motion.div>
              </Fragment>
            ))}

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
              <span className="block text-[11.5px] font-semibold text-[#8B94A3]">
                태국
              </span>
              <span className="mt-0.5 block text-[13.5px] font-semibold text-[#0C3F80]">
                klink
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* 대안 비교 — 담당자는 이미 KOTRA를 다녀왔다. 그 경험과 대조시킨다. */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead label="다른 선택지와 비교" title="어디까지 해주는가" />
          </motion.div>

          <div className="mt-14 border-t border-[#E3E7ED]">
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
                <h3 className="text-[15px] font-semibold text-[#12161F] md:col-span-3">
                  {a.name}
                </h3>
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
              <h3 className="text-[15px] font-bold text-[#0C3F80] md:col-span-3">
                B&amp;Y k-link
              </h3>
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
                  <p className={`mt-2.5 ${T.body}`}>{f.body}</p>
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
            <h2 className={T.h2}>태국, 한번 보시겠습니까</h2>
            <p className={`mt-5 ${T.lead}`}>
              제품 카테고리와 현재 국내 유통 상황만 알려주시면, 태국에서 등록이
              가능한 품목인지부터 확인해 드립니다. 검토 단계에서는 비용이 들지
              않습니다.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "태국 진출 상담 요청",
                )}&body=${encodeURIComponent(MAIL_BODY)}`}
              >
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

      <Footer note="현재 첫 제품군의 태국 FDA 등록을 진행 중이며 아직 판매를 시작하지 않았습니다. 2026년 출시 예정.">
        B&amp;Y k-link co., ltd. — 태국 방콕
      </Footer>
    </div>
  );
}
