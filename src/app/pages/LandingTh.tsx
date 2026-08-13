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
  Droplets,
  Salad,
  Fish,
  Sandwich,
  UtensilsCrossed,
  CupSoda,
  Refrigerator,
  GlassWater,
} from "lucide-react";
import { t, type ThLang } from "../i18n";
import { Btn, Card, Container, Eyebrow, Figure, Footer, Section, SectionHead, T } from "./site";
import { COMPANY_REG_NO, CONTACT_EMAIL, LINE_URL, mailto } from "../contact";

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
          /*
           * 15ml다. 여기 오래 "20 ml"라고 적혀 있었는데 그건 올레샷 값이었다 —
           * 두 스틱의 용량이 다르다. 내용량은 라벨 고시 450호의 필수 표시
           * 항목이라 페이지와 라벨이 어긋나면 광고 심의 대상이 되므로, 이 숫자를
           * 올레샷과 같이 묶지 말 것(docs/serving.md 2절).
           */
          size: "15 ml",
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

  /*
   * 섭취법. 근거와 카피는 docs/serving.md.
   *
   * 사진은 SKU마다 "가장 안 떠오르는 사용법" 한 컷씩이다 — 그대로 마시는 그림은
   * 바로 위 제품 섹션이 이미 하고 있어서, 여기서 반복하면 자리값을 못 한다.
   *
   * 아이콘도 카피다. 근육·체중계·심장은 문장이 없어도 효능을 말하므로 쓰지 않는다.
   * 여기 있는 것은 전부 그릇·온도·동작만 가리킨다. 올레와 올토가 UtensilsCrossed를
   * 같이 쓰는 건 실수가 아니라 둘의 두 번째 줄이 같은 축(요리에)이기 때문이다.
   */
  const serving = [
    {
      name: c.olleName,
      size: "20 ml",
      img: "/brands/serve-olle-salad.webp",
      taste: c.serveOlleTaste,
      ways: c.serveOlleWays,
      icons: [Droplets, Salad, Fish],
    },
    {
      name: c.oltoName,
      // 올레샷과 다르다. 위 brands의 주석 참고.
      size: "15 ml",
      img: "/brands/serve-olto-bread.webp",
      taste: c.serveOltoTaste,
      ways: c.serveOltoWays,
      icons: [Droplets, Sandwich, UtensilsCrossed],
    },
    {
      name: c.eunhwiSkuName,
      size: "90 ml",
      img: "/brands/serve-hobak-milk.webp",
      taste: c.serveHobakTaste,
      ways: c.serveHobakWays,
      icons: [CupSoda, Refrigerator, GlassWater],
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

              {/*
                소비자용 버튼이 먼저다. QR로 들어오는 사람 대부분이 소비자다.
                LINE이 아직 없으면 버튼을 지우는 게 아니라 이메일로 길을 바꾼다 —
                버튼이 사라지면 이 히어로에는 소비자가 누를 것이 하나도 없다.
              */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {LINE_URL ? (
                  <Btn href={LINE_URL} variant="line" external>
                    <MessageCircle size={17} />
                    {c.heroCtaConsumer}
                  </Btn>
                ) : (
                  <Btn href={mailto(c.consumerMailSubject)}>
                    <Mail size={17} />
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

      {/*
        먹는 법 — 제품 섹션이 "무엇"을 말했으니 여기가 "어떻게"다.

        이 자리에 있는 이유는 순서 때문이다. 제품을 보고 나서 쓰는 그림이 서고,
        그 다음에 LINE 버튼이 온다. 반대로 두면 갖고 싶어지기 전에 버튼을 민다.

        효능을 말할 수 없는 동안(광고 사전 심의 전) 이 섹션이 제품에 의미를 붙이는
        유일한 자리이고, 용법은 심의 대상이 아니라서 인허가를 기다리지 않아도 된다.
      */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead
              label={c.serveLabel}
              title={c.serveTitle}
              lead={c.serveLead}
            />
          </motion.div>

          {/*
            열은 세 제품, 행은 세 가지 방법이다. 번호를 붙이지 않는다 — 진행 방식
            도식의 01·02·03은 순서를 뜻하는데, 여기서는 제품에도 방법에도 순서가
            없다. 번호를 달면 "1번부터 하세요"라는 없는 말이 생긴다.
          */}
          <div className="mt-14 grid gap-x-9 gap-y-12 md:grid-cols-3">
            {serving.map((s, i) => (
              <motion.article
                key={s.name}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-t-2 border-[#0C3F80] pt-6"
              >
                {/*
                  모바일에서는 사진을 원형 썸네일로 줄인다. 세 열이 세로로 쌓이면
                  4:5 사진 석 장이 연달아 나와서 바로 위 제품 섹션과 겹쳐 보인다 —
                  여기는 사진을 다시 크게 보여줄 자리가 아니다.
                */}
                <div className="flex items-center gap-4 md:block">
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className="size-14 shrink-0 rounded-full border border-[#E3E7ED] bg-[#F4F6F8] object-cover md:hidden"
                  />
                  <Figure
                    src={s.img}
                    alt={s.name}
                    ratio="aspect-[4/5]"
                    className="hidden md:block"
                  />
                  {/*
                    용량을 이름 아래가 아니라 옆에 둔다. 올토샷은 용량을 확인할
                    때까지 비어 있는데, 아래에 두면 그 열만 줄 하나가 없어져서
                    세 열의 목록 시작점이 어긋난다. 옆에 두면 있든 없든 한 줄이다.
                    브랜드 카드가 이름과 분류를 붙이는 방식과 같은 문법이기도 하다.
                  */}
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 md:mt-5">
                    <h3 className={T.h3}>{s.name}</h3>
                    {s.size && (
                      <span className="text-[12.5px] text-[#8B94A3]">
                        {s.size}
                      </span>
                    )}
                  </div>
                </div>

                {/*
                  맛 한 줄. 이 자리가 비어 있어서 섹션이 설명서처럼 읽혔다 —
                  무엇을 하라고만 하고 어떤 맛인지는 한 글자도 없었다.

                  효능은 광고 사전승인 전까지 못 쓰지만 맛은 사실 기술이라 지금
                  쓸 수 있다. "몸에 어떻게 좋은지" 자리를 "입에 어떻게 좋은지"로
                  채우는 줄이다.
                */}
                <p className="mt-4 text-[13.5px] leading-relaxed text-[#5A6373] md:min-h-[2.75rem]">
                  {s.taste}
                </p>

                <ul className="mt-5 divide-y divide-[#E3E7ED] border-t border-[#E3E7ED]">
                  {s.ways.map((way, j) => {
                    const Icon = s.icons[j];
                    return (
                      <li key={way} className="flex items-start gap-3.5 py-4">
                        <span className="mt-0.5 shrink-0 text-[#0C3F80]">
                          <Icon size={17} strokeWidth={1.75} />
                        </span>
                        <span className="text-[14.5px] leading-relaxed">
                          {way}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.article>
            ))}
          </div>

          {/*
            이 섹션의 값을 회수하는 줄이라 각주 크기로 두지 않는다.

            앞의 아홉 줄이 지어낸 사용법이 아니라 한국에서 실제로 그렇게 먹는
            방식이라는 것(정품성), 그런데 태국 매대에는 아직 없다는 것(결핍),
            그래서 지금 할 수 있는 일은 LINE뿐이라는 것(출구)이 한 문장에 있다.
            바로 아래가 그 LINE 섹션이라 버튼을 여기 또 두지 않는다.
          */}
          <motion.p {...fadeUp} className={`mt-12 max-w-[62ch] ${T.body}`}>
            {c.serveNote}
          </motion.p>
        </Container>
      </Section>

      {/*
        소비자 훅 — 아직 못 파니까, 지금 당장 줄 수 있는 것 두 가지를 준다.

        먹는 법 섹션이 앞에 들어오면서 흰 면이 둘 연달아 서지만 그대로 둔다.
        site.tsx가 정한 대로 구획은 색이 아니라 여백이 나눈다 — 여기서 tone을
        바꾸면 아래 파트너 섹션과 회색이 붙어 더 큰 덩어리가 생긴다.
      */}
      <Section>
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <motion.div {...fadeUp} className="md:col-span-6">
              {/* 받는 것 두 가지는 그대로다. 달라지는 건 연락 수단뿐이라 리드만 갈아 끼운다. */}
              <SectionHead
                label={c.lineLabel}
                title={c.lineTitle}
                lead={LINE_URL ? c.lineBody : c.lineBodyAlt}
              />
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
                <Btn
                  href={mailto(c.consumerMailSubject)}
                  className="mt-8 w-full sm:w-auto"
                >
                  <Mail size={18} />
                  {c.emailCta}
                </Btn>
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

                다만 카드가 다섯 장이 되면서 아래로 700px 가까운 빈자리가 남았다.
                채우는 대신 붙여 둔다 — 다섯 장을 훑어 내리는 내내 "당신이 할 일"
                한 칸이 옆에 그대로 서 있는 것이 이 섹션의 논지다.
              */}
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-[#E3E7ED] bg-white px-7 py-14 text-center md:sticky md:top-24">
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

          {/*
            이 섹션은 다섯 장을 읽히고 끝난다. 마지막에 누를 것이 없으면 앞의
            다섯 장이 통째로 버려진다 — 예전에는 두 버튼이 모두 환경변수에 걸려
            있어서 실제로 그런 화면이 나갔다. 메일 버튼은 항상 선다.
          */}
          <motion.div {...fadeUp} className="mt-14 flex flex-col gap-3 sm:flex-row">
            <Btn href={mailto(c.partnerMailSubject)}>
              <Mail size={17} />
              {c.bizCta}
              <ArrowRight size={17} />
            </Btn>
            {LINE_URL && (
              <Btn href={LINE_URL} variant="line" external>
                <MessageCircle size={17} />
                {c.lineCta}
              </Btn>
            )}
          </motion.div>

          <motion.p {...fadeUp} className={`mt-5 ${T.small}`}>
            {CONTACT_EMAIL}
          </motion.p>
        </Container>
      </Section>

      {/* 일하는 방식 — 서울에서 매대까지 한 팀이라는 것을 한 줄로 보여준다 */}
      <Section>
        <Container>
          <motion.div {...fadeUp}>
            <SectionHead title={c.flowLabel} />
          </motion.div>

          {/*
            예전에는 한 줄에 아이콘·제목·도시를 놓고 도시를 오른쪽 끝에 붙였다.
            1280px에서는 제목과 도시 사이가 1,500px 가까이 벌어져서, 세 줄짜리
            표가 아니라 덜 채운 표로 읽혔다.

            세 칸으로 세우면 폭이 내용으로 차고, 한국어 페이지의 단계 도식과 같은
            문법(윗괘선 + 번호 + 제목)이 된다. 언어가 달라도 같은 회사로 보인다.
          */}
          <div className="mt-12 grid gap-y-8 md:grid-cols-3 md:gap-x-9 md:gap-y-0">
            {flow.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="border-t-2 border-[#0C3F80] pt-5"
              >
                <span className="text-[12px] font-semibold tabular-nums text-[#0C3F80]">
                  {`0${i + 1}`}
                </span>
                <div className="mt-4 flex items-center gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#E3E7ED] bg-white text-[#0C3F80]">
                    <s.Icon size={17} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15.5px] font-semibold tracking-[-0.01em]">
                      {s.title}
                    </h3>
                    <p className={`mt-0.5 ${T.small}`}>{s.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 아직 못 한 일은 지우지 않되, 헤드라인이 아니라 주석 자리에 둔다 */}
          <p className={`mt-10 max-w-[56ch] ${T.small}`}>{c.statusNote}</p>
        </Container>
      </Section>

      {/* 전화번호는 한국 번호라 여기서는 걸지 않는다. 태국 독자에게는 길이 아니다. */}
      <Footer
        legal={`${c.footerLegalLabel} ${COMPANY_REG_NO} · ${c.footerOfficeLabel} ${c.footerAddress}`}
        links={[[CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`]]}
      >
        {c.footerNote}
      </Footer>

      {/* 고정 CTA가 푸터 마지막 줄을 덮지 않도록 모바일에서만 자리를 비운다 */}
      <div aria-hidden className="h-20 sm:hidden" />

      {/*
        모바일 하단 고정 CTA — QR 유입의 이탈 지점을 막는다. QR로 들어온 사람은
        페이지 어디에 있든 여기서 나가므로, LINE이 없다고 이 자리를 비우지 않는다.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E3E7ED] bg-white/92 px-4 py-3 backdrop-blur-md sm:hidden">
        {LINE_URL ? (
          <Btn href={LINE_URL} variant="line" external className="w-full">
            <MessageCircle size={18} />
            {c.lineCta}
          </Btn>
        ) : (
          <Btn href={mailto(c.consumerMailSubject)} className="w-full">
            <Mail size={18} />
            {c.emailCta}
          </Btn>
        )}
      </div>
    </div>
  );
}
