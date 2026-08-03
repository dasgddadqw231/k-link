import { motion } from "motion/react";
import {
  MessageCircle,
  Mail,
  ArrowRight,
  Check,
  Building2,
  FileCheck2,
  Megaphone,
  Factory,
  Search,
  PackageCheck,
  Store,
} from "lucide-react";
import { t, type ThLang } from "../i18n";
import { Btn, Card, Container, Eyebrow, Figure, Footer, Section, SectionHead, T } from "./site";

/** 값이 없으면 해당 버튼을 렌더링하지 않는다. 없는 연락처를 지어내지 않기 위함. */
const LINE_URL = (import.meta.env.VITE_LINE_URL as string) || "";
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string) || "";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const CHARACTERS = [
  "/brands/sku-olleshot.webp",
  "/brands/sku-hobak.webp",
  "/brands/sku-oltoshot.webp",
];

/**
 * 태국 수요측 페이지 — 소비자(B1), 유통(B2), 오프라인 리테일(B3) 세 독자를 히어로에서 분기시킨다.
 * 조판과 색은 LandingKo와 같은 시스템(./site)을 쓴다. 독자가 다르다고 톤까지
 * 갈라지면 같은 회사로 보이지 않는다.
 */
export default function LandingTh({ lang }: { lang: ThLang }) {
  const c = t[lang];

  const brands = [
    {
      name: c.positivaName,
      kind: c.positivaKind,
      desc: c.positivaDesc,
      items: [
        {
          name: c.olleName,
          sub: c.olleDesc,
          size: "20 ml",
          img: "/brands/sku-olleshot.webp",
        },
        {
          name: c.oltoName,
          sub: c.oltoDesc,
          size: "20 ml",
          img: "/brands/sku-oltoshot.webp",
        },
      ],
    },
    {
      name: c.eunhwiName,
      kind: c.eunhwiKind,
      desc: c.eunhwiDesc,
      items: [
        {
          name: c.eunhwiSkuName,
          sub: c.eunhwiSkuDesc,
          size: "90 ml",
          img: "/brands/sku-hobak.webp",
        },
        {
          name: c.realPhotoLabel,
          sub: c.madeInKorea,
          size: "",
          img: "/brands/eunhwi-product.webp",
        },
      ],
    },
  ];

  const perks = [c.linePerk1, c.linePerk2];

  /** 유통 파트너가 계산기를 두드릴 근거. 전부 태국 법인이라서 가능한 것들이다. */
  const bizCards = [
    { Icon: Building2, title: c.biz1Title, body: c.biz1Body },
    { Icon: FileCheck2, title: c.biz2Title, body: c.biz2Body },
    { Icon: Megaphone, title: c.biz3Title, body: c.biz3Body },
    { Icon: Factory, title: c.biz4Title, body: c.biz4Body },
    // 소량 발주. 도매와 셀렉트숍이 공통으로 가장 먼저 묻는 것인데 빠져 있었다.
    { Icon: PackageCheck, title: c.biz5Title, body: c.biz5Body },
  ];

  const flow = [
    { Icon: Search, title: c.flow1Title, sub: c.flow1Sub },
    { Icon: PackageCheck, title: c.flow2Title, sub: c.flow2Sub },
    { Icon: Store, title: c.flow3Title, sub: c.flow3Sub },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#12161F] antialiased">
      {/* HERO — QR로 들어온 사람이 3초 안에 뭘 파는지 알아야 한다 */}
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
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h1 className={`mt-5 whitespace-pre-line ${T.display}`}>
                {c.heroTitle}
              </h1>
              <p className={`mt-7 max-w-[46ch] ${T.lead}`}>{c.heroSub}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {LINE_URL && (
                  <Btn href={LINE_URL} variant="line" external>
                    <MessageCircle size={17} />
                    {c.heroCtaConsumer}
                  </Btn>
                )}
                <Btn href="#partner" variant="secondary">
                  {c.heroCtaPartner}
                  <ArrowRight size={17} />
                </Btn>
              </div>
            </div>

            {/* 한국어 페이지의 요약 패널 자리. 이 페이지에서는 제품 라인업이 그 역할을 한다. */}
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-[#E3E7ED] bg-white p-5 md:p-6">
                <div className="grid grid-cols-3 gap-2.5">
                  {CHARACTERS.map((src) => (
                    <Figure key={src} src={src} alt="" ratio="aspect-[4/5]" />
                  ))}
                </div>
                <p className="mt-4 text-[12.5px] leading-relaxed text-[#8B94A3]">
                  {c.productsNote}
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 제품 — 실물 3종이 현재 유일한 구체적 증거다 */}
      <Section tone="alt">
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead title={c.productsLabel} />
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {brands.map((brand, i) => (
              <motion.article key={brand.name} {...fadeUp} transition={{ delay: i * 0.08 }}>
                <Card className="h-full">
                  <div className="flex flex-wrap items-baseline gap-x-2.5">
                    <h3 className={T.h3}>{brand.name}</h3>
                    <span className="text-[13px] font-medium text-[#0C3F80]">
                      {brand.kind}
                    </span>
                  </div>
                  <p className={`mt-2 ${T.body}`}>{brand.desc}</p>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {brand.items.map((item) => (
                      <div key={item.name}>
                        <Figure
                          src={item.img}
                          alt={item.name}
                          badge={item.size || undefined}
                          ratio="aspect-[4/5]"
                        />
                        <p className="mt-3 text-[14px] font-semibold leading-snug">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-[#8B94A3]">
                          {item.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 소비자 훅 — 아직 못 파니까, 지금 당장 줄 수 있는 것 세 가지를 준다 */}
      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <motion.div {...fadeUp} className="md:col-span-6">
              <SectionHead label={c.lineLabel} title={c.lineTitle} lead={c.lineBody} />
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.08 }} className="md:col-span-6">
              <ul className="divide-y divide-[#E3E7ED] border-y border-[#E3E7ED]">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-3.5 py-5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0C3F80] text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>

              {LINE_URL ? (
                <Btn href={LINE_URL} variant="line" external className="mt-8 w-full sm:w-auto">
                  <MessageCircle size={18} />
                  {c.lineCta}
                </Btn>
              ) : (
                <p className="mt-8 rounded-xl border border-dashed border-[#D7DCE4] px-5 py-4 text-center text-[13px] text-[#8B94A3]">
                  {c.lineMissing}
                </p>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* 유통 파트너 훅 — 태국 법인이라서 가능한 것들. 경쟁사가 복제할 수 없는 지점이다. */}
      <Section id="partner" tone="alt">
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead label={c.bizLabel} title={c.bizTitle} lead={c.bizBody} />
          </motion.div>

          {/*
            여기 독자는 태국의 유통·리테일이다. 한국어 페이지처럼 단계별 역할표를
            쓰지 않는다 — 저쪽 독자는 "내가 뭘 해야 하나"를 묻지만, 이쪽은 "내가 뭘
            안 해도 되나"를 묻는다.

            그래서 우리가 지는 넉 장과 상대가 하는 한 장을 나란히 놓는다. 폭과 개수의
            차이가 그대로 논지가 된다. 넉 장을 다 읽지 않아도 오른쪽 한 칸만 보면
            이 거래가 무엇인지 안다.
          */}
          <div className="mt-14 grid gap-y-12 md:grid-cols-[1fr_1px_17rem] md:gap-x-9 md:gap-y-0">
            <div>
              {/* 열 머리는 회색 괘선으로 둔다 — 네이비는 아래 카드들이 쓰고 있다. */}
              <div className="flex items-baseline gap-2.5 border-b border-[#D7DCE4] pb-3">
                <span className="text-[15px] font-bold tracking-[-0.01em] text-[#0C3F80]">
                  klink
                </span>
                <span className="text-[12px] font-semibold text-[#8B94A3]">
                  {c.bizWeLabel}
                </span>
              </div>

              <div className="mt-8 grid gap-x-9 gap-y-10 sm:grid-cols-2">
                {bizCards.map((card, i) => (
                  <motion.div key={card.title} {...fadeUp} transition={{ delay: i * 0.06 }}>
                    <div className="border-t border-[#0C3F80] pt-6">
                      <span className="text-[#0C3F80]">
                        <card.Icon size={20} strokeWidth={1.75} />
                      </span>
                      <h3 className={`mt-5 ${T.h3}`}>{card.title}</h3>
                      <p className={`mt-3 ${T.body}`}>{card.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 리스크가 갈리는 선. 모바일에서는 세로선이 설 자리가 없어 지운다. */}
            <div aria-hidden className="hidden bg-[#E3E7ED] md:block" />

            <motion.div {...fadeUp} transition={{ delay: 0.24 }} className="flex flex-col">
              <div className="flex items-baseline gap-2.5 border-b border-[#D7DCE4] pb-3">
                <span className="text-[15px] font-bold tracking-[-0.01em] text-[#5A6373]">
                  {c.bizYouWho}
                </span>
                <span className="text-[12px] font-semibold text-[#8B94A3]">
                  {c.bizYouLabel}
                </span>
              </div>

              {/*
                왼쪽 열 높이를 따라 늘리지 않는다. 다섯 장 옆에서 한 장이 억지로
                늘어나면 빈 공간만 생기고, 높이 차이를 그대로 두는 편이 "우리가 더
                많이 진다"는 말을 대신한다.
              */}
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-[#E3E7ED] bg-white px-7 py-14 text-center">
                <span className="text-[#0C3F80]">
                  <Store size={22} strokeWidth={1.75} />
                </span>
                <p className="mt-6 text-[40px] leading-none font-bold tracking-[-0.03em] text-[#12161F]">
                  {c.bizYouVerb}
                </p>
                <p className="mt-6 text-[12px] font-semibold tracking-[0.02em] text-[#8B94A3]">
                  {c.bizYouOnly}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp} className="mt-14 flex flex-col gap-3 sm:flex-row">
            {LINE_URL && (
              <Btn href={LINE_URL} external>
                {c.bizCta}
                <ArrowRight size={17} />
              </Btn>
            )}
            {CONTACT_EMAIL && (
              <Btn href={`mailto:${CONTACT_EMAIL}`} variant="secondary">
                <Mail size={17} />
                {c.emailCta}
              </Btn>
            )}
          </motion.div>
        </Container>
      </Section>

      {/* 일하는 방식 — 서울에서 매대까지 한 팀이라는 것을 한 줄로 보여준다 */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead title={c.flowLabel} />
          </motion.div>

          <div className="mt-12 border-t border-[#E3E7ED]">
            {flow.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-[#E3E7ED] py-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#E3E7ED] bg-white text-[#0C3F80]">
                  <s.Icon size={17} strokeWidth={1.75} />
                </span>
                <h3 className="text-[15.5px] font-semibold tracking-[-0.01em]">
                  {s.title}
                </h3>
                <span className={T.small}>{s.sub}</span>
              </motion.div>
            ))}
          </div>

          {/* 아직 못 한 일은 지우지 않되, 헤드라인이 아니라 주석 자리에 둔다 */}
          <p className={`mt-10 max-w-[56ch] ${T.small}`}>{c.statusNote}</p>
        </Container>
      </Section>

      <Footer>{c.footerNote}</Footer>

      {/* 고정 CTA가 푸터 마지막 줄을 덮지 않도록 모바일에서만 자리를 비운다 */}
      {LINE_URL && <div aria-hidden className="h-20 sm:hidden" />}

      {/* 모바일 하단 고정 CTA — QR 유입의 이탈 지점을 막는다 */}
      {LINE_URL && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3E7ED] bg-white/92 px-4 py-3 backdrop-blur-md sm:hidden">
          <Btn href={LINE_URL} variant="line" external className="w-full">
            <MessageCircle size={18} />
            {c.lineCta}
          </Btn>
        </div>
      )}
    </div>
  );
}
