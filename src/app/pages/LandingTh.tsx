import { motion } from "motion/react";
import {
  MessageCircle,
  Mail,
  ArrowRight,
  Check,
  Building2,
  FileCheck2,
  Sparkles,
  Factory,
  Search,
  PackageCheck,
  Store,
} from "lucide-react";
import { t, type ThLang } from "../i18n";

/** 값이 없으면 해당 버튼을 렌더링하지 않는다. 없는 연락처를 지어내지 않기 위함. */
const LINE_URL = (import.meta.env.VITE_LINE_URL as string) || "";
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string) || "";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/** 태국 수요측 페이지 — 소비자(B1), 유통(B2), 오프라인 리테일(B3) 세 독자를 히어로에서 분기시킨다. */
export default function LandingTh({ lang }: { lang: ThLang }) {
  const c = t[lang];

  /** 브랜드 캐릭터는 누끼 이미지다. 타일 배경색은 캐릭터 색에서 뽑아 맞춘다. */
  const brands = [
    {
      name: c.positivaName,
      kind: c.positivaKind,
      desc: c.positivaDesc,
      mascot: "/brands/positiva-mascot.webp",
      mascotTint: "#EAEFDD",
      accent: "#5E7241",
      items: [
        {
          name: c.olleName,
          sub: c.olleDesc,
          size: "20 ml",
          img: "/brands/positiva-olleshot.webp",
          tint: "#FBF0D6",
        },
        {
          name: c.oltoName,
          sub: c.oltoDesc,
          size: "20 ml",
          img: "/brands/positiva-oltoshot.webp",
          tint: "#FBE5D9",
        },
      ],
    },
    {
      name: c.eunhwiName,
      kind: c.eunhwiKind,
      desc: c.eunhwiDesc,
      mascot: "/brands/eunhwi-mascot.webp",
      mascotTint: "#FAEEDA",
      accent: "#A6641B",
      items: [
        {
          name: c.eunhwiSkuName,
          sub: c.eunhwiSkuDesc,
          size: "90 ml",
          img: "/brands/eunhwi-character.webp",
          tint: "#FBF1DA",
        },
        {
          name: c.realPhotoLabel,
          sub: c.madeInKorea,
          size: "",
          img: "/brands/eunhwi-product.webp",
          tint: "#F1F1EF",
          photo: true,
        },
      ],
    },
  ];

  const perks = [c.linePerk1, c.linePerk2, c.linePerk3];

  /** 유통 파트너가 계산기를 두드릴 근거. 전부 태국 법인이라서 가능한 것들이다. */
  const bizCards = [
    { Icon: Building2, title: c.biz1Title, body: c.biz1Body },
    { Icon: FileCheck2, title: c.biz2Title, body: c.biz2Body },
    {
      Icon: Sparkles,
      title: c.biz3Title,
      body: c.biz3Body,
      art: [
        "/brands/positiva-mascot.webp",
        "/brands/eunhwi-mascot.webp",
        "/brands/positiva-olleshot.webp",
        "/brands/positiva-oltoshot.webp",
      ],
    },
    { Icon: Factory, title: c.biz4Title, body: c.biz4Body },
  ];

  const flow = [
    { Icon: Search, title: c.flow1Title, sub: c.flow1Sub },
    { Icon: PackageCheck, title: c.flow2Title, sub: c.flow2Sub },
    { Icon: Store, title: c.flow3Title, sub: c.flow3Sub },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0A0E1A] antialiased">
      {/* HERO — 캐릭터를 첫 화면에 세운다. QR로 들어온 사람이 3초 안에 뭘 파는지 알아야 한다. */}
      <section className="relative overflow-hidden bg-[#0A0E1A] px-6 pt-20 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 75% at 50% 0%, rgba(12,63,128,0.6) 0%, rgba(10,14,26,0) 62%)",
          }}
        />
        <div className="relative mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <img
              src="/brands/klink-mark.webp"
              alt="B&Y k-link"
              className="mb-6 h-14 w-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
              {c.eyebrow}
            </span>
            <h1 className="mt-4 whitespace-pre-line text-[2.6rem] font-bold leading-[1.12] tracking-tight sm:text-5xl">
              {c.heroTitle}
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">
              {c.heroSub}
            </p>

            <div className="mt-8 flex w-full flex-col gap-2.5">
              {LINE_URL && (
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-13 items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3.5 font-bold transition-colors active:bg-[#05b34c]"
                >
                  <MessageCircle size={18} />
                  {c.heroCtaConsumer}
                </a>
              )}
              <a
                href="#partner"
                className="flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 py-3.5 font-bold text-white/90 transition-colors active:bg-white/10"
              >
                {c.heroCtaPartner}
                <ArrowRight size={17} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* 캐릭터 3종이 히어로 바닥에 선다. 누끼라 배경 위에 그대로 얹힌다. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mx-auto mt-10 flex max-w-lg items-end justify-center gap-1 pb-4"
        >
          <img
            src="/brands/positiva-olleshot.webp"
            alt=""
            aria-hidden
            className="h-36 w-auto drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:h-44"
          />
          <img
            src="/brands/eunhwi-character.webp"
            alt=""
            aria-hidden
            className="h-32 w-auto drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:h-40"
          />
          <img
            src="/brands/positiva-oltoshot.webp"
            alt=""
            aria-hidden
            className="h-32 w-auto drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:h-40"
          />
        </motion.div>
      </section>

      {/* 제품 — 실물 3종이 현재 유일한 구체적 증거다. 캐릭터로 기억에 남긴다. */}
      <section className="bg-[#FBF7EF] py-14">
        <div className="mx-auto max-w-lg px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            {c.productsLabel}
          </p>
          <p className="mb-5 mt-2 text-[13.5px] leading-relaxed text-neutral-500">
            {c.productsNote}
          </p>
          <div className="space-y-4">
            {brands.map((brand, i) => (
              <motion.article
                key={brand.name}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_2px_20px_rgba(10,14,26,0.05)]"
              >
                <header className="flex items-center gap-4 px-5 pt-5">
                  <div
                    className="relative h-16 w-16 shrink-0 rounded-2xl"
                    style={{ backgroundColor: brand.mascotTint }}
                  >
                    <img
                      src={brand.mascot}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-contain p-1.5 drop-shadow-[0_3px_5px_rgba(0,0,0,0.10)]"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="text-lg font-bold tracking-tight">{brand.name}</h3>
                      <span
                        className="text-[12px] font-semibold"
                        style={{ color: brand.accent }}
                      >
                        {brand.kind}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                      {brand.desc}
                    </p>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-2.5 p-4">
                  {brand.items.map((item) => (
                    <div
                      key={item.name}
                      className="overflow-hidden rounded-2xl"
                      style={{ backgroundColor: item.tint }}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy"
                          className={
                            item.photo
                              ? "absolute inset-0 h-full w-full object-cover"
                              : "absolute inset-0 h-full w-full object-contain p-3 drop-shadow-[0_6px_9px_rgba(0,0,0,0.12)]"
                          }
                        />
                        {item.size && (
                          <span className="absolute right-2 top-2 rounded-full bg-white/75 px-2 py-0.5 text-[10px] font-bold tracking-tight text-neutral-600 backdrop-blur-sm">
                            {item.size}
                          </span>
                        )}
                      </div>
                      <div className="px-3 pb-3.5 pt-2.5">
                        <p className="text-[13px] font-bold leading-tight tracking-tight">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-snug text-neutral-500">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 소비자 훅 — 아직 못 파니까, 지금 당장 줄 수 있는 것 세 가지를 준다. */}
      <section className="bg-white py-14">
        <motion.div {...fadeUp} className="mx-auto max-w-lg px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#06A047]">
            {c.lineLabel}
          </p>
          <h2 className="mt-3 whitespace-pre-line text-[1.85rem] font-bold leading-[1.2] tracking-tight">
            {c.lineTitle}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-neutral-500">
            {c.lineBody}
          </p>

          <ul className="mt-7 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#06C755]/12 text-[#06A047]">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-[14.5px] leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          {LINE_URL ? (
            <a
              href={LINE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 flex h-14 items-center justify-center gap-2 rounded-xl bg-[#06C755] font-bold text-white transition-colors active:bg-[#05b34c]"
            >
              <MessageCircle size={19} />
              {c.lineCta}
            </a>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-neutral-300 py-4 text-center text-[12px] text-neutral-400">
              {c.lineMissing}
            </p>
          )}
        </motion.div>
      </section>

      {/* 유통 파트너 훅 — 태국 법인이라서 가능한 것들. 경쟁사가 복제할 수 없는 지점이다. */}
      <section id="partner" className="scroll-mt-4 bg-[#0A0E1A] py-16 text-white">
        <div className="mx-auto max-w-lg px-5">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5B9BE8]">
              {c.bizLabel}
            </p>
            <h2 className="mt-3 whitespace-pre-line text-[1.95rem] font-bold leading-[1.18] tracking-tight">
              {c.bizTitle}
            </h2>
            <p className="mt-3.5 text-[14.5px] leading-relaxed text-white/60">
              {c.bizBody}
            </p>
          </motion.div>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {bizCards.map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0C3F80] text-white">
                  <card.Icon size={17} />
                </span>
                <h3 className="mt-3.5 text-[15px] font-bold leading-snug tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                  {card.body}
                </p>
                {card.art && (
                  <div className="mt-4 flex items-end justify-around gap-1 rounded-xl bg-white/[0.05] px-3 py-3">
                    {card.art.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="h-16 w-auto"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-7 space-y-2.5">
            {LINE_URL && (
              <a
                href={LINE_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white font-bold text-[#0A0E1A] transition-colors active:bg-white/85"
              >
                {c.bizCta}
                <ArrowRight size={18} />
              </a>
            )}
            {CONTACT_EMAIL && (
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/20 font-bold text-white/90 transition-colors active:bg-white/10"
              >
                <Mail size={18} />
                {c.emailCta}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 일하는 방식 — 서울에서 매대까지 한 팀이라는 것을 한 줄로 보여준다. */}
      <section className="bg-[#F7F6F3] py-14">
        <motion.div {...fadeUp} className="mx-auto max-w-lg px-5">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            {c.flowLabel}
          </p>
          <ol className="flex items-stretch gap-2">
            {flow.map((s, i) => (
              <li key={s.title} className="flex flex-1 items-stretch gap-2">
                <div className="flex flex-1 flex-col justify-center rounded-2xl border border-black/5 bg-white px-3 py-5 text-center">
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#0C3F80]/8 text-[#0C3F80]">
                    <s.Icon size={18} />
                  </span>
                  <p className="mt-3 text-[13px] font-bold leading-tight tracking-tight">
                    {s.title}
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-400">{s.sub}</p>
                </div>
                {i < flow.length - 1 && (
                  <ArrowRight size={14} className="shrink-0 self-center text-neutral-300" />
                )}
              </li>
            ))}
          </ol>

          {/* 아직 못 한 일은 지우지 않되, 헤드라인이 아니라 주석 자리에 둔다. */}
          <p className="mt-8 border-t border-black/5 pt-6 text-center text-[12px] leading-relaxed text-neutral-400">
            {c.statusNote}
          </p>
        </motion.div>
      </section>

      <footer className="border-t border-black/5 px-6 py-8 pb-28 text-center sm:pb-8">
        {/* 심볼만 — 사명은 바로 아래 텍스트로 나오므로 워드마크까지 넣으면 중복이다 */}
        <img src="/brands/klink-mark.webp" alt="" className="mx-auto mb-3 h-8 w-auto opacity-40" />
        <p className="text-[12px] text-neutral-400">{c.footerNote}</p>
      </footer>

      {/* 모바일 하단 고정 CTA — QR 유입의 이탈 지점을 막는다 */}
      {LINE_URL && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/92 px-4 py-3 backdrop-blur-md sm:hidden">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-13 items-center justify-center gap-2 rounded-xl bg-[#06C755] py-3.5 font-bold text-white"
          >
            <MessageCircle size={18} />
            {c.lineCta}
          </a>
        </div>
      )}
    </div>
  );
}
